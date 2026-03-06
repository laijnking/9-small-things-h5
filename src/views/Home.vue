<template>
  <div class="page-container">
    <!-- 头部 -->
    <header class="page-header">
      <div class="header-content">
        <h1 class="header-title">{{ dateStr }}</h1>
        <p class="header-subtitle">
          <span class="streak-badge">
            🔥 连续坚持 {{ streak }} 天
          </span>
        </p>
      </div>
    </header>

    <!-- 进度条 -->
    <section class="progress-section">
      <div class="progress-header">
        <span class="progress-label">今日进度</span>
        <span class="progress-value">{{ completedCount }}/{{ habits.length }}</span>
      </div>
      <div class="progress-bar">
        <div 
          class="progress-bar-fill animated"
          :style="{ width: progressPercent + '%' }"
        ></div>
      </div>
    </section>

    <!-- 语音输入组件 -->
    <section class="voice-section">
      <VoiceRecorder @saved="handleVoiceSaved" />
    </section>

    <!-- 习惯列表 -->
    <section class="habits-section">
      <div class="section-header">
        <h2 class="section-title">今日习惯</h2>
        <span class="section-count">{{ completedCount }}/{{ habits.length }}</span>
      </div>
      <div class="habits-list">
        <HabitCard
          v-for="habit in habits"
          :key="habit.id"
          :habit="habit"
          @complete="handleComplete"
        />
      </div>
    </section>

    <!-- 底部导航 -->
    <nav class="tab-bar">
      <router-link to="/" class="tab-item" :class="{ active: currentRoute === '/' }">
        <span class="tab-item-icon">🏠</span>
        <span class="tab-item-label">首页</span>
      </router-link>
      <router-link to="/stats" class="tab-item" :class="{ active: currentRoute === '/stats' }">
        <span class="tab-item-icon">📊</span>
        <span class="tab-item-label">统计</span>
      </router-link>
      <router-link to="/review" class="tab-item" :class="{ active: currentRoute === '/review' }">
        <span class="tab-item-icon">📅</span>
        <span class="tab-item-label">回顾</span>
      </router-link>
      <router-link to="/settings" class="tab-item" :class="{ active: currentRoute === '/settings' }">
        <span class="tab-item-icon">⚙️</span>
        <span class="tab-item-label">设置</span>
      </router-link>
    </nav>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import HabitCard from '@/components/HabitCard.vue'
import VoiceRecorder from '@/components/VoiceRecorder.vue'
import { useHabitsStore } from '@/stores/habits'

const route = useRoute()
const currentRoute = computed(() => route.path)

const habitsStore = useHabitsStore()
const habits = computed(() => habitsStore.habits)
const completedCount = computed(() => habits.value.filter(h => h.completed).length)
const progressPercent = computed(() => {
  if (habits.value.length === 0) return 0
  return (completedCount.value / habits.value.length) * 100
})

const dateStr = new Date().toLocaleDateString('zh-CN', {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
  weekday: 'long',
})

const streak = ref(12)

const handleVoiceSaved = (data) => {
  // 处理语音保存逻辑
  console.log('Voice saved:', data)
}

const handleComplete = (habitId) => {
  habitsStore.completeHabit(habitId)
}
</script>

<style scoped>
/* 页面容器 */
.page-container {
  min-height: 100vh;
  min-height: 100dvh;
  background-color: var(--background);
  padding-bottom: calc(70px + var(--spacing-safe-bottom));
}

/* 头部区域 */
.page-header {
  background: var(--surface);
  padding: calc(16px + var(--spacing-safe-top)) 20px 20px;
  border-bottom: 1px solid var(--border-light);
  box-shadow: var(--shadow-sm);
}

.header-content {
  max-width: 600px;
  margin: 0 auto;
}

.header-title {
  font-size: 20px;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0;
  line-height: 1.4;
}

.header-subtitle {
  margin-top: 8px;
  font-size: 14px;
  color: var(--text-secondary);
}

.streak-badge {
  display: inline-flex;
  align-items: center;
  padding: 4px 12px;
  background: linear-gradient(135deg, var(--primary-light) 0%, rgba(255, 138, 101, 0.2) 100%);
  color: var(--primary-dark);
  border-radius: var(--radius-full);
  font-weight: 600;
  font-size: 13px;
}

/* 进度区域 */
.progress-section {
  background: var(--surface);
  padding: 20px;
  border-bottom: 1px solid var(--border-light);
}

.progress-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.progress-label {
  font-size: 14px;
  color: var(--text-secondary);
  font-weight: 500;
}

.progress-value {
  font-size: 14px;
  color: var(--primary);
  font-weight: 600;
}

/* 语音区域 */
.voice-section {
  padding: 24px 20px;
}

/* 习惯列表区域 */
.habits-section {
  padding: 0 20px 20px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  padding-top: 8px;
}

.section-title {
  font-size: 16px;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0;
}

.section-count {
  font-size: 13px;
  color: var(--text-secondary);
  background: var(--background-alt);
  padding: 4px 10px;
  border-radius: var(--radius-full);
}

.habits-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

/* 响应式适配 */
@media (max-width: 375px) {
  .header-title {
    font-size: 18px;
  }
  
  .section-title {
    font-size: 15px;
  }
}

/* 横屏适配 */
@media (orientation: landscape) {
  .page-container {
    padding-bottom: calc(70px + var(--spacing-safe-bottom));
  }
}
</style>
