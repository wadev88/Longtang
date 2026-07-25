import type { CacheRepository } from '../domain/repositories/cache-repository'
import type { UserRepository } from '../domain/repositories/user-repository'
import type { TransactionRepository } from '../domain/repositories/transaction-repository'
import { UserHandler } from '../handlers/user-handler'
import { UserService } from '../services/user-service'
import { TransactionHandler } from '../handlers/transaction-handler'
import { TransactionService } from '../services/transaction-service'

export interface Repositories {
  userRepository: UserRepository
  cacheRepository: CacheRepository
  transactionRepository: TransactionRepository
}

export interface Container {
  userHandler: UserHandler
  transactionHandler: TransactionHandler
}

export function createContainer(repos: Repositories): Container {
  const userService = new UserService(repos.userRepository, repos.cacheRepository)
  const transactionService = new TransactionService(repos.transactionRepository)
  return {
    userHandler: new UserHandler(userService),
    transactionHandler: new TransactionHandler(transactionService),
  }
}
