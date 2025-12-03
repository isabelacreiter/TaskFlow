// src/hooks/useTasks.ts
'use client';

import { useState, useEffect } from 'react';
import { collection, addDoc, updateDoc, deleteDoc, doc, onSnapshot, query, where } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import type { Task } from '@/types';
import { toast } from 'sonner';
import { getFirebaseAuth, getFirebaseFirestore } from '@/lib/firebase';

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const auth = getFirebaseAuth();
      const db = getFirebaseFirestore();

      if (!auth || !db) {
        console.warn('Firebase não está disponível');
        setLoading(false);
        return;
      }

      const currentAuth = getAuth();
      if (!currentAuth.currentUser) {
        setLoading(false);
        return;
      }

      const unsubscribe = onSnapshot(
        query(collection(db, 'tasks'), where('userId', '==', currentAuth.currentUser.uid)),
        (snapshot) => {
          const tasksData = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
          })) as Task[];
          setTasks(tasksData);
          setLoading(false);
        },
        (error) => {
          console.error('Erro ao carregar tarefas:', error);
          toast.error('Erro ao carregar tarefas');
          setLoading(false);
        }
      );

      return () => unsubscribe();
    } catch (error) {
      console.error('Erro na inicialização do useTasks:', error);
      setLoading(false);
    }
  }, []);

  const createTask = async (taskData: Omit<Task, 'id' | 'userId' | 'createdAt'>) => {
    try {
      const auth = getFirebaseAuth();
      const db = getFirebaseFirestore();

      if (!auth || !db) {
        toast.error('Firebase não está disponível');
        return;
      }

      const currentAuth = getAuth();
      await addDoc(collection(db, 'tasks'), {
        ...taskData,
        userId: currentAuth.currentUser!.uid,
        createdAt: new Date().toISOString(),
      });
      toast.success('Tarefa criada!');
    } catch (err) {
      console.error('Erro ao criar tarefa:', err);
      toast.error('Erro ao criar tarefa');
    }
  };

  const updateTask = async (id: string, updates: Partial<Task>) => {
    try {
      const db = getFirebaseFirestore();

      if (!db) {
        toast.error('Firebase não está disponível');
        return;
      }

      await updateDoc(doc(db, 'tasks', id), updates);
      toast.success('Tarefa atualizada!');
    } catch (err) {
      console.error('Erro ao atualizar tarefa:', err);
      toast.error('Erro ao atualizar tarefa');
    }
  };

  const deleteTask = async (id: string) => {
    try {
      const db = getFirebaseFirestore();

      if (!db) {
        toast.error('Firebase não está disponível');
        return;
      }

      await deleteDoc(doc(db, 'tasks', id));
      toast.success('Tarefa excluída!');
    } catch (err) {
      console.error('Erro ao excluir tarefa:', err);
      toast.error('Erro ao excluir tarefa');
    }
  };

  return { tasks, loading, createTask, updateTask, deleteTask };
}