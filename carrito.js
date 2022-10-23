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
  const fragmentInner = document.createDocumentFragment();
  carritoDeCompras.forEach((producto) => {
    const subtotal = producto.precio*producto.cantidadVendida;
    const clone = templateCarrito.cloneNode(true);
    clone.querySelector(".img-fluid").setAttribute("src", producto.imagen);
    clone.querySelector(".img-fluid").setAttribute("alt", producto.nombre);
    clone.querySelector(".card-title").textContent = producto.nombre.toUpperCase();
    clone.querySelector(".text-muted").textContent = `$ ${producto.precio}`;
    for(const talle in producto.tallesObj){
      if(producto.tallesObj[talle].cantidadVendida>0){
        const cloneInner = templateTalles.cloneNode(true);
        cloneInner.querySelector(".talle").textContent = "Talle: "+talle;
        cloneInner.querySelector(".card-text b").textContent = producto.tallesObj[talle].cantidadVendida;
        cloneInner.querySelector(".fa-plus").dataset.id = producto.id;
        cloneInner.querySelector(".fa-plus").dataset.talle = talle;
        cloneInner.querySelector(".fa-minus").dataset.id = producto.id;
        cloneInner.querySelector(".fa-minus").dataset.talle = talle;
        fragmentInner.appendChild(cloneInner);
      }
    }
    clone.querySelector(".talle").appendChild(fragmentInner);
    clone.querySelector(".card-subtitle b").textContent = `$ ${subtotal}`;;
    fragment.appendChild(clone);
  });
  offcanvas.querySelector(".offcanvas-body").appendChild(fragment);
  totalizar();
};

const aniadeACarrito = (id, talle) => {
  console.log(id,talle)
  const index = carritoDeCompras.findIndex(producto => producto.id === id);
  if(index!==-1){
    if(carritoDeCompras[index].tallesObj[talle].stock===carritoDeCompras[index].tallesObj[talle].cantidadVendida){
      muestraToast(rojo,"No hay más stock en este talle del producto");
    }else{
      carritoDeCompras[index].tallesObj[talle].cantidadVendida++;
      carritoDeCompras[index].cantidadVendida++;
    };
  }else{
    const producto = productos.find(producto => producto.id === id );
    producto.tallesObj[talle].cantidadVendida=1
    producto.cantidadVendida=1;
    carritoDeCompras.push(producto); 
  };
  actualizaCarrito();
};

const disminuyeCantidad = (id,talle) => {
  const index = carritoDeCompras.findIndex(producto => producto.id === id);
  carritoDeCompras[index].cantidadVendida--;
  carritoDeCompras[index].tallesObj[talle].cantidadVendida--;
  if(carritoDeCompras[index].cantidadVendida===0){
    carritoDeCompras.splice(index,1);
    muestraToast(rojo,"Se quitó el producto del carrito");
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
        carritoDeCompras.forEach(producto=>{
          for(const talle in producto.tallesObj){
            producto.tallesObj[talle].cantidadVendida=0;
          };
        });
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