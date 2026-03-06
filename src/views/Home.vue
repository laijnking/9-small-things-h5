<template>
  <div class="min-h-screen bg-background">
    <!-- 头部 -->
    <header class="px-4 pt-6 pb-4 bg-surface shadow-sm">
      <h1 class="text-xl font-semibold text-text-primary">{{ dateStr }}</h1>
      <p class="text-sm text-text-secondary mt-1">连续坚持 {{ streak }} 天 🎉</p>
    </header>

    <!-- 进度条 -->
    <div class="px-4 py-4 bg-surface border-b">
      <div class="flex justify-between items-center mb-2">
        <span class="text-sm text-text-secondary">今日进度</span>
        <span class="text-sm font-medium text-primary">{{ completedCount }}/{{ habits.length }}</span>
      </div>
      <div class="h-2 bg-gray-200 rounded-full overflow-hidden">
        <div 
          class="h-full bg-primary transition-all duration-500"
          :style="{ width: progressPercent + '%' }"
        ></div>
      </div>
    </div>

    <!-- 语音输入组件 -->
    <div class="px-4 py-6">
      <VoiceRecorder @saved="handleVoiceSaved" />
    </div>

    <!-- 习惯列表 -->
    <div class="px-4 pb-20 space-y-2">
      <HabitCard
        v-for="habit in habits"
        :key="habit.id"
        :habit="habit"
        @complete="handleComplete"
      />
    </div>

    <!-- 底部导航 -->
    <nav class="fixed bottom-0 left-0 right-0 bg-surface border-t px-4 py-2 flex justify-around safe-area-bottom">
      <router-link to="/" class="flex flex-col items-center py-2 px-4" :class="currentRoute === '/' ? 'text-primary' : 'text-text-secondary'">
        <span class="text-xl">🏠</span>
        <span class="text-xs mt-1">首页</span>
      </router-link>
      <router-link to="/stats" class="flex flex-col items-center py-2 px-4" :class="currentRoute === '/stats' ? 'text-primary' : 'text-text-secondary'">
        <span class="text-xl">📊</span>
        <span class="text-xs mt-1">统计</span>
      </router-link>
      <router-link to="/review" class="flex flex-col items-center py-2 px-4" :class="currentRoute === '/review' ? 'text-primary' : 'text-text-secondary'">
        <span class="text-xl">📅</span>
        <span class="text-xs mt-1">回顾</span>
      </router-link>
      <router-link to="/settings" class="flex flex-col items-center py-2 px-4" :class="currentRoute === '/settings' ? 'text-primary' : 'text-text-secondary'">
        <span class="text-xl">⚙️</span>
        <span class="text-xs mt-1">设置</span>
      </router-link>
    </nav>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import HabitCard from '@/components/HabitCard.vue'
import VoiceRecorder from '@/components/VoiceRecorder.vue'
import { useHabitsStore } from '@/stores/habits'

const route = useRoute()
const currentRoute = computed(() => route.path)

const habitsStore = useHabitsStore()
const habits = computed(() => habitsStore.habits)
const completedCount = computed(() => habits.value.filter(h => h.completed).length)
const progressPercent = computed(() => (completedCount.value / habits.value.length) * 100)

const dateStr = new Date().toLocaleDateString('zh-CN', {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
  weekday: 'long',
})

const streak = ref(12)

const handleComplete = (habitId) => {
  habitsStore.completeHabit(habitId)
}
</script>
