import Blits from '@lightningjs/blits'
import theme from '../theme'
import { AppStore } from '../store'

export default Blits.Component('FloatingCartButton', {
  state() {
    return {
      // visual constants to avoid inline literals in template bindings
      btnW: 100,
      btnH: 100,
      offsetX: 120,
      offsetY: 140,
      iconX: 28,
      iconY: 28,
      badgeX: 64,
      badgeY: 8,
      badgeW: 28,
      badgeH: 28,
      badgeTextX: 6,
      badgeTextY: 3,
      primary: theme.colors.primary,
      surface: theme.colors.surface,
      secondary: theme.colors.secondary,
      // dynamic data
      countStr: '0'
    }
  },
  template: `
    <Element :x="$w - $offsetX" :y="$h - $offsetY" :w="$btnW" :h="$btnH" :color="$primary" @enter="$goCart">
      <Text :x="$iconX" :y="$iconY" :content="'🛒'" size="44" :color="$surface" />
      <Element :x="$badgeX" :y="$badgeY" :w="$badgeW" :h="$badgeH" :color="$secondary">
        <Text :x="$badgeTextX" :y="$badgeTextY" :content="$countStr" size="20" :color="$surface" />
      </Element>
    </Element>
  `,
  subscriptions() {
    return [
      AppStore.subscribe(() => {
        this.countStr = String(AppStore.cartCount)
      })
    ]
  },
  methods: {
    // PUBLIC_INTERFACE
    goCart() { this.$router.to('/cart') }
  }
})
