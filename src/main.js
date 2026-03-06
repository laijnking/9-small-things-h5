import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import './assets/styles.css'

const app = createApp(App)
const pinia = createPinia()

// 全局错误处理
app.config.errorHandler = (err, vm, info) => {
  console.error('Vue 错误:', err, info)
}

app.use(pinia)
app.use(router)

// 挂载应用
app.mount('#app')

// 初始化 store
import { useHabitsStore } from '@/stores/habits'
const habitsStore = useHabitsStore()
habitsStore.loadFromLocalStorage()
