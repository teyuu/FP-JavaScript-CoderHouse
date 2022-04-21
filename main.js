const contenedorProductos = document.getElementById('contenedor__productos');
const contenedorCarrito = document.getElementById('contenedor__carrito');
const subtotal = document.getElementById('subtotal')



document.addEventListener('DOMContentLoaded', () =>{
    fetchData()
})

const fetchData = async () => {
    try{
        const rest = await fetch ('api.json');
        const remeras = await rest.json();
        renderProductos(remeras)
    } catch(error){
        console.log(error)
    }
}

//Renderizar productos con fetch
const renderProductos = remeras => {
    remeras.forEach (remera => {
      contenedorProductos.innerHTML += `
      <div class="card" style="width: 18rem;">
      <img src="${remera.img}" class="card-img-top" alt="${remera.modelo}">
      <div class="card-body d-flex justify-content-between flex-column">
        <h5 class="card-title">${remera.modelo}</h5>
        <h5 class="card-price">$${remera.precio}</h5>
        <div class="btn btn-warning" onclick="agregarAlCarrito(${remera.id})">COMPRAR $ ${remera.precio}</div>  
      </div>
    </div>
          `;
    });

  }

  let carrito = JSON.parse(localStorage.getItem("CARRITO")) || [];
  updateCarrito();

  function agregarAlCarrito(id){
    //check si el producto ya se encuentra en el carrito
    if(carrito.some((item)=> item.id == id)){
      cambiarNumUnidades('suma', id)
    }else{
      const item = remeras.find((remera)=> remera.id == id)

      carrito.push({
        ...item,
        numeroDeUnidades: 1,
      })
    }

    updateCarrito();
  }
  

  //Update Carrito
  function updateCarrito(){
    renderCarritoItems();
    renderSubTotal();

    //localStorage
    localStorage.setItem("CARRITO", JSON.stringify(carrito));
  }

  //calcular y render subtotal
  function renderSubTotal(){
    let precioTotal = 0, totalItems=0;

    carrito.forEach((item) => {
      precioTotal += item.precio * item.numeroDeUnidades;
      totalItems += item.numeroDeUnidades;
    })

    subtotal.innerHTML = `Subtotal (${totalItems} items): $${precioTotal}`
  }

  //Render productos del carrito
  function renderCarritoItems(){
    contenedorCarrito.innerHTML = "";
    carrito.forEach((remera)=>{
      contenedorCarrito.innerHTML += `
      <div class="card" style="width: 14rem;">
      <img src="${remera.img}" class="card-img-top" alt="${remera.modelo}">
      <div class="card-body">
        <h5 class="card-title">${remera.modelo}</h5>
        <h5 class="card-price">$${remera.precio}</h5>  
      </div>
      <div class="unidades d-flex p-1">
              <div class="btn resta" onclick="cambiarNumUnidades('resta', ${remera.id})"><i class="bi bi-cart-dash-fill"></i></div>
              <div class="numero">${remera.numeroDeUnidades}</div>
              <div class="btn suma" onclick="cambiarNumUnidades('suma', ${remera.id})"><i class="bi bi-cart-plus-fill"></i></div>
              <div class="btn botonBorrar" onclick="borrarDelCarrito(${remera.id})"><i class="bi bi-trash3"></i></div>
            </div>
    </div>
      `
    })
  }

  //Quitar items del carrito
  function borrarDelCarrito(id){
    carrito = carrito.filter((item) => item.id != id)

    updateCarrito();
  }
  //cambiar el numero de unidades
  function cambiarNumUnidades(action, id){
    carrito = carrito.map((item) => {
      let numeroDeUnidades = item.numeroDeUnidades;


      if(item.id == id){
        if(action == "resta" && numeroDeUnidades > 1){
          numeroDeUnidades--;
        }else if(action == "suma" && numeroDeUnidades < 10){
          numeroDeUnidades++
        }
      }

      return {
        ...item,
        numeroDeUnidades,
      }
    })

    updateCarrito()
  };
  

function mostrar(){
  Swal.fire(
    'Su compra ha sido realizada con éxito!',
    'Vuelva pronto!',
    'success'
  )
}

