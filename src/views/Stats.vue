<template>
  <div class="min-h-screen bg-background">
    <!-- 头部 -->
    <header class="px-4 pt-6 pb-4 bg-surface shadow-sm">
      <h1 class="text-xl font-semibold text-text-primary">📊 统计</h1>
      <p class="text-sm text-text-secondary mt-1">查看你的习惯养成进度</p>
    </header>

    <!-- 总览卡片 -->
    <div class="px-4 py-4">
      <div class="bg-gradient-to-r from-primary to-primary-light rounded-xl p-4 text-white">
        <div class="text-sm opacity-90">总完成率</div>
        <div class="text-4xl font-bold mt-2">{{ habitsStore.progressPercent.toFixed(0) }}%</div>
        <div class="text-sm mt-2 opacity-90">
          今日已完成 {{ habitsStore.completedCount }}/{{ habitsStore.habits.length }} 个习惯
        </div>
      </div>
    </div>

    <!-- 习惯分布 -->
    <div class="px-4 py-2">
      <h3 class="font-medium text-text-primary mb-3">📈 习惯分布</h3>
      <div class="space-y-3">
        <div
          v-for="habit in habitsStore.habits"
          :key="habit.id"
          class="bg-surface rounded-lg p-3 shadow-sm"
        >
          <div class="flex items-center justify-between mb-2">
            <div class="flex items-center gap-2">
              <span class="text-xl">{{ habit.completed ? '✅' : habit.icon }}</span>
              <span :class="habit.completed ? 'text-success' : 'text-text-primary'">
                {{ habit.name }}
              </span>
            </div>
            <span :class="habit.completed ? 'text-success' : 'text-text-secondary'">
              {{ habit.completed ? '已完成' : '未完成' }}
            </span>
          </div>
          <div class="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              :class="habit.completed ? 'bg-success' : 'bg-primary'"
              class="h-full transition-all duration-500"
              :style="{ width: habit.completed ? '100%' : '0%' }"
            ></div>
          </div>
        </div>
      </div>
    </div>

    <!-- 开销统计 -->
    <div v-if="habitsStore.expenses.length > 0" class="px-4 py-4">
      <h3 class="font-medium text-text-primary mb-3">💰 今日开销</h3>
      <div class="bg-surface rounded-lg p-4 shadow-sm">
        <div class="text-3xl font-bold text-primary">¥{{ habitsStore.totalExpenses.toFixed(2) }}</div>
        <div class="text-sm text-text-secondary mt-2">
          共 {{ habitsStore.expenses.length }} 笔记录
        </div>
      </div>
    </div>

    <!-- 日记统计 -->
    <div v-if="habitsStore.diaries.length > 0" class="px-4 py-4 pb-20">
      <h3 class="font-medium text-text-primary mb-3">📚 日记统计</h3>
      <div class="bg-surface rounded-lg p-4 shadow-sm">
        <div class="text-3xl font-bold text-primary">{{ habitsStore.diaries.length }}</div>
        <div class="text-sm text-text-secondary mt-2">
          已记录 {{ habitsStore.diaries.length }} 篇日记
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useHabitsStore } from '@/stores/habits'

const habitsStore = useHabitsStore()
</script>
