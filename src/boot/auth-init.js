import { useAuthStore } from 'stores/auth'

export default async () => {
  const auth = useAuthStore()
  auth.initializeAuth()
}
