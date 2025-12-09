import Blits from '@lightningjs/blits'
import Header from '../components/Header'
import FloatingCartButton from '../components/FloatingCartButton'
import { AppStore } from '../store'

export default Blits.Component('ProductDetail', {
  components: { Header, FloatingCartButton },
  props: ['id'],
  template: `
    <Element :w="$w" :h="$h" :color="0xf9fafbff">
      <Header :title="'Product Details'" />
      <Element x="32" :y="132" :w="$w - 64" :h="$h - 164" :color="0x00000000">
        <Element x="0" y="0" w="700" h="500" :color="0xffffffff">
          <Element :src="$imgSrc" w="700" h="500" />
        </Element>
        <Element x="740" y="0" w="800" h="500" :color="0xffffffff">
          <Text x="20" y="20" :content="$title" size="40" :color="0x111827ff" />
          <Text x="20" y="80" :content="$priceStr" size="36" :color="0x2563ebff" />
          <Text x="20" y="140" :content="$desc" size="28" :color="0x111827ff" />
          <Element x="20" y="360" w="280" h="64" :color="0xf59e0bff" @enter="$add">
            <Text x="20" y="16" :content="'Add to Cart'" size="28" :color="0xffffffff" />
          </Element>
        </Element>
      </Element>
      <FloatingCartButton />
    </Element>
  `,
  state() {
    return {
      product: null,
      imgSrc: '',
      title: '',
      priceStr: '$0',
      desc: ''
    }
  },
  watchers: {
    product(p) {
      this.imgSrc = p && p.image ? p.image : ''
      this.title = p && p.name ? p.name : ''
      this.priceStr = p && p.price ? ('$' + p.price) : '$0'
      this.desc = p && p.description ? p.description : ''
    }
  },
  async onInit() {
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
