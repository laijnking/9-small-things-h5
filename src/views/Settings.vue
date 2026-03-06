<template>
  <div class="min-h-screen bg-background pb-20">
    <!-- 头部 -->
    <header class="px-4 pt-6 pb-4 bg-surface shadow-sm">
      <h1 class="text-2xl font-bold text-text-primary">⚙️ 设置</h1>
      <p class="text-sm text-text-secondary mt-1">个性化你的习惯追踪</p>
    </header>

    <!-- 提醒设置 -->
    <div class="px-4 py-4">
      <h2 class="text-sm font-medium text-text-secondary mb-3 uppercase tracking-wide">提醒设置</h2>
      <div class="bg-surface rounded-xl shadow-sm overflow-hidden">
        <div class="flex items-center justify-between p-4 border-b">
          <div class="flex items-center gap-3">
            <span class="text-xl">🔔</span>
            <div>
              <div class="text-sm text-text-primary font-medium">每日提醒</div>
              <div class="text-xs text-text-secondary">每天晚上 8 点提醒你打卡</div>
            </div>
          </div>
          <label class="relative inline-flex items-center cursor-pointer">
            <input 
              type="checkbox" 
              v-model="settings.dailyReminder"
              class="sr-only peer"
            >
            <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
          </label>
        </div>
        
        <div v-if="settings.dailyReminder" class="p-4 border-b">
          <div class="flex items-center justify-between">
            <span class="text-sm text-text-secondary">提醒时间</span>
            <input 
              type="time" 
              v-model="settings.reminderTime"
              class="text-sm text-text-primary border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:border-primary"
            >
          </div>
        </div>

        <div class="flex items-center justify-between p-4">
          <div class="flex items-center gap-3">
            <span class="text-xl">📱</span>
            <div>
              <div class="text-sm text-text-primary font-medium">推送通知</div>
              <div class="text-xs text-text-secondary">允许发送推送通知</div>
            </div>
          </div>
          <label class="relative inline-flex items-center cursor-pointer">
            <input 
              type="checkbox" 
              v-model="settings.pushNotification"
              class="sr-only peer"
            >
            <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
          </label>
        </div>
      </div>
    </div>

    <!-- 习惯管理 -->
    <div class="px-4 py-4">
      <h2 class="text-sm font-medium text-text-secondary mb-3 uppercase tracking-wide">习惯管理</h2>
      <div class="bg-surface rounded-xl shadow-sm overflow-hidden">
        <div 
          v-for="habit in habits" 
          :key="habit.id"
          class="flex items-center justify-between p-4 border-b last:border-b-0"
        >
          <div class="flex items-center gap-3">
            <span class="text-xl">{{ habit.icon }}</span>
            <div>
              <div class="text-sm text-text-primary font-medium">{{ habit.name }}</div>
              <div class="text-xs text-text-secondary">{{ habit.description }}</div>
            </div>
          </div>
          <label class="relative inline-flex items-center cursor-pointer">
            <input 
              type="checkbox" 
              :checked="habit.enabled !== false"
              @change="toggleHabit(habit.id)"
              class="sr-only peer"
            >
            <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
          </label>
        </div>
        
        <button 
          @click="showAddHabit = true"
          class="w-full p-4 text-center text-primary font-medium hover:bg-gray-50"
        >
          + 添加自定义习惯
        </button>
      </div>
    </div>

    <!-- 数据管理 -->
    <div class="px-4 py-4">
      <h2 class="text-sm font-medium text-text-secondary mb-3 uppercase tracking-wide">数据管理</h2>
      <div class="bg-surface rounded-xl shadow-sm overflow-hidden">
        <button 
          @click="exportData"
          class="w-full flex items-center justify-between p-4 border-b hover:bg-gray-50"
        >
          <div class="flex items-center gap-3">
            <span class="text-xl">📤</span>
            <div class="text-left">
              <div class="text-sm text-text-primary font-medium">导出数据</div>
              <div class="text-xs text-text-secondary">导出所有打卡记录为 JSON</div>
            </div>
          </div>
          <span class="text-text-secondary">→</span>
        </button>
        
        <button 
          @click="showClearConfirm = true"
          class="w-full flex items-center justify-between p-4 hover:bg-gray-50"
        >
          <div class="flex items-center gap-3">
            <span class="text-xl">🗑️</span>
            <div class="text-left">
              <div class="text-sm text-red-500 font-medium">清除所有数据</div>
              <div class="text-xs text-text-secondary">删除所有打卡记录和设置</div>
            </div>
          </div>
          <span class="text-text-secondary">→</span>
        </button>
      </div>
    </div>

    <!-- 关于 -->
    <div class="px-4 py-4">
      <h2 class="text-sm font-medium text-text-secondary mb-3 uppercase tracking-wide">关于</h2>
      <div class="bg-surface rounded-xl shadow-sm overflow-hidden">
        <div class="p-4 text-center">
          <div class="text-4xl mb-2">🌟</div>
          <div class="text-lg font-semibold text-text-primary">小事打卡</div>
          <div class="text-sm text-text-secondary mt-1">Version 1.0.0</div>
          <div class="text-xs text-text-secondary mt-4">
            每天 9 件小事，成就更好的自己
          </div>
        </div>
      </div>
    </div>

    <!-- 添加习惯弹窗 -->
    <div 
      v-if="showAddHabit"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      @click="showAddHabit = false"
    >
      <div 
        class="bg-surface rounded-xl p-6 w-full max-w-sm mx-4"
        @click.stop
      >
        <h3 class="text-lg font-semibold text-text-primary mb-4">添加自定义习惯</h3>
        <input 
          v-model="newHabit.name"
          type="text"
          placeholder="习惯名称"
          class="w-full border border-gray-200 rounded-lg px-3 py-2 mb-3 text-sm focus:outline-none focus:border-primary"
        >
        <input 
          v-model="newHabit.description"
          type="text"
          placeholder="描述"
          class="w-full border border-gray-200 rounded-lg px-3 py-2 mb-3 text-sm focus:outline-none focus:border-primary"
        >
        <input 
          v-model="newHabit.icon"
          type="text"
          placeholder="图标（emoji）"
          class="w-full border border-gray-200 rounded-lg px-3 py-2 mb-4 text-sm focus:outline-none focus:border-primary"
        >
        <div class="flex gap-3">
          <button 
            @click="showAddHabit = false"
            class="flex-1 bg-gray-100 text-text-primary py-2 rounded-lg font-medium"
          >
            取消
          </button>
          <button 
            @click="addHabit"
            class="flex-1 bg-primary text-white py-2 rounded-lg font-medium"
          >
            添加
          </button>
        </div>
      </div>
    </div>

    <!-- 清除数据确认弹窗 -->
    <div 
      v-if="showClearConfirm"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      @click="showClearConfirm = false"
    >
      <div 
        class="bg-surface rounded-xl p-6 w-full max-w-sm mx-4"
        @click.stop
      >
        <h3 class="text-lg font-semibold text-text-primary mb-2">确认清除数据？</h3>
        <p class="text-sm text-text-secondary mb-4">
          此操作不可恢复，所有打卡记录和设置都将被删除。
        </p>
        <div class="flex gap-3">
          <button 
            @click="showClearConfirm = false"
            class="flex-1 bg-gray-100 text-text-primary py-2 rounded-lg font-medium"
          >
            取消
          </button>
          <button 
            @click="clearAllData"
            class="flex-1 bg-red-500 text-white py-2 rounded-lg font-medium"
          >
            确认清除
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useHabitsStore } from '@/stores/habits'

const habitsStore = useHabitsStore()
const habits = computed(() => habitsStore.habits)

const showAddHabit = ref(false)
const showClearConfirm = ref(false)
const newHabit = ref({
  name: '',
  description: '',
  icon: '⭐',
})

const settings = ref({
  dailyReminder: false,
  reminderTime: '20:00',
  pushNotification: false,
})

const toggleHabit = (habitId) => {
  const habit = habits.value.find(h => h.id === habitId)
  if (habit) {
    habit.enabled = habit.enabled === false ? true : false
    habitsStore.saveToLocalStorage()
  }
}

const addHabit = () => {
  if (!newHabit.value.name) {
    alert('请输入习惯名称')
    return
  }
  
  const newId = Math.max(...habits.value.map(h => h.id)) + 1
  habits.value.push({
    id: newId,
    name: newHabit.value.name,
    description: newHabit.value.description || '',
    icon: newHabit.value.icon || '⭐',
    completed: false,
    enabled: true,
  })
  
  habitsStore.saveToLocalStorage()
  newHabit.value = { name: '', description: '', icon: '⭐' }
  showAddHabit.value = false
}

const exportData = () => {
  const data = {
    habits: habits.value,
    settings: settings.value,
    exportDate: new Date().toISOString(),
  }
  
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `9small-things-export-${new Date().toISOString().split('T')[0]}.json`
  a.click()
  URL.revokeObjectURL(url)
}

const clearAllData = () => {
  localStorage.removeItem('9small-habits')
  localStorage.removeItem('9small-habits-date')
  localStorage.removeItem('9small-stats')
  localStorage.removeItem('9small-history')
  
  habitsStore.resetDaily()
  showClearConfirm.value = false
  
  alert('数据已清除')
}

onMounted(() => {
  // 加载设置
  const savedSettings = localStorage.getItem('9small-settings')
  if (savedSettings) {
    try {
      settings.value = JSON.parse(savedSettings)
    } catch (e) {
      console.error('加载设置失败:', e)
    }
  }
})

// 监听设置变化并保存
const saveSettings = () => {
  localStorage.setItem('9small-settings', JSON.stringify(settings.value))
}

// 使用 watch 监听设置变化（需要 Vue 的 watch）
import { watch } from 'vue'
watch(settings, saveSettings, { deep: true })
</script>

<style scoped>
.bg-background {
  background-color: #FAFAFA;
}

.bg-surface {
  background-color: #FFFFFF;
}

.text-text-primary {
  color: #1F2937;
}

.text-text-secondary {
  color: #6B7280;
}

.text-primary {
  color: #3B82F6;
}
</style>
