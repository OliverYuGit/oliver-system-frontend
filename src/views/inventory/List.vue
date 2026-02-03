<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useInventoryStore } from '@/stores'
import { Card, Button, Modal, Input } from '@/components/common'
import { formatDate, daysUntil, daysSince } from '@/utils'
import { INVENTORY_CATEGORIES } from '@/types/inventory'
import type { InventoryItem, InventoryCategory } from '@/types'
import {
  PlusIcon,
  ShoppingCartIcon,
  ExclamationTriangleIcon,
  ArrowPathIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
} from '@heroicons/vue/24/outline'

const inventoryStore = useInventoryStore()

const showAddModal = ref(false)
const searchQuery = ref('')
const selectedCategory = ref<InventoryCategory | null>(null)

const newItem = ref({
  name: '',
  category: 'other' as InventoryCategory,
  quantity: 1,
  unit: '个',
  minQuantity: 1,
  expiryDate: '',
  replacementCycle: undefined as number | undefined,
  location: '',
  notes: '',
})

const filteredItems = computed(() => {
  let items = inventoryStore.items
  
  if (selectedCategory.value) {
    items = items.filter(item => item.category === selectedCategory.value)
  }
  
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    items = items.filter(item => 
      item.name.toLowerCase().includes(query) ||
      item.notes?.toLowerCase().includes(query)
    )
  }
  
  return items
})

const groupedItems = computed(() => {
  const groups: Record<string, InventoryItem[]> = {}
  
  for (const category of INVENTORY_CATEGORIES) {
    const categoryItems = filteredItems.value.filter(item => item.category === category.id)
    if (categoryItems.length > 0) {
      groups[category.id] = categoryItems
    }
  }
  
  return groups
})

function getCategoryInfo(categoryId: InventoryCategory) {
  return INVENTORY_CATEGORIES.find(c => c.id === categoryId)
}

function getItemStatus(item: InventoryItem): { type: string; label: string; color: string } | null {
  if (item.needsToBuy) {
    return { type: 'buy', label: '需购买', color: 'bg-yellow-100 text-yellow-700' }
  }
  if (item.expiryDate && daysUntil(item.expiryDate) <= 7) {
    const days = daysUntil(item.expiryDate)
    if (days < 0) {
      return { type: 'expired', label: '已过期', color: 'bg-red-100 text-red-700' }
    }
    return { type: 'expiring', label: `${days}天后过期`, color: 'bg-orange-100 text-orange-700' }
  }
  if (item.lastReplaced && item.replacementCycle) {
    const days = daysSince(item.lastReplaced)
    if (days >= item.replacementCycle) {
      return { type: 'replace', label: '需更换', color: 'bg-purple-100 text-purple-700' }
    }
  }
  return null
}

function openAddModal() {
  newItem.value = {
    name: '',
    category: 'other',
    quantity: 1,
    unit: '个',
    minQuantity: 1,
    expiryDate: '',
    replacementCycle: undefined,
    location: '',
    notes: '',
  }
  showAddModal.value = true
}

async function saveItem() {
  await inventoryStore.addItem({
    name: newItem.value.name,
    category: newItem.value.category,
    quantity: newItem.value.quantity,
    unit: newItem.value.unit,
    minQuantity: newItem.value.minQuantity,
    expiryDate: newItem.value.expiryDate || undefined,
    replacementCycle: newItem.value.replacementCycle,
    location: newItem.value.location || undefined,
    notes: newItem.value.notes || undefined,
  })
  showAddModal.value = false
}

async function markPurchased(item: InventoryItem) {
  await inventoryStore.markPurchased(item.id, item.minQuantity)
}

async function markReplaced(item: InventoryItem) {
  await inventoryStore.markReplaced(item.id)
}

onMounted(() => {
  inventoryStore.fetchItems()
  inventoryStore.fetchSummary()
})
</script>

<template>
  <div class="space-y-6 animate-fade-in">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">库存管理</h1>
        <p class="text-gray-500 mt-1">管理家庭物品库存，及时补充</p>
      </div>
      <Button variant="primary" @click="openAddModal">
        <PlusIcon class="w-5 h-5 mr-2" />
        添加物品
      </Button>
    </div>

    <!-- Stats -->
    <div class="grid grid-cols-2 sm:grid-cols-4 gap-4">
      <Card padding="md">
        <div class="text-center">
          <p class="text-2xl font-bold text-gray-900">{{ inventoryStore.summary.totalItems }}</p>
          <p class="text-sm text-gray-500">总物品</p>
        </div>
      </Card>
      <Card padding="md">
        <div class="text-center">
          <p class="text-2xl font-bold text-yellow-600">{{ inventoryStore.summary.needsToBuy }}</p>
          <p class="text-sm text-gray-500">需购买</p>
        </div>
      </Card>
      <Card padding="md">
        <div class="text-center">
          <p class="text-2xl font-bold text-orange-600">{{ inventoryStore.summary.expiringSoon }}</p>
          <p class="text-sm text-gray-500">即将过期</p>
        </div>
      </Card>
      <Card padding="md">
        <div class="text-center">
          <p class="text-2xl font-bold text-purple-600">{{ inventoryStore.summary.needsReplacement }}</p>
          <p class="text-sm text-gray-500">需更换</p>
        </div>
      </Card>
    </div>

    <!-- Alerts -->
    <div v-if="inventoryStore.itemsNeedingPurchase.length > 0" class="space-y-2">
      <h2 class="text-lg font-semibold text-gray-900 flex items-center gap-2">
        <ShoppingCartIcon class="w-5 h-5 text-yellow-600" />
        需要购买
      </h2>
      <Card padding="sm">
        <div class="flex flex-wrap gap-2">
          <div
            v-for="item in inventoryStore.itemsNeedingPurchase"
            :key="item.id"
            class="flex items-center gap-2 px-3 py-2 bg-yellow-50 rounded-lg"
          >
            <span>{{ getCategoryInfo(item.category)?.icon }}</span>
            <span class="text-sm font-medium text-yellow-800">{{ item.name }}</span>
            <span class="text-xs text-yellow-600">(剩{{ item.quantity }}{{ item.unit }})</span>
            <Button
              variant="ghost"
              size="sm"
              class="ml-2"
              @click="markPurchased(item)"
            >
              已购买
            </Button>
          </div>
        </div>
      </Card>
    </div>

    <!-- Search & Filter -->
    <div class="flex flex-col sm:flex-row gap-4">
      <div class="relative flex-1">
        <MagnifyingGlassIcon class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          v-model="searchQuery"
          type="text"
          placeholder="搜索物品..."
          class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
        />
      </div>
      <div class="flex gap-2 overflow-x-auto pb-2 sm:pb-0">
        <button
          :class="[
            'px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors',
            !selectedCategory
              ? 'bg-primary-100 text-primary-800'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          ]"
          @click="selectedCategory = null"
        >
          全部
        </button>
        <button
          v-for="category in INVENTORY_CATEGORIES"
          :key="category.id"
          :class="[
            'px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors',
            selectedCategory === category.id
              ? 'bg-primary-100 text-primary-800'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          ]"
          @click="selectedCategory = category.id"
        >
          {{ category.icon }} {{ category.name }}
        </button>
      </div>
    </div>

    <!-- Items List -->
    <div v-if="Object.keys(groupedItems).length === 0" class="text-center py-12">
      <ShoppingCartIcon class="w-12 h-12 text-gray-300 mx-auto mb-3" />
      <p class="text-gray-500">暂无物品</p>
      <Button variant="primary" class="mt-4" @click="openAddModal">
        <PlusIcon class="w-5 h-5 mr-2" />
        添加第一个物品
      </Button>
    </div>

    <div v-else class="space-y-6">
      <div v-for="(items, categoryId) in groupedItems" :key="categoryId">
        <h2 class="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
          <span>{{ getCategoryInfo(categoryId as InventoryCategory)?.icon }}</span>
          {{ getCategoryInfo(categoryId as InventoryCategory)?.name }}
          <span class="text-sm font-normal text-gray-400">({{ items.length }})</span>
        </h2>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <Card
            v-for="item in items"
            :key="item.id"
            padding="md"
            class="relative"
          >
            <div class="flex items-start justify-between">
              <div>
                <h3 class="font-medium text-gray-900">{{ item.name }}</h3>
                <p class="text-sm text-gray-500 mt-1">
                  {{ item.quantity }} {{ item.unit }}
                  <span v-if="item.location" class="text-gray-400">· {{ item.location }}</span>
                </p>
              </div>
              <span
                v-if="getItemStatus(item)"
                :class="[
                  'px-2 py-1 text-xs font-medium rounded-full',
                  getItemStatus(item)?.color
                ]"
              >
                {{ getItemStatus(item)?.label }}
              </span>
            </div>
            
            <div v-if="item.expiryDate || item.lastReplaced" class="mt-3 text-xs text-gray-500">
              <p v-if="item.expiryDate">
                过期日期: {{ formatDate(item.expiryDate) }}
              </p>
              <p v-if="item.lastReplaced">
                上次更换: {{ formatDate(item.lastReplaced) }}
              </p>
            </div>

            <div v-if="item.notes" class="mt-2 text-sm text-gray-600">
              {{ item.notes }}
            </div>

            <div class="mt-4 flex gap-2">
              <Button
                v-if="item.needsToBuy"
                variant="cta"
                size="sm"
                @click="markPurchased(item)"
              >
                已购买
              </Button>
              <Button
                v-if="item.replacementCycle && getItemStatus(item)?.type === 'replace'"
                variant="secondary"
                size="sm"
                @click="markReplaced(item)"
              >
                已更换
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>

    <!-- Add Item Modal -->
    <Modal v-model="showAddModal" title="添加物品" size="lg">
      <form @submit.prevent="saveItem" class="space-y-4">
        <Input
          v-model="newItem.name"
          label="物品名称"
          placeholder="例如：美士猫粮"
          required
        />

        <div>
          <label class="label">分类</label>
          <div class="grid grid-cols-3 gap-2">
            <button
              v-for="category in INVENTORY_CATEGORIES"
              :key="category.id"
              type="button"
              :class="[
                'p-2 rounded-lg border text-sm transition-colors',
                newItem.category === category.id
                  ? 'border-primary-500 bg-primary-50'
                  : 'border-gray-200 hover:bg-gray-50'
              ]"
              @click="newItem.category = category.id"
            >
              {{ category.icon }} {{ category.name }}
            </button>
          </div>
        </div>

        <div class="grid grid-cols-3 gap-4">
          <Input
            v-model.number="newItem.quantity"
            type="number"
            label="当前数量"
            required
          />
          <Input
            v-model="newItem.unit"
            label="单位"
            placeholder="个/袋/瓶"
          />
          <Input
            v-model.number="newItem.minQuantity"
            type="number"
            label="最低库存"
          />
        </div>

        <div class="grid grid-cols-2 gap-4">
          <Input
            v-model="newItem.expiryDate"
            type="date"
            label="过期日期（可选）"
          />
          <Input
            v-model.number="newItem.replacementCycle"
            type="number"
            label="更换周期（天，可选）"
          />
        </div>

        <Input
          v-model="newItem.location"
          label="存放位置（可选）"
          placeholder="例如：厨房柜子"
        />

        <Input
          v-model="newItem.notes"
          label="备注（可选）"
          placeholder="其他说明..."
        />
      </form>

      <template #footer>
        <div class="flex justify-end gap-3">
          <Button variant="secondary" @click="showAddModal = false">取消</Button>
          <Button variant="primary" @click="saveItem">保存</Button>
        </div>
      </template>
    </Modal>
  </div>
</template>
