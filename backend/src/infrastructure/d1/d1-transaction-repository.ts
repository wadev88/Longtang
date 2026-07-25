import type { D1Database } from '@cloudflare/workers-types'
import type { CreateTransactionInput, Transaction, UpdateTransactionInput } from '../../domain/entities/transaction'
import type { TransactionRepository } from '../../domain/repositories/transaction-repository'
import { v4 } from 'uuid'

export class D1TransactionRepository implements TransactionRepository {
  constructor(private readonly db: D1Database) {}

  async findAll(userId: string): Promise<Transaction[]> {
    const { results } = await this.db
      .prepare('SELECT * FROM transactions WHERE user_id = ? ORDER BY date DESC, created_at DESC')
      .bind(userId)
      .all()
    return results.map(this.mapRow)
  }

  async findById(id: string): Promise<Transaction | null> {
    const row = await this.db
      .prepare('SELECT * FROM transactions WHERE id = ?')
      .bind(id)
      .first()
    return row ? this.mapRow(row) : null
  }

  async create(input: CreateTransactionInput): Promise<Transaction> {
    const id = v4()
    const now = new Date().toISOString()
    await this.db
      .prepare(
        `INSERT INTO transactions (id, user_id, type, category, amount, note, date, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`
      )
      .bind(id, input.userId, input.type, input.category, input.amount, input.note ?? '', input.date, now, now)
      .run()
    return this.findById(id) as Promise<Transaction>
  }

  async update(id: string, input: UpdateTransactionInput): Promise<Transaction | null> {
    const existing = await this.findById(id)
    if (!existing) return null

    const now = new Date().toISOString()
    await this.db
      .prepare(
        `UPDATE transactions SET type = ?, category = ?, amount = ?, note = ?, date = ?, updated_at = ? WHERE id = ?`
      )
      .bind(
        input.type ?? existing.type,
        input.category ?? existing.category,
        input.amount ?? existing.amount,
        input.note ?? existing.note,
        input.date ?? existing.date,
        now,
        id
      )
      .run()
    return this.findById(id)
  }

  async delete(id: string): Promise<boolean> {
    const { success } = await this.db
      .prepare('DELETE FROM transactions WHERE id = ?')
      .bind(id)
      .run()
    return success
  }

  private mapRow(row: any): Transaction {
    return {
      id: row.id,
      userId: row.user_id,
      type: row.type,
      category: row.category,
      amount: row.amount,
      note: row.note ?? '',
      date: row.date,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    }
  }
}
