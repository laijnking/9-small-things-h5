<template>
  <div class="voice-recorder">
    <!-- 录音按钮 -->
    <button
      @mousedown="startRecording"
      @mouseup="stopRecording"
      @touchstart="startRecording"
      @touchend="stopRecording"
      @mouseleave="stopRecording"
      :class="[
        'relative w-20 h-20 rounded-full flex items-center justify-center text-3xl',
        'shadow-lg transition-all duration-200 select-none',
        isRecording ? 'bg-primary-dark scale-105' : 'bg-primary hover:bg-primary-dark'
      ]"
    >
      <span v-if="isRecording">🎤</span>
      <span v-else>🎙️</span>
      
      <!-- 录音波纹动画 -->
      <div v-if="isRecording" class="absolute inset-0 rounded-full bg-primary opacity-30 animate-ping"></div>
    </button>

    <!-- 识别结果 -->
    <div v-if="transcript" class="mt-4 bg-surface rounded-lg p-4 shadow-sm">
      <div class="flex justify-between items-start mb-2">
        <h3 class="font-medium text-text-primary">识别结果</h3>
        <button @click="clearTranscript" class="text-sm text-text-secondary">清空</button>
      </div>
      <p class="text-text-secondary">{{ transcript }}</p>
      
      <div v-if="optimizedText" class="mt-3 pt-3 border-t">
        <p class="text-sm text-primary font-medium">✨ 优化后：</p>
        <p class="text-sm text-text-secondary mt-1">{{ optimizedText }}</p>
      </div>
      
      <div class="mt-3 flex gap-2">
        <button 
          @click="reRecord" 
          class="flex-1 bg-gray-100 text-text-primary py-2 rounded-lg font-medium"
        >
          重新录音
        </button>
        <button 
          @click="confirmTranscript" 
          class="flex-1 bg-primary text-white py-2 rounded-lg font-medium"
        >
          确认保存
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import funasrService from '@/services/aliyun/funasr'
import bailianService from '@/services/aliyun/bailian'

const emit = defineEmits(['saved'])

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
      
      try {
        // 调用 FunASR 识别
        transcript.value = await funasrService.transcribe(audioBlob)
        
        // 调用 Bailian 优化
        optimizedText.value = await bailianService.optimizeText(transcript.value)
      } catch (error) {
        console.error('识别失败:', error)
        transcript.value = '识别失败，请重试'
      }
      
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

const reRecord = () => {
  clearTranscript()
}

const confirmTranscript = () => {
  emit('saved', {
    original: transcript.value,
    optimized: optimizedText.value,
    timestamp: Date.now(),
  })
  clearTranscript()
}
</script>
