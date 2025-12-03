// src/app/tasks/[id]/page.tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useTasks } from "@/hooks/useTasks";
import { useAuth } from "@/hooks/useAuth";
import { Task, Subtask } from "@/types";
import { ArrowLeft, Edit, Trash2, MessageSquare, Send } from "lucide-react";
import { TaskForm } from "@/components/tasks/TaskForm";
import { getFirebaseFirestore } from "@/lib/firebase";
import { doc, getDoc, updateDoc, arrayUnion, Timestamp } from "firebase/firestore";

interface Comment {
  id: string;
  author: string;
  text: string;
  createdAt: Date;
}

export default function TaskDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const { updateTask, deleteTask } = useTasks();
  const [task, setTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [submittingComment, setSubmittingComment] = useState(false);

  const taskId = params.id as string;

  useEffect(() => {
    if (authLoading || !user) return;

    const fetchTask = async () => {
      try {
        const db = getFirebaseFirestore();
        if (!db) {
          setLoading(false);
          return;
        }

        const docSnap = await getDoc(doc(db, "tasks", taskId));
        if (docSnap.exists()) {
          const data = docSnap.data();
          setTask({
            id: docSnap.id,
            ...data,
          } as Task);

          // Carregar comentários
          if (data.comments) {
            setComments(
              data.comments.map((c: any) => ({
                ...c,
                createdAt: c.createdAt?.toDate?.() || new Date(c.createdAt),
              }))
            );
          }
        } else {
          router.push("/tasks");
        }
      } catch (error) {
        console.error("Erro ao carregar tarefa:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTask();
  }, [taskId, user, authLoading]);

  const handleSaveTask = async (data: Omit<Task, "id" | "userId" | "createdAt">) => {
    await updateTask(taskId, data);
    setTask((prev) => (prev ? { ...prev, ...data } : null));
    setEditing(false);
  };

  const handleDeleteTask = async () => {
    if (confirm("Tem certeza que deseja deletar esta tarefa?")) {
      await deleteTask(taskId);
      router.push("/tasks");
    }
  };

  const handleAddComment = async () => {
    if (!newComment.trim() || !user) return;

    setSubmittingComment(true);
    try {
      const db = getFirebaseFirestore();
      if (!db) return;

      const taskRef = doc(db, "tasks", taskId);
      const comment = {
        id: `${Date.now()}`,
        author: user.email || "Anônimo",
        text: newComment,
        createdAt: Timestamp.now(),
      };

      await updateDoc(taskRef, {
        comments: arrayUnion(comment),
      });

      setComments((prev) => [
        ...prev,
        {
          ...comment,
          createdAt: new Date(),
        },
      ]);
      setNewComment("");
    } catch (error) {
      console.error("Erro ao adicionar comentário:", error);
    } finally {
      setSubmittingComment(false);
    }
  };

  const handleToggleSubtask = async (subtaskId: string) => {
    if (!task) return;

    const updatedSubtasks = task.subtasks.map((s) =>
      s.id === subtaskId ? { ...s, completed: !s.completed } : s
    );

    await updateTask(taskId, {
      ...task,
      subtasks: updatedSubtasks,
    });

    setTask((prev) =>
      prev
        ? {
            ...prev,
            subtasks: updatedSubtasks,
          }
        : null
    );
  };

  if (authLoading || loading) {
    return (
      <div className="p-8 text-center">
        <p>Carregando detalhes da tarefa...</p>
      </div>
    );
  }

  if (!task) {
    return (
      <div className="p-8 text-center">
        <p className="text-red-600">Tarefa não encontrada</p>
        <Link href="/tasks" className="text-indigo-600 hover:underline mt-4 inline-block">
          Voltar para tarefas
        </Link>
      </div>
    );
  }

  const progressPercentage =
    task.subtasks && task.subtasks.length > 0
      ? (task.subtasks.filter((s) => s.completed).length / task.subtasks.length) * 100
      : 0;

  return (
    <div className="min-h-screen bg-white dark:bg-black">
      {/* Header */}
      <header className="border-b bg-white dark:bg-black dark:border-zinc-800">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/tasks" className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-900 rounded-lg">
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <h1 className="text-2xl font-bold">Detalhes da Tarefa</h1>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setEditing(!editing)}
              className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
            >
              <Edit className="h-4 w-4" />
              {editing ? "Cancelar" : "Editar"}
            </button>
            <button
              onClick={handleDeleteTask}
              className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              <Trash2 className="h-4 w-4" />
              Deletar
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-8">
        {editing ? (
          <div className="mb-8 p-6 bg-zinc-50 dark:bg-zinc-950 border dark:border-zinc-800 rounded-lg">
            <h2 className="text-xl font-bold mb-4">Editar Tarefa</h2>
            <TaskForm onSubmit={handleSaveTask} initialData={task} />
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-8">
            {/* Conteúdo Principal */}
            <div className="md:col-span-2 space-y-6">
              {/* Informações Básicas */}
              <div className="p-6 bg-white dark:bg-zinc-950 border dark:border-zinc-800 rounded-lg">
                <h2 className="text-3xl font-bold mb-4">{task.title}</h2>
                <p className="text-zinc-600 dark:text-zinc-400 text-lg">{task.description}</p>
              </div>

              {/* Status e Prioridade */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-white dark:bg-zinc-950 border dark:border-zinc-800 rounded-lg">
                  <h3 className="text-sm font-semibold text-zinc-600 dark:text-zinc-400 mb-2">
                    Prioridade
                  </h3>
                  <span
                    className={`inline-block px-3 py-1 rounded-lg font-medium ${
                      task.priority === "high"
                        ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                        : task.priority === "medium"
                        ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                        : "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                    }`}
                  >
                    {task.priority === "high"
                      ? "Alta"
                      : task.priority === "medium"
                      ? "Média"
                      : "Baixa"}
                  </span>
                </div>

                <div className="p-4 bg-white dark:bg-zinc-950 border dark:border-zinc-800 rounded-lg">
                  <h3 className="text-sm font-semibold text-zinc-600 dark:text-zinc-400 mb-2">
                    Status
                  </h3>
                  <span
                    className={`inline-block px-3 py-1 rounded-lg font-medium ${
                      task.status === "done"
                        ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                        : task.status === "doing"
                        ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                        : "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
                    }`}
                  >
                    {task.status === "done"
                      ? "Concluído"
                      : task.status === "doing"
                      ? "Fazendo"
                      : "A Fazer"}
                  </span>
                </div>
              </div>

              {/* Data de Vencimento */}
              {task.dueDate && (
                <div className="p-4 bg-white dark:bg-zinc-950 border dark:border-zinc-800 rounded-lg">
                  <h3 className="text-sm font-semibold text-zinc-600 dark:text-zinc-400 mb-2">
                    Data de Vencimento
                  </h3>
                  <p className="text-lg">
                    {new Date(task.dueDate).toLocaleDateString("pt-BR", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                      weekday: "long",
                    })}
                  </p>
                </div>
              )}

              {/* Sub-tarefas */}
              {task.subtasks && task.subtasks.length > 0 && (
                <div className="p-6 bg-white dark:bg-zinc-950 border dark:border-zinc-800 rounded-lg">
                  <h3 className="text-lg font-semibold mb-4">
                    Sub-tarefas ({task.subtasks.filter((s) => s.completed).length}/
                    {task.subtasks.length})
                  </h3>

                  {/* Barra de Progresso */}
                  <div className="mb-4">
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                      <div
                        className="bg-indigo-600 h-3 rounded-full transition-all"
                        style={{ width: `${progressPercentage}%` }}
                      ></div>
                    </div>
                    <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-2">
                      {Math.round(progressPercentage)}% concluído
                    </p>
                  </div>

                  {/* Lista de Sub-tarefas */}
                  <ul className="space-y-2">
                    {task.subtasks.map((subtask) => (
                      <li key={subtask.id} className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={subtask.completed}
                          onChange={() => handleToggleSubtask(subtask.id)}
                          className="w-5 h-5 rounded cursor-pointer"
                        />
                        <span
                          className={`flex-1 ${
                            subtask.completed
                              ? "line-through text-zinc-500"
                              : "text-black dark:text-white"
                          }`}
                        >
                          {subtask.title}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Comentários */}
              <div className="p-6 bg-white dark:bg-zinc-950 border dark:border-zinc-800 rounded-lg">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <MessageSquare className="h-5 w-5" />
                  Comentários ({comments.length})
                </h3>

                {/* Lista de Comentários */}
                <div className="space-y-3 mb-6">
                  {comments.length === 0 ? (
                    <p className="text-zinc-600 dark:text-zinc-400 text-sm">Nenhum comentário ainda</p>
                  ) : (
                    comments.map((comment) => (
                      <div
                        key={comment.id}
                        className="p-3 bg-zinc-50 dark:bg-zinc-900 rounded-lg"
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="font-semibold text-sm">{comment.author}</p>
                            <p className="text-xs text-zinc-600 dark:text-zinc-400">
                              {new Date(comment.createdAt).toLocaleDateString("pt-BR", {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </p>
                          </div>
                        </div>
                        <p className="mt-2 text-sm">{comment.text}</p>
                      </div>
                    ))
                  )}
                </div>

                {/* Adicionar Comentário */}
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && handleAddComment()}
                    placeholder="Adicionar um comentário..."
                    className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg dark:bg-zinc-900 focus:ring-2 focus:ring-indigo-600 focus:outline-none"
                  />
                  <button
                    onClick={handleAddComment}
                    disabled={submittingComment || !newComment.trim()}
                    className="p-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50"
                  >
                    <Send className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-4">
              <div className="p-4 bg-indigo-50 dark:bg-indigo-950 rounded-lg border border-indigo-200 dark:border-indigo-800">
                <h4 className="font-semibold text-indigo-900 dark:text-indigo-200 mb-2">
                  Informações
                </h4>
                <ul className="text-sm text-indigo-800 dark:text-indigo-300 space-y-2">
                  <li>
                    <strong>ID:</strong> {task.id.slice(0, 8)}...
                  </li>
                  <li>
                    <strong>Criada em:</strong>{" "}
                    {new Date(task.createdAt).toLocaleDateString("pt-BR")}
                  </li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
