import { defineStore } from 'pinia'

export const useHabitsStore = defineStore('habits', {
  state: () => ({
    habits: [
      { id: 1, name: '写 3 句话', description: '记录今天的 3 件小事', icon: '📝', completed: false },
      { id: 2, name: '整理空间', description: '花 10 分钟收拾一个小区域', icon: '🧹', completed: false },
      { id: 3, name: '记录开销', description: '看清钱都去了哪里', icon: '💰', completed: false },
      { id: 4, name: '学技能', description: '碎片化学习一个技能', icon: '🎨', completed: false },
      { id: 5, name: '深度阅读', description: '静下心来读一篇长文', icon: '📚', completed: false },
      { id: 6, name: '联系朋友', description: '真诚问候一个具体的人', icon: '👤', completed: false },
      { id: 7, name: '早起', description: '比平时早起半小时', icon: '⏰', completed: false },
      { id: 8, name: '运动', description: '10 分钟简单运动', icon: '🏃', completed: false },
      { id: 9, name: '睡前关机', description: '睡前一小时远离手机', icon: '📵', completed: false },
    ],
    diaries: [],
    expenses: [],
    cleanups: [],
    earlyRiseDays: 0, // 连续早起天数
  }),

  getters: {
    completedCount: (state) => state.habits.filter(h => h.completed).length,
    progressPercent: (state) => (state.completedCount / state.habits.length) * 100,
    totalExpenses: (state) => state.expenses.reduce((sum, e) => sum + e.amount, 0),
  },

  actions: {
    completeHabit(habitId) {
      const habit = this.habits.find(h => h.id === habitId)
      if (habit && !habit.completed) {
        habit.completed = true
        this.saveToLocalStorage()
      }
    },

    uncompleteHabit(habitId) {
      const habit = this.habits.find(h => h.id === habitId)
      if (habit && habit.completed) {
        habit.completed = false
        this.saveToLocalStorage()
      }
    },

    resetDaily() {
      this.habits.forEach(h => h.completed = false)
      this.saveToLocalStorage()
    },

    addDiary(diary) {
      this.diaries.push({
        id: Date.now(),
        ...diary,
        date: new Date().toISOString(),
      })
      this.saveToLocalStorage()
    },

    addExpense(expense) {
      this.expenses.push({
        id: Date.now(),
        ...expense,
        date: new Date().toISOString(),
      })
      this.saveToLocalStorage()
    },

    addCleanup(cleanup) {
      this.cleanups.push({
        id: Date.now(),
        ...cleanup,
        date: new Date().toISOString(),
      })
      this.saveToLocalStorage()
    },

    saveToLocalStorage() {
      localStorage.setItem('9small-habits', JSON.stringify(this.habits))
      localStorage.setItem('9small-habits-date', new Date().toDateString())
      localStorage.setItem('9small-diaries', JSON.stringify(this.diaries))
      localStorage.setItem('9small-expenses', JSON.stringify(this.expenses))
      localStorage.setItem('9small-cleanups', JSON.stringify(this.cleanups))
    },

    loadFromLocalStorage() {
      const today = new Date().toDateString()
      const savedDate = localStorage.getItem('9small-habits-date')
      
      if (savedDate === today) {
        const habits = localStorage.getItem('9small-habits')
        if (habits) this.habits = JSON.parse(habits)
      }
      
      const diaries = localStorage.getItem('9small-diaries')
      if (diaries) this.diaries = JSON.parse(diaries)
      
      const expenses = localStorage.getItem('9small-expenses')
      if (expenses) this.expenses = JSON.parse(expenses)
      
      const cleanups = localStorage.getItem('9small-cleanups')
      if (cleanups) this.cleanups = JSON.parse(cleanups)
    },
  },
})
