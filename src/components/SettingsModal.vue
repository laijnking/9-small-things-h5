<template>
  <div
    v-if="showSettings"
    class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
  >
    <div class="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 animate-scale-in">
      <!-- Header -->
      <div class="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
        <h3 class="text-lg font-semibold text-gray-800">API 设置</h3>
        <button @click="showSettings = false" class="text-gray-400 hover:text-gray-600">
          <span class="text-xl">✕</span>
        </button>
      </div>

      <!-- Body -->
      <div class="p-6 space-y-4">
        <!-- API Key Input -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">API Key</label>
          <input
            v-model="apiKey"
            type="password"
            placeholder="sk-..."
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          />
          <p class="mt-1 text-xs text-gray-500">
            从阿里云控制台获取 <a href="https://dashscope.console.aliyun.com/apiKey" target="_blank" class="text-primary hover:underline">API Key</a>
          </p>
        </div>

        <!-- Models Select -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">模型</label>
          <select
            v-model="selectedModel"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            <option value="qwen3-coder-next">Qwen3 Coder Next (代码)</option>
            <option value="qwen-max">Qwen Max (通用)</option>
            <option value="qwen-plus">Qwen Plus (增强)</option>
            <option value="qwen-turbo">Qwen Turbo (快速)</option>
          </select>
        </div>

        <!-- Test Connection -->
        <div class="flex gap-2">
          <button
            @click="testConnection"
            :disabled="testingConnection"
            class="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
          >
            {{ testingConnection ? '测试中...' : '测试连接' }}
          </button>
        </div>

        <!-- Connection Results -->
        <div v-if="connectionTestResult" :class="[
          'p-3 rounded-lg',
          connectionTestResult.success ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
        ]">
          {{ connectionTestResult.message }}
        </div>

        <!-- Info -->
        <div class="bg-blue-50 rounded-lg p-4 text-sm text-blue-700">
          <p>💡 使用说明：</p>
          <ul class="mt-2 space-y-1">
            <li>• FunASR：语音识别（录音转文字）</li>
            <li>• Bailian：文本优化（日记生成）</li>
            <li>• API Key 仅存储在浏览器内存中</li>
          </ul>
        </div>
      </div>

      <!-- Footer -->
      <div class="px-6 py-4 bg-gray-50 rounded-b-2xl flex justify-end gap-2">
        <button
          @click="showSettings = false"
          class="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
        >
          关闭
        </button>
        <button
          @click="saveSettings"
          :disabled="!apiKey"
          class="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark disabled:opacity-50"
        >
          保存
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import funasrService from '@/services/aliyun/funasr'
import bailianService from '@/services/aliyun/bailian'

const showSettings = defineModel('show', { type: Boolean, default: false })

const apiKey = ref('')
const selectedModel = ref('qwen3-coder-next')
const testingConnection = ref(false)
const connectionTestResult = ref(null)

const saveSettings = () => {
  if (apiKey.value) {
    // 保存到 localStorage
    localStorage.setItem('dashscope-api-key', apiKey.value)
    localStorage.setItem('dashscope-model', selectedModel.value)
    
    // 显示成功提示
    connectionTestResult.value = {
      success: true,
      message: '设置已保存！',
    }
    
    setTimeout(() => {
      showSettings.value = false
    }, 1000)
  }
}

const testConnection = async () => {
  if (!apiKey.value) {
    connectionTestResult.value = {
      success: false,
      message: '请输入 API Key',
    }
    return
  }

  testingConnection.value = true
  connectionTestResult.value = null

  try {
    // 保存临时 API Key
    const originalKey = import.meta.env.VITE_DASHSCOPE_API_KEY
    import.meta.env.VITE_DASHSCOPE_API_KEY = apiKey.value

    // 测试 FunASR
    const funasrResult = await funasrService.testConnection()
    
    // 测试 Bailian
    const bailianResult = await bailianService.testConnection()

    // 恢复 API Key
    import.meta.env.VITE_DASHSCOPE_API_KEY = originalKey

    if (funasrResult.success && bailianResult.success) {
      connectionTestResult.value = {
        success: true,
        message: '✅ 连接成功！FunASR 和 Bailian 都正常',
      }
    } else {
      connectionTestResult.value = {
        success: false,
        message: `❌ 连接失败：${funasrResult.message} ${bailianResult.message}`,
      }
    }
  } catch (error) {
    connectionTestResult.value = {
      success: false,
      message: `❌ 测试异常：${error.message}`,
    }
  } finally {
    testingConnection.value = false
  }
}

const loadSettings = () => {
  apiKey.value = localStorage.getItem('dashscope-api-key') || ''
  selectedModel.value = localStorage.getItem('dashscope-model') || 'qwen3-coder-next'
}

onMounted(() => {
  loadSettings()
})
</script>

<style scoped>
.animate-scale-in {
  animation: scaleIn 0.3s ease-out;
}

@keyframes scaleIn {
  0% {
    transform: scale(0.95);
    opacity: 0;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}
</style>
