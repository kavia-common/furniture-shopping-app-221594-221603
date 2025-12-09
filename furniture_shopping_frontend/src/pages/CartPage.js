import Blits from '@lightningjs/blits'
import Header from '../components/Header'
import CartView from '../components/CartView'
import FloatingCartButton from '../components/FloatingCartButton'
import CheckoutModal from '../components/CheckoutModal'
import { AppStore } from '../store'

export default Blits.Component('CartPage', {
  components: { Header, CartView, FloatingCartButton, CheckoutModal },
  template: `
    <Element :w="$w" :h="$h" :color="0xf9fafbff">
      <Header :title="'Your Cart'" />
      <Element x="32" :y="132" :w="$w - 64" :h="$h - 164" :color="0x00000000">
        <CartView />
      </Element>
      <FloatingCartButton />
      <CheckoutModal :alpha="$checkoutOpen ? 1 : 0" />
    </Element>
  `,
  state() {
    return {
      checkoutOpen: false
    }
  },
  subscriptions() {
    return [
      AppStore.subscribe(() => {
        this.checkoutOpen = AppStore.state.checkoutOpen
      })
    ]
  }
})
