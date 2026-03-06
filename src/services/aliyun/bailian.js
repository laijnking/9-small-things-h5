/**
 * Bailian 文本优化服务
 * 阿里云百炼大模型
 */

import axios from 'axios'

const API_KEY = import.meta.env.VITE_DASHSCOPE_API_KEY || ''
const BASE_URL = 'https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions'
const MODEL = 'qwen3-coder-next'
const MAX_RETRIES = 3
const TIMEOUT_MS = 15000

// 延迟获取 store
let statusStore = null
const getStatusStore = async () => {
  if (!statusStore) {
    const { useApiStatusStore } = await import('@/stores/api-status')
    statusStore = useApiStatusStore()
  }
  return statusStore
}

class BailianService {
  getRetryDelay(retryCount) {
    return 1000 * Math.pow(2, retryCount)
  }

  getErrorMessage(error) {
    if (error.code === 'ECONNABORTED') return '请求超时'
    if (error.response) return `API 错误：${error.response.status}`
    if (error.request) return '无响应'
    return error.message || '未知错误'
  }

  normalizeToThreeSentences(text) {
    if (/^\d+\./.test(text) && text.split(/\d+\./).length >= 4) return text
    const sentences = text.split(/[。\.！!?？\n]+/).filter(s => s.trim())
    if (sentences.length >= 3) return `1. ${sentences[0]}\n2. ${sentences[1]}\n3. ${sentences[2]}`
    return text
  }

  async optimizeText(input, options = {}) {
    const store = await getStatusStore()
    
    if (!API_KEY) {
      return new Promise(r => setTimeout(() => r('1. 午餐吃了牛肉面\n2. 花费 35 元\n3. 味道一般'), 500))
    }

    const { systemPrompt = '将用户输入优化成3句话日记格式', maxTokens = 500, temperature = 0.7 } = options
    
    store.setBailianStatus('loading', '正在优化...')

    for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
      try {
        const response = await axios.post(BASE_URL, {
          model: MODEL,
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: `优化成3句话：${input}` }
          ],
          temperature, max_tokens: maxTokens,
        }, { headers: { 'Authorization': `Bearer ${API_KEY}`, 'Content-Type': 'application/json' }, timeout: TIMEOUT_MS })

        store.setBailianStatus('success', '优化成功')
        return this.normalizeToThreeSentences(response.data.choices?.[0]?.message?.content || input)
      } catch (error) {
        if (attempt === MAX_RETRIES) {
          store.setBailianStatus('error', this.getErrorMessage(error))
          return input
        }
        await new Promise(r => setTimeout(r, this.getRetryDelay(attempt)))
      }
    }
  }

  async structureText(input, type = 'diary') {
    const store = await getStatusStore()
    if (!API_KEY) return { date: new Date().toLocaleDateString('zh-CN'), event: '记录', cost: 0, mood: '一般' }
    
    try {
      const response = await axios.post(BASE_URL, {
        model: MODEL,
        messages: [{ role: 'system', content: '返回JSON格式' }, { role: 'user', content: input }],
        temperature: 0.3, max_tokens: 300,
      }, { headers: { 'Authorization': `Bearer ${API_KEY}`, 'Content-Type': 'application/json' }, timeout: TIMEOUT_MS })
      
      store.setBailianStatus('success', '结构化成功')
      return { event: input, date: new Date().toLocaleDateString() }
    } catch (error) {
      store.setBailianStatus('error', this.getErrorMessage(error))
      return { event: input }
    }
  }

  async testConnection() {
    const store = await getStatusStore()
    if (!API_KEY) return { success: false, message: '未配置 API Key' }
    try {
      await axios.post(BASE_URL, { model: MODEL, messages: [{ role: 'user', content: 'hi' }] }, { headers: { 'Authorization': `Bearer ${API_KEY}` }, timeout: 5000 })
      store.setBailianStatus('success', '连接正常')
      return { success: true }
    } catch (error) {
      store.setBailianStatus('error', this.getErrorMessage(error))
      return { success: false }
    }
  }

  reset() {
    getStatusStore().then(store => store.resetBailian())
  }
}

export default new BailianService()
