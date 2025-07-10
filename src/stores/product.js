// src/stores/product.js
import { defineStore } from 'pinia';
import { api } from 'boot/axios';

/**
 * @typedef {Object} Product
 * @property {number} id
 * @property {string} name
 * @property {string} description
 * @property {number} price
 * @property {number} stock_quantity
 * @property {string} [image_url]
 * @property {string} category
 */

/**
 * @typedef {Object} ProductState
 * @property {Product[]} products
 * @property {Product|null} currentProduct
 * @property {string[]} categories
 * @property {boolean} isLoading
 * @property {string|null} error
 * @property {string} searchQuery
 * @property {string} selectedCategory
 * @property {number} currentPage
 * @property {number} totalPages
 * @property {number} itemsPerPage
 */

export const useProductStore = defineStore('products', {
  /** @type {() => ProductState} */
  state: () => ({
    products: [],
    currentProduct: null,
    categories: [],
    isLoading: false,
    error: null,
    searchQuery: '',
    selectedCategory: 'all',
    currentPage: 1,
    totalPages: 1,
    itemsPerPage: 12,
  }),

  getters: {
    /**
     * @returns {Product[]}
     */
    filteredProducts: (state) => {
      let filtered = state.products;

      if (state.searchQuery) {
        const query = state.searchQuery.toLowerCase();
        filtered = filtered.filter(
          (product) =>
            product.name.toLowerCase().includes(query) ||
            product.description.toLowerCase().includes(query)
        );
      }

      if (state.selectedCategory !== 'all') {
        filtered = filtered.filter(
          (product) => product.category === state.selectedCategory
        );
      }

      return filtered;
    },

    /**
     * @returns {Product[]}
     */
    availableProducts: (state) => {
      return state.products.filter((product) => product.stock_quantity > 0);
    },

    /**
     * @returns {string[]}
     */
    productCategories: (state) => {
      const categories = [...new Set(state.products.map((p) => p.category))];
      return categories.filter(Boolean);
    },
  },

  actions: {
    /**
     * @param {number} [page=1]
     * @param {number} [limit=10]
     * @param {string} [search='']
     * @param {string} [category='']
     * @returns {Promise<{ success: boolean, error?: string }>}
     */
    async fetchProducts(page = 1, limit = 10, search = '', category = '') {
      this.isLoading = true;
      this.error = null;

      try {
        const response = await api.get('/products', {
          params: { page, limit, search, category },
        });

        /** @type {{ products: Product[], currentPage: number, totalPages: number }} */
        const data = response.data;

        if (page === 1) {
          this.products = data.products;
        } else {
          this.products.push(...data.products);
        }

        this.currentPage = data.currentPage;
        this.totalPages = data.totalPages;
        this.categories = this.productCategories;

        return { success: true };
      } catch (error) {
        this.error = error.response?.data?.message || 'Failed to fetch products';
        return { success: false, error: this.error };
      } finally {
        this.isLoading = false;
      }
    },

    /**
     * @param {number} productId
     * @returns {Promise<{ success: boolean, error?: string }>}
     */
    async fetchProduct(productId) {
      this.isLoading = true;
      this.error = null;

      try {
        const response = await api.get(`/products/${productId}`);
        this.currentProduct = response.data;
        return { success: true };
      } catch (error) {
        this.error = error.response?.data?.message || 'Failed to fetch product';
        return { success: false, error: this.error };
      } finally {
        this.isLoading = false;
      }
    },

    /**
     * @param {string} query
     * @returns {Promise<{ success: boolean, error?: string }>}
     */
    async searchProducts(query) {
      this.isLoading = true;
      this.error = null;

      try {
        const response = await api.get('/products/search', {
          params: { q: query },
        });
        this.products = response.data;
        this.categories = this.productCategories;
        return { success: true };
      } catch (error) {
        this.error = error.response?.data?.message || 'Search failed';
        return { success: false, error: this.error };
      } finally {
        this.isLoading = false;
      }
    },

    /** @param {string} query */
    setSearchQuery(query) {
      this.searchQuery = query;
    },

    /** @param {string} category */
    setSelectedCategory(category) {
      this.selectedCategory = category;
    },

    clearCurrentProduct() {
      this.currentProduct = null;
    },

    /**
     * @param {Object} productData
     * @returns {Promise<{ success: boolean, message?: string, error?: string }>}
     */
    async createProduct(productData) {
      this.isLoading = true;
      this.error = null;

      try {
        const response = await api.post('/admin/products', productData);
        this.products.unshift(response.data);
        return { success: true, message: 'Product created successfully' };
      } catch (error) {
        this.error = error.response?.data?.message || 'Failed to create product';
        return { success: false, error: this.error };
      } finally {
        this.isLoading = false;
      }
    },

    /**
     * @param {number} productId
     * @param {Object} productData
     * @returns {Promise<{ success: boolean, message?: string, error?: string }>}
     */
    async updateProduct(productId, productData) {
      this.isLoading = true;
      this.error = null;

      try {
        const response = await api.put(`/admin/products/${productId}`, productData);
        const index = this.products.findIndex((p) => p.id === productId);
        if (index !== -1) {
          this.products[index] = response.data;
        }
        return { success: true, message: 'Product updated successfully' };
      } catch (error) {
        this.error = error.response?.data?.message || 'Failed to update product';
        return { success: false, error: this.error };
      } finally {
        this.isLoading = false;
      }
    },

    /**
     * @param {number} productId
     * @returns {Promise<{ success: boolean, message?: string, error?: string }>}
     */
    async deleteProduct(productId) {
      this.isLoading = true;
      this.error = null;

      try {
        await api.delete(`/admin/products/${productId}`);
        this.products = this.products.filter((p) => p.id !== productId);
        return { success: true, message: 'Product deleted successfully' };
      } catch (error) {
        this.error = error.response?.data?.message || 'Failed to delete product';
        return { success: false, error: this.error };
      } finally {
        this.isLoading = false;
      }
    },
  },
});
