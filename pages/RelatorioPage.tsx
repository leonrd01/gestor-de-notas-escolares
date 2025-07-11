
import React, { useState, useEffect, useMemo } from 'react';
import { getFullReportData } from '../services/api';
import { useToast } from '../hooks/useToast';
import Spinner from '../components/Spinner';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

// ...existing code...

type AlunoRelatorio = {
    id: string;
    nome: string;
    turmaNome: string;
    notaTrabalho?: number;
    notaProjeto?: number;
    avaliacao1?: number;
    avaliacao2?: number;
    qualitativo?: string;
    media?: number;
    total?: number;
};

const RelatorioPage: React.FC = () => {
    const [reportData, setReportData] = useState<AlunoRelatorio[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortConfig, setSortConfig] = useState<{ key: keyof AlunoRelatorio; direction: 'ascending' | 'descending' } | null>(null);
    const { addToast } = useToast();

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const data = await getFullReportData();
                setReportData(data);
            } catch (error) {
                addToast('Erro ao carregar dados do relatório.', 'error');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [addToast]);
    
    const sortedAndFilteredData = useMemo(() => {
        let data = [...reportData];
        if (searchTerm) {
            data = data.filter(item => item.nome.toLowerCase().includes(searchTerm.toLowerCase()));
        }
        if (sortConfig !== null) {
            data.sort((a, b) => {
                const aValue = a[sortConfig.key] ?? '';
                const bValue = b[sortConfig.key] ?? '';
                
                if (aValue < bValue) {
                    return sortConfig.direction === 'ascending' ? -1 : 1;
                }
                if (aValue > bValue) {
                    return sortConfig.direction === 'ascending' ? 1 : -1;
                }
                return 0;
            });
        }
        return data;
    }, [reportData, searchTerm, sortConfig]);

    const requestSort = (key: keyof AlunoRelatorio) => {
        let direction: 'ascending' | 'descending' = 'ascending';
        if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setSortConfig({ key, direction });
    };

    const generatePDF = () => {
        const doc = new jsPDF();
        doc.text("Relatório de Notas dos Alunos", 14, 16);
        autoTable(doc, {
            startY: 20,
            head: [['Aluno', 'Turma', 'Trabalho', 'Projeto', 'Av. 1', 'Av. 2', 'Média', 'Qualitativo']],
            body: sortedAndFilteredData.map(item => [
                item.nome,
                item.turmaNome,
                item.notaTrabalho?.toFixed(1) ?? 'N/L',
                item.notaProjeto?.toFixed(1) ?? 'N/L',
                item.avaliacao1?.toFixed(1) ?? 'N/L',
                item.avaliacao2?.toFixed(1) ?? 'N/L',
                item.media?.toFixed(2) ?? 'N/L',
                item.qualitativo ?? '',
            ]),
            styles: { fontSize: 8 },
            headStyles: { fillColor: [74, 85, 104] }
        });
        doc.save('relatorio_notas.pdf');
        addToast("PDF gerado com sucesso!", 'success');
    };

    if (loading) {
        return <Spinner />;
    }

    const SortableHeader: React.FC<{ sortKey: keyof AlunoRelatorio, label: string }> = ({ sortKey, label }) => {
        const isSorted = sortConfig?.key === sortKey;
        const icon = isSorted ? (sortConfig?.direction === 'ascending' ? '▲' : '▼') : '↕';
        return (
            <th onClick={() => requestSort(sortKey)} className="cursor-pointer px-5 py-3 border-b-2 border-gray-200 dark:border-gray-600 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                {label} <span className="ml-1">{icon}</span>
            </th>
        );
    };

    return (
        <div className="container mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Relatório Geral</h1>
                <div className="flex items-center space-x-4 mt-4 md:mt-0">
                    <input
                        type="text"
                        placeholder="Buscar por nome..."
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                    <button onClick={generatePDF} className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition">
                        Gerar PDF
                    </button>
                </div>
            </div>

            <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-x-auto">
                <table className="min-w-full leading-normal">
                    <thead className="bg-gray-50 dark:bg-gray-700">
                        <tr>
                            <SortableHeader sortKey="nome" label="Aluno" />
                            <SortableHeader sortKey="turmaNome" label="Turma" />
                            <SortableHeader sortKey="media" label="Média" />
                            <th className="px-5 py-3 border-b-2 border-gray-200 dark:border-gray-600 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">Qualitativo</th>
                        </tr>
                    </thead>
                    <tbody>
                        {sortedAndFilteredData.map(item => (
                            <tr key={item.id} className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700">
                                <td className="px-5 py-5 text-sm text-gray-900 dark:text-gray-200">{item.nome}</td>
                                <td className="px-5 py-5 text-sm text-gray-900 dark:text-gray-200">{item.turmaNome}</td>
                                <td className="px-5 py-5 text-sm text-gray-900 dark:text-gray-200">{item.media?.toFixed(2) ?? 'N/L'}</td>
                                <td className="px-5 py-5 text-sm text-gray-900 dark:text-gray-200">{item.qualitativo ?? '-'}</td>
                            </tr>
                        ))}
                        {sortedAndFilteredData.length === 0 && (
                            <tr><td colSpan={4} className="text-center py-10 text-gray-500 dark:text-gray-400">Nenhum dado encontrado.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default RelatorioPage;
