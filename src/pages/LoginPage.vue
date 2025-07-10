<template>
  <q-page class="flex flex-center">
    <div class="auth-container">
      <q-card class="auth-card">
        <q-card-section class="text-center">
          <div class="text-h4 text-primary q-mb-md">Welcome Back</div>
          <div class="text-subtitle2 text-grey-7">Sign in to your account</div>
        </q-card-section>

        <q-card-section>
          <q-form @submit="handleLogin" class="q-gutter-md">
            <q-input v-model="form.email" type="email" label="Email" outlined required
              :rules="[val => !!val || 'Email is required', val => isValidEmail(val) || 'Please enter a valid email']">
              <template #prepend>
                <q-icon name="email" />
              </template>
            </q-input>

            <q-input v-model="form.password" :type="showPassword ? 'text' : 'password'" label="Password" outlined
              required :rules="[val => !!val || 'Password is required']">
              <template #prepend>
                <q-icon name="lock" />
              </template>
              <template #append>
                <q-icon :name="showPassword ? 'visibility' : 'visibility_off'" class="cursor-pointer"
                  @click="showPassword = !showPassword" />
              </template>
            </q-input>

            <div class="row justify-between items-center">
              <q-checkbox v-model="form.rememberMe" label="Remember me" />
              <q-btn flat color="primary" label="Forgot password?" size="sm" @click="handleForgotPassword" />
            </div>

            <q-btn type="submit" color="primary" class="q-mx-auto block" size="md" :loading="authStore.isLoading"
              :disable="authStore.isLoading">
              Sign In
            </q-btn>
          </q-form>
        </q-card-section>

        <q-separator />

        <q-card-section class="text-center">
          <div class="text-body2">
            Don't have an account?
            <q-btn flat color="primary" label="Sign up" size="sm" @click="$router.push('/register')" />
          </div>
        </q-card-section>
      </q-card>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useQuasar } from 'quasar'
import { useAuthStore } from '../stores/auth'

const $q = useQuasar()
const router = useRouter()
const authStore = useAuthStore()

const showPassword = ref(false)

const form = reactive({
  email: '',
  password: '',
  rememberMe: false
})

const isValidEmail = (email: string) => {
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailPattern.test(email)
}

const handleLogin = async () => {
  const result = await authStore.login({
    email: form.email,
    password: form.password
  })

  if (result.success) {
    $q.notify({
      type: 'positive',
      message: 'Login successful!',
      position: 'top'
    })

    await router.push('/products')
    
  } else {
    $q.notify({
      type: 'negative',
      message: result.error || 'Login failed',
      position: 'top'
    })
  }
}

const handleForgotPassword = () => {
  $q.notify({
    type: 'info',
    message: 'Password reset functionality coming soon!',
    position: 'top'
  })
}
</script>

<style scoped>
.auth-container {
  width: 100%;
  max-width: 400px;
  padding: 20px;
}

.auth-card {
  width: 100%;
}

@media (max-width: 480px) {
  .auth-container {
    padding: 10px;
  }
}
</style>
