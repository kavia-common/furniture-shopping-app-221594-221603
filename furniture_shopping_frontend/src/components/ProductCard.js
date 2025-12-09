import Blits from '@lightningjs/blits'
import theme from '../theme'

export default Blits.Component('ProductCard', {
  props: ['item'],
  state() {
    return {
      hover: false,
    }
  },
  template: `
    <Element :w="${theme.sizes.productCardW}" :h="${theme.sizes.productCardH}" :color="0xffffffff" :alpha="$hover ? 1 : 0.98">
      <Element x="0" y="0" :w="${theme.sizes.productCardW}" :h="${theme.sizes.productImageH}" :color="${theme.colors.background}">
        <Element x="0" y="0" :w="${theme.sizes.productCardW}" :h="${theme.sizes.productImageH}">
          <Element :src="$item?.image" :w="${theme.sizes.productCardW}" :h="${theme.sizes.productImageH}" />
        </Element>
      </Element>
      <Text x="20" y="${theme.sizes.productImageH + 16}" :content="$item?.name || ''" :color="${theme.colors.text}" size="28" />
      <Text x="20" y="${theme.sizes.productImageH + 60}" :content="'$' + ($item?.price || 0)" :color="${theme.colors.primary}" size="26" />
    </Element>
  `,
  input: {
    enter() {
      if (this.item) {
        this.$router.to(`/product/${this.item.id}`)
      }
    }
  },
  onFocus() {
    this.hover = true
    this.scale = 1.02
  },
  onUnfocus() {
    this.hover = false
    this.scale = 1.0
  }
})
