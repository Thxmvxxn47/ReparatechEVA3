# ReparaTech EVA3 · Presentación

ReparaTech registra solicitudes de reparación desde el catálogo. El taller asigna técnicos y actualiza el estado de cada orden. El cliente puede seguirla en **Mis reparaciones**. Esta edición funciona sin pasarela de pago.

## Arranque

Requisitos para ejecutar con la configuración del proyecto. JDK 21, Maven y Node.js 20 o posterior. Usa `localhost` para ambos servicios.

Desde la carpeta que contiene `backend` y `frontend`, abre dos terminales.

```powershell
cd backend
mvn spring-boot:run
```

```powershell
cd frontend
npm ci
npm run dev
```

- [Tienda y acceso del equipo](http://localhost:5173). El acceso del equipo está en el pie de página.
- [Swagger UI](http://localhost:8080/swagger-ui.html) y [OpenAPI](http://localhost:8080/v3/api-docs).
- Vite dirige `/api` al backend en el puerto 8080. H2 guarda los datos de esta edición en `backend/datos/`. Arranca desde la copia recién extraída para cargar el plantel actualizado. Si importas una base anterior, conserva sus nombres y registros ya existentes.
- Las credenciales son para demostración local.

## Cuentas de demostración

| Nombre | Rol | Usuario | Contraseña |
|---|---|---|---|
| Thomas Marin | Encargado de Taller | encargado@reparatech.cl | 1234 |
| Maximiliano Navarrete | Administrador | admin@reparatech.cl | 1234 |
| Dafne Vargas | Recepcionista | recepcion@reparatech.cl | 1234 |
| Darliette Loncopán | Técnico | tecnico@reparatech.cl | 1234 |
| Victor Gutierrez | Técnico | victor.gutierrez@reparatech.cl | 1234 |
| Carlos Ramirez | Técnico | carlos.ramirez@reparatech.cl | 1234 |
| Mizahel Huaman | Técnico | mizahel.huaman@reparatech.cl | 1234 |
| Sebastian Covarrubias | Técnico | sebastian.covarrubias@reparatech.cl | 1234 |
| Matias Estobar | Técnico | matias.estobar@reparatech.cl | 1234 |
| Rodrigo Chacon | Cliente | rodrigo.chacon@reparatech.cl | 1234 |

## Guion EVA3

1. Entra como cliente, agrega un servicio al carrito y registra una solicitud. Spring Boot toma los precios del catálogo y devuelve el código de la orden.
2. Entra como Thomas, abre **Órdenes / Boletas** y asigna la orden. Entra con la cuenta del técnico asignado y cambia el estado. El cliente puede consultar el avance en **Mis reparaciones**.
3. Entra como Maximiliano para mostrar el plantel y el CRUD de servicios o repuestos. Desde Swagger, inicia sesión con `POST /api/auth/login` y usa el JWT como `Authorization: Bearer` en las rutas protegidas.
4. Recarga la app con sesión iniciada para demostrar la renovación por cookie HttpOnly. El proyecto contiene un backend Spring Boot organizado en controladores, servicios y repositorios, más un frontend React separado.
5. Para verificar la entrega con JDK 21, ejecuta `mvn test` en backend y `npm run build` en frontend. El ZIP original trae un comando Karma sin archivo de configuración, por lo que esa suite de frontend no se puede ejecutar con el material adjunto.

## Fotografías del catálogo

Las fotos de iFixit se incluyen para esta demostración académica no comercial. Se guardaron las versiones de tamaño medio publicadas por iFixit, sin retoques. El SSD se muestra como ejemplo de un modelo real con la capacidad e interfaz catalogadas. [Licencia de contenido de iFixit](https://about.ifixit.com/Info/Licensing)

| Ficha | Autor y fuente | Licencia | Disponibilidad |
|---|---|---|---|
| iPhone 16 Pro Max | [メイド理世](https://commons.wikimedia.org/wiki/File:IPhone_16_Pro_Max_%2854252162653%29.jpg) | [CC BY-SA 2.0](https://creativecommons.org/licenses/by-sa/2.0/) | Enlace externo |
| iPhone 15 | [メイド理世](https://commons.wikimedia.org/wiki/File:Back_view_of_iPhone_15_Blue.jpg) | [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/) | Enlace externo |
| Samsung Galaxy S25 Ultra | [Captainmorlypogi1959](https://commons.wikimedia.org/wiki/File:Samsung_Galaxy_S25_Ultra_2025.jpg) | [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/) | Enlace externo |
| Samsung Galaxy S24 | [Vis M](https://commons.wikimedia.org/wiki/File:Samsung_Galaxy_S24.jpg) | [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/) | Enlace externo |
| Xiaomi 14 Ultra | [RuinDig/Yuki Uchida](https://commons.wikimedia.org/wiki/File:Shibuya-Tokyo---2024-08-28_066.jpg) | [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/) | Enlace externo |
| Google Pixel 9 Pro | [Kyu3a](https://commons.wikimedia.org/wiki/File:Camera_of_Google_Pixel_9_Pro_-_1.jpg) | [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/) | Enlace externo |
| iPad Pro 13" M4 | [Nick Schultz y colaboradores / iFixit](https://www.ifixit.com/Guide/iPad+Pro+13-Inch+Battery+Removal/197871) | [CC BY-NC-SA 3.0](https://creativecommons.org/licenses/by-nc-sa/3.0/) | Incluida en ZIP |
| iPad Air 11" M2 | [Arthur Shi y colaboradores / iFixit](https://www.ifixit.com/Guide/iPad+Air+6+11-Inch+Opening+Procedure/226757) | [CC BY-NC-SA 3.0](https://creativecommons.org/licenses/by-nc-sa/3.0/) | Incluida en ZIP |
| MacBook Pro 14" M4 | [Spencer Day y colaboradores / iFixit](https://www.ifixit.com/Guide/MacBook+Pro+14-Inch+Late+2024+(M4)+Lower+Case+Replacement/217918) | [CC BY-NC-SA 3.0](https://creativecommons.org/licenses/by-nc-sa/3.0/) | Incluida en ZIP |
| Dell XPS 15 | [Clay Eickemeyer y colaboradores / iFixit](https://www.ifixit.com/Guide/Dell+XPS+15+9520+Back+Cover+Replacement/153709) | [CC BY-NC-SA 3.0](https://creativecommons.org/licenses/by-nc-sa/3.0/) | Incluida en ZIP. Variante 9520 |
| ASUS ROG Zephyrus G14 | [Omar Henriquez y colaboradores / iFixit](https://www.ifixit.com/Guide/Asus+ROG+Zephyrus+G14+Battery+Replacement/165021#s347104) | [CC BY-NC-SA 3.0](https://creativecommons.org/licenses/by-nc-sa/3.0/) | Incluida en ZIP |
| Pantalla iPhone 15 | [Clay Eickemeyer y colaboradores / iFixit](https://www.ifixit.com/Guide/iPhone+15+Screen+Replacement/165669#s401464) | [CC BY-NC-SA 3.0](https://creativecommons.org/licenses/by-nc-sa/3.0/) | Incluida en ZIP |
| Pantalla iPhone 14 | [Tobias Isakeit y colaboradores / iFixit](https://www.ifixit.com/Guide/iPhone+14+Screen+Replacement/152975#s333365) | [CC BY-NC-SA 3.0](https://creativecommons.org/licenses/by-nc-sa/3.0/) | Incluida en ZIP |
| Pantalla iPhone 13 | [Kyle Smith y colaboradores / iFixit](https://www.ifixit.com/Guide/iPhone+13+Screen+Replacement/145897#s300462) | [CC BY-NC-SA 3.0](https://creativecommons.org/licenses/by-nc-sa/3.0/) | Incluida en ZIP |
| Pantalla Samsung S24 | [Nick Schultz y colaboradores / iFixit](https://www.ifixit.com/Guide/Samsung+Galaxy+S24+Screen+Replacement/175579#s374908) | [CC BY-NC-SA 3.0](https://creativecommons.org/licenses/by-nc-sa/3.0/) | Incluida en ZIP |
| Pantalla Samsung S23 | [Alex Diaz-Kokaisl y colaboradores / iFixit](https://www.ifixit.com/Guide/Samsung+Galaxy+S23+Screen+Replacement/175309) | [CC BY-NC-SA 3.0](https://creativecommons.org/licenses/by-nc-sa/3.0/) | Incluida en ZIP. Pantalla separada junto al equipo |
| Batería iPhone 15 | [Clay Eickemeyer y colaboradores / iFixit](https://www.ifixit.com/Guide/iPhone+15+Battery+Replacement/165733#s401386) | [CC BY-NC-SA 3.0](https://creativecommons.org/licenses/by-nc-sa/3.0/) | Incluida en ZIP |
| Batería iPhone 14 | [Tobias Isakeit y colaboradores / iFixit](https://www.ifixit.com/Guide/iPhone+14+Battery+Replacement/152966#s317887) | [CC BY-NC-SA 3.0](https://creativecommons.org/licenses/by-nc-sa/3.0/) | Incluida en ZIP |
| Batería Samsung S24 | [Nick Schultz y colaboradores / iFixit](https://www.ifixit.com/Guide/Samsung+Galaxy+S24+Battery+Replacement/175612#s374379) | [CC BY-NC-SA 3.0](https://creativecommons.org/licenses/by-nc-sa/3.0/) | Incluida en ZIP |
| Batería MacBook Air M2 | [Spencer Day y colaboradores / iFixit](https://www.ifixit.com/Guide/MacBook+Air+2022+(M2)+Battery+Replacement/156332#s327229) | [CC BY-NC-SA 3.0](https://creativecommons.org/licenses/by-nc-sa/3.0/) | Incluida en ZIP |
| Disco SSD 512GB NVMe | [SparkFun Electronics](https://commons.wikimedia.org/wiki/File:Raspberry-Pi-SSD-Feature_(cropped)_512GB_NVMe.jpg) | [CC BY 2.0](https://creativecommons.org/licenses/by/2.0/) | Incluida en ZIP. Ejemplo de SSD NVMe de 512 GB, formato M.2 2230. Imagen redimensionada |
| Pantalla iPad Air M2 | [Arthur Shi y colaboradores / iFixit](https://www.ifixit.com/Guide/iPad+Air+6+11-Inch+Screen+Replacement/226892#s444050) | [CC BY-NC-SA 3.0](https://creativecommons.org/licenses/by-nc-sa/3.0/) | Incluida en ZIP. Pantalla de la variante 11 pulgadas |
| Pantalla Samsung Tab S9 | [Nigel y colaboradores / iFixit](https://www.ifixit.com/Guide/Samsung+Galaxy+Tab+S9+Display+Replacement/178997#s381210) | [CC BY-NC-SA 3.0](https://creativecommons.org/licenses/by-nc-sa/3.0/) | Incluida en ZIP. Pantalla levantada durante la reparación |
| MacBook Air 13 pulgadas M3 | [VCCBoardRepairs y Samhext, Repair Wiki](https://wiki.thirdparty.repair/guides/macbook-air-a3113-trackpad-and-or-keyboard-not-working/) | [CC BY-SA 3.0](https://creativecommons.org/licenses/by-sa/3.0/) | Incluida en ZIP. Equipo desmontado, modelo A3113 |

Fotos pendientes de verificar y licenciar para el ZIP: Galaxy Tab S10 Ultra y Galaxy Tab S9 FE. Wikimedia devolvió HTTP 429 durante la descarga, por lo que sus seis fichas conservan enlaces externos.

## Resultado de la verificación

- `npm run build` completado con Node.js 24.
- Maven completó ocho pruebas con H2 en memoria y JDK 17, usando `-Djava.version=17`. La configuración original del proyecto conserva JDK 21.
- Las pruebas cubrieron arranque, catálogo público, Swagger, acceso con JWT, inicio de sesión del plantel, alcance del técnico y creación de una solicitud con el total calculado por la API.
- Queda pendiente una demostración completa en el navegador, incluida la restauración de sesión después de recargar, y la validación con MySQL y JDK 21.
