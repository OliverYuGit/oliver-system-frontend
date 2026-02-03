// Apple Reminders related types

export interface Reminder {
  id: string
  title: string
  notes?: string
  dueDate?: string
  priority: ReminderPriority
  completed: boolean
  list: ReminderList
  createdAt: string
  updatedAt: string
}

export type ReminderPriority = 'none' | 'low' | 'medium' | 'high'

export type ReminderList = 
  | 'inbox' 
  | 'next' 
  | 'waiting' 
  | 'someday' 
  | 'projects'

export interface ReminderListInfo {
  id: ReminderList
  name: string
  icon: string
  color: string
  count: number
}

export interface RemindersState {
  inbox: Reminder[]
  next: Reminder[]
  waiting: Reminder[]
  someday: Reminder[]
  projects: Reminder[]
  loading: boolean
  lastSynced: string | null
}
