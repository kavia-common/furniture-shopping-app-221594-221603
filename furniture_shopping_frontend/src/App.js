import Blits from '@lightningjs/blits'
import Home from './pages/Home'
import ProductDetail from './pages/ProductDetail'
import CartPage from './pages/CartPage'

/**
 * PUBLIC_INTERFACE
 * Root Application for the Furniture Shopping App.
 * Defines routes and renders via <RouterView />.
 */
export default Blits.Application({
  template: `
    <Element :w="$w" :h="$h" :color="0xf9fafbff">
      <RouterView />
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
    return { hasError: false }
  },
  onError(e) {
    this.hasError = true
    // PUBLIC_INTERFACE: log error for debugging environments
    try { console.error('App error:', e) } catch { /* ignore logging errors */ }
    setTimeout(() => { this.hasError = false }, 2000)
  }
})
