/**
 * Bailian 文本优化服务
 * 阿里云百炼大模型
 */

import axios from 'axios'

const API_KEY = import.meta.env.VITE_DASHSCOPE_API_KEY || ''
const MODEL = 'bailian/qwen3-coder-next'

class BailianService {
  /**
   * 文本优化 - 将口语转为结构化日记
   */
  async optimizeText(input) {
    try {
      // 开发环境降级处理
      if (!API_KEY) {
        console.warn('未配置 API Key，使用 Mock 结果')
        return new Promise(resolve => {
          setTimeout(() => {
            resolve('1. 午餐吃了牛肉面\n2. 花费 35 元\n3. 味道一般，下次换一家试试')
          }, 500)
        })
      }

      const response = await axios.post(
        'https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions',
        {
          model: MODEL,
          messages: [
            {
              role: 'system',
              content: '你是一个生活记录助手，请将用户的输入优化成 3 句话的日记格式。保持原意，不编造细节。每句不超过 20 字，语气自然。',
            },
            {
              role: 'user',
              content: `请将以下内容优化成 3 句话的日记格式：${input}`,
            },
          ],
          temperature: 0.7,
          max_tokens: 500,
        },
        {
          headers: {
            'Authorization': `Bearer ${API_KEY}`,
            'Content-Type': 'application/json',
          },
          timeout: 15000,
        }
      )

      return response.data.choices?.[0]?.message?.content || input
    } catch (error) {
      console.error('Bailian 优化失败:', error)
      return input // 降级：返回原文
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

      const response = await axios.post(
        'https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions',
        {
          model: MODEL,
          messages: [{ role: 'user', content: '你好' }],
        },
        {
          headers: {
            'Authorization': `Bearer ${API_KEY}`,
            'Content-Type': 'application/json',
          },
          timeout: 5000,
        }
      )

      if (response.data.choices && response.data.choices.length > 0) {
        return { success: true, message: 'Bailian 连接正常' }
      }

      return { success: false, message: 'Bailian 响应异常' }
    } catch (error) {
      return {
        success: false,
        message: `Bailian 连接失败：${error.message}`,
      }
    }
  }
}

export default new BailianService()
