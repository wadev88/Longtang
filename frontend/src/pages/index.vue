<script setup lang="ts">
import { onMounted } from 'vue'
import { useSEO } from '@/composables/useSEO'
import { useUserStore } from '@/stores/use-user-store'
import { useTransactionStore } from '@/stores/use-transaction-store'

useSEO({
  title: 'NgernNgern ThongThong - Dashboard',
  description: 'Personal finance tracker dashboard — income, expenses, and balance overview.',
  keywords: ['งเงินงทอง', 'การเงิน', 'รายรับ', 'รายจ่าย', 'dashboard'],
})

const userStore = useUserStore()
const transactionStore = useTransactionStore()
const { totalIncome, totalExpense, balance } = storeToRefs(transactionStore)

function formatCurrency(amount: number) {
  return new Intl.NumberFormat('th-TH', { style: 'currency', currency: 'THB' }).format(amount)
}

onMounted(async () => {
  await Promise.all([userStore.fetchUsers(), transactionStore.fetchTransactions()])
})
</script>

<template>
  <div>
    <h1 class="text-h5 font-weight-bold mb-6">ภาพรวมการเงิน</h1>

    <VRow class="mb-6">
      <VCol cols="12" sm="6" lg="3">
        <VCard>
          <VCardText class="d-flex align-center gap-3">
            <VAvatar color="success" variant="tonal" size="48">
              <VIcon icon="ri-arrow-up-line" size="24" />
            </VAvatar>
            <div>
              <div class="text-caption text-medium-emphasis">รายรับทั้งหมด</div>
              <div class="text-h5 font-weight-bold text-success">{{ formatCurrency(totalIncome) }}</div>
            </div>
          </VCardText>
        </VCard>
      </VCol>
      <VCol cols="12" sm="6" lg="3">
        <VCard>
          <VCardText class="d-flex align-center gap-3">
            <VAvatar color="error" variant="tonal" size="48">
              <VIcon icon="ri-arrow-down-line" size="24" />
            </VAvatar>
            <div>
              <div class="text-caption text-medium-emphasis">รายจ่ายทั้งหมด</div>
              <div class="text-h5 font-weight-bold text-error">{{ formatCurrency(totalExpense) }}</div>
            </div>
          </VCardText>
        </VCard>
      </VCol>
      <VCol cols="12" sm="6" lg="3">
        <VCard>
          <VCardText class="d-flex align-center gap-3">
            <VAvatar :color="balance >= 0 ? 'info' : 'warning'" variant="tonal" size="48">
              <VIcon :icon="balance >= 0 ? 'ri-wallet-3-line' : 'ri-alert-line'" size="24" />
            </VAvatar>
            <div>
              <div class="text-caption text-medium-emphasis">คงเหลือ</div>
              <div class="text-h5 font-weight-bold" :class="balance >= 0 ? 'text-info' : 'text-warning'">
                {{ formatCurrency(balance) }}
              </div>
            </div>
          </VCardText>
        </VCard>
      </VCol>
      <VCol cols="12" sm="6" lg="3">
        <VCard>
          <VCardText class="d-flex align-center gap-3">
            <VAvatar color="primary" variant="tonal" size="48">
              <VIcon icon="ri-user-3-line" size="24" />
            </VAvatar>
            <div>
              <div class="text-caption text-medium-emphasis">ผู้ใช้ทั้งหมด</div>
              <div class="text-h5 font-weight-bold">{{ userStore.users.length }}</div>
            </div>
          </VCardText>
        </VCard>
      </VCol>
    </VRow>

    <VRow>
      <VCol cols="12" md="6">
        <VCard title="รายการล่าสุด">
          <VList lines="two">
            <VListItem
              v-for="tx in transactionStore.transactions.slice(0, 5)"
              :key="tx.id"
            >
              <template #prepend>
                <VAvatar
                  :color="tx.type === 'income' ? 'success' : 'error'"
                  variant="tonal"
                  size="36"
                >
                  <VIcon
                    :icon="tx.type === 'income' ? 'ri-arrow-up-line' : 'ri-arrow-down-line'"
                    size="18"
                  />
                </VAvatar>
              </template>
              <VListItemTitle class="d-flex justify-space-between">
                <span>{{ tx.category }}</span>
                <span :class="tx.type === 'income' ? 'text-success' : 'text-error'" class="font-weight-bold">
                  {{ tx.type === 'income' ? '+' : '-' }}{{ formatCurrency(tx.amount) }}
                </span>
              </VListItemTitle>
              <VListItemSubtitle>{{ tx.note || tx.category }}</VListItemSubtitle>
            </VListItem>
            <VListItem v-if="transactionStore.transactions.length === 0" class="text-center text-medium-emphasis py-4">
              ยังไม่มีรายการ
            </VListItem>
          </VList>
          <VCardActions>
            <RouterLink :to="{ name: 'transaction-page' }">
              <VBtn variant="text" size="small">ดูทั้งหมด</VBtn>
            </RouterLink>
          </VCardActions>
        </VCard>
      </VCol>
      <VCol cols="12" md="6">
        <VCard title="ผู้ใช้ล่าสุด">
          <VList lines="two">
            <VListItem
              v-for="user in userStore.users.slice(0, 5)"
              :key="user.id"
            >
              <template #prepend>
                <VAvatar color="primary" variant="tonal" size="36">
                  <VIcon icon="ri-user-3-line" size="18" />
                </VAvatar>
              </template>
              <VListItemTitle>{{ user.name }}</VListItemTitle>
              <VListItemSubtitle>{{ user.email }}</VListItemSubtitle>
            </VListItem>
            <VListItem v-if="userStore.users.length === 0" class="text-center text-medium-emphasis py-4">
              ยังไม่มีผู้ใช้
            </VListItem>
          </VList>
          <VCardActions>
            <RouterLink :to="{ name: 'user-page' }">
              <VBtn variant="text" size="small">ดูทั้งหมด</VBtn>
            </RouterLink>
          </VCardActions>
        </VCard>
      </VCol>
    </VRow>
  </div>
</template>
