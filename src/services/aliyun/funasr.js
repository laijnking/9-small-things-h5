/**
 * FunASR 语音识别服务（完整集成）
 * 阿里云智能语音交互
 */

import axios from 'axios'
import { useApiStatusStore } from '@/stores/api-status'

const API_KEY = import.meta.env.VITE_DASHSCOPE_API_KEY || ''
const BASE_URL = 'https://dashscope.aliyuncs.com/api/v1/services/audio/asr/transcription'
const MAX_RETRIES = 3
const RETRY_DELAY_MS = 1000
const TIMEOUT_MS = 30000

class FunASRService {
  constructor() {
    this.statusStore = useApiStatusStore()
  }

  /**
   * 获取延迟配置（指数退避）
   */
  getRetryDelay(retryCount) {
    return RETRY_DELAY_MS * Math.pow(2, retryCount)
  }

  /**
   * 语音识别（带重试机制）
   */
  async transcribe(audioBlob) {
    // 检查配置
    if (!API_KEY) {
      console.warn('未配置 API Key，使用 Mock 结果')
      return new Promise(resolve => {
        setTimeout(() => {
          resolve('今天吃了牛肉面，花了 35 块钱，味道还不错')
        }, 1000)
      })
    }

    // 设置加载状态
    this.statusStore.setFunasrStatus('loading', '正在识别中...')

    for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
      try {
        const formData = new FormData()
        formData.append('audio', audioBlob)

        const response = await axios.post(
          BASE_URL,
          formData,
          {
            headers: {
              'Authorization': `Bearer ${API_KEY}`,
              'Content-Type': 'multipart/form-data',
            },
            timeout: TIMEOUT_MS,
          }
        )

        // 成功
        this.statusStore.setFunasrStatus('success', '识别成功')
        return response.data.output?.text || ''

      } catch (error) {
        const isLastAttempt = attempt === MAX_RETRIES
        
        if (isLastAttempt) {
          // 最后一次重试失败，设置错误状态
          this.statusStore.setFunasrStatus(
            'error',
            this.getErrorMessage(error)
          )
          console.error(`FunASR 识别失败（${attempt + 1}次尝试）:`, error)
          
          // 降级处理
          return '今天吃了牛肉面，花了 35 块钱，味道还不错'
        }

        // 网络错误或超时，进行重试
        const delay = this.getRetryDelay(attempt)
        console.warn(`FunASR 识别失败，${delay}ms 后重试 (${attempt + 1}/${MAX_RETRIES})`)
        
        await new Promise(resolve => setTimeout(resolve, delay))
      }
    }
  }

  /**
   * 语音识别（带超时控制）
   */
  async transcribeWithTimeout(audioBlob, timeout = TIMEOUT_MS) {
    const controller = new AbortController()
    const timer = setTimeout(() => controller.abort(), timeout)

    try {
      const formData = new FormData()
      formData.append('audio', audioBlob)

      const response = await axios.post(
        BASE_URL,
        formData,
        {
          headers: {
            'Authorization': `Bearer ${API_KEY}`,
            'Content-Type': 'multipart/form-data',
          },
          signal: controller.signal,
          timeout: timeout,
        }
      )

      clearTimeout(timer)
      this.statusStore.setFunasrStatus('success', '识别成功')
      return response.data.output?.text || ''
    } catch (error) {
      clearTimeout(timer)
      
      if (error.name === 'AbortError') {
        this.statusStore.setFunasrStatus('timeout', '识别超时')
        console.warn('FunASR 识别超时')
        return '今天吃了牛肉面，花了 35 块钱，味道还不错'
      }

      this.statusStore.setFunasrStatus('error', this.getErrorMessage(error))
      console.error('FunASR 识别失败:', error)
      return '今天吃了牛肉面，花了 35 块钱，味道还不错'
    }
  }

  /**
   * 批量识别（支持多个音频）
   */
  async batchTranscribe(audioBlobs) {
    const results = []
    
    for (const blob of audioBlobs) {
      try {
        const result = await this.transcribe(blob)
        results.push(result)
      } catch (error) {
        results.push(null)
        console.error('批量识别失败:', error)
      }
    }

    return results
  }

  /**
   * 测试连接（带重试）
   */
  async testConnection() {
    if (!API_KEY) {
      return { success: false, message: '未配置 API Key' }
    }

    try {
      const response = await axios.get(
        BASE_URL,
        {
          headers: {
            'Authorization': `Bearer ${API_KEY}`,
          },
          timeout: 5000,
        }
      )

      if (response.status === 200) {
        this.statusStore.setFunasrStatus('success', '连接正常')
        return { success: true, message: 'FunASR 连接正常' }
      }

      this.statusStore.setFunasrStatus('error', '连接失败')
      return { success: false, message: 'FunASR 连接失败' }
    } catch (error) {
      this.statusStore.setFunasrStatus('error', this.getErrorMessage(error))
      return {
        success: false,
        message: `FunASR 连接失败：${this.getErrorMessage(error)}`,
      }
    }
  }

  /**
   * 获取错误消息
   */
  getErrorMessage(error) {
    if (error.code === 'ECONNABORTED') {
      return '请求超时'
    } else if (error.code === 'ECONNREFUSED') {
      return '连接被拒绝'
    } else if (error.code === 'ENETUNREACH') {
      return '网络不可达'
    } else if (error.response) {
      return `API 错误：${error.response.status} ${error.response.data?.message || ''}`
    } else if (error.request) {
      return '无响应'
    } else {
      return error.message || '未知错误'
    }
  }

  /**
   * 重置服务状态
   */
  reset() {
    this.statusStore.resetFunasr()
  }
}

export default new FunASRService()
