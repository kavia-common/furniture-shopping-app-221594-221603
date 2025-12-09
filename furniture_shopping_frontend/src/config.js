/**
 * PUBLIC_INTERFACE
 * Environment config helper for Vite. Uses a guarded accessor for import.meta.env.
 */

// Safe accessor to avoid parser issues with 'import'
function getImportMetaEnv() {
  try {
    // This will work in Vite where import.meta.env exists
    // eslint-disable-next-line no-undef
    return import.meta && import.meta.env ? import.meta.env : {}
  } catch (e) {
    return {}
  }
}

const envSource = getImportMetaEnv()

const env = {
  // PUBLIC_INTERFACE
  get(key, fallback) {
    const hasKey = Object.prototype.hasOwnProperty.call(envSource, key)
    if (hasKey) {
      const val = envSource[key]
      return typeof val === 'undefined' ? fallback : val
    }
    return fallback
  }
}

// PUBLIC_INTERFACE
export function getApiBase() {
  const a = env.get('VITE_API_BASE', null)
  const b = env.get('VITE_BACKEND_URL', null)
  const api = a || b
  if (!api) return null
  const s = String(api)
  if (s === 'null' || s === 'undefined' || s.trim() === '') return null
  return s
}

// PUBLIC_INTERFACE
export function shouldUseMock() {
  return getApiBase() === null
}

export default { getApiBase, shouldUseMock }
