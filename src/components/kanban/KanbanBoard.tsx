"use client";

import React from 'react';
import { DndContext, DragEndEvent, useSensor, useSensors, PointerSensor, useDraggable, useDroppable } from '@dnd-kit/core';
import type { Task, TaskStatus } from '@/types';

interface KanbanBoardProps {
  tasks: Task[];
  onStatusChange: (taskId: string, newStatus: TaskStatus) => void;
}

function TaskCard({ task }: { task: Task }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({ id: task.id });
  const style = transform ? { transform: `translate3d(${transform.x}px, ${transform.y}px, 0)` } : undefined;

  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      style={style}
      className={`p-3 bg-white rounded border shadow-sm cursor-grab ${isDragging ? 'opacity-75' : ''}`}
    >
      <div className="flex items-center justify-between">
        <h3 className="font-medium text-sm">{task.title}</h3>
        <span className="text-xs text-gray-500 capitalize">{task.priority}</span>
      </div>
      {task.subtasks && task.subtasks.length > 0 && (
        <p className="text-xs text-gray-500 mt-1">{`${task.subtasks.filter((s: { completed: boolean }) => s.completed).length}/${task.subtasks.length} subtasks`}</p>
      )}
    </div>
  );
}

export function KanbanBoard({ tasks, onStatusChange }: KanbanBoardProps) {
  const sensors = useSensors(useSensor(PointerSensor));

  const columns: { id: TaskStatus; title: string }[] = [
    { id: 'todo', title: 'A Fazer' },
    { id: 'doing', title: 'Fazendo' },
    { id: 'done', title: 'Concluído' },
  ];

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;

    const newStatus = over.id as TaskStatus;
    const taskId = active.id as string;

    if (!taskId) return;
    if (newStatus !== undefined && ['todo', 'doing', 'done'].includes(String(newStatus))) {
      onStatusChange(taskId, newStatus);
    }
  };

  return (
    <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {columns.map((col) => (
          <Column key={col.id} id={col.id} title={col.title} tasks={tasks.filter(t => t.status === col.id)} />
        ))}
      </div>
    </DndContext>
  );
}

function Column({ id, title, tasks }: { id: TaskStatus; title: string; tasks: Task[] }) {
  const { isOver, setNodeRef } = useDroppable({ id });

  return (
    <div ref={setNodeRef} id={id} className={`bg-gray-50 p-4 rounded-lg min-h-[200px] border ${isOver ? 'ring-2 ring-blue-400' : ''}`}>
      <h2 className="font-semibold mb-2">{title}</h2>
      <div className="space-y-2">
        {tasks.map(task => (
          <TaskCard key={task.id} task={task} />
        ))}
      </div>
    </div>
  );
}
