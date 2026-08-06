import { useParams } from "react-router-dom";
import products from "../../data/products";
import { useCart } from "../../context/CartContext";
import "../../css/ProductDetail.css";


function ProductDetail(){

  const { id } = useParams();

  const { addToCart } = useCart();


  const product = products.find(
    item => item.id === Number(id)
  );


  if(!product){

    return (
      <h2>
        Producto no encontrado
      </h2>
    );

  }


  return (

    <main className="product-detail">


      <div className="detail-image">

        <img
          src={product.image}
          alt={product.name}
        />

      </div>



      <div className="detail-info">


        <h1>
          {product.name}
        </h1>


        <p className="detail-category">
          {product.category}
        </p>


        <h2>
          ${product.price.toLocaleString("es-CL")}
        </h2>


        <p>
          Producto de excelente calidad.
          Ideal para regalar y disfrutar.
        </p>


        <button
          onClick={()=>addToCart(product)}
        >
          🛒 Agregar al carrito
        </button>


      </div>


    </main>

  );

}


export default ProductDetail;