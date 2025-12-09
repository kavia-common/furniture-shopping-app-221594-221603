import Blits from '@lightningjs/blits'
import theme from '../theme'
import { AppStore } from '../store'

export default Blits.Component('CheckoutModal', {
  state() {
    return {
      // colors and constants
      dimBg: 0x00000088,
      surface: theme.colors.surface,
      textColor: theme.colors.text,
      muted: theme.colors.textMuted,
      bg: theme.colors.background,
      primary: theme.colors.primary,
      secondary: theme.colors.secondary,
      error: theme.colors.error,

      // modal size and computed center positions (computed via watchers on w/h)
      modalW: 900,
      modalH: 600,
      modalX: 0,
      modalY: 0,

      // static positions
      pad: 24,
      inset: 10,
      // derived positions to avoid arithmetic in template
      nameValX: 34,
      emailValX: 34,
      addressValX: 34,

      // form model
      name: 'Alex Doe',
      email: 'alex@example.com',
      address: '123 Ocean Drive\nSeaside City',

      // summary
      total: 0,
      count: 0,
      itemsText: 'Items: 0',
      totalText: 'Total: $0',

      // focus
      focus: 'none'
    }
  },
  watchers: {
    // center modal when width/height change
    w(newW) {
      if (typeof newW === 'number') this.modalX = Math.floor((newW - this.modalW) / 2)
    },
    h(newH) {
      if (typeof newH === 'number') this.modalY = Math.floor((newH - this.modalH) / 2)
    },
    total(newTotal) {
      const t = (newTotal != null && !Number.isNaN(Number(newTotal))) ? Number(newTotal) : 0
      this.totalText = 'Total: $' + t
    },
    count(newCount) {
      const c = (newCount != null && !Number.isNaN(Number(newCount))) ? Number(newCount) : 0
      this.itemsText = 'Items: ' + c
    }
  },
  template: `
    <Element :w="$w" :h="$h" :color="$dimBg">
      <Element :x="$modalX" :y="$modalY" :w="$modalW" :h="$modalH" :color="$surface">
        <Text :x="$pad" y="20" :content="'Checkout'" size="40" :color="$textColor" />

        <Text :x="$pad" y="90" :content="'Name'" size="26" :color="$muted" />
        <Element :x="$pad" y="120" w="560" h="56" :color="$bg" @enter="$focusName" />
        <Text :x="$nameValX" y="130" :content="$name" size="26" :color="$textColor" />

        <Text :x="$pad" y="190" :content="'Email'" size="26" :color="$muted" />
        <Element :x="$pad" y="220" w="560" h="56" :color="$bg" @enter="$focusEmail" />
        <Text :x="$emailValX" y="230" :content="$email" size="26" :color="$textColor" />

        <Text :x="$pad" y="290" :content="'Address'" size="26" :color="$muted" />
        <Element :x="$pad" y="320" w="560" h="120" :color="$bg" @enter="$focusAddress" />
        <Text :x="$addressValX" y="330" :content="$address" size="26" :color="$textColor" />

        <Text x="620" y="120" :content="$itemsText" size="26" :color="$textColor" />
        <Text x="620" y="160" :content="$totalText" size="30" :color="$primary" />

        <Element :x="$pad" y="470" w="240" h="64" :color="$error" @enter="$close">
          <Text x="20" y="16" :content="'Cancel'" size="28" :color="$surface" />
        </Element>
        <Element x="300" y="470" w="280" h="64" :color="$secondary" @enter="$place">
          <Text x="20" y="16" :content="'Place Order'" size="28" :color="$surface" />
        </Element>
      </Element>
    </Element>
  `,
  subscriptions() {
    return [
      AppStore.subscribe(() => {
        this.total = AppStore.cartSubtotal
        this.count = AppStore.cartCount
      })
    ]
  },
  methods: {
    focusName() { this.focus = 'name' },
    focusEmail() { this.focus = 'email' },
    focusAddress() { this.focus = 'address' },
    // PUBLIC_INTERFACE
    close() { AppStore.closeCheckout() },
    // PUBLIC_INTERFACE
    async place() {
      if (!this.name || !this.email || !this.address) return
      await AppStore.placeOrder({ name: this.name, email: this.email, address: this.address })
    }
  },
  onInit() {
    // Initialize computed fields based on initial w/h and summary values
    this.$watchers.w && this.$watchers.w.call(this, this.$w)
    this.$watchers.h && this.$watchers.h.call(this, this.$h)
    this.$watchers.total.call(this, this.total)
    this.$watchers.count.call(this, this.count)

    // derived positions (no arithmetic in template)
    this.nameValX = this.pad + this.inset
    this.emailValX = this.pad + this.inset
    this.addressValX = this.pad + this.inset
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
