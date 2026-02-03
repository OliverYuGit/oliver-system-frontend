import api from './index'
import type { Reminder, ReminderList } from '@/types'

export async function getReminders(list?: ReminderList): Promise<Reminder[]> {
  return api.get('/reminders', { params: { list } })
}

export async function getAllReminders(): Promise<Record<ReminderList, Reminder[]>> {
  return api.get('/reminders/all')
}

export async function syncReminders(): Promise<{ synced: boolean; lastSynced: string }> {
  return api.post('/reminders/sync')
}

export async function getReminder(id: string): Promise<Reminder> {
  return api.get(`/reminders/${id}`)
}

// Note: Reminders are read-only from Apple Reminders
// These are just for reference if we want to add local features later
