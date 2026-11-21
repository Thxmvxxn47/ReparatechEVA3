# ReparaTech EVA3 · Versión 1

Prototipo web de gestión de un taller de reparación de dispositivos. Desarrollado para Desarrollo Fullstack II (DSY1104), Duoc UC. Esta entrega documenta la base de frontend con datos de demostración en memoria.

## Ejecutar en local

Requisitos: Node.js 22 LTS y npm. Las pruebas automatizadas requieren Google Chrome.

```bash
cd frontend
npm ci
npm run dev
```

Abre [localhost:5173](http://localhost:5173). Para generar la compilación estática, ejecuta `npm run build`. Vite escribe los archivos en `frontend/dist/`.

## Arquitectura

| Módulo | Responsabilidad |
| --- | --- |
| [`frontend/src/main.jsx`](frontend/src/main.jsx) | Punto de entrada de React y carga de estilos. |
| [`frontend/src/App.jsx`](frontend/src/App.jsx) | Estado de navegación, sesión de demostración, carrito y composición de las vistas. |
| [`frontend/src/pages/tienda/`](frontend/src/pages/tienda) | Catálogo, ofertas, registro de clientes y checkout simulado. |
| [`frontend/src/pages/admin/`](frontend/src/pages/admin) | Panel interno con gestión de órdenes, clientes, técnicos, servicios y repuestos. |
| [`frontend/src/data/db.js`](frontend/src/data/db.js) | Datos iniciales y operaciones de consulta, creación, edición y eliminación sobre colecciones en memoria. |

La interfaz usa React 18, JavaScript, Bootstrap 5 y Bootstrap Icons. La navegación se controla mediante estado de React. Las vistas consultan el módulo de datos directamente y las modificaciones se pierden al recargar la página.

## Modelo y reglas

- Una orden referencia a un cliente, un servicio y, cuando corresponde, un técnico. Puede registrar repuestos utilizados, diagnóstico, prioridad y costo.
- Los estados de una orden incluyen `Recibido`, `En diagnóstico`, `En reparación`, `Listo para retirar` y `Cancelado`.
- Los totales del carrito se calculan en pesos chilenos con los precios y descuentos del catálogo. El ajuste de stock rechaza valores negativos.
- El inicio de sesión, los permisos por rol y el pago son simulaciones del lado del cliente. Esta entrega se ejecuta sin API, base de datos persistente ni conexión a Transbank.

## Verificación

Desde `frontend`, ejecuta `npm test` para correr Jasmine con Karma y Chrome Headless. Las pruebas existentes ejercitan una réplica en memoria del modelo de datos, por lo que se complementan con la comprobación manual de la interfaz.

1. En **Servicios**, agrega una oferta al carrito y comprueba que aparezca el precio con descuento.
2. Entra al panel **Admin** con la cuenta de demostración `admin@reparatech.cl` / `admin123`. Abre **Órdenes / Boletas** y verifica que un cambio de estado aparezca en el listado.
3. Prueba el acceso de cliente con `carlos@gmail.com` / `1234`. Recarga la página para comprobar que la aplicación vuelve a los datos iniciales.

El historial de Git conserva la publicación inicial de EVA3.
