import Blits from '@lightningjs/blits'
import Home from './pages/Home'
import ProductDetail from './pages/ProductDetail'
import CartPage from './pages/CartPage'

/**
 * PUBLIC_INTERFACE
 * Root Application for the Furniture Shopping App.
 * Provides routes and a visible debug banner to verify render.
 */
export default Blits.Application({
  template: `
    <Element :w="$w" :h="$h" :color="0xf9fafbff">
      <RouterView />
      <Element :x="$bannerX" :y="$bannerY" :w="$bannerW" :h="$bannerH" :color="0x00000055">
        <Text :x="$bannerTextX" :y="$bannerTextY" :content="$bannerText" size="20" :color="0xffffffff" />
      </Element>
    </Element>
  `,
  // Blits Router: simple route definitions
  routes: [
    { path: '/', component: Home },
    { path: '/product/:id', component: ProductDetail },
    { path: '/cart', component: CartPage }
  ],
  state() {
    return {
      w: 0,
      h: 0,
      bannerX: 10,
      bannerY: 680,
      bannerW: 1260,
      bannerH: 30,
      bannerTextX: 12,
      bannerTextY: 4,
      bannerText: 'App Ready'
    }
  },
  watchers: {
    w(n) { if (typeof n === 'number') this.bannerW = n - 20 },
    h(n) { if (typeof n === 'number') this.bannerY = n - 40 }
  }
})
