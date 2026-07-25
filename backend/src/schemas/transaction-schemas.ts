import z from 'zod'

export const TransactionType = z.enum(['income', 'expense'])

export const transactionSchema = z.object({
  id: z.string(),
  userId: z.string(),
  type: TransactionType,
  category: z.string(),
  amount: z.number().positive(),
  note: z.string().optional(),
  date: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
})

export const createTransactionSchema = z.object({
  userId: z.string(),
  type: TransactionType,
  category: z.string().min(1),
  amount: z.number().positive(),
  note: z.string().optional(),
  date: z.string(),
})

export const updateTransactionSchema = createTransactionSchema.partial()

export const transactionIdParamSchema = z.object({
  id: z.string().min(1),
})

export const transactionResponseSchema = z.object({ data: transactionSchema })
export const transactionListResponseSchema = z.object({ data: z.array(transactionSchema) })
export const transactionDeleteResponseSchema = z.object({ success: z.boolean() })
export const errorResponseSchema = z.object({ error: z.string() })
