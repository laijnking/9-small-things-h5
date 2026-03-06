<template>
  <div class="min-h-screen bg-background">
    <!-- 头部 -->
    <header class="px-4 pt-6 pb-4 bg-surface shadow-sm">
      <h1 class="text-xl font-semibold text-text-primary">⚙️ 设置</h1>
      <p class="text-sm text-text-secondary mt-1">个性化你的体验</p>
    </header>

    <!-- 关于 -->
    <div class="px-4 py-4">
      <h3 class="font-medium text-text-primary mb-3">关于应用</h3>
      <div class="bg-surface rounded-xl p-4 shadow-sm">
        <div class="flex items-center gap-3 mb-3">
          <div class="text-4xl">🌙</div>
          <div>
            <div class="font-medium text-lg">9 件小事</div>
            <div class="text-xs text-text-secondary">版本：v0.1.0</div>
          </div>
        </div>
        <p class="text-sm text-text-secondary">
          用微小的确定性行动，替代手机的廉价多巴胺
        </p>
      </div>
    </div>

    <!-- 提醒设置 -->
    <div class="px-4 py-2">
      <h3 class="font-medium text-text-primary mb-3">提醒设置</h3>
      <div class="bg-surface rounded-xl shadow-sm divide-y">
        <div class="p-4 flex justify-between items-center">
          <div>
            <div class="font-medium">每日提醒</div>
            <div class="text-xs text-text-secondary mt-1">提醒你完成习惯</div>
          </div>
          <label class="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" v-model="settings.dailyReminder" class="sr-only peer" />
            <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
          </label>
        </div>
        <div class="p-4 flex justify-between items-center">
          <div>
            <div class="font-medium">睡前关机提醒</div>
            <div class="text-xs text-text-secondary mt-1">22:00 提醒你放下手机</div>
          </div>
          <label class="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" v-model="settings.bedtimeReminder" class="sr-only peer" />
            <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
          </label>
        </div>
      </div>
    </div>

    <!-- 数据管理 -->
    <div class="px-4 py-2">
      <h3 class="font-medium text-text-primary mb-3">数据管理</h3>
      <div class="bg-surface rounded-xl shadow-sm divide-y">
        <button
          @click="exportData"
          class="w-full p-4 flex justify-between items-center text-left"
        >
          <div>
            <div class="font-medium">导出数据</div>
            <div class="text-xs text-text-secondary mt-1">备份你的所有记录</div>
          </div>
          <span class="text-primary">📤</span>
        </button>
        <button
          @click="clearData"
          class="w-full p-4 flex justify-between items-center text-left text-error"
        >
          <div>
            <div class="font-medium">清除数据</div>
            <div class="text-xs text-text-secondary mt-1">删除所有本地数据</div>
          </div>
          <span class="text-error">🗑️</span>
        </button>
      </div>
    </div>

    <!-- 链接 -->
    <div class="px-4 py-4">
      <h3 class="font-medium text-text-primary mb-3">相关链接</h3>
      <div class="bg-surface rounded-xl shadow-sm divide-y">
        <a
          href="https://github.com/laijnking/9-small-things-h5"
          target="_blank"
          class="block p-4 flex justify-between items-center"
        >
          <div class="font-medium">GitHub 仓库</div>
          <span class="text-text-secondary">↗</span>
        </a>
        <a
          href="https://vercel.com"
          target="_blank"
          class="block p-4 flex justify-between items-center"
        >
          <div class="font-medium">Vercel 部署</div>
          <span class="text-text-secondary">↗</span>
        </a>
      </div>
    </div>

    <!-- 底部间距 -->
    <div class="h-20"></div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useHabitsStore } from '@/stores/habits'

const habitsStore = useHabitsStore()

const settings = ref({
  dailyReminder: true,
  bedtimeReminder: true,
})

const exportData = () => {
  const data = {
    habits: habitsStore.habits,
    diaries: habitsStore.diaries,
    expenses: habitsStore.expenses,
    cleanups: habitsStore.cleanups,
    exportDate: new Date().toISOString(),
  }
  
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `9-small-things-backup-${new Date().toISOString().split('T')[0]}.json`
  a.click()
  URL.revokeObjectURL(url)
  
  alert('数据已导出！')
}

const clearData = () => {
  if (confirm('确定要清除所有数据吗？此操作不可恢复！')) {
    localStorage.clear()
    location.reload()
  }
}

onMounted(() => {
  // 加载设置
  const savedSettings = localStorage.getItem('9small-settings')
  if (savedSettings) {
    settings.value = JSON.parse(savedSettings)
  }
})
</script>

<style scoped>
.text-error {
  color: #E57373;
}
</style>
