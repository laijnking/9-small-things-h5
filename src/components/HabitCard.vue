<template>
  <div
    :class="[
      'flex items-center justify-between p-4 rounded-xl shadow-sm',
      'bg-surface transition-all duration-300',
      habit.completed ? 'bg-success/10 border border-success' : 'hover:shadow-md'
    ]"
  >
    <div class="flex items-center gap-3 flex-1">
      <!-- 图标 -->
      <div
        :class="[
          'w-12 h-12 rounded-full flex items-center justify-center text-xl',
          habit.completed ? 'bg-success/20' : 'bg-primary/10'
        ]"
      >
        {{ habit.completed ? '✅' : habit.icon }}
      </div>

      <!-- 内容 -->
      <div class="flex-1">
        <h3
          :class="[
            'font-medium text-base',
            habit.completed ? 'text-success line-through' : 'text-text-primary'
          ]"
        >
          {{ habit.name }}
        </h3>
        <p class="text-sm text-text-secondary mt-0.5">
          {{ habit.description }}
        </p>
      </div>
    </div>

    <!-- 按钮 -->
    <button
      v-if="!habit.completed"
      @click="$emit('complete', habit.id)"
      class="ml-3 px-5 py-2 bg-primary text-white rounded-full text-sm font-medium hover:bg-primary-dark transition-colors"
    >
      开始
    </button>
    <button
      v-else
      class="ml-3 px-5 py-2 bg-success/20 text-success rounded-full text-sm font-medium cursor-default"
    >
      已完成
    </button>
  </div>
</template>

<script setup>
defineProps({
  habit: {
    type: Object,
    required: true,
  },
})

defineEmits(['complete'])
</script>
