/**
 * PUBLIC_INTERFACE
 * Environment config helper for Vite. Uses a guarded accessor for import.meta.env.
 * If expected env vars are missing, the app safely falls back to mock data.
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
  /**
   * Reads a value from the runtime env with a fallback.
   * @param {string} key
   * @param {any} fallback
   * @returns {any}
   */
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
/**
 * Returns API base URL if provided via env, otherwise null.
 * The app will use mock data when this returns null.
 */
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
/**
 * Indicates if the application should use mock data sources.
 * True when no API base is configured via env.
 */
export function shouldUseMock() {
  return getApiBase() === null
}

export default { getApiBase, shouldUseMock }
