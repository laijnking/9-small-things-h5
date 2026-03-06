<template>
  <div class="min-h-screen bg-background">
    <header class="px-4 pt-6 pb-4 bg-surface shadow-sm">
      <h1 class="text-xl font-semibold text-text-primary">📚 深度阅读</h1>
      <p class="text-sm text-text-secondary mt-1">静下心来读一篇长文</p>
    </header>

    <div class="px-4 py-4">
      <label class="block text-sm font-medium text-text-secondary mb-2">文章链接</label>
      <input
        v-model="articleUrl"
        type="url"
        placeholder="https://..."
        class="w-full p-3 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-primary"
      />
    </div>

    <div class="px-4 py-4">
      <div class="bg-gradient-to-r from-primary to-primary-light rounded-xl p-6 text-white text-center">
        <div class="text-5xl font-bold">{{ formattedTime }}</div>
        <div class="text-sm mt-2 opacity-90">目标：30 分钟</div>
        <div class="flex gap-3 mt-6 justify-center">
          <button @click="toggleTimer" class="px-6 py-2 bg-white text-primary rounded-lg font-medium">
            {{ isRunning ? '⏸️ 暂停' : '▶️ 开始' }}
          </button>
          <button @click="resetTimer" class="px-6 py-2 bg-white/20 text-white rounded-lg font-medium">
            🔄 重置
          </button>
        </div>
      </div>
    </div>

    <div v-if="time >= 1800" class="px-4 py-6">
      <button @click="completeReading" class="w-full py-4 bg-primary text-white rounded-xl font-medium text-lg shadow-lg">
        ✅ 完成阅读
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useHabitsStore } from '@/stores/habits'

const habitsStore = useHabitsStore()
const articleUrl = ref('')
const time = ref(0)
const isRunning = ref(false)
let timerId = null

const formattedTime = computed(() => {
  const minutes = Math.floor(time.value / 60)
  const seconds = time.value % 60
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
})

const toggleTimer = () => {
  if (isRunning.value) {
    clearInterval(timerId)
    isRunning.value = false
  } else {
    isRunning.value = true
    timerId = setInterval(() => time.value++, 1000)
  }
}

const resetTimer = () => {
  clearInterval(timerId)
  isRunning.value = false
  time.value = 0
}

const completeReading = () => {
  habitsStore.completeHabit(5)
  habitsStore.addDiary({ type: 'reading', url: articleUrl.value, duration: Math.floor(time.value / 60) })
  alert('深度思考让你走得更远 📖')
  articleUrl.value = ''
  resetTimer()
}
</script>
