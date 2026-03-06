<template>
  <div class="min-h-screen bg-background">
    <!-- 头部 -->
    <header class="px-4 pt-6 pb-4 bg-surface shadow-sm">
      <h1 class="text-xl font-semibold text-text-primary">🧹 整理空间</h1>
      <p class="text-sm text-text-secondary mt-1">花 10 分钟收拾一个小区域</p>
    </header>

    <!-- 选择区域 -->
    <div class="px-4 py-4">
      <h3 class="font-medium text-text-primary mb-3">选择要整理的区域</h3>
      <div class="grid grid-cols-2 gap-3">
        <button
          v-for="area in areas"
          :key="area.id"
          @click="selectedArea = area"
          :class="[
            'p-4 rounded-xl border-2 transition-all',
            selectedArea?.id === area.id
              ? 'border-primary bg-primary/10'
              : 'border-gray-200 bg-surface'
          ]"
        >
          <div class="text-3xl mb-2">{{ area.icon }}</div>
          <div class="text-sm font-medium">{{ area.name }}</div>
        </button>
      </div>
    </div>

    <!-- 拍照区域 -->
    <div v-if="selectedArea" class="px-4 py-2">
      <h3 class="font-medium text-text-primary mb-3">📸 整理前拍照</h3>
      <div class="bg-surface rounded-xl p-4 text-center">
        <img v-if="beforePhoto" :src="beforePhoto" class="w-full h-48 object-cover rounded-lg mb-3" />
        <button
          @click="takeBeforePhoto"
          :class="[
            'w-full py-3 rounded-lg font-medium transition-all',
            beforePhoto
              ? 'bg-gray-100 text-text-primary'
              : 'bg-primary text-white'
          ]"
        >
          {{ beforePhoto ? '📷 重拍' : '📷 拍照记录' }}
        </button>
      </div>
    </div>

    <!-- 计时器 -->
    <div v-if="beforePhoto" class="px-4 py-4">
      <h3 class="font-medium text-text-primary mb-3">⏱️ 开始整理</h3>
      <div class="bg-gradient-to-r from-primary to-primary-light rounded-xl p-6 text-white text-center">
        <div class="text-5xl font-bold">{{ formattedTime }}</div>
        <div class="text-sm mt-2 opacity-90">目标：10 分钟</div>
        
        <div class="flex gap-3 mt-6 justify-center">
          <button
            @click="toggleTimer"
            class="px-6 py-2 bg-white text-primary rounded-lg font-medium"
          >
            {{ isRunning ? '⏸️ 暂停' : '▶️ 开始' }}
          </button>
          <button
            @click="resetTimer"
            class="px-6 py-2 bg-white/20 text-white rounded-lg font-medium"
          >
            🔄 重置
          </button>
        </div>
      </div>
    </div>

    <!-- 整理后拍照 -->
    <div v-if="time >= 60" class="px-4 py-2">
      <h3 class="font-medium text-text-primary mb-3">📸 整理后拍照</h3>
      <div class="bg-surface rounded-xl p-4 text-center">
        <img v-if="afterPhoto" :src="afterPhoto" class="w-full h-48 object-cover rounded-lg mb-3" />
        <button
          @click="takeAfterPhoto"
          :class="[
            'w-full py-3 rounded-lg font-medium transition-all',
            afterPhoto
              ? 'bg-gray-100 text-text-primary'
              : 'bg-success text-white'
          ]"
        >
          {{ afterPhoto ? '📷 重拍' : '📷 拍照记录' }}
        </button>
      </div>
    </div>

    <!-- 完成按钮 -->
    <div v-if="afterPhoto" class="px-4 py-6">
      <button
        @click="completeCleanup"
        class="w-full py-4 bg-primary text-white rounded-xl font-medium text-lg shadow-lg"
      >
        ✅ 完成整理
      </button>
    </div>

    <!-- 历史记录 -->
    <div v-if="habitsStore.cleanups.length > 0" class="px-4 pb-20">
      <h3 class="font-medium text-text-primary mb-3">📚 整理历史</h3>
      <div class="space-y-2">
        <div
          v-for="cleanup in habitsStore.cleanups.slice().reverse()"
          :key="cleanup.id"
          class="bg-surface rounded-lg p-3 shadow-sm"
        >
          <div class="flex justify-between items-start">
            <div>
              <div class="font-medium">{{ cleanup.area }}</div>
              <div class="text-xs text-text-secondary mt-1">
                耗时 {{ cleanup.duration }} 分钟 · {{ formatDate(cleanup.date) }}
              </div>
            </div>
            <div class="text-success text-sm">✅ 完成</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useHabitsStore } from '@/stores/habits'

const habitsStore = useHabitsStore()

const areas = [
  { id: 1, name: '书桌', icon: '📚' },
  { id: 2, name: '床头柜', icon: '🛏️' },
  { id: 3, name: '衣柜', icon: '👔' },
  { id: 4, name: '厨房', icon: '🍳' },
  { id: 5, name: '客厅', icon: '🛋️' },
  { id: 6, name: '卫生间', icon: '🚿' },
]

const selectedArea = ref(null)
const beforePhoto = ref(null)
const afterPhoto = ref(null)
const time = ref(0)
const isRunning = ref(false)
let timerId = null

const formattedTime = computed(() => {
  const minutes = Math.floor(time.value / 60)
  const seconds = time.value % 60
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
})

const takeBeforePhoto = () => {
  // 简化：使用文件输入
  const input = document.createElement('input')
  input.type = 'file'
  input.accept = 'image/*'
  input.capture = 'environment'
  input.onchange = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        beforePhoto.value = event.target.result
      }
      reader.readAsDataURL(file)
    }
  }
  input.click()
}

const takeAfterPhoto = () => {
  const input = document.createElement('input')
  input.type = 'file'
  input.accept = 'image/*'
  input.capture = 'environment'
  input.onchange = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        afterPhoto.value = event.target.result
      }
      reader.readAsDataURL(file)
    }
  }
  input.click()
}

const toggleTimer = () => {
  if (isRunning.value) {
    clearInterval(timerId)
    isRunning.value = false
  } else {
    isRunning.value = true
    timerId = setInterval(() => {
      time.value++
    }, 1000)
  }
}

const resetTimer = () => {
  clearInterval(timerId)
  isRunning.value = false
  time.value = 0
}

const completeCleanup = () => {
  habitsStore.completeHabit(2) // 标记"整理空间"习惯完成
  habitsStore.addCleanup({
    area: selectedArea.value?.name,
    duration: Math.floor(time.value / 60),
    beforePhoto: beforePhoto.value,
    afterPhoto: afterPhoto.value,
  })
  alert('整理完成！空间变整洁了，心情也会变好哦 🎉')
  
  // 重置
  selectedArea.value = null
  beforePhoto.value = null
  afterPhoto.value = null
  resetTimer()
}

const formatDate = (dateStr) => {
  return new Date(dateStr).toLocaleDateString('zh-CN', {
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}
</script>
