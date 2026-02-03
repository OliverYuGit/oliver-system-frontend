// Inventory related types

export interface InventoryItem {
  id: string
  name: string
  category: InventoryCategory
  quantity: number
  unit: string
  minQuantity: number
  expiryDate?: string
  lastReplaced?: string
  replacementCycle?: number // in days
  location?: string
  notes?: string
  needsToBuy: boolean
  createdAt: string
  updatedAt: string
}

export type InventoryCategory = 
  | 'food' 
  | 'pet_supplies' 
  | 'household' 
  | 'personal_care' 
  | 'electronics' 
  | 'other'

export interface InventoryCategoryInfo {
  id: InventoryCategory
  name: string
  icon: string
  color: string
}

export interface InventorySummary {
  totalItems: number
  needsToBuy: number
  expiringSoon: number
  needsReplacement: number
}

export const INVENTORY_CATEGORIES: InventoryCategoryInfo[] = [
  { id: 'food', name: '食品', icon: '🍖', color: 'bg-orange-100 text-orange-800' },
  { id: 'pet_supplies', name: '宠物用品', icon: '🐱', color: 'bg-purple-100 text-purple-800' },
  { id: 'household', name: '家居用品', icon: '🏠', color: 'bg-blue-100 text-blue-800' },
  { id: 'personal_care', name: '个人护理', icon: '🧴', color: 'bg-pink-100 text-pink-800' },
  { id: 'electronics', name: '电子产品', icon: '📱', color: 'bg-gray-100 text-gray-800' },
  { id: 'other', name: '其他', icon: '📦', color: 'bg-slate-100 text-slate-800' },
]
