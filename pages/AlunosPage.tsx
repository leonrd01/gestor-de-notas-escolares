
import React, { useState, useEffect, useCallback } from 'react';
import { getAlunos, addAluno, updateAluno, deleteAluno, getTurmas } from '../services/api';
import type { Aluno, Turma } from '../types';
import { useToast } from '../hooks/useToast';
import Modal from '../components/Modal';
import Spinner from '../components/Spinner';

const AlunosPage: React.FC = () => {
    const [alunos, setAlunos] = useState<Aluno[]>([]);
    const [turmas, setTurmas] = useState<Turma[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentAluno, setCurrentAluno] = useState<Aluno | null>(null);
    const [formData, setFormData] = useState({ nome: '', turmaId: '' });
    const { addToast } = useToast();

    const fetchAlunosAndTurmas = useCallback(async () => {
        setLoading(true);
        try {
            const [alunosData, turmasData] = await Promise.all([getAlunos(), getTurmas()]);
            const turmasMap = new Map(turmasData.map(t => [t.id, t.nomeTurma]));
            const alunosComTurma = alunosData.map(a => ({...a, turmaNome: turmasMap.get(a.turmaId)}));
            setAlunos(alunosComTurma);
            setTurmas(turmasData);
        } catch (error) {
            addToast('Erro ao carregar dados.', 'error');
        } finally {
            setLoading(false);
        }
    }, [addToast]);

    useEffect(() => {
        fetchAlunosAndTurmas();
    }, [fetchAlunosAndTurmas]);

    const openModal = (aluno: Aluno | null = null) => {
        setCurrentAluno(aluno);
        setFormData(aluno ? { nome: aluno.nome, turmaId: aluno.turmaId } : { nome: '', turmaId: '' });
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setCurrentAluno(null);
        setFormData({ nome: '', turmaId: '' });
    };

    const handleSave = async () => {
        if (!formData.nome.trim() || !formData.turmaId) {
            addToast('Nome do aluno e turma são obrigatórios.', 'error');
            return;
        }
        try {
            if (currentAluno) {
                await updateAluno(currentAluno.id, formData.nome, formData.turmaId);
                addToast('Aluno atualizado com sucesso!', 'success');
            } else {
                await addAluno(formData.nome, formData.turmaId);
                addToast('Aluno adicionado com sucesso!', 'success');
            }
            fetchAlunosAndTurmas();
            closeModal();
        } catch (error) {
            addToast('Erro ao salvar aluno.', 'error');
        }
    };

    const handleDelete = async (id: string) => {
        if (window.confirm('Tem certeza que deseja excluir este aluno? Suas notas também serão perdidas.')) {
            try {
                await deleteAluno(id);
                // Note: Deleting associated grades would require a Cloud Function or more complex client-side logic.
                addToast('Aluno excluído com sucesso!', 'success');
                fetchAlunosAndTurmas();
            } catch (error) {
                addToast('Erro ao excluir aluno.', 'error');
            }
        }
    };
    
    if (loading) {
        return <Spinner />;
    }

    return (
        <div className="container mx-auto">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Gerenciar Alunos</h1>
                <button onClick={() => openModal()} className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition" disabled={turmas.length === 0}>
                    {turmas.length === 0 ? 'Crie uma turma primeiro' : 'Adicionar Aluno'}
                </button>
            </div>

             <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden">
                <table className="min-w-full leading-normal">
                    <thead className="bg-gray-50 dark:bg-gray-700">
                        <tr>
                            <th className="px-5 py-3 border-b-2 border-gray-200 dark:border-gray-600 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">Nome do Aluno</th>
                            <th className="px-5 py-3 border-b-2 border-gray-200 dark:border-gray-600 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">Turma</th>
                            <th className="px-5 py-3 border-b-2 border-gray-200 dark:border-gray-600 text-right text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {alunos.map(aluno => (
                            <tr key={aluno.id} className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700">
                                <td className="px-5 py-5 text-sm text-gray-900 dark:text-gray-200"><p>{aluno.nome}</p></td>
                                <td className="px-5 py-5 text-sm text-gray-900 dark:text-gray-200"><p>{aluno.turmaNome || 'N/A'}</p></td>
                                <td className="px-5 py-5 text-sm text-right">
                                    <button onClick={() => openModal(aluno)} className="text-indigo-600 hover:text-indigo-900 mr-4">Editar</button>
                                    <button onClick={() => handleDelete(aluno.id)} className="text-red-600 hover:text-red-900">Excluir</button>
                                </td>
                            </tr>
                        ))}
                        {alunos.length === 0 && (
                            <tr>
                                <td colSpan={3} className="text-center py-10 text-gray-500 dark:text-gray-400">
                                    Nenhum aluno encontrado.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            <Modal isOpen={isModalOpen} onClose={closeModal} title={currentAluno ? 'Editar Aluno' : 'Adicionar Aluno'}>
                <div className="space-y-4">
                    <div>
                        <label htmlFor="nome" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Nome do Aluno</label>
                        <input type="text" id="nome" value={formData.nome} onChange={e => setFormData({...formData, nome: e.target.value})} className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
                    </div>
                    <div>
                        <label htmlFor="turma" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Turma</label>
                        <select id="turma" value={formData.turmaId} onChange={e => setFormData({...formData, turmaId: e.target.value})} className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                            <option value="">Selecione uma turma</option>
                            {turmas.map(turma => (
                                <option key={turma.id} value={turma.id}>{turma.nomeTurma}</option>
                            ))}
                        </select>
                    </div>
                    <div className="flex justify-end space-x-2">
                        <button onClick={closeModal} className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300">Cancelar</button>
                        <button onClick={handleSave} className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700">Salvar</button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default AlunosPage;
