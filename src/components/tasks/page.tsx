// src/app/task/[id]/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useTasks } from '@/hooks/useTasks';
import { TaskForm } from '@/components/tasks/TaskForm';
import { useParams, useRouter } from 'next/navigation';
import { doc, getDoc } from 'firebase/firestore';
import { getDbInstance } from '@/lib/firebase';
import { Task } from '@/types';

export default function TaskDetailPage() {
  const { id } = useParams();
  const { updateTask } = useTasks();
  const router = useRouter();
  const [task, setTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTask = async () => {
      const db = getDbInstance();
      if (!db) {
        setLoading(false);
        return;
      }

      const docSnap = await getDoc(doc(db, 'tasks', id as string));
      if (docSnap.exists()) {
        setTask({ id: docSnap.id, ...docSnap.data() } as Task);
      }
      setLoading(false);
    };
    fetchTask();
  }, [id]);

  const handleSave = (data: Omit<Task, 'id' | 'userId' | 'createdAt'>) => {
    updateTask(id as string, data);
    router.push('/dashboard');
  };

  if (loading) return <div className="p-6">Carregando...</div>;
  if (!task) return <div className="p-6">Tarefa não encontrada</div>;

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Editar Tarefa</h1>
      <TaskForm onSubmit={handleSave} initialData={task} />
    </div>
  );
}