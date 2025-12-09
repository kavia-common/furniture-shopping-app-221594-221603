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
  template: `
    <Element :w="$w" :h="$h" :color="0xf9fafbff">
      <RouterView />
      <!-- Temporary debug banner to avoid blank screen and show product count -->
      <Element :x="10" :y="$h - 40" :w="$w - 20" h="30" :color="0x00000055">
        <Text x="12" y="4" :content="$debugText" size="20" :color="0xffffffff" />
      </Element>
      <Element :alpha="$hasError ? 1 : 0" :w="$w" :h="$h" :color="0x00000088">
        <Text x="40" y="40" :content="'Something went wrong. Please try again.'" size="36" :color="0xffffffff" />
      </Element>
    </Element>
  `,
  routes: [
    { path: '/', component: Home },
    { path: '/product/:id', component: ProductDetail, options: { props: ['id'] } },
    { path: '/cart', component: CartPage }
  ],
  state() {
    return { hasError: false, debugText: 'App starting…' }
  },
  subscriptions() {
    // update debug banner with product count and current route
    const updateDebug = () => {
      try {
        const count = this.$store?.state?.products?.length ?? 0
        const route = this.$router?.current?.path || '/'
        this.debugText = `App started • Route: ${route} • Products: ${count}`
      } catch {
        this.debugText = 'App started'
      }
    }
    updateDebug()
    return [
      // tick on route change
      this.$router?.subscribe?.(() => updateDebug()),
      // if a global store exists, subscribe; guarded to avoid runtime errors
      this.$store?.subscribe?.(() => updateDebug())
    ].filter(Boolean)
  },
  onError(e) {
    this.hasError = true
    // PUBLIC_INTERFACE: log error for debugging environments
    try { console.error('App error:', e) } catch { /* ignore logging errors */ }
    // restore UI after brief time
    this.$setTimeout(() => { this.hasError = false }, 2000)
  }
})
