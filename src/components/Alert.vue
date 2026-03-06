<template>
  <transition name="alert-fade">
    <div
      v-if="visible && message"
      :class="[
        'fixed top-4 left-1/2 -translate-x-1/2 px-6 py-3 rounded-lg shadow-lg z-50 flex items-center gap-3',
        'animate-bounce-in',
        type === 'error' ? 'bg-red-50 text-red-700 border border-red-200' : 
        type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 
        'bg-gray-800 text-white'
      ]"
    >
      <!-- 图标 -->
      <span :class="[
        'text-xl',
        type === 'error' ? 'text-red-500' : 
        type === 'success' ? 'text-green-500' : 
        'text-gray-300'
      ]">
        {{ type === 'error' ? '❌' : type === 'success' ? '✅' : 'ℹ️' }}
      </span>

      <!-- 消息 -->
      <span class="text-sm font-medium">{{ message }}</span>

      <!-- 关闭按钮 -->
      <button
        v-if="closable"
        @click="close"
        class="ml-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
      >
        <span class="text-lg">✕</span>
      </button>
    </div>
  </transition>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

defineProps({
  message: {
    type: String,
    default: '',
  },
  type: {
    type: String,
    default: 'info', // info | success | error
  },
  duration: {
    type: Number,
    default: 3000, // 毫秒
  },
  closable: {
    type: Boolean,
    default: true,
  },
})

const emit = defineEmits(['close'])

const visible = ref(false)
let timer = null

const show = () => {
  visible.value = true
  
  if (duration > 0) {
    timer = setTimeout(() => {
      close()
    }, duration)
  }
}

const close = () => {
  visible.value = false
  clearTimeout(timer)
  emit('close')
}

// 暴露给父组件调用
defineExpose({
  show,
  close,
})

onMounted(() => {
  if (message) {
    show()
  }
})

onUnmounted(() => {
  clearTimeout(timer)
})
</script>

<style scoped>
.alert-fade-enter-active,
.alert-fade-leave-active {
  transition: all 0.3s ease;
  transform: translate(-50%, 0);
  opacity: 1;
}

.alert-fade-enter-from,
.alert-fade-leave-to {
  transform: translate(-50%, -20px);
  opacity: 0;
}

@keyframes bounceIn {
  0% {
    transform: translate(-50%, 100%);
    opacity: 0;
  }
  60% {
    transform: translate(-50%, -10px);
    opacity: 1;
  }
  80% {
    transform: translate(-50%, 5px);
  }
  100% {
    transform: translate(-50%, 0);
  }
}

.animate-bounce-in {
  animation: bounceIn 0.5s cubic-bezier(0.215, 0.610, 0.355, 1.000);
}
</style>
