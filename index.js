const productos = [];
const main = document.querySelector('main');
const templateCards = document.getElementById("templateCards").content;
const templateCarrito = document.getElementById("templateCarrito").content;
const offcanvas = document.querySelector(".offcanvas");
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
    clone.querySelector("select").dataset.id = producto.id;
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

document.addEventListener("click", (e) =>{
  if(e.target.matches(".botonCarrito")){
    offcanvas.classList.add("abreCarrito");
  };
  if(e.target.matches(".btn-close")){
    offcanvas.classList.remove("abreCarrito");
  };
  if(e.target.matches(".btnAgregar")){
    e.preventDefault();
    console.log(e)
    const id = parseInt(e.target.dataset.id);
    productos[id].talleElegido = "";
    aniadeACarrito(id);
    Toastify({
      text: "Se añadió el producto al carrito",
      duration: 1000,
      close: false,
      gravity: "top", 
      position: "center", 
      stopOnFocus: false, 
      style: {
        background: "linear-gradient(to right, #00b09b, #96c93d)",
      },
    }).showToast();
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
  if(e.target.matches(".talleElegido")){
    console.log(e.target)
    let producto = productos.find(producto => producto.id === e.target.dataset.id);
    producto.talleElegido = e.target.value;
  };
});
recuperaProductos();
(()=>{
	!localStorage.getItem('carrito') ? localStorage.setItem('carrito','[]') : traeCarrito(); 
	actualizaCarrito();
})();