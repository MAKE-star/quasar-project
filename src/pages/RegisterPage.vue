<template>
  <q-page class="flex flex-center">
    <div class="auth-container">
      <q-card class="auth-card">
        <q-card-section class="text-center">
          <div class="text-h4 text-primary q-mb-md">Create Account</div>
          <div class="text-subtitle2 text-grey-7">Join us today and start shopping</div>
        </q-card-section>

        <q-card-section>
          <q-form @submit="handleRegister" class="q-gutter-md">
            <div class="row q-gutter-sm">
              <div class="col">
                <q-input v-model="form.first_name" label="First Name" outlined required
                  :rules="[(val: string) => !!val || 'First name is required']">
                  <template #prepend>
                    <q-icon name="person" />
                  </template>
                </q-input>
              </div>
              <div class="col">
                <q-input v-model="form.last_name" label="Last Name" outlined required
                  :rules="[(val: string) => !!val || 'Last name is required']">
                  <template #prepend>
                    <q-icon name="person" />
                  </template>
                </q-input>
              </div>
            </div>

            <q-input v-model="form.email" type="email" label="Email" outlined required
              :rules="[(val: string) => !!val || 'Email is required', val => isValidEmail(val) || 'Please enter a valid email']">
              <template #prepend>
                <q-icon name="email" />
              </template>
            </q-input>

            <q-input v-model="form.phone" label="Phone Number (Optional)" outlined mask="+234 ### ### ####"
              placeholder="+234 905 236 8651" :rules="[
                val => !val || val.length >= 17 || 'Invalid phone number format'
              ]">
              <template #prepend>
                <q-icon name="phone" />
              </template>
            </q-input>

            <q-input v-model="form.password" :type="showPassword ? 'text' : 'password'" label="Password" outlined
              required :rules="[
                (val: string) => !!val || 'Password is required',
                (val: string) => val.length >= 8 || 'Password must be at least 8 characters',
                (val: string) => /(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(val) || 'Password must contain uppercase, lowercase, and number'
              ]">
              <template #prepend>
                <q-icon name="lock" />
              </template>
              <template #append>
                <q-icon :name="showPassword ? 'visibility' : 'visibility_off'" class="cursor-pointer"
                  @click="showPassword = !showPassword" />
              </template>
            </q-input>

            <q-input v-model="form.confirmPassword" :type="showConfirmPassword ? 'text' : 'password'"
              label="Confirm Password" outlined required :rules="[
                (val: string) => !!val || 'Please confirm your password',
                (val: string) => val === form.password || 'Passwords do not match'
              ]">
              <template #prepend>
                <q-icon name="lock" />
              </template>
              <template #append>
                <q-icon :name="showConfirmPassword ? 'visibility' : 'visibility_off'" class="cursor-pointer"
                  @click="showConfirmPassword = !showConfirmPassword" />
              </template>
            </q-input>
            <q-checkbox v-model="form.acceptTerms"
              :rules="[(val: string) => !!val || 'You must accept the terms and conditions']">
              <span class="text-body2">
                I agree to the
                <a class="text-primary cursor-pointer" @click.prevent="showTerms = true">Terms of Service</a>
                and
                <a class="text-primary cursor-pointer" @click.prevent="showPrivacy = true">Privacy Policy</a>
              </span>
            </q-checkbox>
            <q-btn type="submit" color="primary" class="q-mx-auto block" size="lg" :loading="authStore.isLoading"
              :disable="authStore.isLoading">
              Create Account
            </q-btn>
          </q-form>
        </q-card-section>

        <q-separator />

        <q-card-section class="text-center">
          <div class="text-body2">
            Already have an account?
            <q-btn flat color="primary" label="Sign in" size="sm" @click="$router.push('/login')" />
          </div>
        </q-card-section>
      </q-card>
    </div>

    <!-- Terms of Service Dialog -->
    <q-dialog v-model="showTerms">
      <q-card style="min-width: 350px">
        <q-card-section>
          <div class="text-h6">Terms of Service</div>
        </q-card-section>
        <q-card-section class="q-pt-none">
          <div class="text-body2">
            By using our service, you agree to our terms and conditions...
            <br><br>
            <em>Full terms would be displayed here in a real application.</em>
          </div>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Close" color="primary" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- Privacy Policy Dialog -->
    <q-dialog v-model="showPrivacy">
      <q-card style="min-width: 350px">
        <q-card-section>
          <div class="text-h6">Privacy Policy</div>
        </q-card-section>
        <q-card-section class="q-pt-none">
          <div class="text-body2">
            We respect your privacy and are committed to protecting your personal data...
            <br><br>
            <em>Full privacy policy would be displayed here in a real application.</em>
          </div>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Close" color="primary" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useQuasar } from 'quasar'
import { useAuthStore } from 'stores/auth'

const $q = useQuasar()
const router = useRouter()
const authStore = useAuthStore()

const showPassword = ref(false)
const showConfirmPassword = ref(false)
const showTerms = ref(false)
const showPrivacy = ref(false)

const form = reactive({
  first_name: '',
  last_name: '',
  email: '',
  phone: '',
  password: '',
  confirmPassword: '',
  acceptTerms: false
})

const isValidEmail = (email: string) => {
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailPattern.test(email)
}

const handleRegister = async () => {
  const userData = {
    first_name: form.first_name,
    last_name: form.last_name,
    email: form.email,
    phone: form.phone || null,
    password: form.password,
    confirmPassword: form.confirmPassword,
    acceptTerms: form.acceptTerms
  }

  const result = await authStore.register(userData)
  console.log("result", result);

  if (result.success === true) {
    $q.notify({
      type: 'positive',
      message: result.message ?? 'Registration successful!',
      position: 'top',
      timeout: 5000
    })

    // Redirect to login page
    await router.push('/login')
  } else {
    $q.notify({
      type: 'negative',
      message: result.error || 'Registration failed',
      position: 'top'
    })
  }
}
</script>

<style scoped>
.auth-container {
  width: 100%;
  max-width: 500px;
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
