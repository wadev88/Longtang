<script setup lang="ts">
import { useTransactionStore } from '@/stores/use-transaction-store'
import type { CreateTransactionBody, UpdateTransactionBody, Transaction } from '@/models'
import { INCOME_CATEGORIES, EXPENSE_CATEGORIES } from '@/models'

const transactionStore = useTransactionStore()
const { transactions, isLoading, error, totalIncome, totalExpense, balance } = storeToRefs(transactionStore)

const headers = [
  { title: 'Date', key: 'date' },
  { title: 'Type', key: 'type' },
  { title: 'Category', key: 'category' },
  { title: 'Amount', key: 'amount' },
  { title: 'Note', key: 'note' },
  { title: 'Action', key: 'action', sortable: false, align: 'end' as const },
]

const dialog = ref(false)
const deleteDialog = ref(false)
const isSubmitting = ref(false)
const editingTransaction = ref<Transaction | null>(null)
const deletingTransaction = ref<Transaction | null>(null)

const form = ref<CreateTransactionBody & { id?: string }>({
  userId: '',
  type: 'expense',
  category: '',
  amount: 0,
  note: '',
  date: new Date().toISOString().split('T')[0],
})

const selectedType = ref<'income' | 'expense'>('expense')
const categoryOptions = computed(() =>
  selectedType.value === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES
)

function openCreate() {
  editingTransaction.value = null
  selectedType.value = 'expense'
  form.value = {
    userId: '',
    type: 'expense',
    category: '',
    amount: 0,
    note: '',
    date: new Date().toISOString().split('T')[0],
  }
  dialog.value = true
}

function openEdit(tx: Transaction) {
  editingTransaction.value = tx
  selectedType.value = tx.type
  form.value = {
    userId: tx.userId,
    type: tx.type,
    category: tx.category,
    amount: tx.amount,
    note: tx.note,
    date: tx.date,
  }
  dialog.value = true
}

function openDelete(tx: Transaction) {
  deletingTransaction.value = tx
  deleteDialog.value = true
}

async function submit() {
  isSubmitting.value = true
  try {
    if (editingTransaction.value)
      await transactionStore.updateTransaction(editingTransaction.value.id, form.value as UpdateTransactionBody)
    else
      await transactionStore.createTransaction(form.value as CreateTransactionBody)
    dialog.value = false
  }
  finally {
    isSubmitting.value = false
  }
}

async function confirmDelete() {
  if (!deletingTransaction.value) return
  isSubmitting.value = true
  try {
    await transactionStore.deleteTransaction(deletingTransaction.value.id)
    deleteDialog.value = false
  }
  finally {
    isSubmitting.value = false
  }
}

const typeColors: Record<string, string> = {
  income: 'success',
  expense: 'error',
}

const typeLabels: Record<string, string> = {
  income: 'รายรับ',
  expense: 'รายจ่าย',
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('th-TH', { dateStyle: 'medium' })
}

function formatCurrency(amount: number) {
  return new Intl.NumberFormat('th-TH', { style: 'currency', currency: 'THB' }).format(amount)
}

watch(selectedType, (val) => {
  form.value.type = val
  form.value.category = ''
})

onMounted(() => transactionStore.fetchTransactions())
</script>

<template>
  <div>
    <!-- Summary Cards -->
    <VRow class="mb-6">
      <VCol cols="12" md="4">
        <VCard>
          <VCardText class="d-flex align-center gap-3">
            <VAvatar color="success" variant="tonal" rounded>
              <VIcon icon="ri-arrow-up-line" />
            </VAvatar>
            <div>
              <div class="text-caption text-disabled">รายรับ</div>
              <div class="text-h5 font-weight-bold text-success">
                {{ formatCurrency(totalIncome) }}
              </div>
            </div>
          </VCardText>
        </VCard>
      </VCol>
      <VCol cols="12" md="4">
        <VCard>
          <VCardText class="d-flex align-center gap-3">
            <VAvatar color="error" variant="tonal" rounded>
              <VIcon icon="ri-arrow-down-line" />
            </VAvatar>
            <div>
              <div class="text-caption text-disabled">รายจ่าย</div>
              <div class="text-h5 font-weight-bold text-error">
                {{ formatCurrency(totalExpense) }}
              </div>
            </div>
          </VCardText>
        </VCard>
      </VCol>
      <VCol cols="12" md="4">
        <VCard>
          <VCardText class="d-flex align-center gap-3">
            <VAvatar :color="balance >= 0 ? 'info' : 'warning'" variant="tonal" rounded>
              <VIcon :icon="balance >= 0 ? 'ri-wallet-3-line' : 'ri-alert-line'" />
            </VAvatar>
            <div>
              <div class="text-caption text-disabled">คงเหลือ</div>
              <div class="text-h5 font-weight-bold" :class="balance >= 0 ? 'text-info' : 'text-warning'">
                {{ formatCurrency(balance) }}
              </div>
            </div>
          </VCardText>
        </VCard>
      </VCol>
    </VRow>

    <!-- Transactions List -->
    <VCard>
      <VCardTitle class="d-flex align-center justify-space-between pa-4">
        <span class="text-h6">รายการทั้งหมด</span>
        <VBtn
          color="primary"
          prepend-icon="ri-add-line"
          @click="openCreate"
        >
          เพิ่มรายการ
        </VBtn>
      </VCardTitle>

      <VDivider />

      <VAlert
        v-if="error"
        type="error"
        class="ma-4"
        :text="error"
        closable
      />

      <VDataTable
        :headers="headers"
        :items="transactions"
        :loading="isLoading"
        hover
      >
        <template #item.date="{ item }">
          {{ formatDate(item.date) }}
        </template>

        <template #item.type="{ item }">
          <VChip
            :color="typeColors[item.type]"
            size="small"
          >
            {{ typeLabels[item.type] }}
          </VChip>
        </template>

        <template #item.amount="{ item }">
          <span :class="item.type === 'income' ? 'text-success' : 'text-error'" class="font-weight-medium">
            {{ item.type === 'income' ? '+' : '-' }}{{ formatCurrency(item.amount) }}
          </span>
        </template>

        <template #item.action="{ item }">
          <IconBtn @click="openEdit(item)">
            <VTooltip activator="parent" location="top">Edit</VTooltip>
            <VIcon icon="ri-pencil-line" />
          </IconBtn>
          <IconBtn color="error" @click="openDelete(item)">
            <VTooltip activator="parent" location="top">Delete</VTooltip>
            <VIcon icon="ri-delete-bin-line" />
          </IconBtn>
        </template>

        <template #no-data>
          <div class="text-center py-8 text-disabled">
            ยังไม่มีรายการ กด "เพิ่มรายการ" เพื่อเริ่มบันทึก
          </div>
        </template>
      </VDataTable>
    </VCard>

    <!-- Create / Edit Dialog -->
    <VDialog v-model="dialog" max-width="520" persistent>
      <VCard :title="editingTransaction ? 'แก้ไขรายการ' : 'เพิ่มรายการ'">
        <VCardText>
          <VForm @submit.prevent="submit">
            <VRow>
              <VCol cols="12">
                <VRadioGroup
                  v-model="selectedType"
                  inline
                  hide-details
                >
                  <VRadio label="รายรับ" value="income" color="success" />
                  <VRadio label="รายจ่าย" value="expense" color="error" />
                </VRadioGroup>
              </VCol>
              <VCol cols="12" md="6">
                <VTextField
                  v-model="form.date"
                  label="วันที่"
                  type="date"
                  required
                />
              </VCol>
              <VCol cols="12" md="6">
                <VTextField
                  v-model="form.amount"
                  label="จำนวนเงิน"
                  type="number"
                  min="0"
                  step="0.01"
                  prepend-inner-icon="ri-money-dollar-circle-line"
                  required
                />
              </VCol>
              <VCol cols="12">
                <VSelect
                  v-model="form.category"
                  :items="categoryOptions"
                  label="หมวดหมู่"
                  prepend-inner-icon="ri-price-tag-3-line"
                  required
                />
              </VCol>
              <VCol cols="12">
                <VTextField
                  v-model="form.note"
                  label="บันทึกเพิ่มเติม"
                  prepend-inner-icon="ri-file-text-line"
                />
              </VCol>
              <VCol cols="12" v-if="!editingTransaction">
                <VTextField
                  v-model="form.userId"
                  label="User ID"
                  prepend-inner-icon="ri-user-line"
                  hint="ใส่ ID ผู้ใช้ (เช่น 123e4567-e89b-12d3-a456-426614174000)"
                  required
                />
              </VCol>
            </VRow>
          </VForm>
        </VCardText>
        <VCardActions class="justify-end pa-4">
          <VBtn variant="text" @click="dialog = false">ยกเลิก</VBtn>
          <VBtn
            color="primary"
            :loading="isSubmitting"
            @click="submit"
          >
            {{ editingTransaction ? 'บันทึก' : 'เพิ่ม' }}
          </VBtn>
        </VCardActions>
      </VCard>
    </VDialog>

    <!-- Delete Dialog -->
    <VDialog v-model="deleteDialog" max-width="400">
      <VCard title="ลบรายการ">
        <VCardText>
          แน่ใจหรือว่าต้องการลบรายการนี้? การกระทำนี้ไม่สามารถย้อนกลับได้
        </VCardText>
        <VCardActions class="justify-end pa-4">
          <VBtn variant="text" @click="deleteDialog = false">ยกเลิก</VBtn>
          <VBtn
            color="error"
            :loading="isSubmitting"
            @click="confirmDelete"
          >
            ลบ
          </VBtn>
        </VCardActions>
      </VCard>
    </VDialog>
  </div>
</template>
