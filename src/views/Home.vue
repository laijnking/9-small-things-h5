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

    <!-- 语音按钮 -->
    <div class="px-4 py-6 flex justify-center">
      <button
        @mousedown="startRecording"
        @mouseup="stopRecording"
        @touchstart="startRecording"
        @touchend="stopRecording"
        @mouseleave="stopRecording"
        :class="[
          'relative px-10 py-4 rounded-full text-white font-semibold text-lg',
          'shadow-lg transition-all duration-200 select-none',
          isRecording ? 'bg-primary-dark scale-105' : 'bg-primary hover:bg-primary-dark'
        ]"
      >
        <span v-if="isRecording" class="recording-animation">
          🎤 松开结束
        </span>
        <span v-else>
          🎙️ 按住说话
        </span>
      </button>
    </div>

    <!-- 识别结果展示 -->
    <div v-if="transcript" class="px-4 mb-4">
      <div class="bg-surface rounded-lg p-4 shadow-sm">
        <div class="flex justify-between items-start mb-2">
          <h3 class="font-medium text-text-primary">识别结果</h3>
          <button @click="clearTranscript" class="text-sm text-text-secondary">清空</button>
        </div>
        <p class="text-text-secondary">{{ transcript }}</p>
        <div v-if="optimizedText" class="mt-3 pt-3 border-t">
          <p class="text-sm text-primary font-medium">优化后：</p>
          <p class="text-sm text-text-secondary mt-1">{{ optimizedText }}</p>
        </div>
        <div class="mt-3 flex gap-2">
          <button 
            @click="confirmTranscript" 
            class="flex-1 bg-primary text-white py-2 rounded-lg font-medium"
          >
            确认保存
          </button>
          <button 
            @click="reRecord" 
            class="flex-1 bg-gray-100 text-text-primary py-2 rounded-lg font-medium"
          >
            重新录音
          </button>
        </div>
      </div>
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
    <nav class="fixed bottom-0 left-0 right-0 bg-surface border-t px-4 py-2 flex justify-around">
      <button class="flex flex-col items-center py-2 px-4 text-primary">
        <span class="text-xl">🏠</span>
        <span class="text-xs mt-1">首页</span>
      </button>
      <button class="flex flex-col items-center py-2 px-4 text-text-secondary">
        <span class="text-xl">📊</span>
        <span class="text-xs mt-1">统计</span>
      </button>
      <button class="flex flex-col items-center py-2 px-4 text-text-secondary">
        <span class="text-xl">📅</span>
        <span class="text-xs mt-1">回顾</span>
      </button>
      <button class="flex flex-col items-center py-2 px-4 text-text-secondary">
        <span class="text-xl">⚙️</span>
        <span class="text-xs mt-1">设置</span>
      </button>
    </nav>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import HabitCard from '@/components/HabitCard.vue'
import { useHabitsStore } from '@/stores/habits'
import funasrService from '@/services/aliyun/funasr'
import bailianService from '@/services/aliyun/bailian'

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
const isRecording = ref(false)
const transcript = ref('')
const optimizedText = ref('')
let mediaRecorder = null
let audioChunks = []

const startRecording = async () => {
  try {
    isRecording.value = true
    audioChunks = []
    
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
    mediaRecorder = new MediaRecorder(stream)
    
    mediaRecorder.ondataavailable = (event) => {
      audioChunks.push(event.data)
    }
    
    mediaRecorder.start()
  } catch (error) {
    console.error('录音失败:', error)
    alert('无法访问麦克风，请检查权限设置')
    isRecording.value = false
  }
}

const stopRecording = async () => {
  if (!isRecording.value || !mediaRecorder) return
  
  isRecording.value = false
  
  return new Promise((resolve) => {
    mediaRecorder.onstop = async () => {
      const audioBlob = new Blob(audioChunks, { type: 'audio/webm' })
      
      // 模拟识别结果（开发环境）
      transcript.value = '今天吃了牛肉面，花了 35 块钱，味道还不错'
      
      // 实际调用 FunASR
      // const result = await funasrService.transcribe(audioBlob)
      // transcript.value = result
      
      // 调用 Bailian 优化
      optimizedText.value = await bailianService.optimizeText(transcript.value)
      
      resolve()
    }
    
    mediaRecorder.stop()
    mediaRecorder.stream.getTracks().forEach(track => track.stop())
  })
}

const clearTranscript = () => {
  transcript.value = ''
  optimizedText.value = ''
}

const confirmTranscript = () => {
  // 保存到数据库
  console.log('保存:', transcript.value, optimizedText.value)
  clearTranscript()
  alert('已保存！')
}

const reRecord = () => {
  clearTranscript()
}

const handleComplete = (habitId) => {
  habitsStore.completeHabit(habitId)
}
</script>
