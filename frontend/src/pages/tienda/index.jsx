import { useState, useMemo } from 'react'
import {
  serviciosDB,
  categoriasDB,
  blogsDB,
  clientesDB,
  dispositivosDB,
  formatCLP,
  ordenesDB,
} from '../../data/db'

function Img({ src, alt, style, fallback }) {
  const [err, setErr] = useState(false)
  if (!src || err)
    return (
      <div
        style={{
          ...style,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg,#e8f4fd,#dbeafe)',
          fontSize: '0.85rem',
          padding: 8,
          textAlign: 'center',
        }}
      >
        {fallback || alt}
      </div>
    )
  return (
    <img
      src={src}
      alt={alt}
      style={{ ...style, objectFit: 'cover' }}
      onError={() => setErr(true)}
      loading="lazy"
    />
  )
}

export function HomePage({ onNav, onAddCart }) {
  const servicios = serviciosDB.getAll().slice(0, 4)
  const categorias = categoriasDB.getAll()
  const dispositivos = dispositivosDB.getAll().slice(0, 6)

  return (
    <div>
      <div
        style={{
          background: 'linear-gradient(135deg,#0f4c81 0%,#1a6eb5 60%,#00b4d8 100%)',
          color: '#fff',
          padding: '80px 24px',
          textAlign: 'center',
        }}
      >
        <h1
          style={{
            fontFamily: 'Space Grotesk,sans-serif',
            fontSize: '2.8rem',
            fontWeight: 800,
            marginBottom: 12,
          }}
        >
          {' '}
          Repara tu dispositivo hoy
        </h1>
        <p style={{ fontSize: '1.1rem', opacity: 0.88, maxWidth: 560, margin: '0 auto 28px' }}>
          Servicio técnico profesional en Santiago. iPhone, Samsung, iPad, MacBook y más. Garantía en
          todas las reparaciones.
        </p>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          <button
            style={{
              background: '#00b4d8',
              color: '#fff',
              border: 'none',
              padding: '12px 28px',
              borderRadius: 10,
              fontWeight: 700,
              fontSize: '1rem',
              cursor: 'pointer',
            }}
            onClick={() => onNav('servicios')}
          >
            Ver servicios
          </button>
          <button
            style={{
              background: 'rgba(255,255,255,0.15)',
              color: '#fff',
              border: '2px solid rgba(255,255,255,0.4)',
              padding: '12px 28px',
              borderRadius: 10,
              fontWeight: 700,
              fontSize: '1rem',
              cursor: 'pointer',
            }}
            onClick={() => onNav('comprar')}
          >
            Solicitar reparación
          </button>
        </div>

        <div
          style={{
            display: 'flex',
            gap: '2rem',
            justifyContent: 'center',
            marginTop: 40,
            flexWrap: 'wrap',
          }}
        >
          {[
            ['800+', 'Reparaciones/mes'],
            ['7 años', 'Experiencia'],
            ['98%', 'Satisfacción'],
            ['6', 'Técnicos cert.'],
          ].map(([v, l]) => (
            <div key={l} style={{ textAlign: 'center' }}>
              <div
                style={{ fontFamily: 'Space Grotesk,sans-serif', fontSize: '1.8rem', fontWeight: 800 }}
              >
                {v}
              </div>
              <div style={{ fontSize: '0.78rem', opacity: 0.75, marginTop: 2 }}>{l}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '2rem 1.5rem' }}>
        <h2
          style={{
            fontFamily: 'Space Grotesk,sans-serif',
            fontSize: '1.6rem',
            fontWeight: 700,
            marginBottom: '1.2rem',
          }}
        >
          Categorías <span style={{ color: '#00b4d8' }}>de servicio</span>
        </h2>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill,minmax(180px,1fr))',
            gap: '1rem',
            marginBottom: '2.5rem',
          }}
        >
          {categorias.map((c) => (
            <div
              key={c.id}
              onClick={() => onNav('categorias')}
              style={{
                background: '#fff',
                border: '1px solid #dde3ea',
                borderRadius: 14,
                overflow: 'hidden',
                cursor: 'pointer',
                transition: 'transform 0.2s,box-shadow 0.2s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)'
                e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.12)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = ''
                e.currentTarget.style.boxShadow = ''
              }}
            >
              <Img
                src={c.imagen}
                alt={c.nombre}
                style={{ width: '100%', height: 110 }}
                fallback={c.icono}
              />
              <div style={{ padding: '10px 12px' }}>
                <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>
                  {c.icono} {c.nombre}
                </div>
                <div style={{ fontSize: '0.73rem', color: '#6b7280', marginTop: 2 }}>
                  {c.descripcion.slice(0, 40)}…
                </div>
              </div>
            </div>
          ))}
        </div>

        <h2
          style={{
            fontFamily: 'Space Grotesk,sans-serif',
            fontSize: '1.6rem',
            fontWeight: 700,
            marginBottom: '1.2rem',
          }}
        >
          Servicios <span style={{ color: '#00b4d8' }}>destacados</span>
        </h2>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill,minmax(260px,1fr))',
            gap: '1.2rem',
            marginBottom: '2.5rem',
          }}
        >
          {servicios.map((s) => {
            const precio = serviciosDB.precioConDescuento(s)
            return (
              <div
                key={s.id}
                style={{
                  background: '#fff',
                  border: '1px solid #dde3ea',
                  borderRadius: 14,
                  overflow: 'hidden',
                  transition: 'transform 0.2s,box-shadow 0.2s',
                  cursor: 'pointer',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)'
                  e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.12)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = ''
                  e.currentTarget.style.boxShadow = ''
                }}
              >
                <div style={{ position: 'relative' }}>
                  <Img
                    src={s.imagen}
                    alt={s.nombre}
                    style={{ width: '100%', height: 160 }}
                    fallback={s.icono}
                  />
                  {s.enOferta && (
                    <span
                      style={{
                        position: 'absolute',
                        top: 10,
                        left: 10,
                        background: '#dc2626',
                        color: '#fff',
                        fontSize: '0.72rem',
                        fontWeight: 700,
                        padding: '3px 10px',
                        borderRadius: 20,
                      }}
                    >
                      -{s.descuento}% OFF
                    </span>
                  )}
                </div>
                <div style={{ padding: '1rem' }}>
                  <div style={{ fontWeight: 700, fontSize: '1rem', marginBottom: 4 }}>{s.nombre}</div>
                  <div style={{ fontSize: '0.82rem', color: '#6b7280', marginBottom: 10 }}>
                    {s.descripcion}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 4 }}>
                    <span
                      style={{
                        fontFamily: 'Space Grotesk,sans-serif',
                        fontSize: '1.4rem',
                        fontWeight: 700,
                        color: '#0f4c81',
                      }}
                    >
                      {formatCLP(precio)}
                    </span>
                    {s.enOferta && (
                      <span
                        style={{ textDecoration: 'line-through', color: '#aaa', fontSize: '0.85rem' }}
                      >
                        {formatCLP(s.precio)}
                      </span>
                    )}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#6b7280', marginBottom: 10 }}>
                    {s.tiempoEstimado} min estimado
                  </div>
                  <button
                    onClick={() => onAddCart(s)}
                    style={{
                      background: '#0f4c81',
                      color: '#fff',
                      border: 'none',
                      padding: '8px 0',
                      borderRadius: 8,
                      fontWeight: 600,
                      fontSize: '0.85rem',
                      cursor: 'pointer',
                      width: '100%',
                    }}
                  >
                    Agregar al carrito
                  </button>
                </div>
              </div>
            )
          })}
        </div>

        <h2
          style={{
            fontFamily: 'Space Grotesk,sans-serif',
            fontSize: '1.6rem',
            fontWeight: 700,
            marginBottom: '1.2rem',
          }}
        >
          Dispositivos que <span style={{ color: '#00b4d8' }}>reparamos</span>
        </h2>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill,minmax(180px,1fr))',
            gap: '1rem',
            marginBottom: '2.5rem',
          }}
        >
          {dispositivos.map((d) => (
            <div
              key={d.id}
              style={{
                background: '#fff',
                border: '1px solid #dde3ea',
                borderRadius: 12,
                overflow: 'hidden',
                cursor: 'pointer',
              }}
              onClick={() => onNav('servicios')}
            >
              <Img src={d.imagen} alt={d.nombre} style={{ width: '100%', height: 130 }} fallback="Foto pendiente" />
              {d.fotoFuente && <a className="photo-credit" href={d.fotoFuente} target="_blank" rel="noreferrer" onClick={e => e.stopPropagation()}>{d.fotoCredito}</a>}
              <div style={{ padding: '10px' }}>
                <div style={{ fontWeight: 700, fontSize: '0.83rem' }}>{d.nombre}</div>
                <div style={{ fontSize: '0.72rem', color: '#6b7280' }}>
                  {d.marca} · {d.categoria}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div
          style={{
            background: 'linear-gradient(135deg,#dc2626,#f97316)',
            borderRadius: 14,
            padding: '2rem',
            color: '#fff',
            marginBottom: '2.5rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '1rem',
          }}
        >
          <div>
            <div
              style={{
                fontSize: '0.78rem',
                opacity: 0.85,
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
              }}
            >
              {' '}
              Oferta del mes
            </div>
            <div
              style={{
                fontFamily: 'Space Grotesk,sans-serif',
                fontSize: '1.5rem',
                fontWeight: 800,
                margin: '4px 0',
              }}
            >
              Limpieza de software — 15% OFF
            </div>
            <div style={{ opacity: 0.88 }}>
              Incluye eliminación de virus y optimización completa del sistema
            </div>
          </div>
          <button
            style={{
              background: '#fff',
              color: '#dc2626',
              border: 'none',
              padding: '12px 24px',
              borderRadius: 10,
              fontWeight: 700,
              fontSize: '0.95rem',
              cursor: 'pointer',
            }}
            onClick={() => onNav('ofertas')}
          >
            Ver oferta →
          </button>
        </div>

        <h2
          style={{
            fontFamily: 'Space Grotesk,sans-serif',
            fontSize: '1.6rem',
            fontWeight: 700,
            marginBottom: '1.2rem',
          }}
        >
          Últimos <span style={{ color: '#00b4d8' }}>artículos</span>
        </h2>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill,minmax(280px,1fr))',
            gap: '1.2rem',
          }}
        >
          {blogsDB
            .getAll()
            .slice(0, 2)
            .map((b) => (
              <div
                key={b.id}
                onClick={() => onNav('blog-detalle', b.id)}
                style={{
                  background: '#fff',
                  border: '1px solid #dde3ea',
                  borderRadius: 14,
                  overflow: 'hidden',
                  cursor: 'pointer',
                }}
              >
                <Img src={b.imagen} alt={b.titulo} style={{ width: '100%', height: 180 }} fallback="" />
                <div style={{ padding: '1rem' }}>
                  <div
                    style={{
                      fontSize: '0.72rem',
                      color: '#00b4d8',
                      fontWeight: 700,
                      textTransform: 'uppercase',
                    }}
                  >
                    {b.tag}
                  </div>
                  <div style={{ fontWeight: 700, margin: '4px 0', fontSize: '0.95rem' }}>{b.titulo}</div>
                  <div style={{ fontSize: '0.82rem', color: '#6b7280' }}>{b.resumen}</div>
                  <div style={{ fontSize: '0.75rem', color: '#aaa', marginTop: 8 }}>{b.fecha}</div>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  )
}

export function ServiciosPage({ onNav, onAddCart }) {
  const servicios = serviciosDB.getAll()
  const categorias = categoriasDB.getAll()
  const [cat, setCat] = useState('Todos')
  const [buscar, setBuscar] = useState('')

  const filtrados = useMemo(
    () =>
      servicios.filter(
        (s) =>
          (!buscar || s.nombre.toLowerCase().includes(buscar.toLowerCase())) &&
          (cat === 'Todos' || s.categoria === cat),
      ),
    [cat, buscar, servicios],
  )

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '2rem 1.5rem' }}>
      <h2
        style={{
          fontFamily: 'Space Grotesk,sans-serif',
          fontSize: '1.6rem',
          fontWeight: 700,
          marginBottom: '1.2rem',
        }}
      >
        Nuestros <span style={{ color: '#00b4d8' }}>servicios</span>
      </h2>
      <div
        style={{ display: 'flex', gap: 12, marginBottom: 16, flexWrap: 'wrap', alignItems: 'center' }}
      >
        <div style={{ position: 'relative', flex: 1, maxWidth: 360 }}>
          <span
            style={{
              position: 'absolute',
              left: 10,
              top: '50%',
              transform: 'translateY(-50%)',
              color: '#aaa',
            }}
          ></span>
          <input
            style={{
              width: '100%',
              padding: '9px 12px 9px 32px',
              border: '1px solid #dde3ea',
              borderRadius: 8,
              fontSize: '0.88rem',
              outline: 'none',
              boxSizing: 'border-box',
            }}
            placeholder="Buscar servicio..."
            value={buscar}
            onChange={(e) => setBuscar(e.target.value)}
          />
        </div>
      </div>

      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 20 }}>
        {['Todos', ...categorias.map((c) => c.nombre)].map((c) => (
          <button
            key={c}
            onClick={() => setCat(c)}
            style={{
              padding: '6px 16px',
              borderRadius: 30,
              border: '1px solid #dde3ea',
              background: cat === c ? '#0f4c81' : '#fff',
              color: cat === c ? '#fff' : '#374151',
              fontWeight: 600,
              fontSize: '0.83rem',
              cursor: 'pointer',
            }}
          >
            {c}
          </button>
        ))}
      </div>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill,minmax(260px,1fr))',
          gap: '1.2rem',
        }}
      >
        {filtrados.map((s) => {
          const precio = serviciosDB.precioConDescuento(s)
          return (
            <div
              key={s.id}
              style={{
                background: '#fff',
                border: '1px solid #dde3ea',
                borderRadius: 14,
                overflow: 'hidden',
              }}
            >
              <div style={{ position: 'relative' }}>
                <Img
                  src={s.imagen}
                  alt={s.nombre}
                  style={{ width: '100%', height: 160 }}
                  fallback={s.icono}
                />
                {s.enOferta && (
                  <span
                    style={{
                      position: 'absolute',
                      top: 10,
                      left: 10,
                      background: '#dc2626',
                      color: '#fff',
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      padding: '3px 10px',
                      borderRadius: 20,
                    }}
                  >
                    -{s.descuento}% OFF
                  </span>
                )}
              </div>
              <div style={{ padding: '1rem' }}>
                <div style={{ fontWeight: 700, fontSize: '1rem', marginBottom: 4 }}>{s.nombre}</div>
                <div style={{ fontSize: '0.82rem', color: '#6b7280', marginBottom: 10 }}>
                  {s.descripcion}
                </div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 4 }}>
                  <span
                    style={{
                      fontFamily: 'Space Grotesk,sans-serif',
                      fontSize: '1.4rem',
                      fontWeight: 700,
                      color: '#0f4c81',
                    }}
                  >
                    {formatCLP(precio)}
                  </span>
                  {s.enOferta && (
                    <span style={{ textDecoration: 'line-through', color: '#aaa', fontSize: '0.85rem' }}>
                      {formatCLP(s.precio)}
                    </span>
                  )}
                </div>
                <div style={{ fontSize: '0.75rem', color: '#6b7280', marginBottom: 10 }}>
                  {s.tiempoEstimado} min
                </div>
                <div style={{ display: 'flex', gap: 6 }}>
                  <button
                    onClick={() => onAddCart(s)}
                    style={{
                      flex: 1,
                      background: '#0f4c81',
                      color: '#fff',
                      border: 'none',
                      padding: '8px',
                      borderRadius: 8,
                      fontWeight: 600,
                      fontSize: '0.83rem',
                      cursor: 'pointer',
                    }}
                  >
                    + Carrito
                  </button>
                  <button
                    onClick={() => onNav('comprar')}
                    style={{
                      flex: 1,
                      background: '#f4f7fb',
                      color: '#0f4c81',
                      border: '1px solid #dde3ea',
                      padding: '8px',
                      borderRadius: 8,
                      fontWeight: 600,
                      fontSize: '0.83rem',
                      cursor: 'pointer',
                    }}
                  >
                    Solicitar
                  </button>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export function OfertasPage({ onAddCart }) {
  const ofertas = serviciosDB.getEnOferta()
  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '2rem 1.5rem' }}>
      <div
        style={{
          background: 'linear-gradient(135deg,#dc2626,#f97316)',
          borderRadius: 14,
          padding: '2rem',
          color: '#fff',
          textAlign: 'center',
          marginBottom: 24,
        }}
      >
        <h1 style={{ fontFamily: 'Space Grotesk,sans-serif', fontSize: '2rem', fontWeight: 800 }}>
          {' '}
          Ofertas especiales
        </h1>
        <p style={{ opacity: 0.9, marginTop: 4 }}>Servicios con descuento por tiempo limitado</p>
      </div>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill,minmax(260px,1fr))',
          gap: '1.2rem',
        }}
      >
        {ofertas.map((s) => {
          const precio = serviciosDB.precioConDescuento(s)
          return (
            <div
              key={s.id}
              style={{
                background: '#fff',
                border: '2px solid #dc2626',
                borderRadius: 14,
                overflow: 'hidden',
              }}
            >
              <div style={{ position: 'relative' }}>
                <Img
                  src={s.imagen}
                  alt={s.nombre}
                  style={{ width: '100%', height: 160 }}
                  fallback={s.icono}
                />
                <span
                  style={{
                    position: 'absolute',
                    top: 10,
                    left: 10,
                    background: '#dc2626',
                    color: '#fff',
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    padding: '4px 12px',
                    borderRadius: 20,
                  }}
                >
                  -{s.descuento}% OFF
                </span>
              </div>
              <div style={{ padding: '1rem' }}>
                <div style={{ fontWeight: 700, fontSize: '1rem', marginBottom: 4 }}>{s.nombre}</div>
                <div style={{ fontSize: '0.82rem', color: '#6b7280', marginBottom: 10 }}>
                  {s.descripcion}
                </div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 10 }}>
                  <span
                    style={{
                      fontFamily: 'Space Grotesk,sans-serif',
                      fontSize: '1.4rem',
                      fontWeight: 700,
                      color: '#dc2626',
                    }}
                  >
                    {formatCLP(precio)}
                  </span>
                  <span style={{ textDecoration: 'line-through', color: '#aaa', fontSize: '0.85rem' }}>
                    {formatCLP(s.precio)}
                  </span>
                </div>
                <div style={{ fontSize: '0.75rem', color: '#6b7280', marginBottom: 10 }}>
                  {s.tiempoEstimado} min
                </div>
                <button
                  onClick={() => onAddCart(s)}
                  style={{
                    width: '100%',
                    background: '#dc2626',
                    color: '#fff',
                    border: 'none',
                    padding: '10px',
                    borderRadius: 8,
                    fontWeight: 700,
                    fontSize: '0.88rem',
                    cursor: 'pointer',
                  }}
                >
                  Aprovechar oferta
                </button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export function CategoriasPage({ onAddCart }) {
  const categorias = categoriasDB.getAll()
  const [activa, setActiva] = useState(categorias[0])
  const dispositivos = dispositivosDB.getByCategoria(activa?.nombre || '')
  const srvs = serviciosDB.getByCategoria(activa?.nombre || '')

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '2rem 1.5rem' }}>
      <h2
        style={{
          fontFamily: 'Space Grotesk,sans-serif',
          fontSize: '1.6rem',
          fontWeight: 700,
          marginBottom: '1.2rem',
        }}
      >
        Categorías de <span style={{ color: '#00b4d8' }}>servicio</span>
      </h2>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill,minmax(160px,1fr))',
          gap: '1rem',
          marginBottom: '2rem',
        }}
      >
        {categorias.map((c) => (
          <div
            key={c.id}
            onClick={() => setActiva(c)}
            style={{
              background: activa?.id === c.id ? '#e8f4fd' : '#fff',
              border: `2px solid ${activa?.id === c.id ? '#00b4d8' : '#dde3ea'}`,
              borderRadius: 12,
              overflow: 'hidden',
              cursor: 'pointer',
            }}
          >
            <Img
              src={c.imagen}
              alt={c.nombre}
              style={{ width: '100%', height: 100 }}
              fallback={c.icono}
            />
            <div style={{ padding: '8px 10px', textAlign: 'center' }}>
              <div style={{ fontWeight: 700, fontSize: '0.85rem' }}>
                {c.icono} {c.nombre}
              </div>
            </div>
          </div>
        ))}
      </div>

      {activa && (
        <>
          <h3
            style={{
              fontFamily: 'Space Grotesk,sans-serif',
              fontSize: '1.2rem',
              fontWeight: 700,
              margin: '1.5rem 0 0.5rem',
            }}
          >
            {activa.icono} {activa.nombre}
          </h3>
          <p style={{ color: '#6b7280', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
            {activa.descripcion}
          </p>

          {dispositivos.length > 0 && (
            <>
              <h4 style={{ fontWeight: 700, marginBottom: 12, fontSize: '0.95rem', color: '#374151' }}>
                Modelos que reparamos:
              </h4>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill,minmax(150px,1fr))',
                  gap: '0.8rem',
                  marginBottom: '2rem',
                }}
              >
                {dispositivos.map((d) => (
                  <div
                    key={d.id}
                    style={{
                      background: '#fff',
                      border: '1px solid #dde3ea',
                      borderRadius: 10,
                      overflow: 'hidden',
                    }}
                  >
                    <Img
                      src={d.imagen}
                      alt={d.nombre}
                      style={{ width: '100%', height: 110 }}
                      fallback="Foto pendiente"
                    />
              {d.fotoFuente && <a className="photo-credit" href={d.fotoFuente} target="_blank" rel="noreferrer" onClick={e => e.stopPropagation()}>{d.fotoCredito}</a>}
                    <div style={{ padding: '8px 10px' }}>
                      <div style={{ fontWeight: 700, fontSize: '0.78rem' }}>{d.nombre}</div>
                      <div style={{ fontSize: '0.7rem', color: '#6b7280' }}>{d.marca}</div>
                      <div style={{ fontSize: '0.68rem', color: '#aaa', marginTop: 2 }}>
                        {d.fallas_comunes.slice(0, 2).join(' · ')}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {srvs.length === 0 ? (
            <div
              style={{
                background: '#e0f2fe',
                borderRadius: 8,
                padding: '12px 16px',
                color: '#075985',
                fontSize: '0.88rem',
              }}
            >
              {' '}
              Sin servicios en esta categoría aún.
            </div>
          ) : (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill,minmax(240px,1fr))',
                gap: '1.2rem',
              }}
            >
              {srvs.map((s) => {
                const precio = serviciosDB.precioConDescuento(s)
                return (
                  <div
                    key={s.id}
                    style={{
                      background: '#fff',
                      border: '1px solid #dde3ea',
                      borderRadius: 14,
                      overflow: 'hidden',
                    }}
                  >
                    <Img
                      src={s.imagen}
                      alt={s.nombre}
                      style={{ width: '100%', height: 140 }}
                      fallback={s.icono}
                    />
                    <div style={{ padding: '1rem' }}>
                      {s.enOferta && (
                        <span
                          style={{
                            background: '#dc2626',
                            color: '#fff',
                            fontSize: '0.7rem',
                            fontWeight: 700,
                            padding: '2px 8px',
                            borderRadius: 20,
                          }}
                        >
                          -{s.descuento}% OFF
                        </span>
                      )}
                      <div style={{ fontWeight: 700, margin: '6px 0 4px' }}>{s.nombre}</div>
                      <div
                        style={{
                          fontFamily: 'Space Grotesk,sans-serif',
                          fontSize: '1.2rem',
                          fontWeight: 700,
                          color: '#0f4c81',
                          marginBottom: 8,
                        }}
                      >
                        {formatCLP(precio)}
                      </div>
                      <button
                        onClick={() => onAddCart(s)}
                        style={{
                          width: '100%',
                          background: '#0f4c81',
                          color: '#fff',
                          border: 'none',
                          padding: '8px',
                          borderRadius: 8,
                          fontWeight: 600,
                          fontSize: '0.83rem',
                          cursor: 'pointer',
                        }}
                      >
                        Agregar al carrito
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </>
      )}
    </div>
  )
}

export function NosotrosPage() {
  const equipo = [
    { n: 'Rodrigo Fuentes', r: 'Jefe Técnico — Smartphones', i: '' },
    { n: 'Camila Vera', r: 'Especialista Laptops', i: '' },
    { n: 'Felipe Morales', r: 'Técnico Tablets', i: '' },
    { n: 'Josefa Lagos', r: 'Experta Placa Base', i: '' },
    { n: 'Matías Pérez', r: 'Técnico Smartphones', i: '' },
    { n: 'Daniela Araya', r: 'Soporte Software', i: '' },
  ]
  return (
    <div>
      <div style={{ background: '#0a1628', color: '#fff', padding: '4rem 24px', textAlign: 'center' }}>
        <h1 style={{ fontFamily: 'Space Grotesk,sans-serif', fontSize: '2.2rem', fontWeight: 800 }}>
          Sobre ReparaTech{' '}
        </h1>
        <p style={{ opacity: 0.75, maxWidth: 560, margin: '10px auto 0', fontSize: '1rem' }}>
          Expertos en reparación de dispositivos electrónicos desde 2017, comprometidos con calidad y
          honestidad.
        </p>
      </div>
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '2rem 1.5rem' }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '2rem',
            marginBottom: '3rem',
            alignItems: 'center',
          }}
        >
          <div>
            <Img
              src="https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=600&q=80"
              alt="Taller"
              style={{ width: '100%', height: 280, borderRadius: 14 }}
              fallback=""
            />
          </div>
          <div>
            <h2
              style={{
                fontFamily: 'Space Grotesk,sans-serif',
                fontSize: '1.5rem',
                fontWeight: 700,
                marginBottom: 12,
              }}
            >
              Nuestra <span style={{ color: '#00b4d8' }}>historia</span>
            </h2>
            <p style={{ color: '#6b7280', lineHeight: 1.7, marginBottom: 12 }}>
              ReparaTech nació en 2017 con una misión clara: brindar servicio técnico de calidad a
              precios justos en Santiago Centro.
            </p>
            <p style={{ color: '#6b7280', lineHeight: 1.7 }}>
              Hoy contamos con 6 técnicos especializados y atendemos más de 800 reparaciones al mes con
              garantía en todos nuestros trabajos.
            </p>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '0.8rem',
                marginTop: '1.5rem',
              }}
            >
              {[
                ['800+', 'Rep./mes'],
                ['7 años', 'Exp.'],
                ['98%', 'Satisf.'],
                ['6', 'Técnicos'],
              ].map(([v, l]) => (
                <div
                  key={l}
                  style={{
                    background: '#f4f7fb',
                    border: '1px solid #dde3ea',
                    borderRadius: 10,
                    padding: '1rem',
                    textAlign: 'center',
                  }}
                >
                  <div
                    style={{
                      fontFamily: 'Space Grotesk,sans-serif',
                      fontSize: '1.6rem',
                      fontWeight: 800,
                      color: '#0f4c81',
                    }}
                  >
                    {v}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>{l}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <h2
          style={{
            fontFamily: 'Space Grotesk,sans-serif',
            fontSize: '1.4rem',
            fontWeight: 700,
            marginBottom: '1.2rem',
          }}
        >
          Nuestro <span style={{ color: '#00b4d8' }}>equipo</span>
        </h2>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill,minmax(160px,1fr))',
            gap: '1rem',
          }}
        >
          {equipo.map((t) => (
            <div
              key={t.n}
              style={{
                background: '#fff',
                border: '1px solid #dde3ea',
                borderRadius: 14,
                padding: '1.5rem',
                textAlign: 'center',
              }}
            >
              <div
                style={{
                  width: 60,
                  height: 60,
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg,#0f4c81,#00b4d8)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.6rem',
                  margin: '0 auto 10px',
                }}
              >
                {t.i}
              </div>
              <div style={{ fontWeight: 700, fontSize: '0.88rem' }}>{t.n}</div>
              <div style={{ fontSize: '0.72rem', color: '#6b7280', marginTop: 2 }}>{t.r}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export function BlogPage({ onNav }) {
  const blogs = blogsDB.getAll()
  return (
    <div style={{ maxWidth: 1100, margin: '0 auto', padding: '2rem 1.5rem' }}>
      <h2
        style={{
          fontFamily: 'Space Grotesk,sans-serif',
          fontSize: '1.6rem',
          fontWeight: 700,
          marginBottom: '1.2rem',
        }}
      >
        Blog <span style={{ color: '#00b4d8' }}>ReparaTech</span>
      </h2>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill,minmax(280px,1fr))',
          gap: '1.2rem',
        }}
      >
        {blogs.map((b) => (
          <div
            key={b.id}
            onClick={() => onNav('blog-detalle', b.id)}
            style={{
              background: '#fff',
              border: '1px solid #dde3ea',
              borderRadius: 14,
              overflow: 'hidden',
              cursor: 'pointer',
              transition: 'box-shadow 0.2s',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.boxShadow = '0 6px 24px rgba(0,0,0,0.1)')}
            onMouseLeave={(e) => (e.currentTarget.style.boxShadow = '')}
          >
            <Img src={b.imagen} alt={b.titulo} style={{ width: '100%', height: 190 }} fallback="" />
            <div style={{ padding: '1.1rem' }}>
              <div
                style={{
                  fontSize: '0.72rem',
                  color: '#00b4d8',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                }}
              >
                {b.tag}
              </div>
              <div style={{ fontWeight: 700, margin: '4px 0', fontSize: '0.95rem', lineHeight: 1.4 }}>
                {b.titulo}
              </div>
              <div style={{ fontSize: '0.82rem', color: '#6b7280', marginBottom: 8, lineHeight: 1.5 }}>
                {b.resumen}
              </div>
              <div style={{ fontSize: '0.75rem', color: '#aaa' }}> {b.fecha}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export function DetalleBlogPage({ blogId, onNav }) {
  const blog = blogsDB.getById(blogId)
  const otros = blogsDB
    .getAll()
    .filter((b) => b.id !== blogId)
    .slice(0, 2)
  if (!blog)
    return (
      <div style={{ maxWidth: 720, margin: '2rem auto', padding: '0 1.5rem' }}>
        <p>Artículo no encontrado.</p>
      </div>
    )
  return (
    <div style={{ maxWidth: 720, margin: '0 auto', padding: '2rem 1.5rem' }}>
      <button
        onClick={() => onNav('blog')}
        style={{
          background: '#f4f7fb',
          border: '1px solid #dde3ea',
          padding: '6px 14px',
          borderRadius: 8,
          cursor: 'pointer',
          marginBottom: 16,
          fontSize: '0.85rem',
          fontWeight: 600,
        }}
      >
        ← Volver al blog
      </button>
      <Img
        src={blog.imagen}
        alt={blog.titulo}
        style={{ width: '100%', height: 280, borderRadius: 14, marginBottom: 20 }}
        fallback=""
      />
      <span
        style={{
          background: '#00b4d8',
          color: '#fff',
          borderRadius: 20,
          padding: '3px 12px',
          fontSize: '0.73rem',
          fontWeight: 700,
        }}
      >
        {blog.tag}
      </span>
      <h1
        style={{
          fontFamily: 'Space Grotesk,sans-serif',
          fontSize: '1.8rem',
          fontWeight: 800,
          margin: '12px 0 8px',
          lineHeight: 1.3,
        }}
      >
        {blog.titulo}
      </h1>
      <div style={{ color: '#aaa', fontSize: '0.82rem', marginBottom: 20 }}> {blog.fecha}</div>
      <p style={{ lineHeight: 1.9, color: '#374151', fontSize: '0.95rem' }}>{blog.contenido}</p>
      {otros.length > 0 && (
        <>
          <hr style={{ margin: '2rem 0', border: 'none', borderTop: '1px solid #dde3ea' }} />
          <h3 style={{ fontWeight: 700, marginBottom: 12 }}>Otros artículos</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            {otros.map((b) => (
              <div
                key={b.id}
                onClick={() => onNav('blog-detalle', b.id)}
                style={{
                  background: '#fff',
                  border: '1px solid #dde3ea',
                  borderRadius: 12,
                  overflow: 'hidden',
                  cursor: 'pointer',
                }}
              >
                <Img src={b.imagen} alt={b.titulo} style={{ width: '100%', height: 130 }} fallback="" />
                <div style={{ padding: '10px' }}>
                  <div style={{ fontSize: '0.72rem', color: '#00b4d8', fontWeight: 700 }}>{b.tag}</div>
                  <div style={{ fontWeight: 700, fontSize: '0.88rem', margin: '4px 0' }}>{b.titulo}</div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}

export function ContactoPage({ toast }) {
  const [form, setForm] = useState({ nombre: '', correo: '', asunto: '', mensaje: '' })
  const submit = (e) => {
    e.preventDefault()
    toast && toast(' Mensaje enviado. Te responderemos pronto.')
    setForm({ nombre: '', correo: '', asunto: '', mensaje: '' })
  }
  return (
    <div style={{ maxWidth: 1000, margin: '0 auto', padding: '2rem 1.5rem' }}>
      <h2
        style={{
          fontFamily: 'Space Grotesk,sans-serif',
          fontSize: '1.6rem',
          fontWeight: 700,
          marginBottom: '1.5rem',
        }}
      >
        Contáctanos
      </h2>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
        <div>
          <Img
            src="https://images.unsplash.com/photo-1534536281715-e28d76689b4d?w=500&q=80"
            alt="Contacto"
            style={{ width: '100%', height: 200, borderRadius: 12, marginBottom: 16 }}
            fallback=""
          />
          {[
            ['', 'Dirección', "Av. Libertador B. O'Higgins 1234, Santiago"],
            ['', 'Teléfono', '+56 2 2345 6789'],
            ['', 'Email', 'contacto@reparatech.cl'],
            ['', 'Horario', 'Lun–Vie 9:00–19:00 | Sáb 10:00–15:00'],
          ].map(([ic, l, v]) => (
            <div key={l} style={{ display: 'flex', gap: 12, marginBottom: 14 }}>
              <span style={{ fontSize: '1.2rem', marginTop: 2 }}>{ic}</span>
              <div>
                <div style={{ fontWeight: 700, fontSize: '0.88rem' }}>{l}</div>
                <div style={{ color: '#6b7280', fontSize: '0.83rem', marginTop: 2 }}>{v}</div>
              </div>
            </div>
          ))}
        </div>
        <div
          style={{
            background: '#fff',
            borderRadius: 14,
            padding: '1.5rem',
            boxShadow: '0 4px 16px rgba(0,0,0,0.07)',
          }}
        >
          <h3 style={{ fontWeight: 700, marginBottom: 16 }}>Envíanos un mensaje</h3>
          <form onSubmit={submit}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 10 }}>
              <div>
                <label
                  style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, marginBottom: 4 }}
                >
                  Nombre *
                </label>
                <input
                  style={inputStyle}
                  value={form.nombre}
                  onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                  required
                />
              </div>
              <div>
                <label
                  style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, marginBottom: 4 }}
                >
                  Correo *
                </label>
                <input
                  style={inputStyle}
                  type="email"
                  value={form.correo}
                  onChange={(e) => setForm({ ...form, correo: e.target.value })}
                  required
                />
              </div>
            </div>
            <div style={{ marginBottom: 10 }}>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, marginBottom: 4 }}>
                Asunto *
              </label>
              <input
                style={inputStyle}
                value={form.asunto}
                onChange={(e) => setForm({ ...form, asunto: e.target.value })}
                required
              />
            </div>
            <div style={{ marginBottom: 14 }}>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, marginBottom: 4 }}>
                Mensaje *
              </label>
              <textarea
                style={{ ...inputStyle, resize: 'vertical' }}
                rows={4}
                value={form.mensaje}
                onChange={(e) => setForm({ ...form, mensaje: e.target.value })}
                required
              />
            </div>
            <button
              type="submit"
              style={{
                width: '100%',
                padding: '11px',
                background: '#0f4c81',
                color: '#fff',
                border: 'none',
                borderRadius: 10,
                fontWeight: 700,
                fontSize: '0.95rem',
                cursor: 'pointer',
              }}
            >
              Enviar mensaje
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export function RegistroPage({ onNav, onLogin }) {
  const [form, setForm] = useState({
    nombre: '',
    apellido: '',
    correo: '',
    telefono: '',
    direccion: '',
    password: '',
    confirmar: '',
  })
  const [err, setErr] = useState('')
  const submit = async (e) => {
    e.preventDefault()
    if (form.password !== form.confirmar) {
      setErr('Las contraseñas no coinciden.')
      return
    }
    try {
      const { confirmar, ...data } = form
      const usuario = await clientesDB.register(data)
      await onLogin?.(usuario)
      onNav('home')
    } catch (ex) {
      setErr(ex.message)
    }
  }
  return (
    <div style={{ maxWidth: 500, margin: '2rem auto', padding: '0 1.5rem' }}>
      <div
        style={{
          background: '#fff',
          borderRadius: 16,
          padding: '2rem',
          boxShadow: '0 4px 20px rgba(0,0,0,0.07)',
        }}
      >
        <h2 style={{ fontFamily: 'Space Grotesk,sans-serif', marginBottom: 4 }}>Crear cuenta</h2>
        <p style={{ color: '#6b7280', fontSize: '0.85rem', marginBottom: 16 }}>
          Regístrate para hacer seguimiento de tus reparaciones
        </p>
        {err && (
          <div
            style={{
              background: '#fee2e2',
              color: '#991b1b',
              padding: '8px 12px',
              borderRadius: 8,
              marginBottom: 12,
              fontSize: '0.85rem',
            }}
          >
            {' '}
            {err}
          </div>
        )}
        <form onSubmit={submit}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 10 }}>
            <div>
              <label style={labelStyle}>Nombre *</label>
              <input
                style={inputStyle}
                value={form.nombre}
                onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                required
              />
            </div>
            <div>
              <label style={labelStyle}>Apellido *</label>
              <input
                style={inputStyle}
                value={form.apellido}
                onChange={(e) => setForm({ ...form, apellido: e.target.value })}
                required
              />
            </div>
          </div>
          <div style={{ marginBottom: 10 }}>
            <label style={labelStyle}>Correo *</label>
            <input
              style={inputStyle}
              type="email"
              value={form.correo}
              onChange={(e) => setForm({ ...form, correo: e.target.value })}
              required
            />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 10 }}>
            <div>
              <label style={labelStyle}>Teléfono</label>
              <input
                style={inputStyle}
                value={form.telefono}
                onChange={(e) => setForm({ ...form, telefono: e.target.value })}
                placeholder="+569..."
              />
            </div>
            <div>
              <label style={labelStyle}>Dirección</label>
              <input
                style={inputStyle}
                value={form.direccion}
                onChange={(e) => setForm({ ...form, direccion: e.target.value })}
              />
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 16 }}>
            <div>
              <label style={labelStyle}>Contraseña *</label>
              <input
                style={inputStyle}
                type="password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                required
              />
            </div>
            <div>
              <label style={labelStyle}>Confirmar *</label>
              <input
                style={inputStyle}
                type="password"
                value={form.confirmar}
                onChange={(e) => setForm({ ...form, confirmar: e.target.value })}
                required
              />
            </div>
          </div>
          <button
            type="submit"
            style={{
              width: '100%',
              padding: '11px',
              background: '#0f4c81',
              color: '#fff',
              border: 'none',
              borderRadius: 10,
              fontWeight: 700,
              fontSize: '0.95rem',
              cursor: 'pointer',
            }}
          >
            Crear cuenta
          </button>
        </form>
        <p style={{ textAlign: 'center', marginTop: 12, fontSize: '0.84rem', color: '#6b7280' }}>
          ¿Ya tienes cuenta?{' '}
          <span
            style={{ color: '#00b4d8', cursor: 'pointer', fontWeight: 600 }}
            onClick={() => onNav('login')}
          >
            Inicia sesión
          </span>
        </p>
      </div>
    </div>
  )
}

export function LoginClientePage({ onNav, onLogin }) {
  const [form, setForm] = useState({ correo: '', password: '' })
  const [err, setErr] = useState('')
  const submit = async (e) => {
    e.preventDefault()
    try {
      const c = await clientesDB.login(form.correo, form.password)
      if (c.rol !== 'cliente') throw new Error('Utiliza el acceso al panel')
      await onLogin?.(c)
      onNav('home')
    } catch (ex) {
      setErr(ex.message)
    }
  }
  return (
    <div style={{ maxWidth: 420, margin: '2rem auto', padding: '0 1.5rem' }}>
      <div
        style={{
          background: '#fff',
          borderRadius: 16,
          padding: '2rem',
          boxShadow: '0 4px 20px rgba(0,0,0,0.07)',
        }}
      >
        <h2 style={{ fontFamily: 'Space Grotesk,sans-serif', marginBottom: 4 }}>Iniciar sesión</h2>
        <p style={{ color: '#6b7280', fontSize: '0.85rem', marginBottom: 12 }}>
          Accede para ver el estado de tus reparaciones
        </p>
        <div
          style={{
            background: '#e0f2fe',
            borderRadius: 8,
            padding: '8px 12px',
            fontSize: '0.8rem',
            color: '#075985',
            marginBottom: 12,
          }}
        >
          Cuenta de prueba: rodrigo.chacon@reparatech.cl / 1234
        </div>
        {err && (
          <div
            style={{
              background: '#fee2e2',
              color: '#991b1b',
              padding: '8px 12px',
              borderRadius: 8,
              marginBottom: 12,
              fontSize: '0.85rem',
            }}
          >
            {' '}
            {err}
          </div>
        )}
        <form onSubmit={submit}>
          <div style={{ marginBottom: 10 }}>
            <label style={labelStyle}>Correo</label>
            <input
              style={inputStyle}
              type="email"
              value={form.correo}
              onChange={(e) => setForm({ ...form, correo: e.target.value })}
              required
            />
          </div>
          <div style={{ marginBottom: 16 }}>
            <label style={labelStyle}>Contraseña</label>
            <input
              style={inputStyle}
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
            />
          </div>
          <button
            type="submit"
            style={{
              width: '100%',
              padding: '11px',
              background: '#0f4c81',
              color: '#fff',
              border: 'none',
              borderRadius: 10,
              fontWeight: 700,
              fontSize: '0.95rem',
              cursor: 'pointer',
            }}
          >
            Entrar
          </button>
        </form>
        <p style={{ textAlign: 'center', marginTop: 12, fontSize: '0.84rem', color: '#6b7280' }}>
          ¿No tienes cuenta?{' '}
          <span
            style={{ color: '#00b4d8', cursor: 'pointer', fontWeight: 600 }}
            onClick={() => onNav('registro')}
          >
            Regístrate
          </span>
        </p>
        <hr style={{ margin: '16px 0', border: 'none', borderTop: '1px solid #dde3ea' }} />
        <button
          onClick={() => onNav('admin-login')}
          style={{
            width: '100%',
            padding: '10px',
            background: '#f4f7fb',
            color: '#374151',
            border: '1px solid #dde3ea',
            borderRadius: 10,
            fontWeight: 600,
            fontSize: '0.85rem',
            cursor: 'pointer',
          }}
        >
          Acceso administradores
        </button>
      </div>
    </div>
  )
}

export function CheckoutPage({ carrito, clienteLogueado, onResult, toast }) {
  const [dispositivo, setDispositivo] = useState('')
  const [falla, setFalla] = useState('')
  const [enviando, setEnviando] = useState(false)
  const total = carrito.reduce((suma, servicio) => suma + serviciosDB.precioConDescuento(servicio), 0)

  async function solicitar(event) {
    event.preventDefault()
    if (enviando || !clienteLogueado?.clienteId || carrito.length === 0) return
    setEnviando(true)
    try {
      const orden = await ordenesDB.create({
        dispositivo: dispositivo.trim(),
        falla: falla.trim(),
        servicioId: carrito[0].id,
        servicioIds: carrito.map(servicio => servicio.id),
      })
      onResult(orden)
    } catch (error) {
      toast(error.message, 'error')
    } finally {
      setEnviando(false)
    }
  }

  return (
    <section className="store-container repair-checkout">
      <h1>Solicitar reparación</h1>
      <form className="a-card repair-form" onSubmit={solicitar}>
        <label htmlFor="equipo">Marca y modelo</label>
        <input id="equipo" className="f-input" value={dispositivo}
          onChange={e => setDispositivo(e.target.value)} required maxLength={120} />
        <label htmlFor="falla">¿Qué problema presenta el equipo?</label>
        <textarea id="falla" className="f-input" value={falla}
          onChange={e => setFalla(e.target.value)} required maxLength={1000} rows={4} />
        <ul className="repair-summary">
          {carrito.map((servicio, index) => (
            <li key={index}><span>{servicio.nombre}</span><strong>{formatCLP(serviciosDB.precioConDescuento(servicio))}</strong></li>
          ))}
        </ul>
        <p><strong>Total estimado {formatCLP(total)}</strong></p>
        <button className="btn-rt btn-primary-rt" type="submit"
          disabled={enviando || !carrito.length || !dispositivo.trim() || !falla.trim()}>
          {enviando ? 'Registrando…' : 'Registrar solicitud'}
        </button>
      </form>
    </section>
  )
}
