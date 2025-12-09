import Blits from '@lightningjs/blits'
import theme from '../theme'

export default Blits.Component('ProductCard', {
  props: ['item'],
  state() {
    // Precompute all values to avoid inline expressions in the template
    return {
      cardW: theme.sizes.productCardW,
      cardH: theme.sizes.productCardH,
      imgH: theme.sizes.productImageH,
      nameY: theme.sizes.productImageH + 16,
      priceY: theme.sizes.productImageH + 60,
      textColor: theme.colors.text,
      priceColor: theme.colors.primary,
      bgColor: theme.colors.background,
      surface: 0xffffffff,

      // Interaction visuals
      alphaVal: 1,
      scale: 1,

      // Data projections
      imageSrc: '',
      imageAlpha: 0,
      placeholderAlpha: 1,
      placeholderText: 'Product',
      placeholderTextColor: 0x111827ff,
      nameText: '',
      priceText: '$0',
    }
  },
  watchers: {
    // Map props.item into flat state for simple ${...} bindings
    item(newVal) {
      const obj = (newVal && typeof newVal === 'object') ? newVal : {}
      const hasImg = !!obj.image
      this.imageSrc = hasImg ? String(obj.image) : ''
      this.imageAlpha = hasImg ? 1 : 0
      this.placeholderAlpha = hasImg ? 0 : 1
      this.nameText = obj.name ? String(obj.name) : ''
      const priceVal = (obj.price != null && !Number.isNaN(Number(obj.price))) ? Number(obj.price) : 0
      this.priceText = '$' + priceVal
      this.placeholderText = this.nameText || 'Product'
    }
  },
  template: `
    <Element :w="\${cardW}" :h="\${cardH}" :color="\${surface}" :alpha="\${alphaVal}">
      <Element x="0" y="0" :w="\${cardW}" :h="\${imgH}" :color="\${bgColor}">
        <Element :alpha="\${imageAlpha}" :src="\${imageSrc}" :w="\${cardW}" :h="\${imgH}" />
        <Element :alpha="\${placeholderAlpha}" :w="\${cardW}" :h="\${imgH}" :color="0x2563EB22">
          <Text x="20" y="20" :content="\${placeholderText}" size="24" :color="\${placeholderTextColor}" />
        </Element>
      </Element>
      <Text x="20" :y="\${nameY}" :content="\${nameText}" :color="\${textColor}" size="28" />
      <Text x="20" :y="\${priceY}" :content="\${priceText}" :color="\${priceColor}" size="26" />
    </Element>
  `,
  input: {
    enter() {
      const it = this.item
      if (it && it.id != null) {
        this.$router.to('/product/' + String(it.id))
      }
    }
  },
  onInit() {
    // Initialize from initial props
    this.$watchers.item && this.$watchers.item.call(this, this.item)
  },
  onFocus() {
    this.alphaVal = 1
    this.scale = 1.02
  },
  onUnfocus() {
    this.alphaVal = 1
    this.scale = 1
  }
})
