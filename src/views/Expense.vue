<template>
  <div class="min-h-screen bg-background">
    <!-- 头部 -->
    <header class="px-4 pt-6 pb-4 bg-surface shadow-sm">
      <h1 class="text-xl font-semibold text-text-primary">💰 记录开销</h1>
      <p class="text-sm text-text-secondary mt-1">看清钱都去了哪里</p>
    </header>

    <!-- 金额输入 -->
    <div class="px-4 py-6">
      <div class="bg-surface rounded-xl p-6 shadow-sm">
        <label class="block text-sm font-medium text-text-secondary mb-2">金额</label>
        <div class="flex items-center gap-2">
          <span class="text-3xl text-primary">¥</span>
          <input
            v-model="amount"
            type="number"
            step="0.01"
            min="0"
            placeholder="0.00"
            class="flex-1 text-4xl font-bold text-text-primary outline-none"
          />
        </div>
      </div>
    </div>

    <!-- 分类选择 -->
    <div class="px-4 py-2">
      <h3 class="font-medium text-text-primary mb-3">选择分类</h3>
      <div class="grid grid-cols-3 gap-3">
        <button
          v-for="category in categories"
          :key="category.id"
          @click="selectedCategory = category"
          :class="[
            'p-4 rounded-xl border-2 transition-all',
            selectedCategory?.id === category.id
              ? 'border-primary bg-primary/10'
              : 'border-gray-200 bg-surface'
          ]"
        >
          <div class="text-2xl mb-1">{{ category.icon }}</div>
          <div class="text-xs font-medium">{{ category.name }}</div>
        </button>
      </div>
    </div>

    <!-- 描述输入 -->
    <div class="px-4 py-4">
      <label class="block text-sm font-medium text-text-secondary mb-2">描述（可选）</label>
      <input
        v-model="description"
        type="text"
        placeholder="例如：午餐牛肉面"
        class="w-full p-3 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-primary"
      />
    </div>

    <!-- 保存按钮 -->
    <div class="px-4 py-6">
      <button
        @click="saveExpense"
        :disabled="!amount || !selectedCategory"
        :class="[
          'w-full py-4 rounded-xl font-medium text-lg shadow-lg transition-all',
          amount && selectedCategory
            ? 'bg-primary text-white'
            : 'bg-gray-200 text-gray-400 cursor-not-allowed'
        ]"
      >
        💰 保存记录
      </button>
    </div>

    <!-- 今日开销 -->
    <div v-if="todayExpenses.length > 0" class="px-4 pb-20">
      <h3 class="font-medium text-text-primary mb-3">💸 今日开销</h3>
      <div class="bg-gradient-to-r from-primary to-primary-light rounded-xl p-4 text-white mb-4">
        <div class="text-sm opacity-90">今日总计</div>
        <div class="text-3xl font-bold mt-1">¥{{ todayTotal.toFixed(2) }}</div>
        <div class="text-sm mt-2 opacity-90">共 {{ todayExpenses.length }} 笔记录</div>
      </div>

      <div class="space-y-2">
        <div
          v-for="expense in todayExpenses"
          :key="expense.id"
          class="bg-surface rounded-lg p-3 shadow-sm flex justify-between items-center"
        >
          <div class="flex items-center gap-3">
            <div class="text-2xl">{{ expense.icon }}</div>
            <div>
              <div class="font-medium text-text-primary">{{ expense.category }}</div>
              <div class="text-xs text-text-secondary">{{ expense.description || '无描述' }}</div>
            </div>
          </div>
          <div class="text-primary font-medium">¥{{ expense.amount.toFixed(2) }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useHabitsStore } from '@/stores/habits'

const habitsStore = useHabitsStore()

const amount = ref('')
const selectedCategory = ref(null)
const description = ref('')

const categories = [
  { id: 1, name: '餐饮', icon: '🍜' },
  { id: 2, name: '交通', icon: '🚕' },
  { id: 3, name: '娱乐', icon: '🎬' },
  { id: 4, name: '购物', icon: '🛍️' },
  { id: 5, name: '日用', icon: '📦' },
  { id: 6, name: '其他', icon: '💸' },
]

const todayExpenses = computed(() => {
  const today = new Date().toDateString()
  return habitsStore.expenses.filter(e => new Date(e.date).toDateString() === today)
})

const todayTotal = computed(() => {
  return todayExpenses.value.reduce((sum, e) => sum + e.amount, 0)
})

const saveExpense = () => {
  if (!amount.value || !selectedCategory.value) return
  
  habitsStore.completeHabit(3) // 标记"记录开销"习惯完成
  habitsStore.addExpense({
    amount: parseFloat(amount.value),
    category: selectedCategory.value.name,
    icon: selectedCategory.value.icon,
    description: description.value,
  })
  
  alert('开销已记录！清楚钱的去向，才能更好地掌控生活 💪')
  
  // 重置
  amount.value = ''
  selectedCategory.value = null
  description.value = ''
}
</script>
