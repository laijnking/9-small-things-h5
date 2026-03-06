/**
 * Bailian 文本优化服务（完整集成）
 * 阿里云百炼大模型
 */

import axios from 'axios'
import { useApiStatusStore } from '@/stores/api-status'

const API_KEY = import.meta.env.VITE_DASHSCOPE_API_KEY || ''
const BASE_URL = 'https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions'
const MODEL = 'qwen3-coder-next'
const MAX_RETRIES = 3
const RETRY_DELAY_MS = 1000
const TIMEOUT_MS = 15000

class BailianService {
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
   * 文本优化（带重试机制）
   */
  async optimizeText(input, options = {}) {
    // 检查配置
    if (!API_KEY) {
      console.warn('未配置 API Key，使用 Mock 结果')
      return new Promise(resolve => {
        setTimeout(() => {
          resolve('1. 午餐吃了牛肉面\n2. 花费 35 元\n3. 味道一般，下次换一家试试')
        }, 500)
      })
    }

    const {
      systemPrompt = '你是一个生活记录助手，请将用户的输入优化成 3 句话的日记格式。保持原意，不编造细节。每句不超过 20 字，语气自然。',
      maxTokens = 500,
      temperature = 0.7,
    } = options

    // 设置加载状态
    this.statusStore.setBailianStatus('loading', '正在优化...')

    for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
      try {
        const response = await axios.post(
          BASE_URL,
          {
            model: MODEL,
            messages: [
              { role: 'system', content: systemPrompt },
              { role: 'user', content: `请将以下内容优化成 3 句话的日记格式：${input}` },
            ],
            temperature,
            max_tokens: maxTokens,
          },
          {
            headers: {
              'Authorization': `Bearer ${API_KEY}`,
              'Content-Type': 'application/json',
            },
            timeout: TIMEOUT_MS,
          }
        )

        // 成功
        this.statusStore.setBailianStatus('success', '优化成功')
        const result = response.data.choices?.[0]?.message?.content || input
        
        // 确保返回 3 句话格式
        return this.normalizeToThreeSentences(result)

      } catch (error) {
        const isLastAttempt = attempt === MAX_RETRIES
        
        if (isLastAttempt) {
          // 最后一次重试失败，设置错误状态
          this.statusStore.setBailianStatus(
            'error',
            this.getErrorMessage(error)
          )
          console.error(`Bailian 优化失败（${attempt + 1}次尝试）:`, error)
          
          // 降级处理：返回原文
          return input
        }

        // 网络错误或超时，进行重试
        const delay = this.getRetryDelay(attempt)
        console.warn(`Bailian 优化失败，${delay}ms 后重试 (${attempt + 1}/${MAX_RETRIES})`)
        
        await new Promise(resolve => setTimeout(resolve, delay))
      }
    }
  }

  /**
   * 结构化文本生成
   */
  async structureText(input, structureType = 'diary') {
    if (!API_KEY) {
      return new Promise(resolve => {
        setTimeout(() => {
          resolve(this.getMockStructuredData(input, structureType))
        }, 500)
      })
    }

    const systemPrompts = {
      diary: '你是一个生活记录助手。请将用户输入整理为结构化日记，包含：日期、时间、事件、地点、花费、心情。格式为 JSON。',
      summary: '你是一个摘要生成助手。请将用户输入生成 3 点摘要，每点不超过 15 字。格式为 JSON，包含：title、points 数组。',
      action: '你是一个行动计划助手。请从用户输入中提取：任务、截止时间、优先级、所需资源。格式为 JSON。',
    }

    const systemPrompt = systemPrompts[structureType] || systemPrompts.diary

    try {
      const response = await axios.post(
        BASE_URL,
        {
          model: MODEL,
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: input },
          ],
          temperature: 0.3,
          max_tokens: 300,
        },
        {
          headers: {
            'Authorization': `Bearer ${API_KEY}`,
            'Content-Type': 'application/json',
          },
          timeout: TIMEOUT_MS,
        }
      )

      this.statusStore.setBailianStatus('success', '结构化成功')
      const result = response.data.choices?.[0]?.message?.content || input
      
      // 尝试解析 JSON
      try {
        const jsonMatch = result.match(/\{[\s\S]*\}/)
        if (jsonMatch) {
          return JSON.parse(jsonMatch[0])
        }
      } catch (e) {
        // JSON 解析失败，返回原文
      }

      return result
    } catch (error) {
      this.statusStore.setBailianStatus('error', this.getErrorMessage(error))
      console.error('结构化失败:', error)
      return this.getMockStructuredData(input, structureType)
    }
  }

  /**
   * 情感分析
   */
  async analyzeSentiment(text) {
    if (!API_KEY) {
      return new Promise(resolve => {
        setTimeout(() => {
          resolve({ sentiment: 'neutral', score: 0, keywords: [] })
        }, 500)
      })
    }

    try {
      const response = await axios.post(
        BASE_URL,
        {
          model: MODEL,
          messages: [
            {
              role: 'system',
              content: '你是一个情感分析助手。请分析用户输入的情绪，返回：sentiment（positive/neutral/negative）、score（-1 到 1）、keywords（3-5 个关键词）。格式为 JSON。',
            },
            { role: 'user', content: text },
          ],
          temperature: 0.2,
          max_tokens: 200,
        },
        {
          headers: {
            'Authorization': `Bearer ${API_KEY}`,
            'Content-Type': 'application/json',
          },
          timeout: TIMEOUT_MS,
        }
      )

      this.statusStore.setBailianStatus('success', '情感分析成功')
      const result = response.data.choices?.[0]?.message?.content || '{}'
      
      // 尝试解析 JSON
      try {
        const jsonMatch = result.match(/\{[\s\S]*\}/)
        if (jsonMatch) {
          return JSON.parse(jsonMatch[0])
        }
      } catch (e) {
        // JSON 解析失败
      }

      return { sentiment: 'neutral', score: 0, keywords: text.split(/[\s,，.。]+/).slice(0, 5) }
    } catch (error) {
      this.statusStore.setBailianStatus('error', this.getErrorMessage(error))
      console.error('情感分析失败:', error)
      return { sentiment: 'neutral', score: 0, keywords: [] }
    }
  }

  /**
   * 生成 3 句话总结
   */
  async summarizeInThreeSentences(text) {
    if (!API_KEY) {
      return new Promise(resolve => {
        setTimeout(() => {
          resolve(text.slice(0, 100) + '...')
        }, 500)
      })
    }

    try {
      const response = await axios.post(
        BASE_URL,
        {
          model: MODEL,
          messages: [
            {
              role: 'system',
              content: '请将用户输入总结为 3 句话，每句不超过 20 字。保持原意，不编造细节。格式：1. ... 2. ... 3. ...',
            },
            { role: 'user', content: text },
          ],
          temperature: 0.5,
          max_tokens: 300,
        },
        {
          headers: {
            'Authorization': `Bearer ${API_KEY}`,
            'Content-Type': 'application/json',
          },
          timeout: TIMEOUT_MS,
        }
      )

      this.statusStore.setBailianStatus('success', '总结成功')
      return response.data.choices?.[0]?.message?.content || text
    } catch (error) {
      this.statusStore.setBailianStatus('error', this.getErrorMessage(error))
      console.error('总结失败:', error)
      return text
    }
  }

  /**
   * 批量优化
   */
  async batchOptimize(texts) {
    const results = []
    
    for (const text of texts) {
      try {
        const result = await this.optimizeText(text)
        results.push(result)
      } catch (error) {
        results.push(text)
        console.error('批量优化失败:', error)
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
      const response = await axios.post(
        BASE_URL,
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
        this.statusStore.setBailianStatus('success', '连接正常')
        return { success: true, message: 'Bailian 连接正常' }
      }

      this.statusStore.setBailianStatus('error', '响应异常')
      return { success: false, message: 'Bailian 响应异常' }
    } catch (error) {
      this.statusStore.setBailianStatus('error', this.getErrorMessage(error))
      return {
        success: false,
        message: `Bailian 连接失败：${this.getErrorMessage(error)}`,
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
   * 规范化为 3 句话格式
   */
  normalizeToThreeSentences(text) {
    // 已经是 3 句话格式
    if (/^\d+\./.test(text) && text.split(/\d+\./).length >= 4) {
      return text
    }

    // 简单分句
    const sentences = text.split(/[。\.！!?？\n]+/).filter(s => s.trim())
    
    if (sentences.length >= 3) {
      return `1. ${sentences[0]}\n2. ${sentences[1]}\n3. ${sentences[2]}`
    }

    return text
  }

  /**
   * 获取 mock 结构化数据
   */
  getMockStructuredData(input, type) {
    const mockData = {
      diary: {
        date: new Date().toLocaleDateString('zh-CN', { month: 'long', day: 'numeric' }),
        time: '12:00',
        event: '吃了牛肉面',
        location: '附近餐馆',
        cost: 35,
        mood: '良好',
      },
      summary: {
        title: '今日记录',
        points: ['吃了牛肉面', '花费 35 元', '味道不错'],
      },
      action: {
        task: '记录开销',
        deadline: '',
        priority: 'low',
        resources: [],
      },
    }

    return mockData[type] || input
  }

  /**
   * 重置服务状态
   */
  reset() {
    this.statusStore.resetBailian()
  }
}

export default new BailianService()
