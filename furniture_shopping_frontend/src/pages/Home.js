import Blits from '@lightningjs/blits'
import theme from '../theme'
import Header from '../components/Header'
import ProductCard from '../components/ProductCard'
import FloatingCartButton from '../components/FloatingCartButton'
import CheckoutModal from '../components/CheckoutModal'
import { AppStore } from '../store'

/**
 * PUBLIC_INTERFACE
 * Home page: shows a grid of ProductCard items with safe fallbacks.
 */
export default Blits.Component('Home', {
  components: { Header, ProductCard, FloatingCartButton, CheckoutModal },
  template: `
    <Element :w="$w" :h="$h" :color="0xf9fafbff">
      <Header :title="$headerTitle" />
      <Element :x="$contentX" :y="$contentY" :w="$contentW" :h="$contentH" :color="0x00000000">
        <Text :x="$loadingX" :y="$loadingY" :content="$loadingText" size="32" :color="$loadingColor" />
        <Text :x="$errorX" :y="$errorY" :content="$errorText" size="28" :color="$errorColor" />

        <Element :alpha="$emptyAlpha" :x="$emptyX" :y="$emptyY" :w="$emptyW" :h="$emptyH" :color="$emptyBg">
          <Text :x="$emptyTextX" :y="$emptyTextY" :content="$emptyText" size="30" :color="$emptyTextColor" />
        </Element>

        <Element :for="(item, index) in $layoutItems" :key="$item.id" :x="$item.x" :y="$item.y">
          <ProductCard :item="$item" />
        </Element>
      </Element>

      <FloatingCartButton />
      <CheckoutModal :alpha="$checkoutAlpha" />
    </Element>
  `,
  state() {
    return {
      // canvas
      w: 0,
      h: 0,
      // header
      headerTitle: 'Ocean Furniture',
      // content area (precomputed sizes)
      contentX: 32,
      contentY: 132,
      contentW: 0,
      contentH: 0,
      // messages
      loadingText: '',
      loadingX: 0, loadingY: 0,
      loadingColor: 0x111827ff,
      errorText: '',
      errorX: 0, errorY: 40,
      errorColor: 0xef4444ff,
      // empty placeholder
      emptyAlpha: 0,
      emptyText: 'No products available',
      emptyTextColor: 0x111827ff,
      emptyBg: 0xffffffff,
      emptyX: 0, emptyY: 90, emptyW: 600, emptyH: 100,
      emptyTextX: 20, emptyTextY: 30,
      // data
      layoutItems: [],
      // modal
      checkoutAlpha: 0
    }
  },
  watchers: {
    w(newW) {
      if (typeof newW === 'number') {
        this.contentW = newW - 64
      }
    },
    h(newH) {
      if (typeof newH === 'number') {
        this.contentH = newH - 164
      }
    }
  },
  subscriptions() {
    return [
      AppStore.subscribe(() => {
        const list = Array.isArray(AppStore.state.products) ? AppStore.state.products : []
        // grid layout calculations
        const colW = theme.sizes.productCardW + 30
        const rowH = theme.sizes.productCardH + 30
        const cols = 3
        const laid = list.map((p, i) => {
          const c = i % cols
          const r = Math.floor(i / cols)
          return {
            id: p.id,
            name: p.name,
            price: p.price,
            image: p.image,
            x: c * colW,
            y: 40 + r * rowH
          }
        })
        this.layoutItems = laid
        this.emptyAlpha = laid.length === 0 ? 1 : 0

        // loading / error display strings
        this.loadingText = AppStore.state.loading ? 'Loading products...' : ''
        const e = AppStore.state.error
        this.errorText = e ? ('Error: ' + String(e)) : ''

        // modal alpha
        this.checkoutAlpha = AppStore.state.checkoutOpen ? 1 : 0
      })
    ]
  },
  async onInit() {
    // initialize dimensions
    this.w = this.$w
    this.h = this.$h
    this.$watchers.w && this.$watchers.w.call(this, this.$w)
    this.$watchers.h && this.$watchers.h.call(this, this.$h)

    if (!AppStore.state.products || AppStore.state.products.length === 0) {
      await AppStore.loadProducts()
    } else {
      // ensure initial layout from current store content
      const list = Array.isArray(AppStore.state.products) ? AppStore.state.products : []
      const colW = theme.sizes.productCardW + 30
      const rowH = theme.sizes.productCardH + 30
      const cols = 3
      const laid = list.map((p, i) => {
        const c = i % cols
        const r = Math.floor(i / cols)
        return { id: p.id, name: p.name, price: p.price, image: p.image, x: c * colW, y: 40 + r * rowH }
      })
      this.layoutItems = laid
      this.emptyAlpha = laid.length === 0 ? 1 : 0
    }
  }
})
