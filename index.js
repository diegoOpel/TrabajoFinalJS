const productos = [];
const main = document.querySelector('main');
const templateCards = document.getElementById("templateCards").content;
const templateCarrito = document.getElementById("templateCarrito").content;
const offcanvas = document.querySelector(".offcanvas");
const modalFinalizaCompra = document.querySelector(".modal");
const btnFinalizarCompra = document.getElementById("btnFinalizarCompra");
const name = document.getElementById("name");
const email = document.getElementById("email");
const address = document.getElementById("address");
const message = document.getElementById("message");
const rojo = "linear-gradient(to right, rgba(152,25,0,1) 22%, rgba(255,0,0,1) 100%)";
const verde = "linear-gradient(to right, #00b09b, #96c93d)";
const carritoDeCompras = [];

const recuperaProductos = async () => {
  const resp = await fetch("./productos.json");
  const data = await resp.json();
  data.forEach((producto) =>{
    productos.push(producto);
  });
  renderProductos(productos);
};

const renderProductos = (array) => {
  const fragment = document.createDocumentFragment();
  array.forEach((producto) =>{
    const clone = templateCards.cloneNode(true);
    clone.querySelector("img").setAttribute("src", producto.imagen);
    clone.querySelector("img").setAttribute("alt", producto.nombre);
    clone.querySelector("h5").textContent = producto.nombre.toUpperCase();
    clone.querySelector("p").textContent = `$ ${producto.precio}`;
    const select = clone.querySelector("select");
    clone.querySelector("button").dataset.id = producto.id;
    clone.querySelector("select").classList.add("selectTalle"+producto.id);
    producto.talle.forEach((talle) =>{
      const fragment = document.createDocumentFragment();
      const tamanio = document.createElement("option");
      tamanio.setAttribute("value", talle);
      tamanio.classList.add("talleElegido");
      tamanio.dataset.id = producto.id;
      tamanio.textContent = talle;
      fragment.appendChild(tamanio);
      select.appendChild(fragment);
    });
    fragment.appendChild(clone);
  });
  main.textContent = "";
  main.appendChild(fragment);
};

const muestraToast= (color, mensaje) => {
  Toastify({
    text: mensaje,
    duration: 3000,
    close: false,
    gravity: "top", 
    position: "center", 
    stopOnFocus: false, 
    style: {
      background: color,
    },
  }).showToast();
};

const finalizarCompra = () => {
  modalFinalizaCompra.classList.toggle('noShow');
  message.value="";
  carritoDeCompras.forEach((producto) => message.value +=
  `${producto.nombre}, TALLE: ${producto.talleElegido}, CANTIDAD: ${producto.cantidadVendida}, PRECIO UNITARIO: $${producto.precio}, SUBTOTAL: $${producto.precio*producto.cantidadVendida}`
  );
  message.value += ` TOTAL: ${offcanvas.querySelector("#total").textContent}`;

    
  btnFinalizarCompra.addEventListener("click", (e) => {
    e.preventDefault();
    console.log(message.value);
    const form = document.getElementById('form');
    btnFinalizarCompra.value = 'Finalizando compra...';

    const serviceID = 'default_service';
    const templateID = 'template_d0sq32m';

    emailjs.sendForm(serviceID, templateID, form)
      .then(() => {
        btnFinalizarCompra.value = 'Finalizar compra';
        muestraToast(verde,"Compra finalizada!");
        modalFinalizaCompra.classList.toggle('noShow');
        offcanvas.classList.remove("abreCarrito");
        carritoDeCompras.splice(0,carritoDeCompras.length);
				actualizaCarrito();
      }, (err) => {
        btnFinalizarCompra.value = 'Finalizar compra';
        muestraToast(rojo,"Ups, algo anda mal...");
      });
});
};

document.addEventListener("click", (e) =>{
  if(e.target.matches(".botonCarrito")){
    offcanvas.classList.add("abreCarrito");
  };
  if(e.target.matches(".btn-close")){
    offcanvas.classList.remove("abreCarrito");
  };
  if(e.target.matches(".btnAgregar")){
    e.preventDefault();
    const id = parseInt(e.target.dataset.id);
    const talleElegido = document.querySelector(".selectTalle"+id).value;
    if(talleElegido!=="Elegir talle"){
      aniadeACarrito(id,talleElegido);
      muestraToast(verde,"Se añadió el producto al carrito")
    }else{
      muestraToast(rojo,"Elige un talle primero")
    }
  };
  if(e.target.matches(".vaciarCarrito")){
    vaciaCarrito();
  };
  if(e.target.matches(".fa-plus")){
    const id = parseInt(e.target.dataset.id);
    aniadeACarrito(id);
  };
  if(e.target.matches(".fa-minus")){
    const id = parseInt(e.target.dataset.id);
    disminuyeCantidad(id);
  };
  if(e.target.matches(".navbar-toggler-icon")){
    document.querySelector(".navbar-collapse").classList.toggle("show")
  };
  if(e.target.matches(".finalizaCompra")){
    carritoDeCompras.length>0 ? finalizarCompra(): muestraToast(rojo,"Tenés que agregar algo al carrito primero")
  };
  if(e.target.matches(".cierraModal")){
    modalFinalizaCompra.classList.toggle('noShow');
  };
});
recuperaProductos();
(()=>{
	!localStorage.getItem('carrito') ? localStorage.setItem('carrito','[]') : traeCarrito(); 
	actualizaCarrito();
})();