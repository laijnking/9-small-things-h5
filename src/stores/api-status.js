import { defineStore } from 'pinia'

export const useApiStatusStore = defineStore('apiStatus', {
  state: () => ({
    funasr: {
      status: 'idle', // idle | loading | success | error | timeout
      message: '',
      lastCall: null,
      retryCount: 0,
    },
    bailian: {
      status: 'idle',
      message: '',
      lastCall: null,
      retryCount: 0,
    },
  }),

  getters: {
    isFunasrReady: (state) => state.funasr.status === 'success',
    isBailianReady: (state) => state.bailian.status === 'success',
    hasError: (state) => state.funasr.status === 'error' || state.bailian.status === 'error',
  },

  actions: {
    setFunasrStatus(status, message = '') {
      this.funasr.status = status
      this.funasr.message = message
      this.funasr.lastCall = Date.now()
      if (status === 'error') {
        this.funasr.retryCount += 1
      } else if (status === 'success') {
        this.funasr.retryCount = 0
      }
    },

    setBailianStatus(status, message = '') {
      this.bailian.status = status
      this.bailian.message = message
      this.bailian.lastCall = Date.now()
      if (status === 'error') {
        this.bailian.retryCount += 1
      } else if (status === 'success') {
        this.bailian.retryCount = 0
      }
    },

    resetApiStatus() {
      this.funasr.status = 'idle'
      this.funasr.message = ''
      this.bailian.status = 'idle'
      this.bailian.message = ''
      this.funasr.retryCount = 0
      this.bailian.retryCount = 0
    },

    resetFunasr() {
      this.funasr.status = 'idle'
      this.funasr.message = ''
      this.funasr.retryCount = 0
    },

    resetBailian() {
      this.bailian.status = 'idle'
      this.bailian.message = ''
      this.bailian.retryCount = 0
    },
  },
})
