<template>
  <q-layout view="lHh Lpr lFf">
    <!-- Header -->
    <q-header elevated class="bg-primary text-white">
      <q-toolbar>
        <q-btn flat dense round icon="menu" @click="toggleLeftDrawer" />
        <q-toolbar-title>E-Shop Marketplace</q-toolbar-title>
        <q-btn flat label="Back to Dashboard" icon="arrow_back" @click="$router.push('/products')" />
      </q-toolbar>
    </q-header>

    <!-- Sidebar -->
    <q-drawer v-model="cartStore.isDrawerOpen" show-if-above bordered>
      <q-scroll-area class="fit">
        <q-list class="q-pa-md">
          <q-item clickable v-ripple @click="$router.push('/products')">
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

    <!-- Page Content -->
    <q-page-container>
      <q-page class="q-pa-md bg-grey-1">
        <h1 class="text-h4 text-primary text-weight-bold q-mb-none">Your Cart</h1>
        <div class="q-mb-xl">
          <h2 class="text-h5 q-mb-md">Cart Items ({{ cartStore.totalItems }})</h2>

          <q-card flat bordered v-if="cartStore.isEmpty" class="q-pa-md">
            <div class="text-grey-7 text-center">No items in cart.</div>
          </q-card>

          <q-card flat bordered v-else>
            <q-list bordered separator>
              <q-item v-for="(item) in items" :key="item.id">
                <q-item-section avatar>
                  <q-avatar square size="40px">
                    <img :src="item.image_url" :alt="item.name" @error="handleImageError" />
                  </q-avatar>
                </q-item-section>
                <q-item-section>
                  <q-item-label>{{ item.name }}</q-item-label>
                  <q-item-label caption>{{ item.description }}</q-item-label>
                </q-item-section>
                <q-item-section>
                  <div class="row items-center q-gutter-sm">
                    <q-btn flat dense round icon="remove" color="negative"
                      @click="cartStore.decreaseQuantity(item.id)" />
                    <span>{{ item.quantity }}</span>
                    <q-btn flat dense round icon="add" color="primary" @click="cartStore.increaseQuantity(item.id)"
                      :disable="item.quantity >= item.stock_quantity" />
                  </div>
                </q-item-section>
                <q-item-section class="text-primary">
                  ${{ (item.price * item.quantity).toFixed(2) }}
                </q-item-section>
                <q-item-section side>
                  <q-btn flat dense icon="delete" color="negative" @click="cartStore.removeFromCart(item.id)" />
                </q-item-section>
              </q-item>
            </q-list>

            <q-card-section class="text-right">
              <div class="text-subtitle1 text-weight-bold text-primary">
                Total: ${{ cartStore.formattedTotalPrice }}
              </div>
              <q-btn color="primary" rounded label="Checkout" class="q-mt-md" @click="checkout"
                :disable="cartStore.isEmpty" />
              <q-btn color="negative" rounded label="Clear Cart" class="q-mt-md q-ml-md" @click="cartStore.clearCart"
                :disable="cartStore.isEmpty" />
            </q-card-section>
          </q-card>
        </div>

        <!-- Receipt Modal -->
        <q-dialog v-model="showReceiptModal" persistent>
          <q-card style="min-width: 500px">
            <q-card-section class="row items-center q-pb-none">
              <div class="text-h6">Receipt</div>
              <q-space />
              <q-btn icon="close" flat round dense v-close-popup />
            </q-card-section>

            <q-card-section>
              <div ref="receiptContent" class="receipt-wrapper">
                <div class="receipt-inner">
                  <!-- Logo -->
                  <!-- Text-based Logo -->
                  <div class="receipt-header">
                    <div class="receipt-title">E-SHOP</div>
                  </div>


                  <!-- Title -->
                  <h6 class="q-mt-none q-mb-sm">Order Receipt</h6>
                  <div class="text-subtitle2 q-mb-md">
                    Order Date: {{ new Date().toLocaleString() }}
                  </div>

                  <!-- Table -->
                  <table class="receipt-table">
                    <thead>
                      <tr>
                        <th>S/N</th>
                        <th>Item</th>
                        <th>Qty</th>
                        <th>Amount ($)</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="(item, index) in items" :key="item.id">
                        <td>{{ index + 1 }}</td>
                        <td>{{ item.name }}</td>
                        <td>{{ item.quantity }}</td>
                        <td>{{ (item.price * item.quantity).toFixed(2) }}</td>
                      </tr>
                    </tbody>
                  </table>

                  <!-- Total -->
                  <div class="text-right text-weight-bold q-mt-md">
                    Total: ${{ cartStore.formattedTotalPrice }}
                  </div>

                  <!-- Thank you note -->
                  <div class="text-center q-mt-lg text-grey-8">
                    Thank you for shopping with E-Shop!
                  </div>
                </div>
              </div>
            </q-card-section>
            <q-card-actions class="justify-center q-mb-md">
              <q-btn color="primary" label="Download Receipt" @click="downloadReceipt" />
            </q-card-actions>
          </q-card>
        </q-dialog>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { api } from 'boot/axios'
import { useRouter } from 'vue-router';
import { useQuasar } from 'quasar';
import { useCartStore } from '../stores/cart';
import { useAuthStore } from '../stores/auth';
import html2pdf from 'html2pdf.js';

const $q = useQuasar();
const router = useRouter();
const cartStore = useCartStore();
const authStore = useAuthStore();
authStore.initializeAuth()

type CartItem = {
  id: number;
  name: string;
  description: string;
  image_url: string;
  price: number;
  quantity: number;
  stock_quantity: number;
};

const items = computed<CartItem[]>(() => cartStore.items);


const showReceiptModal = ref(false);
const receiptContent = ref<HTMLElement | null>(null);

const toggleLeftDrawer = () => {
  cartStore.toggleDrawer();
};

const checkout = () => {
  console.log('[Checkout] Opening receipt modal...');
  showReceiptModal.value = true;
};

const downloadReceipt = async () => {
  if (!receiptContent.value) {
    console.warn('[DownloadReceipt] receiptContent is null');
    return;
  }

  let token = localStorage.getItem('token');
  if (!token) {
    const authToken = authStore.token;
    if (authToken) {
      token = authToken;
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      $q.notify({ type: 'negative', message: 'No auth token found.', position: 'top-right' });
      return;
    }
  }

  const orderItems = cartStore.items.map((item: CartItem) => ({
    productId: item.id,
    quantity: item.quantity,
    price: Number(item.price),
  }));

  try {
    await api.post(
      '/orders',
      { items: orderItems },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    await html2pdf()
      .set({ filename: `receipt_${Date.now()}.pdf` })
      .from(receiptContent.value)
      .save();

    cartStore.clearCart();
    showReceiptModal.value = false;

    $q.notify({
      type: 'positive',
      message: 'Order placed and receipt downloaded!',
      position: 'top-right',
    });
  } catch (error) {
    console.error('[Order Error]', error);
    $q.notify({
      type: 'negative',
      message: 'Failed to place order. Try again.',
      position: 'top-right',
    });
  }
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
  console.warn('[ImageError] Failed to load image:', target.src);
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

.q-card {
  border: 1px solid rgba(0, 0, 0, 0.05);
  border-radius: 12px;
  overflow: hidden;
  background: #ffffff;
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

.receipt-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 12px;
  font-size: 14px;
}

.receipt-table th,
.receipt-table td {
  border: 1px solid #ccc;
  padding: 8px;
  text-align: left;
}

.receipt-title {
  text-align: center;
  font-size: 24px;
  font-weight: bold;
  color: #3b82f6;
  /* Quasar primary blue */
  margin-bottom: 12px;
  letter-spacing: 1px;
}

.receipt-inner {
  padding: 24px 32px;
  background-color: #fff;
  font-family: Arial, sans-serif;
  font-size: 14px;
  color: #333;
  border: 1px solid #ddd;
  border-radius: 8px;
}


.receipt-table th {
  background-color: #f0f0f0;
  font-weight: bold;
}
</style>
