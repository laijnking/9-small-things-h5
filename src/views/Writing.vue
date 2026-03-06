<template>
  <div class="min-h-screen bg-background">
    <!-- 头部 -->
    <header class="px-4 pt-6 pb-4 bg-surface shadow-sm">
      <h1 class="text-xl font-semibold text-text-primary">📝 写 3 句话</h1>
      <p class="text-sm text-text-secondary mt-1">记录今天的 3 件小事</p>
    </header>

    <!-- 输入方式切换 -->
    <div class="px-4 py-4">
      <div class="flex gap-2">
        <button
          v-for="mode in ['voice', 'text']"
          :key="mode"
          @click="currentMode = mode"
          :class="[
            'flex-1 py-3 rounded-lg font-medium transition-all',
            currentMode === mode
              ? 'bg-primary text-white'
              : 'bg-surface text-text-secondary'
          ]"
        >
          {{ mode === 'voice' ? '🎤 语音输入' : '📝 文字输入' }}
        </button>
      </div>
    </div>

    <!-- 语音输入 -->
    <div v-if="currentMode === 'voice'" class="px-4">
      <VoiceRecorder @saved="handleVoiceSaved" />
    </div>

    <!-- 文字输入 -->
    <div v-if="currentMode === 'text'" class="px-4">
      <textarea
        v-model="inputText"
        placeholder="请输入今天发生的 3 件小事..."
        class="w-full h-40 p-4 border border-gray-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-primary"
      ></textarea>
      <button
        @click="optimizeAndSave"
        :disabled="!inputText"
        :class="[
          'w-full mt-4 py-3 rounded-lg font-medium transition-all',
          inputText
            ? 'bg-primary text-white'
            : 'bg-gray-200 text-gray-400 cursor-not-allowed'
        ]"
      >
        ✨ AI 生成日记
      </button>
    </div>

    <!-- 生成结果 -->
    <div v-if="generatedDiary" class="px-4 mt-4">
      <div class="bg-surface rounded-lg p-4 shadow-sm">
        <h3 class="font-medium text-text-primary mb-2">✨ 你的日记：</h3>
        <ol class="list-decimal list-inside space-y-2 text-text-secondary">
          <li v-for="(line, i) in generatedDiary.lines" :key="i">{{ line }}</li>
        </ol>
        <div class="flex gap-2 mt-4">
          <button
            @click="generatedDiary = null"
            class="flex-1 bg-gray-100 text-text-primary py-2 rounded-lg font-medium"
          >
            取消
          </button>
          <button
            @click="saveDiary"
            class="flex-1 bg-primary text-white py-2 rounded-lg font-medium"
          >
            保存到日记本
          </button>
        </div>
      </div>
    </div>

    <!-- 历史记录 -->
    <div v-if="habitsStore.diaries.length > 0" class="px-4 mt-6 pb-20">
      <h3 class="font-medium text-text-primary mb-3">📚 历史日记</h3>
      <div class="space-y-2">
        <div
          v-for="diary in habitsStore.diaries.slice().reverse()"
          :key="diary.id"
          class="bg-surface rounded-lg p-3 shadow-sm"
        >
          <p class="text-xs text-text-secondary mb-2">
            {{ formatDate(diary.date) }}
          </p>
          <ol class="list-decimal list-inside space-y-1 text-sm text-text-secondary">
            <li v-for="(line, i) in diary.lines" :key="i">{{ line }}</li>
          </ol>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useHabitsStore } from '@/stores/habits'
import bailianService from '@/services/aliyun/bailian'
import VoiceRecorder from '@/components/VoiceRecorder.vue'

const habitsStore = useHabitsStore()

const currentMode = ref('voice')
const inputText = ref('')
const generatedDiary = ref(null)

const handleVoiceSaved = (record) => {
  // 语音输入已保存，标记习惯完成
  habitsStore.completeHabit(1)
  habitsStore.addDiary({
    lines: [record.optimized],
    original: record.original,
  })
  alert('日记已保存！')
}

const optimizeAndSave = async () => {
  if (!inputText.value) return
  
  try {
    const result = await bailianService.optimizeText(inputText.value)
    
    // 将结果分成 3 句话
    const lines = result.split('\n').filter(line => line.trim()).slice(0, 3)
    
    generatedDiary.value = {
      original: inputText.value,
      lines: lines,
      timestamp: Date.now(),
    }
  } catch (error) {
    console.error('优化失败:', error)
    alert('AI 生成失败，请重试')
  }
}

const saveDiary = () => {
  if (!generatedDiary.value) return
  
  habitsStore.completeHabit(1)
  habitsStore.addDiary(generatedDiary.value)
  generatedDiary.value = null
  inputText.value = ''
  alert('日记已保存！')
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
