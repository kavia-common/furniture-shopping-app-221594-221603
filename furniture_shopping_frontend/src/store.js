import Blits from '@lightningjs/blits'
import { getApiBase, shouldUseMock } from './config'
import { mockProducts } from './data/mockData'

/**
 * PUBLIC_INTERFACE
 * Global store for the app: products, selection, cart, UI flags.
 */
export const AppStore = Blits.Store({
  state() {
    return {
      loading: false,
      error: null,
      products: [],
      selectedProduct: null,
      cart: [], // [{id, name, price, image, qty}]
      checkoutOpen: false,
      orderPlaced: null,
    }
  },
  getters: {
    cartCount(state) {
      return state.cart.reduce((sum, i) => sum + i.qty, 0)
    },
    cartSubtotal(state) {
      return state.cart.reduce((sum, i) => sum + i.qty * i.price, 0)
    },
  },
  actions: {
    async loadProducts() {
      this.loading = true
      this.error = null
      try {
        if (shouldUseMock()) {
          // simulate network
          await new Promise(r => setTimeout(r, 300))
          this.products = mockProducts
        } else {
          const base = getApiBase()
          const res = await fetch(`${base}/products`, { headers: { 'accept': 'application/json' } })
          if (!res.ok) throw new Error(`Failed to fetch products: ${res.status}`)
          const data = await res.json()
          // Expect array shape: {id, name, price, image, description}
          this.products = Array.isArray(data) ? data : []
        }
      } catch (e) {
        this.error = e?.message || 'Unknown error'
        // fallback to mock
        if (!this.products || this.products.length === 0) {
          this.products = mockProducts
        }
      } finally {
        this.loading = false
      }
    },
    setSelectedProductById(id) {
      this.selectedProduct = this.products.find(p => p.id === id) || null
    },
    addToCart(product, qty = 1) {
      const existing = this.cart.find(i => i.id === product.id)
      if (existing) {
        existing.qty += qty
      } else {
        this.cart.push({
          id: product.id,
          name: product.name,
          price: product.price,
          image: product.image,
          qty,
        })
      }
    },
    removeFromCart(id) {
      this.cart = this.cart.filter(i => i.id !== id)
    },
    updateQty(id, qty) {
      const item = this.cart.find(i => i.id === id)
      if (item) {
        item.qty = Math.max(1, qty)
      }
    },
    clearCart() {
      this.cart = []
    },
    openCheckout() {
      this.checkoutOpen = true
    },
    closeCheckout() {
      this.checkoutOpen = false
    },
    // Mock place order
    async placeOrder({ name, email, address }) {
      this.loading = true
      await new Promise(r => setTimeout(r, 500))
      this.orderPlaced = {
        id: `ORD-${Date.now()}`,
        name, email, address,
        total: this.cart.reduce((s, i) => s + i.qty * i.price, 0),
        items: this.cart.map(i => ({ id: i.id, name: i.name, qty: i.qty, price: i.price })),
      }
      this.clearCart()
      this.checkoutOpen = false
      this.loading = false
    },
  }
})
