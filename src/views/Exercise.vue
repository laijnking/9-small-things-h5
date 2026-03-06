<template>
  <div class="min-h-screen bg-background">
    <header class="px-4 pt-6 pb-4 bg-surface shadow-sm">
      <h1 class="text-xl font-semibold text-text-primary">🏃 运动</h1>
      <p class="text-sm text-text-secondary mt-1">10 分钟简单运动</p>
    </header>

    <div class="px-4 py-4">
      <h3 class="font-medium text-text-primary mb-3">选择运动类型</h3>
      <div class="grid grid-cols-2 gap-3">
        <button v-for="exercise in exercises" :key="exercise.id" @click="selectedExercise = exercise" :class="['p-4 rounded-xl border-2 transition-all', selectedExercise?.id === exercise.id ? 'border-primary bg-primary/10' : 'border-gray-200 bg-surface']">
          <div class="text-3xl mb-2">{{ exercise.icon }}</div>
          <div class="text-sm font-medium">{{ exercise.name }}</div>
        </button>
      </div>
    </div>

    <div v-if="selectedExercise" class="px-4 py-4">
      <div class="bg-gradient-to-r from-primary to-primary-light rounded-xl p-6 text-white text-center">
        <div class="text-5xl font-bold">{{ formattedTime }}</div>
        <div class="text-sm mt-2 opacity-90">目标：10 分钟</div>
        <div class="flex gap-3 mt-6 justify-center">
          <button @click="toggleTimer" class="px-6 py-2 bg-white text-primary rounded-lg font-medium">{{ isRunning ? '⏸️ 暂停' : '▶️ 开始' }}</button>
          <button @click="resetTimer" class="px-6 py-2 bg-white/20 text-white rounded-lg font-medium">🔄 重置</button>
        </div>
      </div>
    </div>

    <div v-if="time >= 600" class="px-4 py-6">
      <button @click="completeExercise" class="w-full py-4 bg-primary text-white rounded-xl font-medium text-lg shadow-lg">✅ 完成运动</button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useHabitsStore } from '@/stores/habits'

const habitsStore = useHabitsStore()
const exercises = [
  { id: 1, name: '深蹲', icon: '🦵' },
  { id: 2, name: '俯卧撑', icon: '💪' },
  { id: 3, name: '平板支撑', icon: '🧘' },
  { id: 4, name: '瑜伽拉伸', icon: '🤸' },
]
const selectedExercise = ref(null)
const time = ref(0)
const isRunning = ref(false)
let timerId = null

const formattedTime = computed(() => {
  const minutes = Math.floor(time.value / 60)
  const seconds = time.value % 60
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
})

const toggleTimer = () => {
  if (isRunning.value) { clearInterval(timerId); isRunning.value = false }
  else { isRunning.value = true; timerId = setInterval(() => time.value++, 1000) }
}

const resetTimer = () => { clearInterval(timerId); isRunning.value = false; time.value = 0 }

const completeExercise = () => {
  habitsStore.completeHabit(8)
  habitsStore.addDiary({ type: 'exercise', exercise: selectedExercise.value?.name, duration: Math.floor(time.value / 60) })
  alert('身体在变好，继续加油 💪')
  selectedExercise.value = null
  resetTimer()
}
</script>
