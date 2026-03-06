<template>
  <div class="min-h-screen bg-background">
    <!-- 头部 -->
    <header class="px-4 pt-6 pb-4 bg-surface shadow-sm">
      <h1 class="text-xl font-semibold text-text-primary">📅 回顾</h1>
      <p class="text-sm text-text-secondary mt-1">回顾你的成长轨迹</p>
    </header>

    <!-- 日期选择 -->
    <div class="px-4 py-4">
      <input
        type="date"
        v-model="selectedDate"
        class="w-full p-3 border border-gray-200 rounded-lg"
      />
    </div>

    <!-- 日记回顾 -->
    <div v-if="filteredDiaries.length > 0" class="px-4 py-2">
      <h3 class="font-medium text-text-primary mb-3">📚 日记回顾</h3>
      <div class="space-y-3">
        <div
          v-for="diary in filteredDiaries"
          :key="diary.id"
          class="bg-surface rounded-lg p-4 shadow-sm"
        >
          <p class="text-xs text-text-secondary mb-2">
            {{ formatDateTime(diary.date) }}
          </p>
          <ol class="list-decimal list-inside space-y-2 text-text-secondary">
            <li v-for="(line, i) in diary.lines" :key="i">{{ line }}</li>
          </ol>
        </div>
      </div>
    </div>

    <!-- 开销回顾 -->
    <div v-if="filteredExpenses.length > 0" class="px-4 py-2">
      <h3 class="font-medium text-text-primary mb-3">💰 开销记录</h3>
      <div class="space-y-2">
        <div
          v-for="expense in filteredExpenses"
          :key="expense.id"
          class="bg-surface rounded-lg p-3 shadow-sm flex justify-between items-center"
        >
          <div>
            <div class="font-medium text-text-primary">{{ expense.category }}</div>
            <div class="text-xs text-text-secondary">{{ expense.description }}</div>
          </div>
          <div class="text-primary font-medium">¥{{ expense.amount.toFixed(2) }}</div>
        </div>
      </div>
    </div>

    <!-- 整理空间回顾 -->
    <div v-if="filteredCleanups.length > 0" class="px-4 py-2">
      <h3 class="font-medium text-text-primary mb-3">🧹 整理空间</h3>
      <div class="space-y-2">
        <div
          v-for="cleanup in filteredCleanups"
          :key="cleanup.id"
          class="bg-surface rounded-lg p-3 shadow-sm"
        >
          <div class="font-medium text-text-primary">{{ cleanup.area }}</div>
          <div class="text-xs text-text-secondary mt-1">
            耗时 {{ cleanup.duration }} 分钟 · {{ formatDateTime(cleanup.date) }}
          </div>
        </div>
      </div>
    </div>

    <!-- 空状态 -->
    <div v-if="isEmpty" class="px-4 py-20 text-center">
      <div class="text-6xl mb-4">📭</div>
      <p class="text-text-secondary">这天还没有记录</p>
      <p class="text-sm text-text-secondary mt-2">开始记录你的第一件小事吧</p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useHabitsStore } from '@/stores/habits'

const habitsStore = useHabitsStore()

const selectedDate = ref(new Date().toISOString().split('T')[0])

const filteredDiaries = computed(() => {
  return habitsStore.diaries.filter(d => 
    d.date.startsWith(selectedDate.value)
  )
})

const filteredExpenses = computed(() => {
  return habitsStore.expenses.filter(e => 
    e.date.startsWith(selectedDate.value)
  )
})

const filteredCleanups = computed(() => {
  return habitsStore.cleanups.filter(c => 
    c.date.startsWith(selectedDate.value)
  )
})

const isEmpty = computed(() => {
  return filteredDiaries.value.length === 0 &&
         filteredExpenses.value.length === 0 &&
         filteredCleanups.value.length === 0
})

const formatDateTime = (dateStr) => {
  return new Date(dateStr).toLocaleString('zh-CN', {
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}
</script>
