
import React, { useState, useEffect, useCallback } from 'react';
import { getTurmas, addTurma, updateTurma, deleteTurma } from '../services/api';
import type { Turma } from '../types';
import { useToast } from '../hooks/useToast';
import Modal from '../components/Modal';
import Spinner from '../components/Spinner';

const TurmasPage: React.FC = () => {
    const [turmas, setTurmas] = useState<Turma[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentTurma, setCurrentTurma] = useState<Turma | null>(null);
    const [nomeTurma, setNomeTurma] = useState('');
    const { addToast } = useToast();

    const fetchTurmas = useCallback(async () => {
        setLoading(true);
        try {
            const data = await getTurmas();
            setTurmas(data);
        } catch (error) {
            addToast('Erro ao carregar turmas.', 'error');
        } finally {
            setLoading(false);
        }
    }, [addToast]);

    useEffect(() => {
        fetchTurmas();
    }, [fetchTurmas]);

    const openModal = (turma: Turma | null = null) => {
        setCurrentTurma(turma);
        setNomeTurma(turma ? turma.nomeTurma : '');
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setCurrentTurma(null);
        setNomeTurma('');
    };

    const handleSave = async () => {
        if (!nomeTurma.trim()) {
            addToast('O nome da turma não pode estar vazio.', 'error');
            return;
        }
        try {
            if (currentTurma) {
                await updateTurma(currentTurma.id, nomeTurma);
                addToast('Turma atualizada com sucesso!', 'success');
            } else {
                await addTurma(nomeTurma);
                addToast('Turma adicionada com sucesso!', 'success');
            }
            fetchTurmas();
            closeModal();
        } catch (error) {
            addToast('Erro ao salvar turma.', 'error');
        }
    };

    const handleDelete = async (id: string) => {
        if (window.confirm('Tem certeza que deseja excluir esta turma? Esta ação não pode ser desfeita.')) {
            try {
                await deleteTurma(id);
                addToast('Turma excluída com sucesso!', 'success');
                fetchTurmas();
            } catch (error) {
                addToast('Erro ao excluir turma. Verifique se existem alunos vinculados.', 'error');
            }
        }
    };
    
    if (loading) {
        return <Spinner />;
    }

    return (
        <div className="container mx-auto">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Gerenciar Turmas</h1>
                <button onClick={() => openModal()} className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition">
                    Adicionar Turma
                </button>
            </div>
            
            <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden">
                <table className="min-w-full leading-normal">
                    <thead className="bg-gray-50 dark:bg-gray-700">
                        <tr>
                            <th className="px-5 py-3 border-b-2 border-gray-200 dark:border-gray-600 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                                Nome da Turma
                            </th>
                            <th className="px-5 py-3 border-b-2 border-gray-200 dark:border-gray-600 text-right text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                                Ações
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {turmas.map(turma => (
                            <tr key={turma.id} className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700">
                                <td className="px-5 py-5 text-sm text-gray-900 dark:text-gray-200">
                                    <p className="whitespace-no-wrap">{turma.nomeTurma}</p>
                                </td>
                                <td className="px-5 py-5 text-sm text-right">
                                    <button onClick={() => openModal(turma)} className="text-indigo-600 hover:text-indigo-900 mr-4">Editar</button>
                                    <button onClick={() => handleDelete(turma.id)} className="text-red-600 hover:text-red-900">Excluir</button>
                                </td>
                            </tr>
                        ))}
                         {turmas.length === 0 && (
                            <tr>
                                <td colSpan={2} className="text-center py-10 text-gray-500 dark:text-gray-400">
                                    Nenhuma turma encontrada.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            <Modal isOpen={isModalOpen} onClose={closeModal} title={currentTurma ? 'Editar Turma' : 'Adicionar Turma'}>
                <div className="space-y-4">
                    <div>
                        <label htmlFor="nomeTurma" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Nome da Turma</label>
                        <input
                            type="text"
                            id="nomeTurma"
                            value={nomeTurma}
                            onChange={(e) => setNomeTurma(e.target.value)}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        />
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

export default TurmasPage;
