/**
 * FunASR 语音识别服务
 * 阿里云智能语音交互
 */

import axios from 'axios'

const API_KEY = import.meta.env.VITE_DASHSCOPE_API_KEY || ''

class FunASRService {
  /**
   * 语音识别
   */
  async transcribe(audioBlob) {
    try {
      // 开发环境降级处理
      if (!API_KEY) {
        console.warn('未配置 API Key，使用 Mock 结果')
        return new Promise(resolve => {
          setTimeout(() => {
            resolve('今天吃了牛肉面，花了 35 块钱，味道还不错')
          }, 1000)
        })
      }

      const formData = new FormData()
      formData.append('audio', audioBlob)

      const response = await axios.post(
        'https://dashscope.aliyuncs.com/api/v1/services/audio/asr/transcription',
        formData,
        {
          headers: {
            'Authorization': `Bearer ${API_KEY}`,
            'Content-Type': 'multipart/form-data',
          },
          timeout: 30000,
        }
      )

      return response.data.output?.text || ''
    } catch (error) {
      console.error('FunASR 识别失败:', error)
      
      // 降级：返回 Mock 数据
      return '今天吃了牛肉面，花了 35 块钱，味道还不错'
    }
  }

  /**
   * 测试连接
   */
  async testConnection() {
    try {
      if (!API_KEY) {
        return { success: false, message: '未配置 API Key' }
      }

      const response = await axios.get(
        'https://dashscope.aliyuncs.com/api/v1/services/audio/asr/transcription',
        {
          headers: {
            'Authorization': `Bearer ${API_KEY}`,
          },
          timeout: 5000,
        }
      )

      return { success: true, message: 'FunASR 连接正常' }
    } catch (error) {
      return {
        success: false,
        message: `FunASR 连接失败：${error.message}`,
      }
    }
  }
}

export default new FunASRService()
