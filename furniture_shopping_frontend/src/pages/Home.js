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
    <Element :w="\${w}" :h="\${h}" :color="0xf9fafbff">
      <Header :title="\${headerTitle}" />
      <Element :x="\${contentX}" :y="\${contentY}" :w="\${contentW}" :h="\${contentH}" :color="0x00000000">
        <Text :x="\${loadingX}" :y="\${loadingY}" :content="\${loadingText}" size="32" :color="\${loadingColor}" />
        <Text :x="\${errorX}" :y="\${errorY}" :content="\${errorText}" size="28" :color="\${errorColor}" />
        <Element :alpha="\${emptyAlpha}" :x="\${emptyX}" :y="\${emptyY}" :w="\${emptyW}" :h="\${emptyH}" :color="\${emptyBg}">
          <Text :x="\${emptyTextX}" :y="\${emptyTextY}" :content="\${emptyText}" size="30" :color="\${emptyTextColor}" />
        </Element>

        <Element :for="(it, index) in \${layoutItems}" :x="\${it.x}" :y="\${it.y}">
          <ProductCard :item="\${it}" />
        </Element>
      </Element>

      <FloatingCartButton />
      <CheckoutModal :alpha="\${checkoutAlpha}" />
    </Element>
  `,
  state() {
    return {
      // ui tokens
      w: 0,
      h: 0,
      headerTitle: 'Ocean Furniture',
      contentX: 32,
      contentY: 132,
      contentPadW: 64,
      contentPadH: 164,
      contentW: 0,
      contentH: 0,

      // loading/error/empty precomputed strings and positions
      loadingText: '',
      loadingX: 0, loadingY: 0,
      loadingColor: 0x111827ff,

      errorText: '',
      errorX: 0, errorY: 40,
      errorColor: 0xef4444ff,

      emptyAlpha: 0,
      emptyText: 'No products available',
      emptyTextColor: 0x111827ff,
      emptyBg: 0xffffffff,
      emptyX: 0, emptyY: 90, emptyW: 600, emptyH: 100,
      emptyTextX: 20, emptyTextY: 30,

      // data
      products: [],
      layoutItems: [],

      // modal flag -> precomputed alpha for template
      checkoutOpen: false,
      checkoutAlpha: 0
    }
  },
  watchers: {
    // adjust content dimensions when app size is known
    w(newW) {
      if (typeof newW === 'number') {
        this.contentW = newW - this.contentPadW
      }
    },
    h(newH) {
      if (typeof newH === 'number') {
        this.contentH = newH - this.contentPadH
      }
    },
    // reflect loading and error from store by computing strings (no ternaries in template)
    products(newVal) {
      const colW = theme.sizes.productCardW + 30
      const rowH = theme.sizes.productCardH + 30
      const cols = 3
      const list = Array.isArray(newVal) ? newVal : []
      const laid = list.map((p, i) => {
        const col = i % cols
        const row = Math.floor(i / cols)
        return { id: p.id, name: p.name, price: p.price, image: p.image, x: col * colW, y: 40 + row * rowH }
      })
      this.layoutItems = laid
      this.emptyAlpha = (list.length === 0) ? 1 : 0
    },
    // compute modal alpha
    checkoutOpen(isOpen) {
      this.checkoutAlpha = isOpen ? 1 : 0
    }
  },
  subscriptions() {
    return [
      AppStore.subscribe(() => {
        // Update data
        this.products = AppStore.state.products

        // Loading text
        if (AppStore.state.loading) {
          this.loadingText = 'Loading products...'
          this.loadingX = 0
          this.loadingY = 0
        } else {
          this.loadingText = ''
        }

        // Error text
        const e = AppStore.state.error
        this.errorText = e ? ('Error: ' + String(e)) : ''

        // Checkout state
        this.checkoutOpen = AppStore.state.checkoutOpen ? 1 : 0
      })
    ]
  },
  async onInit() {
    // initialize dimensions based on initial w/h
    this.w = this.$w
    this.h = this.$h
    this.$watchers.w && this.$watchers.w.call(this, this.$w)
    this.$watchers.h && this.$watchers.h.call(this, this.$h)

    if (!AppStore.state.products || AppStore.state.products.length === 0) {
      await AppStore.loadProducts()
    } else {
      this.products = AppStore.state.products
    }
  }
})
