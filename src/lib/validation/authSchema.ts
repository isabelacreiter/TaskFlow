import { z } from 'zod';

export const registerSchema = z
	.object({
		name: z.string().min(2, { message: 'Nome deve ter pelo menos 2 caracteres' }),
		email: z.string().email({ message: 'E-mail inválido' }),
		password: z
			.string()
			.min(8, { message: 'Senha deve ter pelo menos 8 caracteres' })
			.regex(/(?=.*[A-Z])/, { message: 'Senha deve conter ao menos uma letra maiúscula' })
			.regex(/(?=.*[0-9])/, { message: 'Senha deve conter ao menos um número' }),
		confirmPassword: z.string(),
	})
	.refine((data) => data.password === data.confirmPassword, {
		path: ['confirmPassword'],
		message: 'As senhas não coincidem',
	});

export const loginSchema = z.object({
	email: z.string().email({ message: 'E-mail inválido' }),
	password: z.string().min(8, { message: 'Senha deve ter pelo menos 8 caracteres' }),
});
