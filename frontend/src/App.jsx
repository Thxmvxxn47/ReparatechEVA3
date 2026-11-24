import { useState, useCallback, useEffect } from 'react'
import { ToastContainer } from './components/ui'
import StoreNavbar from './components/layout/StoreNavbar'
import AdminSidebar from './components/layout/AdminSidebar'

import {
  HomePage,
  ServiciosPage,
  OfertasPage,
  CategoriasPage,
  RegistroPage,
  LoginClientePage,
  NosotrosPage,
  BlogPage,
  DetalleBlogPage,
  ContactoPage,
  ComprarEquipoPage,
} from './pages/tienda'

import {
  AdminLoginPage,
  AdminDashboard,
  AdminOrdenes,
  AdminServicios,
  AdminCategorias,
  AdminClientes,
  AdminTecnicos,
  AdminRepuestos,
  AdminUsuarios,
  AdminReportes,
  AdminPerfil,
} from './pages/admin'

import { serviciosDB, formatCLP, loadPublic, loadPrivate, clearPrivate, ordenesDB } from './data/db'
import { renew, logout as apiLogout } from './data/api'

function CartDrawer({ open, onClose, carrito, onRemove, onCheckout }) {
  const total = carrito.reduce((suma, item) => suma + (item.tipoLinea === 'equipo'
    ? item.precio_referencial : serviciosDB.precioConDescuento(item)), 0)

  return (
    <>
      <div className={`cart-drawer-overlay ${open ? 'show' : ''}`} onClick={onClose} />
      <div className={`cart-drawer ${open ? 'open' : ''}`} inert={open ? undefined : ''}>
        <div className="cart-header">
          <h4>Carrito</h4>
          <button type="button" className="btn-rt btn-ghost-rt" aria-label="Cerrar carrito" onClick={onClose}>×</button>
        </div>
        <div className="cart-items">
          {!carrito.length && <p className="text-center my-4">Tu carrito está vacío</p>}
          {carrito.map((item, i) => (
            <div key={`${item.id}-${i}`} className="cart-item">
              <div className="ci-info">
                <div className="ci-name">{item.nombre}</div>
                <div className="ci-price">{formatCLP(item.tipoLinea === 'equipo'
                  ? item.precio_referencial : serviciosDB.precioConDescuento(item))}</div>
              </div>
              <button type="button" className="btn-rt btn-ghost-rt"
                aria-label={`Quitar ${item.nombre}`} onClick={() => onRemove(i)}>×</button>
            </div>
          ))}
        </div>
        <div className="cart-footer">
          <div className="cart-total"><span>Total</span><strong>{formatCLP(total)}</strong></div>
          <button type="button" className="btn-full btn-cyan-full" disabled={!carrito.length} onClick={onCheckout}>
            Continuar a la compra
          </button>
        </div>
      </div>
    </>
  )
}

const ADMIN_TITLES = {
  dashboard: 'Dashboard',
  ordenes: 'Órdenes / Boletas',
  servicios: 'Servicios',
  categorias: 'Categorías',
  clientes: 'Clientes',
  tecnicos: 'Técnicos',
  repuestos: 'Repuestos',
  usuarios: 'Usuarios',
  reportes: 'Reportes',
  perfil: 'Mi perfil',
}

function AdminTopbar({ page, user, onNav, onLogout }) {
  return (
    <div className="admin-topbar">
      <div className="page-title">{ADMIN_TITLES[page] || page}</div>
      <select className="f-input admin-mobile-nav" value={page} aria-label="Sección del taller"
        onChange={e => onNav(e.target.value)}>
        {ACCESS[user.rol].map(id => <option key={id} value={id}>{ADMIN_TITLES[id] || 'Ver tienda'}</option>)}
      </select>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
        <div className="user-avatar" style={{ background: 'var(--rt-blue)' }}>
          {user.nombre[0]}
          {user.apellido[0]}
        </div>
        <span style={{ fontSize: '0.82rem', fontWeight: 600 }}>{user.nombre}</span>
        <button className="btn-rt btn-ghost-rt admin-mobile-nav" type="button" onClick={onLogout}>Salir</button>
      </div>
    </div>
  )
}

function MisReparaciones({ cliente }) {
  const [ordenes, setOrdenes] = useState(() => ordenesDB.getByCliente(cliente.clienteId))
  const [error, setError] = useState('')
  const actualizar = async () => {
    try {
      const { api } = await import('./data/api')
      setOrdenes(await api('/mis-ordenes'))
    } catch (e) {
      setError(e.message)
    }
  }
  useEffect(() => {
    actualizar()
  }, [])
  return (
    <section style={{ maxWidth: 1000, margin: '2rem auto', padding: '1rem' }}>
      <h2>Compras</h2>
      <p>Consulta el estado de tus solicitudes y compras de demostración.</p>
      <button className="btn-rt btn-primary-rt" onClick={actualizar}>
        Actualizar estados
      </button>
      {error && <p role="alert">{error}</p>}
      <div className="a-card" style={{ marginTop: 20, overflowX: 'auto' }}>
        <table className="rt-table">
          <thead>
            <tr>
              <th>Orden</th>
              <th>Dispositivo</th>
              <th>Estado</th>
              <th>Costo estimado</th>
            </tr>
          </thead>
          <tbody>
            {ordenes.map((o) => (
              <tr key={o.id}>
                <td>{o.id}</td>
                <td>{o.dispositivo}{['Compra', 'Compra y reparación'].includes(o.tipoOrden) && <small className="d-block">{o.tipoOrden}</small>}</td>
                <td>{o.estado}</td>
                <td>{formatCLP(o.costoTotal)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}

const ACCESS = {
  administrador: [
    'dashboard',
    'ordenes',
    'servicios',
    'categorias',
    'clientes',
    'tecnicos',
    'repuestos',
    'usuarios',
    'reportes',
    'perfil',
    'tienda',
  ],
  encargado: [
    'dashboard',
    'ordenes',
    'servicios',
    'categorias',
    'clientes',
    'tecnicos',
    'repuestos',
    'reportes',
    'perfil',
    'tienda',
  ],
  recepcionista: ['dashboard', 'ordenes', 'clientes', 'perfil', 'tienda'],
  tecnico: ['dashboard', 'ordenes', 'perfil', 'tienda'],
}
export default function App() {
  const [mode, setMode] = useState('tienda')
  const [storePage, setStorePage] = useState('home')
  const [adminPage, setAdminPage] = useState('dashboard')
  const [extraId, setExtraId] = useState(null)
  const [adminUser, setAdminUser] = useState(null)
  const [clienteLogueado, setClienteLogueado] = useState(null)
  const [carrito, setCarrito] = useState([])
  const [cartOpen, setCartOpen] = useState(false)
  const [toasts, setToasts] = useState([])

  const [ready, setReady] = useState(false)
  const [startupError, setStartupError] = useState('')
  useEffect(() => {
    const handler = (e) => toast(e.detail, 'error')
    window.addEventListener('rt-api-error', handler)
    return () => window.removeEventListener('rt-api-error', handler)
  }, [])
  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        await loadPublic()
        try {
          const restored = await renew()
          if (!cancelled) {
            await loadPrivate(restored.usuario.rol)
            if (!cancelled) {
              if (restored.usuario.rol === 'cliente') setClienteLogueado(restored.usuario)
              else {
                setAdminUser(restored.usuario)
                if (sessionStorage.getItem('rt_area') === 'admin') setMode('admin')
              }
            }
          }
        } catch {
          clearPrivate()
        }
      } catch (ex) {
        if (!cancelled) setStartupError('No se pudo conectar con Spring Boot: ' + ex.message)
      } finally {
        if (!cancelled) setReady(true)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [])
  const loginUser = async (user) => {
    await loadPrivate(user.rol)
    if (user.rol === 'cliente') {
      setClienteLogueado(user)
      setMode('tienda')
    } else {
      setAdminUser(user)
      setAdminPage('dashboard')
      setMode('admin')
      sessionStorage.setItem('rt_area', 'admin')
    }
  }
  const signOut = async () => {
    await apiLogout()
    clearPrivate()
    setAdminUser(null)
    setClienteLogueado(null)
    setMode('tienda')
    setStorePage('home')
    sessionStorage.removeItem('rt_area')
  }

  const toast = useCallback((msg, type = 'success') => {
    const id = Date.now()
    setToasts((p) => [...p, { id, msg, type }])
    setTimeout(() => setToasts((p) => p.filter((t) => t.id !== id)), 3000)
  }, [])

  const navStore = (page, id = null) => {
    setStorePage(page)
    setExtraId(id)
    window.scrollTo(0, 0)
    if (page === 'admin-login') {
      if (adminUser) {
        setMode('admin')
        sessionStorage.setItem('rt_area', 'admin')
      } else setMode('admin-login')
    }
    if (page === 'tienda') {
      setMode('tienda')
    }
  }

  const navAdmin = (page) => {
    if (page === 'tienda') {
      setMode('tienda')
      sessionStorage.removeItem('rt_area')
      return
    }
    if (ACCESS[adminUser?.rol]?.includes(page)) setAdminPage(page)
  }

  const agregarAlCarrito = (item, tipoLinea) => {
    if (carrito.length >= 30) {
      toast('El carrito admite hasta 30 artículos.', 'error')
      return
    }
    setCarrito(actual => [...actual, { ...item, tipoLinea }])
    setCartOpen(true)
  }
  const addCart = servicio => agregarAlCarrito(servicio, 'servicio')
  const agregarEquipo = equipo => agregarAlCarrito(equipo, 'equipo')
  const removeCart = indice => setCarrito(actual => actual.filter((_, i) => i !== indice))
  const goCheckout = () => {
    setCartOpen(false)
    if (carrito.length) navStore(clienteLogueado ? 'comprar' : 'login', clienteLogueado ? null : 'comprar')
  }

  const pageProps = { toast }

  if (!ready)
    return <div style={{ padding: '4rem', textAlign: 'center' }}>Conectando con ReparaTech...</div>
  if (startupError)
    return (
      <div style={{ padding: '3rem', textAlign: 'center', color: '#b91c1c' }}>
        {startupError}
        <p>Inicia el backend en http://localhost:8080 y recarga la página.</p>
      </div>
    )

  if (mode === 'admin-login' || (mode === 'admin' && !adminUser)) {
    return (
      <>
        <AdminLoginPage onLogin={loginUser} />
        <ToastContainer toasts={toasts} />
      </>
    )
  }

  if (mode === 'admin' && adminUser) {
    return (
      <>
        <div className="admin-layout">
          <AdminSidebar
            active={adminPage}
            onNav={navAdmin}
            user={adminUser}
            allowed={ACCESS[adminUser.rol]}
            onLogout={signOut}
          />
          <div className="admin-main">
            <AdminTopbar page={adminPage} user={adminUser} onNav={navAdmin} onLogout={signOut} />
            <div className="admin-content">
              {adminPage === 'dashboard' && ACCESS[adminUser.rol]?.includes('dashboard') && (
                <AdminDashboard onNav={navAdmin} user={adminUser} />
              )}
              {adminPage === 'ordenes' &&
                ACCESS[adminUser.rol]?.includes('ordenes') &&
                ACCESS[adminUser.rol]?.includes('ordenes') && (
                  <AdminOrdenes role={adminUser.rol} {...pageProps} />
                )}
              {adminPage === 'servicios' && ACCESS[adminUser.rol]?.includes('servicios') && (
                <AdminServicios {...pageProps} />
              )}
              {adminPage === 'categorias' && ACCESS[adminUser.rol]?.includes('categorias') && (
                <AdminCategorias {...pageProps} />
              )}
              {adminPage === 'clientes' && ACCESS[adminUser.rol]?.includes('clientes') && (
                <AdminClientes {...pageProps} />
              )}
              {adminPage === 'tecnicos' && ACCESS[adminUser.rol]?.includes('tecnicos') && (
                <AdminTecnicos {...pageProps} />
              )}
              {adminPage === 'repuestos' && ACCESS[adminUser.rol]?.includes('repuestos') && (
                <AdminRepuestos {...pageProps} />
              )}
              {adminPage === 'usuarios' && ACCESS[adminUser.rol]?.includes('usuarios') && (
                <AdminUsuarios {...pageProps} />
              )}
              {adminPage === 'reportes' && ACCESS[adminUser.rol]?.includes('reportes') && (
                <AdminReportes />
              )}
              {adminPage === 'perfil' && ACCESS[adminUser.rol]?.includes('perfil') && (
                <AdminPerfil user={adminUser} {...pageProps} />
              )}
            </div>
          </div>
        </div>
        <ToastContainer toasts={toasts} />
      </>
    )
  }

  return (
    <>
      <StoreNavbar
        page={storePage}
        onNav={navStore}
        carritoCount={carrito.length}
        onCartOpen={() => setCartOpen(true)}
        clienteLogueado={clienteLogueado}
        onLogout={signOut}
      />

      {storePage === 'home' && <HomePage onNav={navStore} onAddCart={addCart} />}
      {storePage === 'servicios' && (
        <ServiciosPage key={extraId || 'Todos'} categoriaInicial={extraId || 'Todos'} onNav={navStore} onAddCart={addCart} onAddEquipo={agregarEquipo} />
      )}
      {storePage === 'detalle-servicio' && <ServiciosPage onNav={navStore} onAddCart={addCart} onAddEquipo={agregarEquipo} />}
      {storePage === 'ofertas' && <OfertasPage onNav={navStore} onAddCart={addCart} />}
      {storePage === 'categorias' && <CategoriasPage onNav={navStore} onAddCart={addCart} />}
      {storePage === 'nosotros' && <NosotrosPage />}
      {storePage === 'blog' && <BlogPage onNav={navStore} />}
      {storePage === 'blog-detalle' && <DetalleBlogPage blogId={extraId} onNav={navStore} />}
      {storePage === 'contacto' && <ContactoPage toast={toast} />}
      {storePage === 'registro' && <RegistroPage onNav={navStore} onLogin={loginUser} />}
      {storePage === 'login' && <LoginClientePage onNav={navStore} onLogin={loginUser} destino={extraId} />}
      {storePage === 'comprar' && (
        <ComprarEquipoPage carrito={carrito} cliente={clienteLogueado} onNav={navStore}
          onComprado={() => setCarrito([])} />
      )}
      {storePage === 'mis-reparaciones' && clienteLogueado && (
        <MisReparaciones cliente={clienteLogueado} />
      )}

      <footer className="store-footer">
        © 2024 <strong>ReparaTech</strong> — Av. Libertador B. O'Higgins 1234, Santiago &nbsp;·&nbsp;
        contacto@reparatech.cl &nbsp;·&nbsp;
        <a
          onClick={() => navStore('admin-login')}
          style={{ color: 'var(--rt-cyan)', cursor: 'pointer', marginLeft: '0.3rem' }}
        >
          Admin
        </a>
      </footer>

      <CartDrawer
        open={cartOpen}
        onClose={() => setCartOpen(false)}
        carrito={carrito}
        onRemove={removeCart}
        onCheckout={goCheckout}
      />
      <ToastContainer toasts={toasts} />
    </>
  )
}
