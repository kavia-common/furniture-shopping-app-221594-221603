import Blits from '@lightningjs/blits'
import App from './App'

/**
 * PUBLIC_INTERFACE
 * Launch the Furniture Shopping App into the element id="app".
 */
console.log('[Boot] Launching Ocean Furniture Shop')
Blits.Launch(App, 'app', {
  w: 1280,
  h: 720,
  keys: { up: 38, down: 40, left: 37, right: 39, enter: 13, back: 8 }
})
