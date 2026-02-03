import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { InventoryItem, InventoryCategory, InventorySummary } from '@/types'
import * as inventoryApi from '@/api/inventory'

export const useInventoryStore = defineStore('inventory', () => {
  // State
  const items = ref<InventoryItem[]>([])
  const summary = ref<InventorySummary>({
    totalItems: 0,
    needsToBuy: 0,
    expiringSoon: 0,
    needsReplacement: 0,
  })
  const loading = ref(false)
  const selectedCategory = ref<InventoryCategory | null>(null)

  // Getters
  const filteredItems = computed(() => {
    if (!selectedCategory.value) return items.value
    return items.value.filter(item => item.category === selectedCategory.value)
  })

  const itemsNeedingPurchase = computed(() => {
    return items.value.filter(item => item.needsToBuy)
  })

  const expiringItems = computed(() => {
    const now = new Date()
    const weekFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000)
    return items.value.filter(item => {
      if (!item.expiryDate) return false
      const expiry = new Date(item.expiryDate)
      return expiry <= weekFromNow && expiry >= now
    })
  })

  const itemsNeedingReplacement = computed(() => {
    return items.value.filter(item => {
      if (!item.lastReplaced || !item.replacementCycle) return false
      const lastReplaced = new Date(item.lastReplaced)
      const daysSince = Math.floor((Date.now() - lastReplaced.getTime()) / (1000 * 60 * 60 * 24))
      return daysSince >= item.replacementCycle
    })
  })

  // Actions
  async function fetchItems(category?: InventoryCategory) {
    loading.value = true
    try {
      items.value = await inventoryApi.getInventoryItems(category)
    } catch (error) {
      console.error('Failed to fetch inventory items:', error)
    } finally {
      loading.value = false
    }
  }

  async function fetchSummary() {
    try {
      summary.value = await inventoryApi.getInventorySummary()
    } catch (error) {
      console.error('Failed to fetch inventory summary:', error)
    }
  }

  async function addItem(item: Omit<InventoryItem, 'id' | 'createdAt' | 'updatedAt' | 'needsToBuy'>) {
    try {
      const newItem = await inventoryApi.createInventoryItem(item)
      items.value.push(newItem)
      await fetchSummary()
      return newItem
    } catch (error) {
      console.error('Failed to add inventory item:', error)
      throw error
    }
  }

  async function updateItem(id: string, updates: Partial<InventoryItem>) {
    try {
      const updatedItem = await inventoryApi.updateInventoryItem(id, updates)
      const index = items.value.findIndex(item => item.id === id)
      if (index !== -1) {
        items.value[index] = updatedItem
      }
      await fetchSummary()
      return updatedItem
    } catch (error) {
      console.error('Failed to update inventory item:', error)
      throw error
    }
  }

  async function deleteItem(id: string) {
    try {
      await inventoryApi.deleteInventoryItem(id)
      items.value = items.value.filter(item => item.id !== id)
      await fetchSummary()
    } catch (error) {
      console.error('Failed to delete inventory item:', error)
      throw error
    }
  }

  async function markPurchased(id: string, quantity: number) {
    try {
      const updatedItem = await inventoryApi.markAsPurchased(id, quantity)
      const index = items.value.findIndex(item => item.id === id)
      if (index !== -1) {
        items.value[index] = updatedItem
      }
      await fetchSummary()
    } catch (error) {
      console.error('Failed to mark item as purchased:', error)
      throw error
    }
  }

  async function markReplaced(id: string) {
    try {
      const updatedItem = await inventoryApi.markAsReplaced(id)
      const index = items.value.findIndex(item => item.id === id)
      if (index !== -1) {
        items.value[index] = updatedItem
      }
      await fetchSummary()
    } catch (error) {
      console.error('Failed to mark item as replaced:', error)
      throw error
    }
  }

  function setCategory(category: InventoryCategory | null) {
    selectedCategory.value = category
  }

  return {
    items,
    summary,
    loading,
    selectedCategory,
    filteredItems,
    itemsNeedingPurchase,
    expiringItems,
    itemsNeedingReplacement,
    fetchItems,
    fetchSummary,
    addItem,
    updateItem,
    deleteItem,
    markPurchased,
    markReplaced,
    setCategory,
  }
})
