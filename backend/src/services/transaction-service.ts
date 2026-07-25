import type { CreateTransactionInput, Transaction, UpdateTransactionInput } from '../domain/entities/transaction'
import type { TransactionRepository } from '../domain/repositories/transaction-repository'
import { NotFoundError } from '../domain/errors'

export class TransactionService {
  constructor(private readonly transactionRepo: TransactionRepository) {}

  async findAll(userId: string): Promise<Transaction[]> {
    return this.transactionRepo.findAll(userId)
  }

  async findById(id: string): Promise<Transaction> {
    const transaction = await this.transactionRepo.findById(id)
    if (!transaction) throw new NotFoundError('Transaction not found')
    return transaction
  }

  async create(input: CreateTransactionInput): Promise<Transaction> {
    return this.transactionRepo.create(input)
  }

  async update(id: string, input: UpdateTransactionInput): Promise<Transaction> {
    const transaction = await this.transactionRepo.update(id, input)
    if (!transaction) throw new NotFoundError('Transaction not found')
    return transaction
  }

  async delete(id: string): Promise<void> {
    const deleted = await this.transactionRepo.delete(id)
    if (!deleted) throw new NotFoundError('Transaction not found')
  }
}
