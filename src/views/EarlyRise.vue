<template>
  <div class="min-h-screen bg-background">
    <header class="px-4 pt-6 pb-4 bg-surface shadow-sm">
      <h1 class="text-xl font-semibold text-text-primary">⏰ 早起打卡</h1>
      <p class="text-sm text-text-secondary mt-1">比平时早起半小时</p>
    </header>

    <div class="px-4 py-6">
      <div class="bg-surface rounded-xl p-6 shadow-sm text-center">
        <label class="block text-sm font-medium text-text-secondary mb-3">起床时间</label>
        <input type="time" v-model="wakeTime" class="text-4xl font-bold text-text-primary outline-none" />
      </div>
    </div>

    <div class="px-4 py-4">
      <div class="bg-surface rounded-xl p-4 shadow-sm">
        <div class="flex justify-between items-center mb-2">
          <span class="text-text-secondary">目标起床时间</span>
          <span class="font-medium text-primary">07:30</span>
        </div>
        <div class="flex justify-between items-center">
          <span class="text-text-secondary">今日起床</span>
          <span class="font-medium" :class="isEarly ? 'text-success' : 'text-text-primary'">{{ wakeTime || '-' }}</span>
        </div>
      </div>
    </div>

    <div class="px-4 py-6">
      <button @click="completeEarlyRise" :disabled="!wakeTime" :class="['w-full py-4 rounded-xl font-medium text-lg shadow-lg transition-all', wakeTime ? 'bg-primary text-white' : 'bg-gray-200 text-gray-400 cursor-not-allowed']">
        ✅ 打卡完成
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useHabitsStore } from '@/stores/habits'

const habitsStore = useHabitsStore()
const wakeTime = ref('')

const isEarly = computed(() => {
  if (!wakeTime.value) return false
  return wakeTime.value < '07:30'
})

const completeEarlyRise = () => {
  habitsStore.completeHabit(7)
  habitsStore.addDiary({ type: 'early-rise', time: wakeTime.value })
  alert('从容的开始新的一天 🌅')
  wakeTime.value = ''
}
</script>
