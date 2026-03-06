<template>
  <div class="min-h-screen bg-background">
    <!-- 头部 -->
    <header class="px-4 pt-6 pb-4 bg-surface shadow-sm">
      <h1 class="text-xl font-semibold text-text-primary">🎨 学技能</h1>
      <p class="text-sm text-text-secondary mt-1">碎片化学习一个技能</p>
    </header>

    <!-- 选择技能 -->
    <div class="px-4 py-4">
      <h3 class="font-medium text-text-primary mb-3">选择要学习的技能</h3>
      <div class="space-y-2">
        <button
          v-for="skill in skills"
          :key="skill.id"
          @click="selectedSkill = skill"
          :class="[
            'w-full p-4 rounded-xl border-2 text-left transition-all',
            selectedSkill?.id === skill.id
              ? 'border-primary bg-primary/10'
              : 'border-gray-200 bg-surface'
          ]"
        >
          <div class="flex items-center gap-3">
            <span class="text-2xl">{{ skill.icon }}</span>
            <div>
              <div class="font-medium">{{ skill.name }}</div>
              <div class="text-xs text-text-secondary">{{ skill.description }}</div>
            </div>
          </div>
        </button>
      </div>
    </div>

    <!-- 计时器 -->
    <div v-if="selectedSkill" class="px-4 py-4">
      <h3 class="font-medium text-text-primary mb-3">⏱️ 学习计时</h3>
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

    <!-- 学习记录 -->
    <div v-if="selectedSkill" class="px-4 py-4">
      <label class="block text-sm font-medium text-text-secondary mb-2">学习内容（可选）</label>
      <textarea
        v-model="learningNote"
        placeholder="今天学习了什么内容？"
        class="w-full h-24 p-3 border border-gray-200 rounded-lg resize-none outline-none focus:ring-2 focus:ring-primary"
      ></textarea>
    </div>

    <!-- 完成按钮 -->
    <div v-if="time >= 60" class="px-4 py-6">
      <button
        @click="completeLearning"
        class="w-full py-4 bg-primary text-white rounded-xl font-medium text-lg shadow-lg"
      >
        ✅ 完成学习
      </button>
    </div>

    <!-- 学习历史 -->
    <div v-if="learningRecords.length > 0" class="px-4 pb-20">
      <h3 class="font-medium text-text-primary mb-3">📚 学习记录</h3>
      <div class="space-y-2">
        <div
          v-for="record in learningRecords"
          :key="record.id"
          class="bg-surface rounded-lg p-3 shadow-sm"
        >
          <div class="flex justify-between items-start">
            <div>
              <div class="font-medium">{{ record.skill }}</div>
              <div class="text-xs text-text-secondary mt-1">
                {{ record.duration }} 分钟 · {{ formatDate(record.date) }}
              </div>
              <div v-if="record.note" class="text-sm text-text-secondary mt-1">
                {{ record.note }}
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

const skills = [
  { id: 1, name: '练字', icon: '✍️', description: '练习书法' },
  { id: 2, name: '画画', icon: '🎨', description: '学习绘画' },
  { id: 3, name: '乐器', icon: '🎵', description: '学习乐器' },
  { id: 4, name: '编程', icon: '💻', description: '学习编程' },
  { id: 5, name: '外语', icon: '🗣️', description: '学习外语' },
  { id: 6, name: '其他', icon: '📚', description: '其他技能' },
]

const selectedSkill = ref(null)
const learningNote = ref('')
const time = ref(0)
const isRunning = ref(false)
let timerId = null

const formattedTime = computed(() => {
  const minutes = Math.floor(time.value / 60)
  const seconds = time.value % 60
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
})

const learningRecords = computed(() => {
  return habitsStore.diaries.filter(d => d.type === 'learning')
})

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

const completeLearning = () => {
  habitsStore.completeHabit(4) // 标记"学技能"习惯完成
  habitsStore.addDiary({
    type: 'learning',
    skill: selectedSkill.value?.name,
    duration: Math.floor(time.value / 60),
    note: learningNote.value,
  })
  
  alert('又进步了一点，时间会给你答案 🌟')
  
  // 重置
  selectedSkill.value = null
  learningNote.value = ''
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
