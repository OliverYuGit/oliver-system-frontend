import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { User, LoginCredentials } from '@/types'
import * as authApi from '@/api/auth'
import { setToken, setRefreshToken, removeTokens, getToken } from '@/utils/auth'

export const useAuthStore = defineStore('auth', () => {
  // State
  const user = ref<User | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  // Getters
  const isAuthenticated = computed(() => !!user.value && !!getToken())
  const username = computed(() => user.value?.username || '')

  // Actions
  async function login(credentials: LoginCredentials) {
    loading.value = true
    error.value = null
    
    try {
      const response = await authApi.login(credentials)
      setToken(response.token)
      setRefreshToken(response.refreshToken)
      user.value = response.user
      return true
    } catch (err: any) {
      error.value = err.response?.data?.message || '登录失败，请检查用户名和密码'
      return false
    } finally {
      loading.value = false
    }
  }

  async function logout() {
    try {
      await authApi.logout()
    } catch {
      // Ignore logout errors
    } finally {
      user.value = null
      removeTokens()
    }
  }

  async function fetchCurrentUser() {
    if (!getToken()) return
    
    loading.value = true
    try {
      user.value = await authApi.getCurrentUser()
    } catch {
      user.value = null
      removeTokens()
    } finally {
      loading.value = false
    }
  }

  function clearError() {
    error.value = null
  }

  return {
    user,
    loading,
    error,
    isAuthenticated,
    username,
    login,
    logout,
    fetchCurrentUser,
    clearError,
  }
})
