// Acceso a API: JWT de acceso sólo en memoria; refresh HttpOnly en cookie.
const API = import.meta.env.VITE_API_URL || '/api'
let accessToken = null
let refreshInFlight = null
export function setAccessToken(t) {
  accessToken = t
}
export async function api(path, options = {}) {
  const run = async () => {
    const headers = { ...options.headers }
    if (options.body !== undefined && !(options.body instanceof FormData))
      headers['Content-Type'] = 'application/json'
    if (accessToken) headers.Authorization = `Bearer ${accessToken}`
    return fetch(`${API}${path}`, {
      ...options,
      headers,
      credentials: 'include',
      body: options.body === undefined ? undefined : JSON.stringify(options.body),
    })
  }
  let res = await run()
  if (res.status === 401 || res.status === 403) {
    if (!path.startsWith('/auth/')) {
      try {
        await renew()
        res = await run()
      } catch {
        accessToken = null
      }
    }
  }
  if (!res.ok) {
    let msg = `Error HTTP ${res.status}`
    try {
      const j = await res.json()
      msg = j.detail || j.message || j.error || msg
    } catch {}
    window.dispatchEvent(new CustomEvent('rt-api-error', { detail: msg }))
    throw new Error(msg)
  }
  if (res.status === 204) return null
  return res.json()
}
export async function renew() {
  if (!refreshInFlight)
    refreshInFlight = (async () => {
      const r = await fetch(`${API}/auth/refresh`, { method: 'POST', credentials: 'include' })
      if (!r.ok) throw new Error('No hay sesión')
      const data = await r.json()
      accessToken = data.token
      return data
    })().finally(() => {
      refreshInFlight = null
    })
  return refreshInFlight
}
export async function login(correo, password) {
  const r = await api('/auth/login', { method: 'POST', body: { correo, password } })
  accessToken = r.token
  return r.usuario
}
export async function register(body) {
  const r = await api('/auth/registro', { method: 'POST', body })
  accessToken = r.token
  return r.usuario
}
export async function logout() {
  try {
    await api('/auth/logout', { method: 'POST' })
  } finally {
    accessToken = null
  }
}
