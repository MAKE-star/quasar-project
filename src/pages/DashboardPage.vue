<template>
  <q-layout view="lHh Lpr lFf">
    <!-- Header -->
    <q-header elevated class="bg-primary text-white">
      <q-toolbar>
        <q-btn flat dense round icon="menu" @click="toggleLeftDrawer" aria-label="Toggle sidebar" />
        <q-toolbar-title>E-Shop Marketplace</q-toolbar-title>
        <q-btn flat rounded label="View Cart" icon="shopping_cart" @click="$router.push('/cart')" />
      </q-toolbar>
    </q-header>

    <!-- Sidebar -->
    <q-drawer v-model="leftDrawerOpen" show-if-above bordered class="bg-white" :width="250" :breakpoint="768">
      <q-scroll-area class="fit">
        <q-list class="q-pa-md">
          <q-item clickable v-ripple @click="showProducts = true" :active="showProducts">
            <q-item-section avatar>
              <q-icon name="shopping_bag" color="primary" />
            </q-item-section>
            <q-item-section>
              <q-item-label>Products</q-item-label>
            </q-item-section>
          </q-item>
          <q-item clickable v-ripple @click="logout">
            <q-item-section avatar>
              <q-icon name="logout" color="negative" />
            </q-item-section>
            <q-item-section>
              <q-item-label>Logout</q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
      </q-scroll-area>
    </q-drawer>

    <!-- Main Content -->
    <q-page-container>
      <q-page class="q-pa-md bg-grey-1">
        <!-- Dashboard Title -->
        <h1 class="text-h4 text-primary text-weight-bold q-mb-lg">Dashboard</h1>

        <!-- Products Section -->
        <div class="q-mb-xl" v-if="showProducts">
          <h2 class="text-h5 text-weight-medium q-mb-md">Available Products</h2>
          <div class="row q-col-gutter-md">
            <div v-for="product in products" :key="product.id" class="col-xs-12 col-sm-6 col-md-4 col-lg-3">
              <q-card class="product-card q-hoverable" flat bordered>
                <q-img :src="product.image" height="200px" fit="cover" :alt="product.name" @error="handleImageError" />
                <q-card-section class="q-pa-md">
                  <div class="text-h6 text-weight-medium">{{ product.name }}</div>
                  <div class="text-caption text-grey-7 q-mt-xs">{{ product.description }}</div>
                  <div class="row items-center justify-between">
                    <div class="text-body1 text-weight-bold q-mt-xs"
                      :class="(product.stock_quantity ?? 0) > 0 ? 'text-positive' : 'text-negative'">
                      {{
                        (product.stock_quantity ?? 0) > 0
                          ? `In Stock: ${(product.stock_quantity ?? 0) - cartStore.getItemQuantity(product.id)}`
                          : 'Sold Out'
                      }}
                    </div>
                    <div class="text-h5 text-weight-bold text-primary">
                      ${{ product.price }}
                    </div>
                  </div>
                  <div class="q-mt-md">
                    <q-btn
                      color="primary"
                      rounded
                      icon="add_shopping_cart"
                      label="Add to Cart"
                      size="sm"
                      @click="addToCart(product)"
                      :disable="(product.stock_quantity ?? 0) === 0 || cartStore.getItemQuantity(product.id) > 0"
                    />
                  </div>
                </q-card-section>
              </q-card>
            </div>
          </div>
        </div>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useQuasar } from 'quasar';
import { useCartStore } from '../stores/cart';
import { useAuthStore } from '../stores/auth';
import { api } from 'boot/axios';

type Product = {
  id: number;
  name: string;
  price: number;
  description: string;
  image: string;
  stock_quantity?: number;
};

const $q = useQuasar();
const router = useRouter();
const cartStore = useCartStore();
const authStore = useAuthStore();
const leftDrawerOpen = ref(false);
const showProducts = ref(true);

const products = ref<Product[]>([]);

onMounted(async () => {
  try {
    const response = await api.get('/products')
    products.value = response.data;
  } catch (error) {
    console.error('Failed to load products:', error);
  }
});

const toggleLeftDrawer = () => {
  leftDrawerOpen.value = !leftDrawerOpen.value;
};

const addToCart = (product: Product) => {
  cartStore.addToCart({
    id: product.id,
    name: product.name,
    price: product.price,
    description: product.description,
    image_url: product.image,
    stock_quantity: product.stock_quantity || 1,
  });

  $q.notify({
    type: 'positive',
    message: `${product.name} added to cart!`,
    position: 'top-right',
  });
};

const logout = async () => {
  authStore.logout();
  $q.notify({
    type: 'info',
    message: 'Logged out successfully.',
    position: 'top-right',
  });
  await router.push('/login');
};

const handleImageError = (event: Event) => {
  const target = event.target as HTMLImageElement;
  console.log('Image failed to load:', target.src);
  target.src = 'https://via.placeholder.com/300x200?text=Image+Not+Found';
};
</script>

<style scoped>
.q-layout {
  background: linear-gradient(to bottom, #f5f7fa, #e0e7ff);
}

.q-header {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.q-drawer {
  background: #ffffff;
  box-shadow: 2px 0 12px rgba(0, 0, 0, 0.05);
}

.q-item:hover {
  background-color: #f1f5f9;
}

.product-card {
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  border-radius: 12px;
  overflow: hidden;
  background: #ffffff;
}

.product-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
}

.q-img {
  border-top-left-radius: 12px;
  border-top-right-radius: 12px;
}

.q-card {
  border: 1px solid rgba(0, 0, 0, 0.05);
}

.q-btn {
  text-transform: none;
  font-weight: 500;
}

.q-list {
  border-radius: 12px;
}

.text-primary {
  color: #3b82f6 !important;
}

.text-grey-7 {
  color: #6b7280 !important;
}

.q-item--active {
  background-color: #e0e7ff;
  color: #3b82f6;
}
</style>
