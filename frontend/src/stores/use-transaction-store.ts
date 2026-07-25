import { defineStore } from 'pinia'
import { transactionApi } from '@/apis/transaction-api'
import type { CreateTransactionBody, UpdateTransactionBody, Transaction } from '@/models'

export const useTransactionStore = defineStore('TransactionStore', () => {
  const transactions = ref<Transaction[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const totalIncome = computed(() =>
    transactions.value.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0)
  )
  const totalExpense = computed(() =>
    transactions.value.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0)
  )
  const balance = computed(() => totalIncome.value - totalExpense.value)

  async function fetchTransactions(userId?: string) {
    isLoading.value = true
    error.value = null
    try {
      const res = await transactionApi.list(userId)
      transactions.value = res.data
    }
    catch (e: any) {
      error.value = e.message
    }
    finally {
      isLoading.value = false
    }
  }

  async function createTransaction(body: CreateTransactionBody) {
    const res = await transactionApi.create(body)
    transactions.value.unshift(res.data)
    return res.data
  }

  async function updateTransaction(id: string, body: UpdateTransactionBody) {
    const res = await transactionApi.update(id, body)
    const idx = transactions.value.findIndex(t => t.id === id)
    if (idx !== -1) transactions.value[idx] = res.data
    return res.data
  }

  async function deleteTransaction(id: string) {
    await transactionApi.remove(id)
    transactions.value = transactions.value.filter(t => t.id !== id)
  }

  return {
    transactions, isLoading, error,
    totalIncome, totalExpense, balance,
    fetchTransactions, createTransaction, updateTransaction, deleteTransaction,
  }
})
