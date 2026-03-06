<template>
  <div
    v-if="showStatus"
    :class="[
      'fixed bottom-6 left-1/2 -translate-x-1/2 px-4 py-2 rounded-lg shadow-lg z-30',
      'flex items-center gap-3',
      status === 'loading' ? 'bg-gray-800 text-white' :
      status === 'success' ? 'bg-green-50 text-green-700 border border-green-200' :
      status === 'error' ? 'bg-red-50 text-red-700 border border-red-200' :
      'bg-white text-gray-700 border border-gray-200'
    ]"
  >
    <!-- Status Icon -->
    <span
      :class="[
        'text-xl',
        status === 'loading' ? 'animate-spin' :
        status === 'success' ? 'text-green-500' :
        status === 'error' ? 'text-red-500' :
        'text-gray-400'
      ]"
    >
      {{ status === 'loading' ? '⏳' : status === 'success' ? '✅' : status === 'error' ? '❌' : 'ℹ️' }}
    </span>

    <!-- Status Message -->
    <div class="flex flex-col">
      <span class="text-xs font-semibold uppercase opacity-70">
        {{ status === 'loading' ? '处理中' : status === 'success' ? '成功' : status === 'error' ? '失败' : '状态' }}
      </span>
      <span class="text-sm">{{ message }}</span>
    </div>

    <!-- Close Button -->
    <button
      v-if="closable"
      @click="close"
      class="ml-2 text-gray-400 hover:text-gray-600"
    >
      <span class="text-lg">✕</span>
    </button>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'

defineProps({
  status: {
    type: String,
    default: 'idle', // idle | loading | success | error | warning
  },
  message: {
    type: String,
    default: '',
  },
  duration: {
    type: Number,
    default: 3000,
  },
  closable: {
    type: Boolean,
    default: true,
  },
})

const showStatus = ref(false)
let timer = null

const close = () => {
  showStatus.value = false
  clearTimeout(timer)
}

const show = () => {
  if (status === 'idle') {
    showStatus.value = false
    return
  }

  showStatus.value = true
  
  if (duration > 0) {
    timer = setTimeout(() => {
      close()
    }, duration)
  }
}

// 暴露给父组件调用
defineExpose({
  show,
  close,
})

onMounted(() => {
  if (status !== 'idle' && message) {
    show()
  }
})

onUnmounted(() => {
  clearTimeout(timer)
})
</script>
