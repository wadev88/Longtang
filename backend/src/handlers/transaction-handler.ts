import type { Context } from 'hono'
import type { CreateTransactionInput, UpdateTransactionInput } from '../domain/entities/transaction'
import { ValidationError } from '../domain/errors'
import type { TransactionService } from '../services/transaction-service'

export class TransactionHandler {
  constructor(private readonly transactionService: TransactionService) {}

  findAll = async (c: Context) => {
    const userId = c.req.query('userId') ?? ''
    const transactions = await this.transactionService.findAll(userId)
    return c.json({ data: transactions })
  }

  findById = async (c: Context) => {
    const transaction = await this.transactionService.findById(this.param(c, 'id'))
    return c.json({ data: transaction })
  }

  create = async (c: Context) => {
    const body = await this.parseJson<CreateTransactionInput>(c)
    const transaction = await this.transactionService.create(body)
    return c.json({ data: transaction }, 201)
  }

  update = async (c: Context) => {
    const body = await this.parseJson<UpdateTransactionInput>(c)
    const transaction = await this.transactionService.update(this.param(c, 'id'), body)
    return c.json({ data: transaction })
  }

  delete = async (c: Context) => {
    await this.transactionService.delete(this.param(c, 'id'))
    return c.json({ success: true }, 200)
  }

  private param(c: Context, name: string): string {
    const value = c.req.param(name)
    if (!value) throw new ValidationError(`${name} param is required`)
    return value
  }

  private async parseJson<T>(c: Context): Promise<T> {
    try {
      return await c.req.json<T>()
    } catch {
      throw new ValidationError('Invalid JSON body')
    }
  }
}
