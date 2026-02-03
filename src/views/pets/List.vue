<script setup lang="ts">
import { ref } from 'vue'
import { Card, Button, Modal, Input } from '@/components/common'
import {
  PlusIcon,
  HeartIcon,
  CakeIcon,
  ScaleIcon,
} from '@heroicons/vue/24/outline'

interface Pet {
  id: string
  name: string
  breed: string
  birthDate: string
  weight: number
  avatar: string
  color: string
}

const pets = ref<Pet[]>([
  {
    id: '1',
    name: 'Fifi',
    breed: '布偶猫',
    birthDate: '2022-10-15',
    weight: 4.0,
    avatar: '🐱',
    color: 'bg-pink-100',
  },
  {
    id: '2',
    name: '派大星',
    breed: '英短蓝猫',
    birthDate: '2022-05-20',
    weight: 6.0,
    avatar: '🐱',
    color: 'bg-blue-100',
  },
  {
    id: '3',
    name: '游十亿',
    breed: '银渐层',
    birthDate: '2022-08-10',
    weight: 4.0,
    avatar: '🐱',
    color: 'bg-gray-100',
  },
])

const showAddModal = ref(false)
const newPet = ref({
  name: '',
  breed: '',
  birthDate: '',
  weight: 0,
})

function calculateAge(birthDate: string): string {
  const birth = new Date(birthDate)
  const now = new Date()
  const months = (now.getFullYear() - birth.getFullYear()) * 12 + (now.getMonth() - birth.getMonth())
  const years = Math.floor(months / 12)
  const remainingMonths = months % 12
  
  if (years === 0) {
    return `${remainingMonths}个月`
  }
  return `${years}岁${remainingMonths}个月`
}

function openAddModal() {
  newPet.value = {
    name: '',
    breed: '',
    birthDate: '',
    weight: 0,
  }
  showAddModal.value = true
}

function savePet() {
  pets.value.push({
    id: Date.now().toString(),
    name: newPet.value.name,
    breed: newPet.value.breed,
    birthDate: newPet.value.birthDate,
    weight: newPet.value.weight,
    avatar: '🐱',
    color: 'bg-purple-100',
  })
  showAddModal.value = false
}
</script>

<template>
  <div class="space-y-6 animate-fade-in">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">宠物管理</h1>
        <p class="text-gray-500 mt-1">记录毛孩子的成长</p>
      </div>
      <Button variant="primary" @click="openAddModal">
        <PlusIcon class="w-5 h-5 mr-2" />
        添加宠物
      </Button>
    </div>

    <!-- Pet Cards -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      <Card
        v-for="pet in pets"
        :key="pet.id"
        padding="none"
        class="overflow-hidden"
      >
        <!-- Header with avatar -->
        <div :class="['p-6 text-center', pet.color]">
          <span class="text-6xl">{{ pet.avatar }}</span>
        </div>
        
        <!-- Info -->
        <div class="p-6">
          <h3 class="text-xl font-bold text-gray-900 text-center">{{ pet.name }}</h3>
          <p class="text-sm text-gray-500 text-center mt-1">{{ pet.breed }}</p>
          
          <div class="mt-6 grid grid-cols-2 gap-4">
            <div class="text-center p-3 bg-gray-50 rounded-lg">
              <CakeIcon class="w-5 h-5 text-gray-400 mx-auto mb-1" />
              <p class="text-sm font-medium text-gray-900">{{ calculateAge(pet.birthDate) }}</p>
              <p class="text-xs text-gray-500">年龄</p>
            </div>
            <div class="text-center p-3 bg-gray-50 rounded-lg">
              <ScaleIcon class="w-5 h-5 text-gray-400 mx-auto mb-1" />
              <p class="text-sm font-medium text-gray-900">{{ pet.weight }} kg</p>
              <p class="text-xs text-gray-500">体重</p>
            </div>
          </div>

          <div class="mt-4 flex gap-2">
            <Button variant="secondary" size="sm" full-width>
              <HeartIcon class="w-4 h-4 mr-1" />
              健康记录
            </Button>
          </div>
        </div>
      </Card>
    </div>

    <!-- Tips -->
    <Card padding="md">
      <div class="flex items-start gap-4">
        <div class="p-3 bg-pink-100 rounded-xl flex-shrink-0">
          <HeartIcon class="w-6 h-6 text-pink-600" />
        </div>
        <div>
          <h3 class="font-semibold text-gray-900">宠物护理提醒</h3>
          <ul class="mt-2 text-sm text-gray-600 space-y-1">
            <li>• 定期驱虫（每月一次体外，每三月一次体内）</li>
            <li>• 每年接种疫苗</li>
            <li>• 定期称重，关注体重变化</li>
            <li>• 保持充足的饮水</li>
          </ul>
        </div>
      </div>
    </Card>

    <!-- Add Pet Modal -->
    <Modal v-model="showAddModal" title="添加宠物" size="md">
      <form @submit.prevent="savePet" class="space-y-4">
        <Input
          v-model="newPet.name"
          label="名字"
          placeholder="宠物的名字"
          required
        />

        <Input
          v-model="newPet.breed"
          label="品种"
          placeholder="例如：布偶猫"
          required
        />

        <Input
          v-model="newPet.birthDate"
          type="date"
          label="出生日期"
          required
        />

        <Input
          v-model.number="newPet.weight"
          type="number"
          label="体重 (kg)"
          placeholder="4.0"
          required
        />
      </form>

      <template #footer>
        <div class="flex justify-end gap-3">
          <Button variant="secondary" @click="showAddModal = false">取消</Button>
          <Button variant="primary" @click="savePet">保存</Button>
        </div>
      </template>
    </Modal>
  </div>
</template>
