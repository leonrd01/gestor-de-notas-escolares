
import React, { useState, useEffect, useCallback } from 'react';
import { getTurmas, getAlunosByTurma, getNotasByAlunos, upsertNotasBatch } from '../services/api';
import type { Turma, Nota, AlunoComNotas } from '../types';
import { useToast } from '../hooks/useToast';
import Spinner from '../components/Spinner';
// Removido import de Aluno não utilizado

import { Timestamp } from 'firebase/firestore';

const emptyNota = (alunoId: string, turmaId: string): Nota => ({
    id: '', // id vazio ou gere um id temporário se necessário
    alunoId,
    turmaId,
    notaTrabalho: 0,
    notaProjeto: 0,
    avaliacao1: 0,
    avaliacao2: 0,
    qualitativo: '',
    media: 0,
    total: 0,
    lastUpdated: new Timestamp(0, 0),
});

const NotasPage: React.FC = () => {
    const [turmas, setTurmas] = useState<Turma[]>([]);
    const [selectedTurma, setSelectedTurma] = useState<string>('');
    const [alunosComNotas, setAlunosComNotas] = useState<AlunoComNotas[]>([]);
    const [loading, setLoading] = useState(false);
    const [loadingData, setLoadingData] = useState(false);
    const { addToast } = useToast();

    useEffect(() => {
        const fetchInitialData = async () => {
            setLoading(true);
            try {
                const turmasData = await getTurmas();
                setTurmas(turmasData);
            } catch (error) {
                addToast('Erro ao carregar turmas.', 'error');
            } finally {
                setLoading(false);
            }
        };
        fetchInitialData();
    }, [addToast]);

    const handleTurmaChange = useCallback(async (turmaId: string) => {
        setSelectedTurma(turmaId);
        if (!turmaId) {
            setAlunosComNotas([]);
            return;
        }
        setLoadingData(true);
        try {
            const alunosData = await getAlunosByTurma(turmaId);
            const alunoIds = alunosData.map(a => a.id);
            const notasData = await getNotasByAlunos(alunoIds);
            const notasMap = new Map(notasData.map(n => [n.alunoId, n]));

            const combinedData = alunosData.map(aluno => ({
                ...aluno,
                notas: notasMap.get(aluno.id) || emptyNota(aluno.id, turmaId)
            }));
            setAlunosComNotas(combinedData);
        } catch (error) {
            addToast('Erro ao carregar alunos e notas.', 'error');
        } finally {
            setLoadingData(false);
        }
    }, [addToast]);

    const handleNotaChange = (alunoId: string, field: keyof Nota, value: string | number) => {
        setAlunosComNotas(prevAlunos => {
            return prevAlunos.map(aluno => {
                if (aluno.id === alunoId) {
                    const newNotas: Nota = { ...aluno.notas!, [field]: value };
                    if (
                        typeof value === 'number' &&
                        (field === 'notaTrabalho' || field === 'notaProjeto' || field === 'avaliacao1' || field === 'avaliacao2')
                    ) {
                        const parsedValue = isNaN(value) ? 0 : value;
                        (newNotas as Nota)[field] = Math.max(0, Math.min(10, parsedValue));
                    }
                    const { notaTrabalho, notaProjeto, avaliacao1, avaliacao2 } = newNotas;
                    newNotas.media = (notaTrabalho + notaProjeto + avaliacao1 + avaliacao2) / 4;
                    newNotas.total = notaTrabalho + notaProjeto + avaliacao1 + avaliacao2;
                    return { ...aluno, notas: newNotas };
                }
                return aluno;
            });
        });
    };

    const handleSaveAll = async () => {
        if (alunosComNotas.length === 0) return;
        setLoading(true);
        try {
            const notasToSave = alunosComNotas.map(a => a.notas).filter(n => n) as Omit<Nota, 'id' | 'lastUpdated'>[];
            await upsertNotasBatch(notasToSave);
            addToast('Notas salvas com sucesso!', 'success');
        } catch (error) {
            addToast('Erro ao salvar notas.', 'error');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };
    
    return (
        <div className="container mx-auto">
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-6">Lançamento de Notas</h1>
            <div className="mb-6 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md">
                <label htmlFor="turma-select" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Selecione uma Turma</label>
                <select
                    id="turma-select"
                    value={selectedTurma}
                    onChange={(e) => handleTurmaChange(e.target.value)}
                    className="mt-1 block w-full md:w-1/3 pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                    <option value="">-- Selecione --</option>
                    {turmas.map(turma => <option key={turma.id} value={turma.id}>{turma.nomeTurma}</option>)}
                </select>
            </div>

            {loadingData ? <Spinner /> : (
                <>
                {selectedTurma && (
                    <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-x-auto">
                        <table className="min-w-full leading-normal">
                            <thead className="bg-gray-50 dark:bg-gray-700">
                                <tr>
                                    {['Aluno', 'Trabalho', 'Projeto', 'Av. 1', 'Av. 2', 'Qualitativo', 'Média', 'Total'].map(header => (
                                        <th key={header} className="px-3 py-3 border-b-2 border-gray-200 dark:border-gray-600 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">{header}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {alunosComNotas.map(({ id, nome, notas }) => (
                                    <tr key={id} className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700">
                                        <td className="px-3 py-3 text-sm text-gray-900 dark:text-gray-200 font-medium">{nome}</td>
                                        {(['notaTrabalho', 'notaProjeto', 'avaliacao1', 'avaliacao2'] as (keyof Nota)[]).map(field => (
                                            <td key={field} className="px-2 py-2 text-sm">
                                                <input
                                                    type="number"
                                                    min="0"
                                                    max="10"
                                                    step="0.1"
                                                    value={typeof notas?.[field] === 'number' ? notas[field] : 0}
                                                    onChange={e => handleNotaChange(id, field, parseFloat(e.target.value))}
                                                    className="w-20 p-1 border rounded bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
                                                />
                                            </td>
                                        ))}
                                        <td className="px-2 py-2 text-sm">
                                            <input
                                                type="text"
                                                value={typeof notas?.qualitativo === 'string' ? notas.qualitativo : ''}
                                                onChange={e => handleNotaChange(id, 'qualitativo', e.target.value)}
                                                className="w-32 p-1 border rounded bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
                                            />
                                        </td>
                                        <td className="px-3 py-3 text-sm text-gray-900 dark:text-gray-200 font-bold">{typeof notas?.media === "number" ? notas.media.toFixed(2) : "--"}</td>
                                        <td className="px-3 py-3 text-sm text-gray-900 dark:text-gray-200 font-bold">{typeof notas?.total === "number" ? notas.total.toFixed(2) : "--"}</td>
                                    </tr>
                                ))}
                                {alunosComNotas.length === 0 && (
                                    <tr><td colSpan={8} className="text-center py-10 text-gray-500 dark:text-gray-400">Nenhum aluno nesta turma.</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
                 {selectedTurma && alunosComNotas.length > 0 && (
                    <div className="mt-6 flex justify-end">
                        <button onClick={handleSaveAll} disabled={loading} className="bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700 transition disabled:bg-indigo-400">
                            {loading ? 'Salvando...' : 'Salvar Todas as Notas'}
                        </button>
                    </div>
                )}
                </>
            )}
        </div>
    );
};

export default NotasPage;
