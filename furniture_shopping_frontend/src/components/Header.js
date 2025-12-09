import Blits from '@lightningjs/blits'
import theme from '../theme'

export default Blits.Component('Header', {
  props: ['title'],
  state() {
    return {
      // interaction
      hoverShop: false,
      hoverCart: false,
      // precomputed tokens for template usage
      surface: theme.colors.surface,
      border: theme.colors.border,
      textColor: theme.colors.text,
      primary: theme.colors.primary,
      secondary: theme.colors.secondary,
      inverse: theme.colors.surface,
      paddingX: theme.spacing.lg,
      // dynamic colors for buttons (avoid ternaries in template)
      shopBg: 0x00000000,
      cartBg: 0x00000000,
      shopText: theme.colors.text,
      cartText: theme.colors.text,
      // title text resolved in script
      headerTitle: 'Furniture Shop'
    }
  },
  watchers: {
    // Update dynamic colors when hovers change
    hoverShop(newVal) {
      this.shopBg = newVal ? this.primary : 0x00000000
      this.shopText = newVal ? this.inverse : this.textColor
    },
    hoverCart(newVal) {
      this.cartBg = newVal ? this.secondary : 0x00000000
      this.cartText = newVal ? this.inverse : this.textColor
    },
    title(newTitle) {
      if (newTitle && String(newTitle).length > 0) {
        this.headerTitle = String(newTitle)
      } else {
        this.headerTitle = 'Furniture Shop'
      }
    }
  },
  template: `
    <Element :w="$w" :h="$h" :color="$surface">
      <Element x="0" :y="$h - 2" :w="$w" h="2" :color="$border" />
      <Text :x="$paddingX" y="30" :content="$headerTitle" :color="$textColor" size="36" />

      <Element :x="$w - 320" y="20" w="300" h="60">
        <Element x="0" y="0" w="140" h="60" :color="$shopBg" @enter="$goHome">
          <Text x="20" y="14" :content="'Home'" :color="$shopText" size="28" />
        </Element>
        <Element x="150" y="0" w="140" h="60" :color="$cartBg" @enter="$goCart">
          <Text x="20" y="14" :content="'Cart'" :color="$cartText" size="28" />
        </Element>
      </Element>
    </Element>
  `,
  methods: {
    // PUBLIC_INTERFACE
    goHome() { this.$router.to('/') },
    // PUBLIC_INTERFACE
    goCart() { this.$router.to('/cart') },
  },
  input: {
    left() { this.hoverShop = true; this.hoverCart = false },
    right() { this.hoverShop = false; this.hoverCart = true },
    up() {},
    down() {},
    enter() {
      if (this.hoverCart) this.$goCart()
      else this.$goHome()
    },
    back() { /* ignore to let app handle */ }
  },
  onInit() {
    this.h = theme.sizes.headerH
    this.w = this.$w || 1920
    // initialize title and hover dependent colors
    this.$watchers.title.call(this, this.title)
    this.$watchers.hoverShop.call(this, this.hoverShop)
    this.$watchers.hoverCart.call(this, this.hoverCart)
  }
})
