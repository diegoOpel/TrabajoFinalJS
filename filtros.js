const inputBuscar = document.getElementById("inputBuscar");

const buscador = () =>{
  let busqueda = inputBuscar.value;
  const resultado = productos.filter((producto) => producto.nombre.toLowerCase().includes(busqueda.toLowerCase()));
  renderProductos(resultado);
};

inputBuscar.addEventListener("keyup", buscador);

document.addEventListener("click", (e) =>{
  if(e.target.matches(".genero")){
    const resultado = productos.filter((producto) => producto.genero.includes(e.target.dataset.genero));
    renderProductos(resultado);
  };
  if(e.target.matches(".oferta")){
    const resultado = productos.filter((producto) => producto.oferta === true);
    renderProductos(resultado);
  };
  if(e.target.matches(".categoria")){
    const resultado = productos.filter((producto) => producto.categoria.toLowerCase().includes(e.target.dataset.categoria));
    renderProductos(resultado);
  };
  if(e.target.matches(".deporte")){
    const resultado = productos.filter((producto) => producto.deporte.toLowerCase().includes(e.target.dataset.deporte));
    renderProductos(resultado);
  };
});
