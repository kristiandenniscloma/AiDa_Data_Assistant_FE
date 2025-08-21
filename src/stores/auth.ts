import { supabase } from '@/lib/supabase'
import { register } from 'module'
import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null as any | null,
    loading: false,
    error: null as string | null
  }),

  actions: {
    async login(email: string, password: string) {
      this.loading = true
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })
      this.loading = false

      if (error) {
        this.error = error.message
        return false
      }

      this.user = data.user
      return true
    },

    async register(email, password) {
      this.loading = true

      const { data, error } = await supabase.auth.signUp({
        email,
        password
      })

      this.loading = false

      if (error) {
        this.error = error.message
        return false
      }

      this.user = data.user

      return true
    },

    async logout() {
      await supabase.auth.signOut()
      this.user = null
    },

    async checkUser() {
      const {
        data: { user }
      } = await supabase.auth.getUser()

      this.user = user
    }
  }
})
