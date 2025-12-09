import Blits from '@lightningjs/blits'
import Home from './pages/Home'
import ProductDetail from './pages/ProductDetail'
import CartPage from './pages/CartPage'

/**
 * PUBLIC_INTERFACE
 * Root Application for the Furniture Shopping App.
 * Defines routes and renders via <RouterView />.
 * Routes:
 *  - '/' -> Home
 *  - '/product/:id' -> ProductDetail (receives prop: id)
 *  - '/cart' -> CartPage
 */
export default Blits.Application({
  // Keep as JS template literal and escape Blits placeholders with a backslash
  template: `
    <Element :w="\${w}" :h="\${h}" :color="0xf9fafbff">
      <RouterView />
      <!-- Fail-safe visible banner -->
      <Element :x="\${debugX}" :y="\${debugY}" :w="\${debugW}" :h="\${debugH}" :color="0x00000055">
        <Text :x="\${debugTextX}" :y="\${debugTextY}" :content="\${debugText}" size="20" :color="0xffffffff" />
      </Element>
      <Element :alpha="\${errorAlpha}" :w="\${w}" :h="\${h}" :color="0x00000088">
        <Text x="40" y="40" :content="\${errorMessage}" size="36" :color="0xffffffff" />
      </Element>
    </Element>
  `,
  routes: [
    { path: '/', component: Home },
    { path: '/product/:id', component: ProductDetail, options: { props: ['id'] } },
    { path: '/cart', component: CartPage }
  ],
  state() {
    return {
      // App frame
      w: 0,
      h: 0,
      // Debug banner geometry and content
      debugX: 10,
      debugY: 680,
      debugW: 1260,
      debugH: 30,
      debugTextX: 12,
      debugTextY: 4,
      debugText: 'App Loaded • Products: 0',
      // Error layer
      errorAlpha: 0,
      errorMessage: 'Something went wrong. Please try again.'
    }
  },
  watchers: {
    w(newW) {
      if (typeof newW === 'number' && newW > 0) {
        this.debugW = newW - 20
      }
    },
    h(newH) {
      if (typeof newH === 'number' && newH > 0) {
        this.debugY = newH - 40
      }
    }
  },
  subscriptions() {
    const updateDebug = () => {
      try {
        const count = this.$store?.state?.products?.length ?? 0
        const route = this.$router?.current?.path || '/'
        this.debugText = 'App Loaded • Route: ' + String(route) + ' • Products: ' + String(count)
      } catch (err) {
        // Fallback if store/router not ready
        this.debugText = 'App Loaded'
      }
    }
    updateDebug()
    return [
      this.$router?.subscribe?.(() => updateDebug()),
      this.$store?.subscribe?.(() => updateDebug())
    ].filter(Boolean)
  },
  onError(e) {
    this.errorAlpha = 1
    try {
      // PUBLIC_INTERFACE
      console.error('App error:', e)
    } catch (logErr) {
      // ignore logging errors
    }
    this.$setTimeout(() => { this.errorAlpha = 0 }, 2000)
  }
})
