<template>
  <transition name="spinner-fade">
    <div
      v-if="loading"
      :class="[
        'fixed inset-0 z-40 flex items-center justify-center bg-black/50 backdrop-blur-sm',
        'transition-all duration-300',
      ]"
    >
      <div class="bg-white rounded-2xl p-6 shadow-2xl flex flex-col items-center">
        <!-- Spinner Animation -->
        <div class="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        
        <!-- Loading Text -->
        <p class="mt-4 text-sm font-medium text-gray-700 animate-pulse">
          {{ message || '正在处理中...' }}
        </p>

        <!-- Error State -->
        <div v-if="error" class="mt-4 p-3 bg-red-50 rounded-lg flex items-center gap-2">
          <span class="text-red-500">❌</span>
          <span class="text-sm text-red-600">{{ error }}</span>
        </div>

        <!-- Retry Button -->
        <button
          v-if="error && !disableRetry"
          @click="retry"
          class="mt-3 px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary-dark transition-colors"
        >
          重试
        </button>
      </div>
    </div>
  </transition>
</template>

<script setup>
defineProps({
  loading: {
    type: Boolean,
    default: false,
  },
  message: {
    type: String,
    default: '',
  },
  error: {
    type: String,
    default: '',
  },
  disableRetry: {
    type: Boolean,
    default: false,
  },
})

defineEmits(['retry'])

const retry = () => {
  emit('retry')
}
</script>

<style scoped>
.spinner-fade-enter-active,
.spinner-fade-leave-active {
  transition: opacity 0.3s ease;
  opacity: 1;
}

.spinner-fade-enter-from,
.spinner-fade-leave-to {
  opacity: 0;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.animate-spin {
  animation: spin 1s linear infinite;
}
</style>
