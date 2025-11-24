// src/hooks/useTasks.ts
'use client';

import { useState, useEffect } from 'react';
import { collection, addDoc, updateDoc, deleteDoc, doc, onSnapshot, query, where, getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import type { Task } from '@/types';
import { toast } from 'sonner';

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const auth = getAuth();
    const db = getFirestore();
    if (!auth.currentUser) {
      setLoading(false);
      return;
    }

    const unsubscribe = onSnapshot(
      query(collection(db, 'tasks'), where('userId', '==', auth.currentUser.uid)),
      (snapshot) => {
        const tasksData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        })) as Task[];
        setTasks(tasksData);
        setLoading(false);
      },
      (error) => {
        toast.error('Erro ao carregar tarefas');
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const createTask = async (taskData: Omit<Task, 'id' | 'userId' | 'createdAt'>) => {
    try {
      const auth = getAuth();
      const db = getFirestore();
      await addDoc(collection(db, 'tasks'), {
        ...taskData,
        userId: auth.currentUser!.uid,
        createdAt: new Date().toISOString(),
      });
      toast.success('Tarefa criada!');
    } catch (err) {
      toast.error('Erro ao criar tarefa');
    }
  };

  const updateTask = async (id: string, updates: Partial<Task>) => {
    try {
      const db = getFirestore();
      await updateDoc(doc(db, 'tasks', id), updates);
      toast.success('Tarefa atualizada!');
    } catch (err) {
      toast.error('Erro ao atualizar tarefa');
    }
  };

  const deleteTask = async (id: string) => {
    try {
      const db = getFirestore();
      await deleteDoc(doc(db, 'tasks', id));
      toast.success('Tarefa excluída!');
    } catch (err) {
      toast.error('Erro ao excluir tarefa');
    }
  };

  return { tasks, loading, createTask, updateTask, deleteTask };
}