<template>
  <div class="min-h-screen bg-background">
    <header class="px-4 pt-6 pb-4 bg-surface shadow-sm">
      <h1 class="text-xl font-semibold text-text-primary">👤 联系朋友</h1>
      <p class="text-sm text-text-secondary mt-1">真诚问候一个具体的人</p>
    </header>

    <div class="px-4 py-4">
      <label class="block text-sm font-medium text-text-secondary mb-2">朋友姓名</label>
      <input v-model="friendName" type="text" placeholder="输入朋友的名字" class="w-full p-3 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-primary" />
    </div>

    <div class="px-4 py-2">
      <label class="block text-sm font-medium text-text-secondary mb-2">联系方式</label>
      <div class="grid grid-cols-3 gap-3">
        <button v-for="method in contactMethods" :key="method.id" @click="selectedMethod = method" :class="['p-4 rounded-xl border-2 transition-all', selectedMethod?.id === method.id ? 'border-primary bg-primary/10' : 'border-gray-200 bg-surface']">
          <div class="text-2xl mb-1">{{ method.icon }}</div>
          <div class="text-xs font-medium">{{ method.name }}</div>
        </button>
      </div>
    </div>

    <div class="px-4 py-4">
      <label class="block text-sm font-medium text-text-secondary mb-2">问候内容（可选）</label>
      <textarea v-model="message" placeholder="想对 TA 说什么？" class="w-full h-24 p-3 border border-gray-200 rounded-lg resize-none outline-none focus:ring-2 focus:ring-primary"></textarea>
    </div>

    <div class="px-4 py-6">
      <button @click="completeContact" :disabled="!friendName || !selectedMethod" :class="['w-full py-4 rounded-xl font-medium text-lg shadow-lg transition-all', friendName && selectedMethod ? 'bg-primary text-white' : 'bg-gray-200 text-gray-400 cursor-not-allowed']">
        ✅ 完成联系
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useHabitsStore } from '@/stores/habits'

const habitsStore = useHabitsStore()
const friendName = ref('')
const selectedMethod = ref(null)
const message = ref('')

const contactMethods = [
  { id: 1, name: '微信', icon: '💬' },
  { id: 2, name: '电话', icon: '📞' },
  { id: 3, name: '短信', icon: '📱' },
]

const completeContact = () => {
  habitsStore.completeHabit(6)
  habitsStore.addDiary({ type: 'contact', friend: friendName.value, method: selectedMethod.value?.name, message: message.value })
  alert('人际关系需要用心浇灌 🤝')
  friendName.value = ''
  selectedMethod.value = null
  message.value = ''
}
</script>
