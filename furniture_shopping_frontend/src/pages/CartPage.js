import Blits from '@lightningjs/blits'
import Header from '../components/Header'
import CartView from '../components/CartView'
import FloatingCartButton from '../components/FloatingCartButton'
import CheckoutModal from '../components/CheckoutModal'
import { AppStore } from '../store'

/**
 * PUBLIC_INTERFACE
 * Cart page layout with checkout modal visibility driven by store.
 */
export default Blits.Component('CartPage', {
  components: { Header, CartView, FloatingCartButton, CheckoutModal },
  template: `
    <Element :w="$w" :h="$h" :color="0xf9fafbff">
      <Header :title="$title" />
      <Element :x="$contentX" :y="$contentY" :w="$contentW" :h="$contentH" :color="0x00000000">
        <CartView />
      </Element>
      <FloatingCartButton />
      <CheckoutModal :alpha="$checkoutAlpha" />
    </Element>
  `,
  state() {
    return {
      title: 'Your Cart',
      contentX: 32,
      contentY: 132,
      contentW: 0,
      contentH: 0,
      checkoutAlpha: 0
    }
  },
  watchers: {
    w(n) { if (typeof n === 'number') this.contentW = n - 64 },
    h(n) { if (typeof n === 'number') this.contentH = n - 164 },
  },
  subscriptions() {
    return [
      AppStore.subscribe(() => {
        this.checkoutAlpha = AppStore.state.checkoutOpen ? 1 : 0
      })
    ]
  },
  onInit() {
    this.$watchers.w && this.$watchers.w.call(this, this.$w)
    this.$watchers.h && this.$watchers.h.call(this, this.$h)
  }
})
