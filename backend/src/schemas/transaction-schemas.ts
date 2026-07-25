import { z } from 'zod'
import { resolver } from 'hono-openapi'

export const TransactionType = z.enum(['income', 'expense'])

export const TransactionSchema = z.object({
  id: z.string().openapi({ example: '123e4567-e89b-12d3-a456-426614174000' }),
  userId: z.string().openapi({ example: '123e4567-e89b-12d3-a456-426614174000' }),
  type: TransactionType.openapi({ example: 'expense' }),
  category: z.string().openapi({ example: 'food' }),
  amount: z.number().positive().openapi({ example: 250 }),
  note: z.string().optional().openapi({ example: 'ลาซานญ่า' }),
  date: z.string().openapi({ example: '2026-07-25' }),
  createdAt: z.string().openapi({ example: '2026-07-25T10:00:00Z' }),
  updatedAt: z.string().openapi({ example: '2026-07-25T10:00:00Z' }),
})

export const transactionResponseSchema = TransactionSchema

export const transactionListResponseSchema = z.object({
  data: z.array(TransactionSchema),
})

export const transactionSingleResponseSchema = z.object({
  data: TransactionSchema,
})

export const createTransactionSchema = z.object({
  userId: z.string().openapi({ example: '123e4567-e89b-12d3-a456-426614174000' }),
  type: TransactionType.openapi({ example: 'expense' }),
  category: z.string().min(1).openapi({ example: 'food' }),
  amount: z.number().positive().openapi({ example: 250 }),
  note: z.string().optional().openapi({ example: 'ลาซานญ่า' }),
  date: z.string().openapi({ example: '2026-07-25' }),
})

export const updateTransactionSchema = z.object({
  type: TransactionType.optional(),
  category: z.string().min(1).optional(),
  amount: z.number().positive().optional(),
  note: z.string().optional(),
  date: z.string().optional(),
})

export const transactionIdParamSchema = z.object({
  id: z.string().openapi({ example: '123e4567-e89b-12d3-a456-426614174000' }),
})

export const transactionDeleteResponseSchema = z.object({
  success: z.boolean(),
})

export const errorResponseSchema = z.object({
  error: z.string(),
})
