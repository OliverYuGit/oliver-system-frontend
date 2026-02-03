import api from './index'
import type { LoginCredentials, AuthResponse, User } from '@/types'

export async function login(credentials: LoginCredentials): Promise<AuthResponse> {
  return api.post('/auth/login', credentials)
}

export async function logout(): Promise<void> {
  return api.post('/auth/logout')
}

export async function refreshToken(token: string): Promise<AuthResponse> {
  return api.post('/auth/refresh', { refreshToken: token })
}

export async function getCurrentUser(): Promise<User> {
  return api.get('/auth/me')
}

export async function updateProfile(data: Partial<User>): Promise<User> {
  return api.put('/auth/profile', data)
}
