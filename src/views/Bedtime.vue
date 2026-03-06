<template>
  <div class="min-h-screen bg-background">
    <header class="px-4 pt-6 pb-4 bg-surface shadow-sm">
      <h1 class="text-xl font-semibold text-text-primary">📵 睡前关机</h1>
      <p class="text-sm text-text-secondary mt-1">睡前一小时远离手机</p>
    </header>

    <div class="px-4 py-6">
      <div class="bg-surface rounded-xl p-6 shadow-sm text-center">
        <label class="block text-sm font-medium text-text-secondary mb-3">计划关机时间</label>
        <input type="time" v-model="bedtime" class="text-4xl font-bold text-text-primary outline-none" />
        <p class="text-xs text-text-secondary mt-2">建议时间：22:00</p>
      </div>
    </div>

    <div class="px-4 py-4">
      <div class="bg-surface rounded-xl p-4 shadow-sm">
        <h3 class="font-medium text-text-primary mb-3">替代活动建议</h3>
        <div class="space-y-2">
          <div v-for="activity in activities" :key="activity.id" class="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
            <span class="text-2xl">{{ activity.icon }}</span>
            <span class="text-sm text-text-secondary">{{ activity.name }}</span>
          </div>
        </div>
      </div>
    </div>

    <div class="px-4 py-6">
      <button @click="completeBedtime" :disabled="!bedtime" :class="['w-full py-4 rounded-xl font-medium text-lg shadow-lg transition-all', bedtime ? 'bg-primary text-white' : 'bg-gray-200 text-gray-400 cursor-not-allowed']">
        ✅ 完成打卡
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useHabitsStore } from '@/stores/habits'

const habitsStore = useHabitsStore()
const bedtime = ref('')

const activities = [
  { id: 1, name: '读纸质书', icon: '📖' },
  { id: 2, name: '写日记', icon: '✍️' },
  { id: 3, name: '冥想/发呆', icon: '🧘' },
  { id: 4, name: '听轻音乐', icon: '🎵' },
]

const completeBedtime = () => {
  habitsStore.completeHabit(9)
  habitsStore.addDiary({ type: 'bedtime', time: bedtime.value })
  alert('好好休息，明天见 🌙')
  bedtime.value = ''
}
</script>
