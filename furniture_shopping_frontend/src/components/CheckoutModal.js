import Blits from '@lightningjs/blits'
import theme from '../theme'
import { AppStore } from '../store'

export default Blits.Component('CheckoutModal', {
  template: `
    <Element :w="$w" :h="$h" :color="0x00000088">
      <Element :x="($w - 900)/2" :y="($h - 600)/2" w="900" h="600" :color="${theme.colors.surface}">
        <Text x="24" y="20" :content="'Checkout'" size="40" :color="${theme.colors.text}" />

        <!-- Form -->
        <Text x="24" y="90" :content="'Name'" size="26" :color="${theme.colors.textMuted}" />
        <Element x="24" y="120" w="560" h="56" :color="${theme.colors.background}" @enter="$focusField('name')" />
        <Text x="34" y="130" :content="$name" size="26" :color="${theme.colors.text}" />

        <Text x="24" y="190" :content="'Email'" size="26" :color="${theme.colors.textMuted}" />
        <Element x="24" y="220" w="560" h="56" :color="${theme.colors.background}" @enter="$focusField('email')" />
        <Text x="34" y="230" :content="$email" size="26" :color="${theme.colors.text}" />

        <Text x="24" y="290" :content="'Address'" size="26" :color="${theme.colors.textMuted}" />
        <Element x="24" y="320" w="560" h="120" :color="${theme.colors.background}" @enter="$focusField('address')" />
        <Text x="34" y="330" :content="$address" size="26" :color="${theme.colors.text}" />

        <!-- Summary -->
        <Text x="620" y="120" :content="'Items: ' + $count" size="26" :color="${theme.colors.text}" />
        <Text x="620" y="160" :content="'Total: $' + $total" size="30" :color="${theme.colors.primary}" />

        <Element x="24" y="470" w="240" h="64" :color="${theme.colors.error}" @enter="$close">
          <Text x="20" y="16" :content="'Cancel'" size="28" :color="${theme.colors.surface}" />
        </Element>
        <Element x="300" y="470" w="280" h="64" :color="${theme.colors.secondary}" @enter="$place">
          <Text x="20" y="16" :content="'Place Order'" size="28" :color="${theme.colors.surface}" />
        </Element>
      </Element>
    </Element>
  `,
  state() {
    return {
      name: 'Alex Doe',
      email: 'alex@example.com',
      address: '123 Ocean Drive\nSeaside City',
      total: 0,
      count: 0,
      focus: 'none'
    }
  },
  subscriptions() {
    return [
      AppStore.subscribe(() => {
        this.total = AppStore.cartSubtotal
        this.count = AppStore.cartCount
      })
    ]
  },
  methods: {
    // In a real TV app, text input is via IME. Here, mock updates via d-pad for demo.
    focusField(field) { this.focus = field },
    // PUBLIC_INTERFACE
    close() { AppStore.closeCheckout() },
    // PUBLIC_INTERFACE
    async place() {
      if (!this.name || !this.email || !this.address) return
      await AppStore.placeOrder({ name: this.name, email: this.email, address: this.address })
    }
  },
  input: {
    up() {},
    down() {},
    left() {},
    right() {},
    enter() {
      // no-op, handled per element
    },
    back() { AppStore.closeCheckout() }
  }
})
