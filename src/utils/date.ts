import dayjs from 'dayjs'
import 'dayjs/locale/zh-cn'
import relativeTime from 'dayjs/plugin/relativeTime'
import isToday from 'dayjs/plugin/isToday'
import isTomorrow from 'dayjs/plugin/isTomorrow'
import isYesterday from 'dayjs/plugin/isYesterday'

dayjs.locale('zh-cn')
dayjs.extend(relativeTime)
dayjs.extend(isToday)
dayjs.extend(isTomorrow)
dayjs.extend(isYesterday)

export function formatDate(date: string | Date, format = 'YYYY-MM-DD'): string {
  return dayjs(date).format(format)
}

export function formatDateTime(date: string | Date): string {
  return dayjs(date).format('YYYY-MM-DD HH:mm')
}

export function formatTime(date: string | Date): string {
  return dayjs(date).format('HH:mm')
}

export function formatRelative(date: string | Date): string {
  const d = dayjs(date)
  if (d.isToday()) return '今天'
  if (d.isTomorrow()) return '明天'
  if (d.isYesterday()) return '昨天'
  return d.fromNow()
}

export function getToday(): string {
  return dayjs().format('YYYY-MM-DD')
}

export function getWeekDays(): string[] {
  const today = dayjs()
  const startOfWeek = today.startOf('week')
  return Array.from({ length: 7 }, (_, i) => 
    startOfWeek.add(i, 'day').format('YYYY-MM-DD')
  )
}

export function getDaysInRange(start: string, end: string): string[] {
  const days: string[] = []
  let current = dayjs(start)
  const endDate = dayjs(end)
  
  while (current.isBefore(endDate) || current.isSame(endDate, 'day')) {
    days.push(current.format('YYYY-MM-DD'))
    current = current.add(1, 'day')
  }
  
  return days
}

export function isExpiringSoon(date: string, days = 7): boolean {
  return dayjs(date).diff(dayjs(), 'day') <= days
}

export function daysSince(date: string): number {
  return dayjs().diff(dayjs(date), 'day')
}

export function daysUntil(date: string): number {
  return dayjs(date).diff(dayjs(), 'day')
}
