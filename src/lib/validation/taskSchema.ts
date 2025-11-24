import { z } from 'zod';

export const subtaskSchema = z.object({
  id: z.string(),
  title: z.string().min(1, { message: 'Sub-tarefa deve ter um título' }),
});

export const taskSchema = z.object({
  title: z.string().min(1, { message: 'Título é obrigatório' }),
  description: z.string().optional(),
  dueDate: z.string().optional(),
  priority: z.enum(['low', 'medium', 'high']).optional(),
  status: z.enum(['todo', 'doing', 'done']).optional(),
  subtasks: z.array(subtaskSchema).optional(),
});
