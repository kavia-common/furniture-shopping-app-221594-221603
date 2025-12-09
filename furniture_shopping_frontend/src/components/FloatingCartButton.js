import Blits from '@lightningjs/blits'
import theme from '../theme'
import { AppStore } from '../store'

export default Blits.Component('FloatingCartButton', {
  template: `
    <Element :x="$w - 120" :y="$h - 140" w="100" h="100" :color="${theme.colors.primary}" @enter="$goCart">
      <Text x="28" y="28" :content="'🛒'" size="44" :color="${theme.colors.surface}" />
      <Element x="64" y="8" w="28" h="28" :color="${theme.colors.secondary}">
        <Text x="6" y="3" :content="$countStr" size="20" :color="${theme.colors.surface}" />
      </Element>
    </Element>
  `,
  state() {
    return {
      countStr: '0'
    }
  },
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
