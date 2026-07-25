export interface Transaction {
  id: string
  userId: string
  type: 'income' | 'expense'
  category: string
  amount: number
  note: string
  date: string
  createdAt: string
  updatedAt: string
}

export interface CreateTransactionBody {
  userId: string
  type: 'income' | 'expense'
  category: string
  amount: number
  note?: string
  date: string
}

export interface UpdateTransactionBody {
  type?: 'income' | 'expense'
  category?: string
  amount?: number
  note?: string
  date?: string
}

export interface TransactionListResponse {
  data: Transaction[]
}

export interface TransactionResponse {
  data: Transaction
}

export const INCOME_CATEGORIES = [
  'เงินเดือน',
  'ฟรีแลนซ์',
  'ขายของ',
  'ลงทุน',
  'ดอกเบี้ย',
  'ของขวัญ',
  'อื่นๆ',
] as const

export const EXPENSE_CATEGORIES = [
  'อาหาร',
  'เดินทาง',
  'ที่พัก',
  'สาธารณูปโภค',
  'บันเทิง',
  'ช้อปปิ้ง',
  'สุขภาพ',
  'การศึกษา',
  'อื่นๆ',
] as const
