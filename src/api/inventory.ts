import api from './index'
import type { InventoryItem, InventoryCategory, InventorySummary } from '@/types'

export async function getInventoryItems(category?: InventoryCategory): Promise<InventoryItem[]> {
  return api.get('/inventory', { params: { category } })
}

export async function getInventorySummary(): Promise<InventorySummary> {
  return api.get('/inventory/summary')
}

export async function getItemsNeedingPurchase(): Promise<InventoryItem[]> {
  return api.get('/inventory/needs-purchase')
}

export async function getExpiringItems(days = 7): Promise<InventoryItem[]> {
  return api.get('/inventory/expiring', { params: { days } })
}

export async function getItemsNeedingReplacement(): Promise<InventoryItem[]> {
  return api.get('/inventory/needs-replacement')
}

export async function createInventoryItem(item: Omit<InventoryItem, 'id' | 'createdAt' | 'updatedAt' | 'needsToBuy'>): Promise<InventoryItem> {
  return api.post('/inventory', item)
}

export async function updateInventoryItem(id: string, item: Partial<InventoryItem>): Promise<InventoryItem> {
  return api.put(`/inventory/${id}`, item)
}

export async function deleteInventoryItem(id: string): Promise<void> {
  return api.delete(`/inventory/${id}`)
}

export async function markAsPurchased(id: string, quantity: number): Promise<InventoryItem> {
  return api.post(`/inventory/${id}/purchase`, { quantity })
}

export async function markAsReplaced(id: string): Promise<InventoryItem> {
  return api.post(`/inventory/${id}/replace`)
}
