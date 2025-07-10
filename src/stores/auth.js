// stores/auth.js
import { defineStore } from 'pinia'
import { api } from 'boot/axios'



export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: {
      first_name: '',
      last_name: '',
      email: '',
      phone: '',
      role: ''
    },
    token: localStorage.getItem('token') || null,
    isLoading: false,
    error: null
  }),

  getters: {
    isAuthenticated: (state) => !!state.token,
    isAdmin: (state) => state.user?.role === 'admin',
    userName: (state) => state.user ? `${state.user.first_name} ${state.user.last_name}` : ''
  },

  actions: {
    async login(credentials) {
      this.isLoading = true
      this.error = null

      try {
        const response = await api.post('/auth/login', credentials)
        const { user, token } = response.data

        this.user = user
        this.token = token
        localStorage.setItem('token', token)

        // Set default auth header
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`

        return { success: true }
      } catch (error) {
        this.error = error.response?.data?.message || 'Login failed'
        return { success: false, error: this.error }
      } finally {
        this.isLoading = false
      }
    },

    async register(userData) {
      this.isLoading = true
      this.error = null

      try {
        const response = await api.post('/auth/register', userData)
        console.log(response);
        return { success: true, message: 'Registration successful!.' }
      } catch (error) {
        this.error = error.response?.data?.message || 'Registration failed'
        return { success: false, error: this.error }
      } finally {
        this.isLoading = false
      }
    },

    async fetchProfile() {
      if (!this.token) return

      try {
        const response = await api.get('/users/profile')
        this.user = response.data
      } catch (error) {
        console.error('Failed to fetch profile:', error)
        if (error.response?.status === 401) {
          this.logout()
        }
      }
    },

    async updateProfile(profileData) {
      this.isLoading = true
      this.error = null

      try {
        const response = await api.put('/users/profile', profileData)
        this.user = response.data
        return { success: true, message: 'Profile updated successfully' }
      } catch (error) {
        this.error = error.response?.data?.message || 'Profile update failed'
        return { success: false, error: this.error }
      } finally {
        this.isLoading = false
      }
    },

    logout() {
      this.user = null
      this.token = null
      this.error = null
      localStorage.removeItem('token')
      delete api.defaults.headers.common['Authorization']
    },

    initializeAuth() {
      if (this.token) {
        api.defaults.headers.common['Authorization'] = `Bearer ${this.token}`
        this.fetchProfile()
      }
    }
  }
})
