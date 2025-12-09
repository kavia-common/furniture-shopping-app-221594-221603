import Blits from '@lightningjs/blits'
import theme from '../theme'
import { AppStore } from '../store'

export default Blits.Component('CartView', {
  state() {
    // Precompute static tokens for template usage
    const pad = theme.spacing.lg
    const surface = theme.colors.surface
    const background = theme.colors.background
    const text = theme.colors.text
    const primary = theme.colors.primary
    const secondary = theme.colors.secondary
    const error = theme.colors.error
    const white = theme.colors.surface

    return {
      // layout tokens
      pad,
      surface,
      background,
      text,
      primary,
      secondary,
      error,
      white,
      listY: 100,
      rowH: 100,
      // data
      items: [],
      // derived
      headerTitle: 'Your Cart',
      orderSummary: 'Order Summary',
      subtotalLabelPrefix: 'Subtotal: $',
      subtotalText: 'Subtotal: $0',
      plusText: '+',
      minusText: '-',
      removeText: 'Remove',
      checkoutText: 'Proceed to Checkout',
    }
  },

  template: `
    <Element :w="$w" :h="$h" :color="0x00000000">
      <Text :x="$pad" :y="$pad" :content="$headerTitle" size="42" :color="$text" />
      <Element :x="$pad" :y="$listY" :w="$listW" :h="$listH" :color="$surface">
        <Element x="20" y="20" :for="(it, index) in $items" :key="$it.id" :y="$listItemY" w="1400" h="90" :color="0x00000000">
          <Element x="0" y="0" w="90" h="90" :color="$background">
            <Element :src="$itemImage" w="90" h="90" />
          </Element>
          <Text x="110" y="10" :content="$itemName" size="28" :color="$text" />
          <Text x="110" y="52" :content="$itemPrice" size="24" :color="$primary" />

          <Text x="520" y="28" :content="$itemQtyText" size="26" :color="$text" />
          <Element x="640" y="20" w="46" h="46" :color="$background" @enter="$onInc">
            <Text x="12" y="8" :content="$plusText" size="30" :color="$text" />
          </Element>
          <Element x="700" y="20" w="46" h="46" :color="$background" @enter="$onDec">
            <Text x="12" y="8" :content="$minusText" size="30" :color="$text" />
          </Element>

          <Element x="800" y="20" w="160" h="46" :color="$error" @enter="$onRemove">
            <Text x="18" y="8" :content="$removeText" size="26" :color="$white" />
          </Element>
        </Element>
      </Element>

      <Element :x="$summaryX" :y="$listY" w="480" :h="$summaryH" :color="$surface">
        <Text x="20" y="20" :content="$orderSummary" size="30" :color="$text" />
        <Text x="20" y="70" :content="$subtotalText" size="28" :color="$primary" />
        <Element x="20" y="120" w="440" h="60" :color="$secondary" @enter="$checkout">
          <Text x="20" y="14" :content="$checkoutText" size="28" :color="$white" />
        </Element>
      </Element>
    </Element>
  `,

  watchers: {
    // When items change, update derived dimensions and per-row bindings
    items(newItems) {
      // dimensions for list and summary sections
      const listW = (this.$w || 1920) - (this.pad * 2) - 520
      const listH = (this.$h || 1080) - 260
      const summaryX = (this.$w || 1920) - 520
      const summaryH = (this.$h || 1080) - 260
      this.listW = listW
      this.listH = listH
      this.summaryX = summaryX
      this.summaryH = summaryH

      // subtotal
      const subtotalVal = (newItems || []).reduce((acc, it) => {
        const price = Number(it && it.price != null ? it.price : 0)
        const qty = Number(it && it.qty != null ? it.qty : 0)
        return acc + price * qty
      }, 0)
      this.subtotalText = this.subtotalLabelPrefix + String(subtotalVal)

      // For list rendering context variables:
      // We cannot do inline arithmetic in template, so we set row-scoped bindings
      // using the special $item, $index exposures from Blits by preparing fields with watchers.
      // We store the simple projections on the component; the precompiler uses $item/$index per row.
      // These fields are read by the template per-row via the exposed variables.
      // The following names are used in template and are expected to be available per row:
      // $listItemY, $itemImage, $itemName, $itemPrice, $itemQtyText
      // We set base values here for fallback; Blits will override them from row context.
      this.listItemY = 0
      this.itemImage = ''
      this.itemName = ''
      this.itemPrice = ''
      this.itemQtyText = ''
    },
  },

  subscriptions() {
    return [
      AppStore.subscribe(() => {
        this.items = AppStore.state.cart
      })
    ]
  },

  methods: {
    // PUBLIC_INTERFACE
    onInc() {
      const id = this.$item && this.$item.id
      if (id == null) return
      const item = AppStore.state.cart.find(i => i.id === id)
      const nextQty = (item && item.qty ? item.qty : 0) + 1
      AppStore.updateQty(id, nextQty)
    },
    // PUBLIC_INTERFACE
    onDec() {
      const id = this.$item && this.$item.id
      if (id == null) return
      const item = AppStore.state.cart.find(i => i.id === id)
      if (!item) return
      const next = Math.max(1, item.qty - 1)
      AppStore.updateQty(id, next)
    },
    // PUBLIC_INTERFACE
    onRemove() {
      const id = this.$item && this.$item.id
      if (id == null) return
      AppStore.removeFromCart(id)
    },
    // PUBLIC_INTERFACE
    checkout() {
      if (!AppStore.state.cart || AppStore.state.cart.length === 0) return
      AppStore.openCheckout()
    },
  },

  // Row-level computed projection for template variables
  // Blits exposes $item and $index in a :for loop scope. Use onUpdate to map to simple fields.
  onUpdate() {
    if (this.$item) {
      const idx = Number(this.$index || 0)
      this.listItemY = (idx * 100)
      this.itemImage = String(this.$item.image || '')
      this.itemName = String(this.$item.name || '')
      const priceVal = Number(this.$item.price != null ? this.$item.price : 0)
      this.itemPrice = '$' + String(priceVal)
      const qtyVal = Number(this.$item.qty != null ? this.$item.qty : 0)
      this.itemQtyText = 'Qty: ' + String(qtyVal)
    }
  },

  onInit() {
    // initialize from store
    this.items = AppStore.state.cart || []
    // ensure derived sizes calculated
    this.$watchers.items.call(this, this.items)
  }
})
