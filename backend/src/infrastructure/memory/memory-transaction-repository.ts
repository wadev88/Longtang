import type { CreateTransactionInput, Transaction, UpdateTransactionInput } from '../../domain/entities/transaction'
import type { TransactionRepository } from '../../domain/repositories/transaction-repository'
import { v4 } from 'uuid'

export class MemoryTransactionRepository implements TransactionRepository {
  private transactions: Map<string, Transaction> = new Map()

  async findAll(userId: string): Promise<Transaction[]> {
    return Array.from(this.transactions.values())
      .filter(t => t.userId === userId)
      .sort((a, b) => b.date.localeCompare(a.date))
  }

  async findById(id: string): Promise<Transaction | null> {
    return this.transactions.get(id) ?? null
  }

  async create(input: CreateTransactionInput): Promise<Transaction> {
    const now = new Date().toISOString()
    const transaction: Transaction = {
      id: v4(),
      userId: input.userId,
      type: input.type,
      category: input.category,
      amount: input.amount,
      note: input.note ?? '',
      date: input.date,
      createdAt: now,
      updatedAt: now,
    }
    this.transactions.set(transaction.id, transaction)
    return transaction
  }

  async update(id: string, input: UpdateTransactionInput): Promise<Transaction | null> {
    const existing = this.transactions.get(id)
    if (!existing) return null

    const updated: Transaction = {
      ...existing,
      type: input.type ?? existing.type,
      category: input.category ?? existing.category,
      amount: input.amount ?? existing.amount,
      note: input.note ?? existing.note,
      date: input.date ?? existing.date,
      updatedAt: new Date().toISOString(),
    }
    this.transactions.set(id, updated)
    return updated
  }

  async delete(id: string): Promise<boolean> {
    return this.transactions.delete(id)
  }
}
