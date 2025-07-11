
import { 
  collection, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  query, 
  where, 
  documentId,
  writeBatch,
  serverTimestamp
} from 'firebase/firestore';
import { db } from './firebase';
import type { Turma, Aluno, Nota } from '../types';

// --- Turma API ---
const turmasCollection = collection(db, 'turmas');

export const getTurmas = async (): Promise<Turma[]> => {
  const snapshot = await getDocs(turmasCollection);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Turma));
};

export const addTurma = (nomeTurma: string) => {
  return addDoc(turmasCollection, { nomeTurma });
};

export const updateTurma = (id: string, nomeTurma: string) => {
  const turmaDoc = doc(db, 'turmas', id);
  return updateDoc(turmaDoc, { nomeTurma });
};

export const deleteTurma = (id: string) => {
  const turmaDoc = doc(db, 'turmas', id);
  return deleteDoc(turmaDoc);
};

// --- Aluno API ---
const alunosCollection = collection(db, 'alunos');

export const getAlunos = async (): Promise<Aluno[]> => {
  const snapshot = await getDocs(alunosCollection);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Aluno));
};

export const getAlunosByTurma = async (turmaId: string): Promise<Aluno[]> => {
  const q = query(alunosCollection, where('turmaId', '==', turmaId));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Aluno));
};

export const addAluno = (nome: string, turmaId: string) => {
  return addDoc(alunosCollection, { nome, turmaId });
};

export const updateAluno = (id: string, nome: string, turmaId: string) => {
  const alunoDoc = doc(db, 'alunos', id);
  return updateDoc(alunoDoc, { nome, turmaId });
};

export const deleteAluno = (id: string) => {
  const alunoDoc = doc(db, 'alunos', id);
  return deleteDoc(alunoDoc);
};


// --- Nota API ---
const notasCollection = collection(db, 'notas');

export const getNotasByTurma = async (turmaId: string): Promise<Nota[]> => {
    if (!turmaId) return [];
    const q = query(notasCollection, where('turmaId', '==', turmaId));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Nota));
};

export const getNotasByAlunos = async (alunoIds: string[]): Promise<Nota[]> => {
    if (alunoIds.length === 0) return [];
    const q = query(notasCollection, where(documentId(), 'in', alunoIds));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Nota));
};

export const upsertNotasBatch = async (notas: Omit<Nota, 'id' | 'lastUpdated'>[]) => {
    const batch = writeBatch(db);
    notas.forEach(notaData => {
        const notaDocRef = doc(db, 'notas', notaData.alunoId);
        batch.set(notaDocRef, { ...notaData, lastUpdated: serverTimestamp() });
    });
    return batch.commit();
};

export const getFullReportData = async (): Promise<any[]> => {
    const [alunos, turmas, notas] = await Promise.all([
        getDocs(collection(db, 'alunos')),
        getDocs(collection(db, 'turmas')),
        getDocs(collection(db, 'notas'))
    ]);

    const turmasMap = new Map(turmas.docs.map(d => [d.id, d.data().nomeTurma]));
    const notasMap = new Map(notas.docs.map(d => [d.id, d.data()]));

    return alunos.docs.map(alunoDoc => {
        const alunoData = alunoDoc.data();
        const notaData = notasMap.get(alunoDoc.id);
        return {
            id: alunoDoc.id,
            nome: alunoData.nome,
            turmaNome: turmasMap.get(alunoData.turmaId) || 'N/A',
            ...(notaData || {})
        };
    });
};
