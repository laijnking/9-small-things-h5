/**
 * FunASR 语音识别服务
 * 阿里云智能语音交互
 */

import axios from 'axios'

const API_KEY = import.meta.env.VITE_DASHSCOPE_API_KEY || ''
const BASE_URL = 'https://dashscope.aliyuncs.com/api/v1/services/audio/asr/transcription'
const MAX_RETRIES = 3
const TIMEOUT_MS = 30000

// 延迟获取 store
let statusStore = null
const getStatusStore = async () => {
  if (!statusStore) {
    const { useApiStatusStore } = await import('@/stores/api-status')
    statusStore = useApiStatusStore()
  }
  return statusStore
}

class FunASRService {
  getRetryDelay(retryCount) {
    return 1000 * Math.pow(2, retryCount)
  }

  getErrorMessage(error) {
    if (error.code === 'ECONNABORTED') return '请求超时'
    if (error.response) return `API 错误：${error.response.status}`
    if (error.request) return '无响应'
    return error.message || '未知错误'
  }

  async transcribe(audioBlob) {
    const store = await getStatusStore()
    
    if (!API_KEY) {
      return new Promise(resolve => setTimeout(() => resolve('今天吃了牛肉面，花了 35 块钱'), 1000))
    }

    store.setFunasrStatus('loading', '正在识别中...')

    for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
      try {
        const formData = new FormData()
        formData.append('audio', audioBlob)

        const response = await axios.post(BASE_URL, formData, {
          headers: { 'Authorization': `Bearer ${API_KEY}`, 'Content-Type': 'multipart/form-data' },
          timeout: TIMEOUT_MS,
        })

        store.setFunasrStatus('success', '识别成功')
        return response.data.output?.text || ''
      } catch (error) {
        if (attempt === MAX_RETRIES) {
          store.setFunasrStatus('error', this.getErrorMessage(error))
          return '今天吃了牛肉面，花了 35 块钱'
        }
        await new Promise(r => setTimeout(r, this.getRetryDelay(attempt)))
      }
    }
  }

  async transcribeWithTimeout(audioBlob, timeout = TIMEOUT_MS) {
    const store = await getStatusStore()
    const controller = new AbortController()
    const timer = setTimeout(() => controller.abort(), timeout)

    try {
      const formData = new FormData()
      formData.append('audio', audioBlob)
      const response = await axios.post(BASE_URL, formData, {
        headers: { 'Authorization': `Bearer ${API_KEY}`, 'Content-Type': 'multipart/form-data' },
        signal: controller.signal, timeout,
      })
      clearTimeout(timer)
      store.setFunasrStatus('success', '识别成功')
      return response.data.output?.text || ''
    } catch (error) {
      clearTimeout(timer)
      if (error.name === 'AbortError') {
        store.setFunasrStatus('timeout', '识别超时')
      } else {
        store.setFunasrStatus('error', this.getErrorMessage(error))
      }
      return '今天吃了牛肉面，花了 35 块钱'
    }
  }

  async testConnection() {
    const store = await getStatusStore()
    if (!API_KEY) return { success: false, message: '未配置 API Key' }
    try {
      await axios.get(BASE_URL, { headers: { 'Authorization': `Bearer ${API_KEY}` }, timeout: 5000 })
      store.setFunasrStatus('success', '连接正常')
      return { success: true }
    } catch (error) {
      store.setFunasrStatus('error', this.getErrorMessage(error))
      return { success: false }
    }
  }

  reset() {
    getStatusStore().then(store => store.resetFunasr())
  }
}

export default new FunASRService()
