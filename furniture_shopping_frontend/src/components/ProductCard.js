import Blits from '@lightningjs/blits'
import theme from '../theme'

export default Blits.Component('ProductCard', {
  props: ['item'],
  state() {
    // Precompute static layout values once for the component instance
    const cardW = theme.sizes.productCardW
    const cardH = theme.sizes.productCardH
    const imgH = theme.sizes.productImageH
    const nameY = imgH + 16
    const priceY = imgH + 60
    const textColor = theme.colors.text
    const priceColor = theme.colors.primary
    const bgColor = theme.colors.background
    const surface = 0xffffffff

    return {
      // interaction
      hover: false,
      // layout tokens
      cardW,
      cardH,
      imgH,
      nameY,
      priceY,
      textColor,
      priceColor,
      bgColor,
      surface,
      // data projections kept simple for template binding
      imageSrc: '',
      nameText: '',
      priceText: '$0'
    }
  },
  watchers: {
    // When prop item changes, map to simple state fields for template
    item(newVal) {
      if (newVal && typeof newVal === 'object') {
        this.imageSrc = newVal.image ? String(newVal.image) : ''
        this.nameText = newVal.name ? String(newVal.name) : ''
        const priceVal = (newVal.price != null && !Number.isNaN(Number(newVal.price))) ? Number(newVal.price) : 0
        // Avoid complex template expressions by formatting here
        this.priceText = '$' + priceVal
      } else {
        this.imageSrc = ''
        this.nameText = ''
        this.priceText = '$0'
      }
    }
  },
  template: `
    <Element :w="$cardW" :h="$cardH" :color="$surface" :alpha="$hover ? 1 : 0.98">
      <Element x="0" y="0" :w="$cardW" :h="$imgH" :color="$bgColor">
        <Element x="0" y="0" :w="$cardW" :h="$imgH">
          <Element :src="$imageSrc" :w="$cardW" :h="$imgH" />
        </Element>
      </Element>
      <Text x="20" :y="$nameY" :content="$nameText" :color="$textColor" size="28" />
      <Text x="20" :y="$priceY" :content="$priceText" :color="$priceColor" size="26" />
    </Element>
  `,
  input: {
    enter() {
      const it = this.item
      if (it && it.id != null) {
        // Build route string without inline braces in template
        this.$router.to('/product/' + String(it.id))
      }
    }
  },
  onInit() {
    // initialize derived fields from initial prop
    this.$watchers.item.call(this, this.item)
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
