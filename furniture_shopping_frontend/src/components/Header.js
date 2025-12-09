import Blits from '@lightningjs/blits'
import theme from '../theme'

export default Blits.Component('Header', {
  props: ['title'],
  state() {
    return {
      hoverShop: false,
      hoverCart: false,
    }
  },
  template: `
    <Element :w="$w" :h="$h" :color="${theme.colors.surface}">
      <!-- Subtle shadow line -->
      <Element x="0" :y="$h - 2" :w="$w" h="2" :color="${theme.colors.border}" />
      <Text x="${theme.spacing.lg}" y="30" :content="$title || 'Furniture Shop'" :color="${theme.colors.text}" size="36" />

      <!-- Nav buttons -->
      <Element :x="$w - 320" y="20" w="300" h="60">
        <Element
          x="0" y="0" w="140" h="60"
          :color="$hoverShop ? ${theme.colors.primary} : 0x00000000"
          @enter="$goHome"
        >
          <Text x="20" y="14" :content="'Home'" :color="$hoverShop ? ${theme.colors.surface} : ${theme.colors.text}" size="28" />
        </Element>
        <Element x="150" y="0" w="140" h="60" :color="$hoverCart ? ${theme.colors.secondary} : 0x00000000" @enter="$goCart">
          <Text x="20" y="14" :content="'Cart'" :color="$hoverCart ? ${theme.colors.surface} : ${theme.colors.text}" size="28" />
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
  }
})
