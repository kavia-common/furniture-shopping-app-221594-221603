import Blits from '@lightningjs/blits'
import Header from '../components/Header.js'
import FloatingCartButton from '../components/FloatingCartButton.js'
import { AppStore } from '../store.js'

/**
 * PUBLIC_INTERFACE
 * Product detail page with safe template bindings only.
 */
export default Blits.Component('ProductDetail', {
  components: { Header, FloatingCartButton },
  props: ['id'],
  template: `
    <Element :w="$w" :h="$h" :color="$bg">
      <Header :title="$headerTitle" />
      <Element :x="$contentX" :y="$contentY" :w="$contentW" :h="$contentH" :color="0x00000000">
        <Element :x="$imageX" :y="$imageY" :w="$imageW" :h="$imageH" :color="$surface">
          <Element :src="$imgSrc" :w="$imageW" :h="$imageH" />
        </Element>
        <Element :x="$detailsX" :y="$detailsY" :w="$detailsW" :h="$detailsH" :color="$surface">
          <Text :x="$titleX" :y="$titleY" :content="$title" :size="$titleSize" :color="$titleColor" />
          <Text :x="$priceX" :y="$priceY" :content="$priceStr" :size="$priceSize" :color="$priceColor" />
          <Text :x="$descX" :y="$descY" :content="$desc" :size="$descSize" :color="$descColor" />
          <Element :x="$addX" :y="$addY" :w="$addW" :h="$addH" :color="$ctaBg" @enter="$add">
            <Text :x="$addTextX" :y="$addTextY" :content="$addText" :size="$addSize" :color="$ctaText" />
          </Element>
        </Element>
      </Element>
      <FloatingCartButton />
    </Element>
  `,
  state() {
    return {
      // colors
      bg: 0xf9fafbff,
      surface: 0xffffffff,
      titleColor: 0x111827ff,
      priceColor: 0x2563ebff,
      descColor: 0x111827ff,
      ctaBg: 0xf59e0bff,
      ctaText: 0xffffffff,

      // header
      headerTitle: 'Product Details',

      // layout
      contentX: 32,
      contentY: 132,
      contentW: 0,
      contentH: 0,

      imageX: 0,
      imageY: 0,
      imageW: 700,
      imageH: 500,

      detailsX: 740,
      detailsY: 0,
      detailsW: 800,
      detailsH: 500,

      titleX: 20,
      titleY: 20,
      titleSize: 40,

      priceX: 20,
      priceY: 80,
      priceSize: 36,

      descX: 20,
      descY: 140,
      descSize: 28,

      addX: 20,
      addY: 360,
      addW: 280,
      addH: 64,
      addTextX: 20,
      addTextY: 16,
      addSize: 28,
      addText: 'Add to Cart',

      // product fields
      product: null,
      imgSrc: '',
      title: '',
      priceStr: '$0',
      desc: '',
    }
  },
  watchers: {
    w(newW) { if (typeof newW === 'number') this.contentW = newW - 64 },
    h(newH) { if (typeof newH === 'number') this.contentH = newH - 164 },
    product(p) {
      this.imgSrc = p && p.image ? p.image : ''
      this.title = p && p.name ? p.name : ''
      this.priceStr = p && p.price != null ? ('$' + p.price) : '$0'
      this.desc = p && p.description ? p.description : ''
    }
  },
  async onInit() {
    this.$watchers.w && this.$watchers.w.call(this, this.$w)
    this.$watchers.h && this.$watchers.h.call(this, this.$h)

    if (!AppStore.state.products || AppStore.state.products.length === 0) {
      await AppStore.loadProducts()
    }
    AppStore.setSelectedProductById(this.id)
    this.product = AppStore.state.selectedProduct
  },
  methods: {
    // PUBLIC_INTERFACE
    add() {
      if (this.product) {
        AppStore.addToCart(this.product, 1)
      }
    }
  }
})
