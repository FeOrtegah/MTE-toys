import "../../css/Home.css";
import products from "../../data/products";
import ProductCard from "../../components/organisms/ProductCard";
import Banner from "../../components/organisms/Banner";
import Icon from "../../components/atoms/Icon";
import Categories from "../../components/organisms/Categories";
import FeaturedProducts from "../../components/organisms/FeaturedProducts";

function Home() {
  return (
    <main className="home">

      <Banner />

      <section className="benefits">

<div className="benefit-card">
<div className="icon-box truck">
<Icon type="truck"/>
</div>
<h3>Envíos rápidos</h3>
<p>Compra segura y rápida</p>
</div>

<div className="benefit-card">
<div className="icon-box gift">
<Icon type="gift"/>
</div>
<h3>Regalos</h3>
<p>Para toda ocasión</p>
</div>

<div className="benefit-card">
<div className="icon-box payment">
<Icon type="card"/>
</div>
<h3>Pagos seguros</h3>
<p>Múltiples métodos de pago</p>
</div>

<div className="benefit-card">
<div className="icon-box star">
<Icon type="star"/>
</div>
<h3>Grandes marcas</h3>
<p>Los mejores juguetes</p>
</div>

</section>

      <Categories />

      <FeaturedProducts />

    </main>
  );
}

export default Home;