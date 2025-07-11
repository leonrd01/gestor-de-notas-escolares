
import { type Timestamp } from 'firebase/firestore';

export interface Turma {
  id: string;
  nomeTurma: string;
}

export interface Aluno {
  id: string;
  nome: string;
  turmaId: string;
  turmaNome?: string; // Optional, for display purposes after joining
}

export interface Nota {
  id: string; // Document ID will be the Aluno ID
  alunoId: string;
  turmaId: string;
  notaTrabalho: number;
  notaProjeto: number;
  avaliacao1: number;
  avaliacao2: number;
  qualitativo: string;
  media: number;
  total: number;
  lastUpdated: Timestamp;
}

export interface AlunoComNotas extends Aluno {
    notas?: Nota;
}
