import Blits from '@lightningjs/blits'
import theme from '../theme'
import { AppStore } from '../store'

export default Blits.Component('CartView', {
  template: `
    <Element :w="$w" :h="$h" :color="0x00000000">
      <Text x="${theme.spacing.lg}" y="${theme.spacing.lg}" :content="'Your Cart'" size="42" :color="${theme.colors.text}" />
      <Element x="${theme.spacing.lg}" y="100" :w="$w - 2*${theme.spacing.lg}" :h="$h - 260" :color="${theme.colors.surface}">
        <!-- Items List -->
        <Element x="20" y="20" :for="(item, idx) in $items" :key="$item.id" :y="$index * 100 + 0" w="1400" h="90" :color="0x00000000">
          <Element x="0" y="0" w="90" h="90" :color="${theme.colors.background}">
            <Element :src="$item.image" w="90" h="90" />
          </Element>
          <Text x="110" y="10" :content="$item.name" size="28" :color="${theme.colors.text}" />
          <Text x="110" y="52" :content="'$' + $item.price" size="24" :color="${theme.colors.primary}" />

          <Text x="520" y="28" :content="'Qty: ' + $item.qty" size="26" :color="${theme.colors.text}" />
          <Element x="640" y="20" w="46" h="46" :color="${theme.colors.background}" @enter="$incQty($item.id)">
            <Text x="12" y="8" :content="'+'" size="30" :color="${theme.colors.text}" />
          </Element>
          <Element x="700" y="20" w="46" h="46" :color="${theme.colors.background}" @enter="$decQty($item.id)">
            <Text x="12" y="8" :content="'-'" size="30" :color="${theme.colors.text}" />
          </Element>

          <Element x="800" y="20" w="160" h="46" :color="${theme.colors.error}" @enter="$remove($item.id)">
            <Text x="18" y="8" :content="'Remove'" size="26" :color="${theme.colors.surface}" />
          </Element>
        </Element>
      </Element>

      <!-- Summary -->
      <Element :x="$w - 520" y="100" w="480" :h="$h - 260" :color="${theme.colors.surface}">
        <Text x="20" y="20" :content="'Order Summary'" size="30" :color="${theme.colors.text}" />
        <Text x="20" y="70" :content="'Subtotal: $' + $subtotal" size="28" :color="${theme.colors.primary}" />
        <Element x="20" y="120" w="440" h="60" :color="${theme.colors.secondary}" @enter="$checkout">
          <Text x="20" y="14" :content="'Proceed to Checkout'" size="28" :color="${theme.colors.surface}" />
        </Element>
      </Element>
    </Element>
  `,
  state() {
    return {
      items: [],
      subtotal: 0,
    }
  },
  subscriptions() {
    return [
      AppStore.subscribe(() => {
        this.items = AppStore.state.cart
        this.subtotal = AppStore.cartSubtotal
      })
    ]
  },
  methods: {
    // PUBLIC_INTERFACE
    incQty(id) {
      const item = AppStore.state.cart.find(i => i.id === id)
      AppStore.updateQty(id, (item?.qty || 1) + 1)
    },
    // PUBLIC_INTERFACE
    decQty(id) {
      const item = AppStore.state.cart.find(i => i.id === id)
      if (!item) return
      const next = Math.max(1, item.qty - 1)
      AppStore.updateQty(id, next)
    },
    // PUBLIC_INTERFACE
    remove(id) {
      AppStore.removeFromCart(id)
    },
    // PUBLIC_INTERFACE
    checkout() {
      if (AppStore.state.cart.length === 0) return
      AppStore.openCheckout()
    }
  }
})
