import Blits from '@lightningjs/blits'
import theme from '../theme'
import Header from '../components/Header'
import ProductCard from '../components/ProductCard'
import FloatingCartButton from '../components/FloatingCartButton'
import CheckoutModal from '../components/CheckoutModal'
import { AppStore } from '../store'

export default Blits.Component('Home', {
  components: { Header, ProductCard, FloatingCartButton, CheckoutModal },
  template: `
    <Element :w="$w" :h="$h" :color="0xf9fafbff">
      <Header :title="'Ocean Furniture'" />
      <Element x="32" :y="132" :w="$w - 64" :h="$h - 164" :color="0x00000000">
        <Text x="0" y="0" :content="$loading ? 'Loading...' : ''" size="32" :color="0x111827ff" />
        <Text x="0" y="0" :content="$error ? ('Error: ' + $error) : ''" size="28" :color="0xef4444ff" />

        <Element :for="(it, index) in $layoutItems" :key="$item.id" :x="$it.x" :y="$it.y">
          <ProductCard :item="$it" />
        </Element>
      </Element>

      <FloatingCartButton />
      <CheckoutModal :alpha="$checkoutOpen ? 1 : 0" />
    </Element>
  `,
  state() {
    return {
      loading: false,
      error: null,
      products: [],
      layoutItems: [],
      checkoutOpen: false
    }
  },
  watchers: {
    products(newVal) {
      const colW = theme.sizes.productCardW + 30
      const rowH = theme.sizes.productCardH + 30
      const cols = 3
      const laid = newVal.map((p, i) => {
        const col = i % cols
        const row = Math.floor(i / cols)
        return { ...p, x: col * colW, y: 40 + row * rowH }
      })
      this.layoutItems = laid
    }
  },
  subscriptions() {
    return [
      AppStore.subscribe(() => {
        this.loading = AppStore.state.loading
        this.error = AppStore.state.error
        this.products = AppStore.state.products
        this.checkoutOpen = AppStore.state.checkoutOpen
      })
    ]
  },
  async onInit() {
    if (!AppStore.state.products || AppStore.state.products.length === 0) {
      await AppStore.loadProducts()
    } else {
      this.products = AppStore.state.products
    }
  }
})
