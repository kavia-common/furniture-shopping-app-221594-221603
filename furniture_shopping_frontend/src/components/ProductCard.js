import Blits from '@lightningjs/blits'
import theme from '../theme'

/**
 * PUBLIC_INTERFACE
 * Minimal ProductCard that always renders a visible block.
 * Uses only simple $ bindings; no inline expressions or stray braces.
 */
export default Blits.Component('ProductCard', {
  props: ['item'],
  state() {
    return {
      // Dimensions and colors from theme
      cardW: theme.sizes.productCardW,
      cardH: theme.sizes.productCardH,
      imgH: theme.sizes.productImageH,
      surface: 0xffffffff,
      primary: theme.colors.primary,
      textColor: theme.colors.text,

      // Precomputed layout positions
      nameY: theme.sizes.productImageH + 20,
      priceY: theme.sizes.productImageH + 60,

      // Data fields
      hasImage: 0,
      placeholderAlpha: 1,
      imageSrc: '',
      nameText: 'Product',
      priceText: '$0',
    }
  },
  watchers: {
    item(val) {
      const v = (val && typeof val === 'object') ? val : {}
      const n = v.name ? String(v.name) : 'Product'
      const p = (v.price != null && !Number.isNaN(Number(v.price))) ? ('$' + Number(v.price)) : '$0'
      const img = v.image ? String(v.image) : ''
      this.nameText = n
      this.priceText = p
      this.imageSrc = img
      this.hasImage = img ? 1 : 0
      this.placeholderAlpha = img ? 0 : 1
    }
  },
  template: `
    <Element :w="$cardW" :h="$cardH" :color="$surface">
      <Element x="0" y="0" :w="$cardW" :h="$imgH" :color="0xffffffff">
        <Element :alpha="$hasImage" :src="$imageSrc" :w="$cardW" :h="$imgH" />
        <Element :alpha="$placeholderAlpha" :w="$cardW" :h="$imgH" :color="$primary">
          <Text x="20" y="20" :content="$nameText" size="26" :color="0xffffffff" />
        </Element>
      </Element>
      <Text x="20" :y="$nameY" :content="$nameText" size="28" :color="$textColor" />
      <Text x="20" :y="$priceY" :content="$priceText" size="26" :color="$primary" />
    </Element>
  `,
  onInit() {
    this.$watchers.item && this.$watchers.item.call(this, this.item)
  },
  input: {
    enter() {
      const it = this.item
      if (it && it.id != null) this.$router.to('/product/' + String(it.id))
    }
  }
})
