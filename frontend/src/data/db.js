import { api, login as apiLogin, register as apiRegister } from './api'
const TIPOS = [
  'clientes',
  'tecnicos',
  'servicios',
  'dispositivos',
  'categorias',
  'repuestos',
  'ordenes',
  'blogs',
]
let activeRole = null
let _db = Object.fromEntries(TIPOS.map((t) => [t, []]))
_db.usuarios = []
const idEqual = (a, b) => String(a) === String(b)
const getAll = (t) => [..._db[t]]
const getById = (t, id) => _db[t].find((x) => idEqual(x.id, id)) || null
const sync = (t, items) => {
  _db[t] = items
}
export function clearPrivate() {
  activeRole = null
  for (const t of TIPOS)
    if (!['servicios', 'dispositivos', 'categorias', 'blogs'].includes(t)) sync(t, [])
  sync('usuarios', [])
}
export async function loadPublic() {
  await Promise.all(
    ['servicios', 'dispositivos', 'categorias', 'blogs'].map(async (t) =>
      sync(t, await api('/public/' + t)),
    ),
  )
}
export async function loadPrivate(role) {
  activeRole = role
  if (role === 'cliente') {
    sync('ordenes', await api('/mis-ordenes'))
  } else {
    const tipos = role === 'tecnico' ? ['clientes', 'tecnicos', 'servicios', 'ordenes'] : TIPOS
    await Promise.all(tipos.map(async (t) => sync(t, await api('/' + t))))
    if (role === 'administrador') sync('usuarios', await api('/usuarios-auth'))
  }
}
export async function refreshType(t) {
  sync(t, await api('/' + t))
  return getAll(t)
}
async function create(t, data) {
  const n = await api(t === 'ordenes' && activeRole === 'cliente' ? '/mis-ordenes' : '/' + t, {
    method: 'POST',
    body: data,
  })
  _db[t].push(n)
  return n
}
async function update(t, id, data) {
  const n = await api('/' + t + '/' + encodeURIComponent(id), { method: 'PUT', body: data })
  sync(
    t,
    _db[t].map((x) => (idEqual(x.id, id) ? n : x)),
  )
  return n
}
async function remove(t, id) {
  await api('/' + t + '/' + encodeURIComponent(id), { method: 'DELETE' })
  sync(
    t,
    _db[t].filter((x) => !idEqual(x.id, id)),
  )
  return true
}
const crud = (t) => ({
  getAll: () => getAll(t),
  getById: (id) => getById(t, id),
  create: (d) => create(t, d),
  update: (id, d) => update(t, id, d),
  delete: (id) => remove(t, id),
})
export const clientesDB = { ...crud('clientes'), login: apiLogin, register: apiRegister }
export const tecnicosDB = crud('tecnicos')
export const serviciosDB = {
  ...crud('servicios'),
  getEnOferta: () => getAll('servicios').filter((s) => s.enOferta),
  getByCategoria: (cat) => getAll('servicios').filter((s) => s.categoria === cat),
  precioConDescuento: (s) => (s.enOferta ? Math.round(s.precio * (1 - s.descuento / 100)) : s.precio),
}
export const dispositivosDB = {
  getAll: () => getAll('dispositivos'),
  getById: (id) => getById('dispositivos', id),
  getByCategoria: (cat) => getAll('dispositivos').filter((d) => d.categoria === cat),
  getMarcas: () => [...new Set(_db.dispositivos.map((d) => d.marca))],
}
export const categoriasDB = crud('categorias')
export const repuestosDB = {
  ...crud('repuestos'),
  ajustarStock: async (id, delta) => {
    const r = await api('/repuestos/' + encodeURIComponent(id) + '/stock', {
      method: 'PATCH',
      body: { delta },
    })
    sync(
      'repuestos',
      _db.repuestos.map((x) => (idEqual(x.id, id) ? r : x)),
    )
    return r
  },
}
export const ordenesDB = {
  ...crud('ordenes'),
  getByCliente: (c) => _db.ordenes.filter((o) => idEqual(o.clienteId, c)),
  getByEstado: (e) => _db.ordenes.filter((o) => o.estado === e),
  cambiarEstado: async (id, estado) => {
    const r = await api('/ordenes/' + encodeURIComponent(id) + '/estado', {
      method: 'PATCH',
      body: { estado },
    })
    sync(
      'ordenes',
      _db.ordenes.map((x) => (idEqual(x.id, id) ? r : x)),
    )
    return r
  },
  getStats: () => {
    let porEstado = {},
      ingresos = 0
    for (const o of _db.ordenes) {
      porEstado[o.estado] = (porEstado[o.estado] || 0) + 1
      if (o.estado === 'Listo para retirar') ingresos += o.costoTotal || 0
    }
    return { total: _db.ordenes.length, porEstado, ingresos }
  },
}
export const blogsDB = { getAll: () => getAll('blogs'), getById: (id) => getById('blogs', id) }
export const authDB = {
  login: apiLogin,
  getAll: () => getAll('usuarios'),
  create: async (d) => {
    const u = await api('/usuarios-auth', { method: 'POST', body: d })
    _db.usuarios.push(u)
    return u
  },
  delete: async (id) => {
    await api('/usuarios-auth/' + id, { method: 'DELETE' })
    _db.usuarios = _db.usuarios.filter((u) => !idEqual(u.id, id))
    return true
  },
}
export const ESTADOS = ['Recibido', 'En diagnóstico', 'En reparación', 'Listo para retirar', 'Cancelado']
export const formatCLP = (n) => `$${Number(n || 0).toLocaleString('es-CL')}`
export const estadoBadgeClass = (e) =>
  ({
    Recibido: 'badge-recibido',
    'En diagnóstico': 'badge-diagnostico',
    'En reparación': 'badge-reparacion',
    'Listo para retirar': 'badge-listo',
    Cancelado: 'badge-cancelado',
  })[e] || 'badge-recibido'
