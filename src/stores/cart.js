// stores/cart.js
import { defineStore } from 'pinia'

export const useCartStore = defineStore('cart', {
  state: () => ({
    items: JSON.parse(localStorage.getItem('cart') || '[]'),
    isDrawerOpen: false
  }),

  getters: {
    totalItems: (state) => {
      return state.items.reduce((total, item) => total + item.quantity, 0)
    },

    totalPrice: (state) => {
      return state.items.reduce((total, item) => total + (item.price * item.quantity), 0)
    },

    formattedTotalPrice: (state) => {
      const total = state.items.reduce((total, item) => total + (item.price * item.quantity), 0)
      return total.toFixed(2)
    },

    isEmpty: (state) => state.items.length === 0,

    getItemQuantity: (state) => (productId) => {
      const item = state.items.find(item => item.id === productId)
      return item ? item.quantity : 0
    }
  },

  actions: {
    addToCart(product, quantity = 1) {
      const existingItem = this.items.find(item => item.id === product.id)

      if (existingItem) {
        existingItem.quantity += quantity
      } else {
        this.items.push({
          id: product.id,
          name: product.name,
          price: product.price,
          image_url: product.image_url,
          stock_quantity: product.stock_quantity,
          quantity: quantity
        })
      }

      this.saveToLocalStorage()
    },

    removeFromCart(productId) {
      this.items = this.items.filter(item => item.id !== productId)
      this.saveToLocalStorage()
    },

    updateQuantity(productId, quantity) {
      const item = this.items.find(item => item.id === productId)

      if (item) {
        if (quantity <= 0) {
          this.removeFromCart(productId)
        } else {
          item.quantity = Math.min(quantity, item.stock_quantity)
        }
        this.saveToLocalStorage()
      }
    },

    increaseQuantity(productId) {
      const item = this.items.find(item => item.id === productId)
      if (item && item.quantity < item.stock_quantity) {
        item.quantity++
        this.saveToLocalStorage()
      }
    },

    decreaseQuantity(productId) {
      const item = this.items.find(item => item.id === productId)
      if (item) {
        if (item.quantity > 1) {
          item.quantity--
        } else {
          this.removeFromCart(productId)
        }
        this.saveToLocalStorage()
      }
    },

    clearCart() {
      this.items = []
      this.saveToLocalStorage()
    },

    saveToLocalStorage() {
      localStorage.setItem('cart', JSON.stringify(this.items))
    },

    loadFromLocalStorage() {
      const saved = localStorage.getItem('cart')
      if (saved) {
        this.items = JSON.parse(saved)
      }
    },

    toggleDrawer() {
      this.isDrawerOpen = !this.isDrawerOpen
    },

    openDrawer() {
      this.isDrawerOpen = true
    },

    closeDrawer() {
      this.isDrawerOpen = false
    },

    // Validate cart items against current stock
    async validateCart() {
      // This would typically make an API call to validate stock
      // For now, we'll just filter out items with 0 stock
      this.items = this.items.filter(item => item.stock_quantity > 0)

      // Update quantities if they exceed stock
      this.items.forEach(item => {
        if (item.quantity > item.stock_quantity) {
          item.quantity = item.stock_quantity
        }
      })

      this.saveToLocalStorage()
    }
  }
})
