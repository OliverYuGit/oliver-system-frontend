import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Reminder, ReminderList } from '@/types'
import * as remindersApi from '@/api/reminders'

export const useRemindersStore = defineStore('reminders', () => {
  // State
  const inbox = ref<Reminder[]>([])
  const next = ref<Reminder[]>([])
  const waiting = ref<Reminder[]>([])
  const someday = ref<Reminder[]>([])
  const projects = ref<Reminder[]>([])
  const loading = ref(false)
  const lastSynced = ref<string | null>(null)

  // Getters
  const allReminders = computed(() => [
    ...inbox.value,
    ...next.value,
    ...waiting.value,
    ...someday.value,
    ...projects.value,
  ])

  const totalCount = computed(() => allReminders.value.length)

  const listCounts = computed(() => ({
    inbox: inbox.value.length,
    next: next.value.length,
    waiting: waiting.value.length,
    someday: someday.value.length,
    projects: projects.value.length,
  }))

  const upcomingReminders = computed(() => {
    return next.value
      .filter(r => !r.completed)
      .slice(0, 5)
  })

  // Actions
  async function fetchAllReminders() {
    loading.value = true
    try {
      const data = await remindersApi.getAllReminders()
      inbox.value = data.inbox || []
      next.value = data.next || []
      waiting.value = data.waiting || []
      someday.value = data.someday || []
      projects.value = data.projects || []
    } catch (error) {
      console.error('Failed to fetch reminders:', error)
    } finally {
      loading.value = false
    }
  }

  async function syncWithApple() {
    loading.value = true
    try {
      const result = await remindersApi.syncReminders()
      lastSynced.value = result.lastSynced
      await fetchAllReminders()
    } catch (error) {
      console.error('Failed to sync reminders:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  function getRemindersByList(list: ReminderList): Reminder[] {
    switch (list) {
      case 'inbox': return inbox.value
      case 'next': return next.value
      case 'waiting': return waiting.value
      case 'someday': return someday.value
      case 'projects': return projects.value
      default: return []
    }
  }

  return {
    inbox,
    next,
    waiting,
    someday,
    projects,
    loading,
    lastSynced,
    allReminders,
    totalCount,
    listCounts,
    upcomingReminders,
    fetchAllReminders,
    syncWithApple,
    getRemindersByList,
  }
})
