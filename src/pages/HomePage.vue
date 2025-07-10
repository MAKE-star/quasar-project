<template>
  <q-page class="bg-grey-1">
    <!-- Hero Section -->
    <section class="bg-primary text-white">
      <div class="container q-py-xl">
        <div class="row items-center">
          <div class="col-md-6 col-12 q-pr-lg">
            <h1 class="text-h2 text-weight-bold q-mb-md">
              Welcome to E-Shop
            </h1>
            <p class="text-h6 q-mb-lg text-grey-3">
              Discover amazing products at unbeatable prices.
              Shop the latest trends and find everything you need.
            </p>
            <div class="q-gutter-md q-mb-xl">
              <q-btn
                size="lg"
                color="white"
                rounded
                text-color="primary"
                label="Shop Now"
                class="text-weight-bold"
                @click="goToShop"
              />
              <q-btn
                size="lg"
                outline
                color="white"
                rounded
                label="Learn More"
                @click="$router.push('/about')"
              />
            </div>
          </div>
          <div class="col-md-6 col-12 text-center">
            <q-img
              src="https://via.placeholder.com/500x400/1976D2/FFFFFF?text=Hero+Image"
              style="max-width: 500px"
              class="rounded-borders"
            />
          </div>
        </div>
      </div>
    </section>

    <!-- Featured Categories -->
    <section class="q-py-xl">
      <div class="container">
        <div class="text-center q-mb-xl">
          <h2 class="text-h3 text-weight-bold text-black-8 q-mb-md">
            Shop by Category
          </h2>
          <p class="text-h6 text-black-6">
            Explore our wide range of product categories
          </p>
        </div>

        <div class="row q-gutter-lg justify-center">
          <div
            v-for="category in featuredCategories"
            :key="category.id"
            class="col-md-3 col-sm-5 col-12"
          >
            <q-card
              class="category-card cursor-pointer"
              @click="$router.push(`/category/${category.slug}`)"
            >
              <q-card-section class="text-center q-pa-lg">
                <q-icon :name="category.icon" size="4rem" :color="category.color" class="q-mb-md" />
                <h3 class="text-h5 text-weight-bold text-black-8 q-mb-sm">
                  {{ category.name }}
                </h3>
                <p class="text-black-6">
                  {{ category.description }}
                </p>
              </q-card-section>
            </q-card>
          </div>
        </div>
      </div>
    </section>

    <!-- Featured Products -->
    <section class="bg-white q-py-xl">
      <div class="container">
        <div class="text-center q-mb-xl">
          <h2 class="text-h3 text-weight-bold text-black-8 q-mb-md">
            Featured Products
          </h2>
          <p class="text-h6 text-black-6">
            Check out our most popular items
          </p>
        </div>

        <div class="row q-gutter-md justify-center">
          <div
            v-for="product in featuredProducts"
            :key="product.id"
            class="col-lg-3 col-md-4 col-sm-6 col-12"
          >
            <q-card class="product-card">
              <q-img
                :src="product.image"
                :alt="product.name"
                height="200px"
                class="cursor-pointer"
                @click="handleProductClick(product.id)"
              />
              <q-card-section>
                <div class="text-h6 text-weight-bold text-black-8 q-mb-sm">
                  {{ product.name }}
                </div>
                <div class="text-black-6 q-mb-md">
                  {{ product.description }}
                </div>
                <div class="row items-center justify-between">
                  <div class="text-h5 text-weight-bold text-primary">
                    ${{ product.price }}
                  </div>
                  <q-btn
                    color="primary"
                    icon="add_shopping_cart"
                    round
                    @click="addToCart(product)"
                  />
                </div>
              </q-card-section>
            </q-card>
          </div>
        </div>

        <div class="text-center q-mt-xl">
          <q-btn
            color="primary"
            size="lg"
            label="View All Products"
            rounded
            @click="$router.push('/products')"
          />
        </div>
      </div>
    </section>

    <!-- Stats Section -->
    <section class="bg-grey-2 q-py-xl">
      <div class="container">
        <div class="row q-gutter-lg text-center">
          <div class="col-md-3 col-6">
            <div class="text-h2 text-weight-bold text-primary q-mb-sm">
              10K+
            </div>
            <div class="text-h6 text-grey-6">
              Happy Customers
            </div>
          </div>
          <div class="col-md-3 col-6">
            <div class="text-h2 text-weight-bold text-primary q-mb-sm">
              5K+
            </div>
            <div class="text-h6 text-grey-6">
              Products
            </div>
          </div>
          <div class="col-md-3 col-6">
            <div class="text-h2 text-weight-bold text-primary q-mb-sm">
              99%
            </div>
            <div class="text-h6 text-grey-6">
              Satisfaction Rate
            </div>
          </div>
          <div class="col-md-3 col-6">
            <div class="text-h2 text-weight-bold text-primary q-mb-sm">
              24/7
            </div>
            <div class="text-h6 text-grey-6">
              Support
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Newsletter -->
    <section class="bg-primary text-white q-py-xl">
      <div class="container text-center">
        <h2 class="text-h3 text-weight-bold q-mb-md">Stay Updated</h2>
        <p class="text-h6 text-grey-3 q-mb-lg">
          Subscribe to our newsletter for the latest deals and updates
        </p>

        <div class="row justify-center">
          <div class="col-md-6 col-12">
            <div class="row q-gutter-md">
              <div class="col">
                <q-input
                  v-model="emailInput"
                  placeholder="Enter your email"
                  outlined
                  bg-color="white"
                  color="primary"
                  @keyup.enter="subscribeNewsletter"
                />
              </div>
              <div class="col-auto">
                <q-btn
                  color="white"
                  text-color="primary"
                  rounded
                  label="Subscribe"
                  :loading="subscribing"
                  @click="subscribeNewsletter"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </q-page>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useQuasar } from 'quasar'
import axios from 'axios'
import { useCartStore } from 'stores/cart'

type Product = {
  id: number
  name: string
  description: string
  price: number
  image: string
  stock_quantity?: number
}

const router = useRouter()
const $q = useQuasar()
const cartStore = useCartStore()

const featuredProducts = ref<Product[]>([])
const emailInput = ref('')
const subscribing = ref(false)

const isAuthenticated = () => !!localStorage.getItem('token')

const featuredCategories = ref([
  { id: 1, name: 'Electronics', slug: 'electronics', icon: 'computer', color: 'blue', description: 'Latest gadgets and tech' },
  { id: 2, name: 'Fashion', slug: 'fashion', icon: 'checkroom', color: 'pink', description: 'Trendy clothing and accessories' },
  { id: 3, name: 'Home & Garden', slug: 'home-garden', icon: 'home', color: 'green', description: 'Everything for your home' },
  { id: 4, name: 'Sports', slug: 'sports', icon: 'sports_soccer', color: 'orange', description: 'Sports equipment and gear' }
])

onMounted(async () => {
  try {
    const res = await axios.get('http://localhost:3000/products')
    featuredProducts.value = res.data.slice(0, 6)
  } catch (err) {
    console.error(err)
    $q.notify({ type: 'negative', message: 'Failed to fetch products', position: 'top-right' })
  }
})

const addToCart = async (product: Product) => {
  if (!isAuthenticated()) {
    await router.push({ path: '/login', query: { redirect: '/products' } })
    return
  }

  cartStore.addToCart({
    id: product.id,
    name: product.name,
    price: product.price,
    description: product.description,
    image_url: product.image,
    stock_quantity: product.stock_quantity ?? 1
  })

  $q.notify({ type: 'positive', message: `${product.name} added to cart!`, position: 'top-right' })
}

const handleProductClick = async (productId: number) => {
  if (!isAuthenticated()) {
    await router.push({ path: '/login', query: { redirect: `/product/${productId}` } })
  } else {
    await router.push(`/product/${productId}`)
  }
}

const goToShop = async () => {
  if (!isAuthenticated()) {
    await router.push({ path: '/login', query: { redirect: '/products' } })
  } else {
    await router.push('/products')
  }
}

const subscribeNewsletter = async () => {
  if (!emailInput.value) {
    $q.notify({ type: 'negative', message: 'Please enter your email address', position: 'top-right' })
    return
  }

  subscribing.value = true
  try {
    await new Promise(resolve => setTimeout(resolve, 1000))
    $q.notify({ type: 'positive', message: 'Successfully subscribed!', position: 'top-right' })
    emailInput.value = ''
  } catch {
    $q.notify({ type: 'negative', message: 'Failed to subscribe.', position: 'top-right' })
  } finally {
    subscribing.value = false
  }
}
</script>

<style scoped>
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}
.category-card, .product-card {
  transition: transform 0.2s ease-in-out;
}
.category-card:hover, .product-card:hover {
  transform: translateY(-5px);
}
</style>
