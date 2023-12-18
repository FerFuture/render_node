// Inicializa el contador del carrito a 0.
let productosEnCarrito = [];
let productsList = [];

// Función para aumentar la cantidad en el carrito de un producto específico.
function agregarAlCarrito(productId) {
  const product = productsList.find(p => p.id === productId);

  if (product.stock > 0) {
    product.stock--;
    productosEnCarrito.push(productId);
  }

  actualizarContadorCarrito();
  actualizarCantidadEnCarrito(productId);
}

// Función para disminuir la cantidad en el carrito de un producto específico.
function quitarDelCarrito(productId) {
  const index = productosEnCarrito.indexOf(productId);

  if (index !== -1) {
    const product = productsList.find(p => p.id === productId);
    product.stock++;
    productosEnCarrito.splice(index, 1);
    actualizarContadorCarrito();
    actualizarCantidadEnCarrito(productId);
  }
}


// Función para actualizar el contador del carrito en el DOM.
function actualizarContadorCarrito() {
  const contadorCarrito = document.querySelector('.contador-carrito');
  contadorCarrito.textContent = productosEnCarrito.length; // Usar la longitud del array
}

// Función para actualizar la cantidad en el carrito de un producto en el DOM.
function actualizarCantidadEnCarrito() {
  productsList.forEach(product => {
    const cantidadElement = document.querySelectorAll(`[data-product-id="${product.id}"] .cantidad`);
    if (cantidadElement) {
      const cantidad = productosEnCarrito.filter(id => id === product.id).length;
      cantidadElement.forEach(element => {
        element.textContent = cantidad; // Actualiza la cantidad de cada producto
      });
    }
  });
}



// Generar productos en el html
// Modifica la función displayProductos para consumir la nueva ruta
async function displayProductos() {
  try {
    // Realiza la solicitud para obtener los productos destacados
    const response = await fetch('/api/destacados');
    const products = await response.json();

    let productoHTML = '';
    products.forEach((p, index) => {
      let buttonHTML = '';

      if (p.stock <= 0) {
        buttonHTML = `<button disabled class="agregar disabled">Sin stock</button>`;
      } else {
        buttonHTML = `<button class="agregar" onclick="agregarAlCarrito(${p.id})">Agregar al Carrito</button>`;
      }

      productoHTML +=
        `<div class="producto" data-product-id="${p.id}">
           <img src="${p.image}" alt="${p.name}">
           <h3>${p.name}</h3>
           <p>Precio $${p.price}</p>
           <p>Cantidad en el carrito: <span class="cantidad">0</span></p>
           ${buttonHTML}
           <button class="quitar" onclick="quitarDelCarrito(${p.id})">Quitar del Carrito</button>
        </div>`;
    });

    document.getElementById('page-content').innerHTML = productoHTML;
  } catch (error) {
    console.error('Error al obtener productos destacados:', error);
  }
}


window.onload = async () => {
  productsList = await (await fetch("/api/productos")).json();
  displayProductos();
}



// Función para abrir el carrito
function abrirCarrito() {
  const modal = document.getElementById('carrito-modal');
  modal.style.display = 'block';

  // Llenar el contenido del carrito
  const carritoProductos = document.getElementById('carrito-productos');
  carritoProductos.innerHTML = '';

  // Crear un objeto para realizar un seguimiento de las cantidades de cada producto
  const cantidadPorProducto = {};

  productosEnCarrito.forEach(productId => {
    if (!cantidadPorProducto[productId]) {
      cantidadPorProducto[productId] = 1;
    } else {
      cantidadPorProducto[productId]++;
    }
  });

  // Calcular el total y llenar el contenido del carrito
  let total = 0;

  for (const productId in cantidadPorProducto) {
    const cantidad = cantidadPorProducto[productId];
    const producto = document.querySelector(`[data-product-id="${productId}"]`);
    const imagenProducto = producto.querySelector('img').src;
    const precioProductoStr = producto.querySelector('p').textContent.replace('$', '').replace(/[^0-9.]/g, '');
    const precioProducto = parseFloat(precioProductoStr);
    const subtotal = precioProducto * cantidad;
    total += subtotal;

    // Agrega la imagen del producto al carrito con una clase para el tamaño
    carritoProductos.innerHTML += `<div class="producto-carrito">
      <img class="imagen-carrito" src="${imagenProducto}" alt="Producto en el carrito">
      <p>Cantidad: ${cantidad}</p>
      <p>Subtotal: $${subtotal.toFixed(2)}</p>
    </div>`;
  }

  // Mostrar el total
  const totalPrecio = document.getElementById('total-precio');
  totalPrecio.textContent = total.toFixed(2);
}

  
  

  // Función para cerrar el carrito (cerrar el modal)
function cerrarCarrito() {
    const modal = document.getElementById('carrito-modal');
    modal.style.display = 'none';
  }
  
  // Llamar a la función cerrarCarrito() cuando se haga clic en la "X" del modal
  document.querySelector('.close').addEventListener('click', cerrarCarrito);
  
  async function completarCompra() {
    try {
      // Envía la lista de productos en el carrito al backend
      const response = await fetch("/api/pay", {
        method: "post",
        body: JSON.stringify(productosEnCarrito),
        headers: {
          "content-type": "application/json",
        },
      });
  
      if (response.ok) {
        const productsList = await response.json();
        console.log("Compra completada exitosamente:", productsList);
      } else {
        console.log("Error al procesar la compra");
      }
  
      productosEnCarrito = [];
    } catch (error) {
      console.error("Error en completarCompra:", error);
    }
  }
  
 // Agrega esta función al final de tu archivo app.js
// Modifica esta función al final de tu archivo app.js
const hamburguesaContainer = document.getElementById('hamburguesa-container');
const hamburguesaIcon = document.getElementById('hamburguesa-icon');
const menuDesplegable = document.getElementById('menu-desplegable');

hamburguesaContainer.addEventListener('click', function() {
  menuDesplegable.style.left = (menuDesplegable.style.left === '0px') ? '-250px' : '0px';
  hamburguesaIcon.classList.toggle('cerrar');
});

// Si deseas que el menú se cierre al hacer clic en cualquier parte del documento, puedes agregar el siguiente código:
document.addEventListener('click', function(event) {
  if (!hamburguesaContainer.contains(event.target) && !menuDesplegable.contains(event.target)) {
    menuDesplegable.style.left = '-250px';
    hamburguesaIcon.classList.remove('cerrar');
  }
});


function mostrarLoader() {
  document.getElementById('loader').style.display = 'block';
}

function ocultarLoader() {
  document.getElementById('loader').style.display = 'none';
}

// Ejemplo de uso
window.onload = async () => {
  mostrarLoader();
  productsList = await (await fetch("/api/productos")).json();
  displayProductos();
  ocultarLoader();
};

// Función para cambiar la ruta sin recargar la página
function navegarA(url) {
  history.pushState(null, null, url);
  manejarRuta(url);
}

// Función para manejar la lógica de enrutamiento
function manejarRuta(ruta) {
  const rutaSinSlash = ruta.replace(/^\/|\/$/g, '');
  switch (rutaSinSlash) {
    case 'almacen':
      filtrarProductosPorCategoria('almacen');
      break;
    // Añadir más casos para otras categorías
    default:
      // Mostrar todos los productos o página de inicio
      displayProductos();
      break;
  }
}

// Escuchar cambios de ruta
window.onpopstate = () => manejarRuta(window.location.pathname);
document.addEventListener('DOMContentLoaded', () => manejarRuta(window.location.pathname));

// Event listeners para los enlaces de categorías
document.querySelectorAll('.menu-desplegable a[data-category-id]').forEach(enlace => {
  enlace.addEventListener('click', (e) => {
    e.preventDefault();
    const categoryId = enlace.getAttribute('data-category-id');
    navegarA(`/${categoryId}`);
  });
});


async function filtrarProductosPorCategoria(categoryId) {
  mostrarLoader();
  try {
    // Asumiendo que tienes una API que devuelve productos por categoría
    const response = await fetch(`/api/productos/categoria/${categoryId}`);
    const productosFiltrados = await response.json();
    displayProductos(productosFiltrados);
  } catch (error) {
    console.error('Error al filtrar productos:', error);
  } finally {
    ocultarLoader();
  }
}

const nombresDeCategoria = {
  '1': 'Almacén',
  '2': 'Bebidas',
  '3': 'Carnes',
  '4': 'Frutas y Verduras',
  '5': 'Lácteos',
  '6': 'Limpieza',
  '7': 'Quesos y Fiambres',
  '8': 'congelados',
  '9': 'Panadería/Repostería',
  '10': 'Mascotas',
  // Agrega más categorías según sea necesario
};

const nombresDeSubcategoria = {

  '1': 'Aceites y Vinagres',
  '2': 'Pastas Secas',
  '3': 'Arroz y Legumbres',
  '4': 'Harinas',
  '5': 'Enlatados',
  '6': 'Sal, Aderezos y Saborizadores',
  '7': 'Caldos, Sopas y Puré',
  '8': 'Repostería y Postres',
  '9': 'Snacks',

  '10': 'Cervezas',
  '11': 'Vinos',
  '12': 'Fernet',
  '13': 'Bebidas Blancas',
  '14': 'Gaseosas',
  '15': 'Aguas',
  '16': 'Jugos',
  '17': 'Bebidas Energizantes',

  '18': 'Carne Vacuna',
  '19': 'Pollo y Granja',
  '20': 'Carne de Cerdo',
  '21': 'Achuras y Embutidos',
  '22': 'Pescados y Mariscos',

  '23': 'Frutas',
  '24': 'Verduras',
  '25': 'Frutos Secos',

  '26': 'Leches',
  '27': 'Yogures',
  '28': 'Mantecas, Margarinas y Levaduras',
  '29': 'Dulce de Leche',
  '30': 'Cremas de Leche',
  '31': 'Postres',
  '32': 'Huevos',
  '33': 'Dulce de Membrillo',

  '34': 'Limpieza de la Ropa',
  '35': 'Limpieza de Pisos/Muebles',
  '36': 'Insecticidas',
  '37': 'Limpieza de Cocina',
  '38': 'Lavandinas',
  '39': 'Rollos de Cocina/Servilletas',
  '40': 'Papeles Higiénicos',
  '41': 'Limpieza de Baño',
  '42': 'Desodorante de Ambiente',

  '43': 'Salchichas',
  '44': 'Queso Cremoso',
  '45': 'Queso en Barra',
  '46': 'Fiambres',

  '47': 'Hamburguesa',
  '48': 'Nuggets y Rebozados',
  '49': 'Papas',
  '50': 'Pollos',
  '51': 'Verduras y Frutas',
  '52': 'Comidas Panificados',
  '53': 'Pescados y Mariscos',
  '54': 'Helados y Postres',

  '55': 'Alimentos y Snacks para Perros',
  '56': 'Accesorios para Mascotas',
  '57': 'Alimentos para Gatos',
  '58': 'Higiene para Mascotas'

  
 
};



document.addEventListener('DOMContentLoaded', function() {
  // Manejar clics en categorías
  document.querySelectorAll('.submenu > a[data-category]').forEach(enlace => {
    enlace.addEventListener('click', function(event) {
        event.preventDefault();
        const categoriaId = event.target.getAttribute('data-category');
        cargarProductosPorCategoria(categoriaId);
    });
});

  // Manejar clics en subcategorías
  document.querySelectorAll('.submenu-content a[data-subcategory]').forEach(enlace => {
    enlace.addEventListener('click', function(event) {
        event.preventDefault();
        const subcategoriaId = event.target.getAttribute('data-subcategory');
        cargarProductosPorSubcategoria(subcategoriaId);
    });
  });
});



function cargarProductosPorCategoria(categoriaId) {
  // Fetch para obtener productos
  fetch(`/api/productos/categoria/${encodeURIComponent(categoriaId)}`)
      .then(response => response.json())
      .then(productos => {
          // Cambiar el título de la categoría
          const titulo = document.getElementById('titulo-categoria');
          titulo.textContent = nombresDeCategoria[categoriaId];

          // Obtener el contenedor de productos
          const container = document.getElementById('page-content');
          let productoHTML = ''; // Iniciar la cadena de HTML vacía

          // Iterar sobre los productos y construir el HTML
          productos.forEach(p => {
              let buttonHTML = '';

              if (p.stock <= 0) {
                  buttonHTML = `<button disabled class="agregar disabled">Sin stock</button>`;
              } else {
                  buttonHTML = `<button class="agregar" onclick="agregarAlCarrito(${p.id})">Agregar al Carrito</button>`;
              }

              productoHTML +=
                  `<div class="producto" data-product-id="${p.id}">
                      <img src="${p.image}" alt="${p.name}">
                      <h3>${p.name}</h3>
                      <p>Precio $${p.price}</p>
                      <p>Cantidad en el carrito: <span class="cantidad">0</span></p>
                      ${buttonHTML}
                      <button class="quitar" onclick="quitarDelCarrito(${p.id})">Quitar del Carrito</button>
                  </div>`;
          });

          // Establecer el HTML en el contenedor
          container.innerHTML = productoHTML;
         
          const categoryBackground = document.getElementById('categoryBackground');
              switch (categoriaId) {
          case '1':
              categoryBackground.style.backgroundImage = 'url(https://storage.googleapis.com/cre8tiveai_images_pr_prod/72ffbc0e672b43b5b11a72a1602c5520/9eea96b23fd7449ab33508715b7d8b84_pr_wm.jpg?GoogleAccessId=cre8tiveai%40appspot.gserviceaccount.com&Expires=1710659040&Signature=O3PM7ig4IvdHLdz4ysmV6IxgJS6bYpGzbC0Fgo1ESwPiccWpbBzlZfNRY0fuA%2FN66qWPsDIxYvQQpVPLAoxekDN723yDXu9OMIvBZhs5rXKampzqdsJ8MlLBIuWaUZLlH%2FKNL5axsazzeWI%2B4nA2dzvQJub4GFqpmw16mnWyrUEkiw24nHfr31%2FdQ081fgfy4M9UawmOGKyLYEexqyhYJuIftAvYMTlPXytMBcldLO%2BQ7cbxwa%2FjwoqMsQ2j%2FtSCJB8tZSC8t9F7plcb9Bbq6qYuOXqdI4v6IOUT1ClWJEAuT3sm9h%2FCet2sJ%2Fk53GQFpwGK6bv7r6PXu2hYbBKXFw%3D%3D)';
          break;
          case '2':
              categoryBackground.style.backgroundImage = 'url(https://images.squarespace-cdn.com/content/v1/5b93e7d4c258b4fee2a78c89/1538864746352-2QXBLUTEMT6I313II2RX/Neactains+Whiskey-9.jpg)';
          break;
          case '3':
              categoryBackground.style.backgroundImage = 'url(https://storage.googleapis.com/cre8tiveai_images_pr_prod/7dc3e1ab7c154c20991a3cb7f22fb00e/60ae92e9b6274499ae8f9032feeeaf5d_pr_wm.png?GoogleAccessId=cre8tiveai%40appspot.gserviceaccount.com&Expires=1710664557&Signature=bW4ScF%2FeQk3dR7g0X75Gxvfl3FthxybmQVhh0NOXeueZ6KhqZmMv90aC%2FMXcZsCUU305jy%2BKgTKFsm0x7aqV1IGWJB7P2t4qchpPILUYq23fvQKjO772hqMmalueAvu17fOE2B6z8kOwSie9fshbc3A9cVqv9rDAhECChKTSEzPQv3VxfbXhkL8D5CHF8guTfUt2LmFkXJTHen0C0gfOHtxadpbOkwi36Fg6yankKa%2F7qkAKoxeeGW%2Fua03VhjLFAN7aEAZCZXm8mxQ9BGnL8hwmmd81wjNG27Yj3RgOP2QXbGjrcQwiSPoVEd9be%2B5TM11M%2FNjsyItrD7Jlp1aASw%3D%3D)';
          break;
          case '4':
              categoryBackground.style.backgroundImage = 'url(https://storage.googleapis.com/cre8tiveai_images_pr_prod/7dc3e1ab7c154c20991a3cb7f22fb00e/d7865fa5c39e43afbf00246582c3e656_pr_wm.png?GoogleAccessId=cre8tiveai%40appspot.gserviceaccount.com&Expires=1710664827&Signature=ZRgc%2BV7HixbIIqRjwmgKi%2Bpc7qU%2Bn5zh6xvM%2F%2BkZP7l0ZL28DYrPKNbpxN25%2FLGYVVgSqLir7FZZ6ZyLPKjAMrrFtS%2BVk%2FaI3vsyVMHutG3hU9I6VzOLSzbWQ54yHNtXTspcsq42bcdlTtaJvQxu%2BzlyVU3mvENYr4aV1uI%2F4k95HhKSBKu1BKnPUK7gJzsQ5XXvdthy3uLF7yZJqBbnmpJ2ABSk%2Fis458hh2W7fKhVZWPuto%2B%2FECfq7fv82tgjIaf7NUAK8Tu7snNA5cF1oKuXhNaDf%2FrNLJhHtrI%2FH7XqBM7kBQL2q6YpJmQxglFeRmiZ%2FB0L5KttZmCSM%2FgQ51Q%3D%3D)';
          break;
          case '5':
              categoryBackground.style.backgroundImage = 'url(https://th.bing.com/th/id/OIG.B8FLy_1NRvlfpywfIB25?pid=ImgGn)';
          break;
          case '6':
              categoryBackground.style.backgroundImage = 'url(https://th.bing.com/th/id/OIG.YzW4LoBsgQRZueZOncjW?w=1024&h=1024&rs=1&pid=ImgDetMain)';
          break;
          case '7':
              categoryBackground.style.backgroundImage = 'url(https://th.bing.com/th/id/OIG.G7b0.LcP22V4lqc1xTOa?w=1024&h=1024&rs=1&pid=ImgDetMain)';
          break;
          case '8':
              categoryBackground.style.backgroundImage = 'url(https://th.bing.com/th/id/OIG.comiYwubbKamV_xau61H?w=1024&h=1024&rs=1&pid=ImgDetMain)';
          break;
          case '9':
              categoryBackground.style.backgroundImage = 'url(https://th.bing.com/th/id/OIG.bZMW4tlzfxWwMklLXUWq?w=1024&h=1024&rs=1&pid=ImgDetMain)';
          break;
          case '10':
              categoryBackground.style.backgroundImage = 'url(https://th.bing.com/th/id/OIG.J6FmwMyOWVfVPeA34Nq_?w=1024&h=1024&rs=1&pid=ImgDetMain)';
          break;
          default:
        categoryBackground.style.backgroundImage = 'url(https://th.bing.com/th/id/OIG.yySlb5WnG2Dx5SKUDP0q?w=1024&h=1024&rs=1&pid=ImgDetMain)';
}

          
          
      })
      .catch(error => console.error('Error al cargar productos:', error));
}

function cargarProductosPorSubcategoria(subcategoriaId) {
    fetch(`/api/productos/subcategoria/${encodeURIComponent(subcategoriaId)}`)
        .then(response => response.json())
        .then(productos => {
            const titulo = document.getElementById('titulo-categoria');
            titulo.textContent = nombresDeSubcategoria[subcategoriaId];
          
            const container = document.getElementById('page-content');
            let productoHTML = ''; // Iniciar la cadena de HTML vacía
  
            productos.forEach(p => {
                let buttonHTML = '';
  
                if (p.stock <= 0) {
                    buttonHTML = `<button disabled class="agregar disabled">Sin stock</button>`;
                } else {
                    buttonHTML = `<button class="agregar" onclick="agregarAlCarrito(${p.id})">Agregar al Carrito</button>`;
                }
  
                productoHTML +=
                    `<div class="producto" data-product-id="${p.id}">
                        <img src="${p.image}" alt="${p.name}">
                        <h3>${p.name}</h3>
                        <p>precio $${p.price}</p>
                        <p>Cantidad en el carrito: <span class="cantidad">0</span></p>
                        ${buttonHTML}
                        <button class="quitar" onclick="quitarDelCarrito(${p.id})">Quitar del Carrito</button>
                    </div>`;
            });
  
            container.innerHTML = productoHTML; // Establecer el HTML en el contenedor
          // ... resto del código para mostrar los productos ...
      })
      .catch(error => console.error('Error al cargar productos:', error));
}

// Evento para manejar la búsqueda
document.getElementById('searchButton').addEventListener('click', function() {
  const searchTerm = document.querySelector('.search-bar input').value;
  cargarProductosPorNombre(searchTerm);
});


function cargarProductosPorNombre(nombre) {
  fetch(`/api/productos/buscar?termino=${encodeURIComponent(nombre)}`)
    .then(response => response.json())
    .then(productos => {
      const titulo = document.getElementById('titulo-categoria');
      titulo.textContent = `Resultados de búsqueda para "${nombre}"`;

      const container = document.getElementById('page-content');
      let productoHTML = '';

      productos.forEach(p => {
        let buttonHTML = '';

        if (p.stock <= 0) {
          buttonHTML = `<button disabled class="agregar disabled">Sin stock</button>`;
        } else {
          buttonHTML = `<button class="agregar" onclick="agregarAlCarrito(${p.id})">Agregar al Carrito</button>`;
        }

        productoHTML +=
          `<div class="producto" data-product-id="${p.id}">
              <img src="${p.image}" alt="${p.name}">
              <h3>${p.name}</h3>
              <p>precio $${p.price}</p>
              <p>Cantidad en el carrito: <span class="cantidad">0</span></p>
              ${buttonHTML}
              <button class="quitar" onclick="quitarDelCarrito(${p.id})">Quitar del Carrito</button>
          </div>`;
      });

      container.innerHTML = productoHTML;
    })
    .catch(error => console.error('Error al cargar productos por búsqueda:', error));
}

// Obtén el elemento de la barra de búsqueda
const searchBar = document.querySelector('.search-bar input');

// Agrega un evento de escucha al evento "keydown"
searchBar.addEventListener('keydown', function(event) {
  // Verifica si la tecla presionada es "Enter" (código 13)
  if (event.key === 'Enter') {
    // Previene la acción predeterminada del "Enter" (por ejemplo, enviar un formulario)
    event.preventDefault();
    
    // Realiza la búsqueda
    realizarBusqueda();
  }
});

// Función para realizar la búsqueda
function realizarBusqueda() {
  const searchTerm = searchBar.value;
  cargarProductosPorNombre(searchTerm);
}

// Evento para manejar el clic en "Ofertas"
document.getElementById('ofertasLink').addEventListener('click', function(event) {
  event.preventDefault(); // Evita que el enlace realice la acción predeterminada
  cargarProductosOfertas();
});

function cargarProductosOfertas() {
  // Realizar la petición al backend para obtener productos con precio menor o igual a 500
  fetch('/api/productos/ofertas')
    .then(response => response.json())
    .then(productos => {
      const titulo = document.getElementById('titulo-categoria');
      titulo.textContent = 'Ofertas'; // Actualizar el título

      const container = document.getElementById('page-content');
      let productoHTML = ''; // Iniciar la cadena de HTML vacía

      productos.forEach(p => {
        let buttonHTML = '';

        if (p.price <= 500) {
          // Solo mostrar el botón "Agregar al Carrito" si el precio es menor o igual a 500
          if (p.stock <= 0) {
            buttonHTML = `<button disabled class="agregar disabled">Sin stock</button>`;
          } else {
            buttonHTML = `<button class="agregar" onclick="agregarAlCarrito(${p.id})">Agregar al Carrito</button>`;
          }

          productoHTML +=
            `<div class="producto" data-product-id="${p.id}">
                <img src="${p.image}" alt="${p.name}">
                <h3>${p.name}</h3>
                <p>Precio $${p.price}</p>
                <p>Cantidad en el carrito: <span class="cantidad">0</span></p>
                ${buttonHTML}
                <button class="quitar" onclick="quitarDelCarrito(${p.id})">Quitar del Carrito</button>
            </div>`;
        }
      });

      container.innerHTML = productoHTML; // Establecer el HTML en el contenedor
    })
    .catch(error => console.error('Error al cargar productos en oferta:', error));
}
