const traeCarrito = () => {
	const carritoEnLocal = JSON.parse(localStorage.getItem('carrito')); 
	carritoDeCompras.splice(0,carritoDeCompras.length);
  carritoEnLocal.forEach((producto)=>carritoDeCompras.push(producto));
};

const totalizar = () => {
  const totalizado = carritoDeCompras.reduce((acc,el) => acc + (el.precio*el.cantidadVendida),0);
  offcanvas.querySelector("#total").textContent = `$ ${totalizado}`;
};

const actualizaCarrito = () => {
  localStorage.setItem('carrito',JSON.stringify(carritoDeCompras));  
  offcanvas.querySelector(".offcanvas-body").innerHTML="";
  const fragment = document.createDocumentFragment();
  carritoDeCompras.forEach((producto) => {
    const subtotal = producto.precio*producto.cantidadVendida;
    const clone = templateCarrito.cloneNode(true);
    clone.querySelector(".img-fluid").setAttribute("src", producto.imagen);
    clone.querySelector(".img-fluid").setAttribute("alt", producto.nombre);
    clone.querySelector(".card-title").textContent = producto.nombre.toUpperCase();
    clone.querySelector(".text-muted").textContent = `$ ${producto.precio}`;
    clone.querySelector(".card-text b").textContent = producto.cantidadVendida;
    clone.querySelector(".talle").textContent = "Talle: "+producto.talleElegido;
    clone.querySelector(".card-subtitle b").textContent = `$ ${subtotal}`;;
    clone.querySelector(".fa-plus").dataset.id = producto.id;
    clone.querySelector(".fa-minus").dataset.id = producto.id;
    clone.querySelector(".fa-minus").dataset.stock = producto.stock;
    fragment.appendChild(clone);
  });
  offcanvas.querySelector(".offcanvas-body").appendChild(fragment);
  totalizar();
};

const aniadeACarrito = (id, talle) => {
  const index = carritoDeCompras.findIndex(producto => producto.id === id);
  if(index!==-1){
    if(carritoDeCompras[index].stock===carritoDeCompras[index].cantidadVendida){
      muestraToast(rojo,"No hay más stock en ese producto");
    }else if(!carritoDeCompras[index].talleElegido===talle){
      let producto = productos.find(producto => producto.id === id );
      producto.cantidadVendida = 1;
      producto.talleElegido=talle;
      carritoDeCompras.push(producto);
    }
    else{
      carritoDeCompras[index].cantidadVendida++;
    };
  }else{
    let producto = productos.find(producto => producto.id === id );
    producto.cantidadVendida = 1;
    producto.talleElegido=talle;
    carritoDeCompras.push(producto); 
  };
  actualizaCarrito();
};

const disminuyeCantidad = (id) => {
  const index = carritoDeCompras.findIndex(producto => producto.id === id);
  carritoDeCompras[index].cantidadVendida--;
  if(carritoDeCompras[index].cantidadVendida<=0){
    carritoDeCompras.splice(index,1);
    muestraToast(rojo,"Se quitó el producto del carrito")
  };
  actualizaCarrito();
};

const vaciaCarrito = () => {
	if (carritoDeCompras.length===0){
		Swal.fire({
			title:'El carrito ya estaba vacío',
			showConfirmButton: false,
			timer: 1500
		})
	}else{
		Swal.fire({
			title: '¿Seguro que quieres Vaciar el Carrito?',
			showDenyButton: true,
			confirmButtonText: 'Aceptar',
			denyButtonText: `Cancelar`,
		}).then((result) => {
			if (result.isConfirmed) {
				carritoDeCompras.splice(0,carritoDeCompras.length);
				actualizaCarrito();
				Swal.fire({
					position: 'center',
					icon: 'success',
					title: `Carrito vacío.`,
					showConfirmButton: false,
					timer: 1000
				});  
			}; 
		});
	};   
};