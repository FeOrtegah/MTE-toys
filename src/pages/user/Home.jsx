import "../../css/Home.css";
import Banner from "../../components/organisms/Banner";
import Categories from "../../components/organisms/Categories";
import FeaturedProducts from "../../components/organisms/FeaturedProducts";
import SubBanner from "../../components/organisms/SubBanner";
import GiftsByPrice from "../../components/organisms/GiftsByPrice";

function Home() {
  return (
    <main className="home">
      <Banner />

      <section className="benefits">
        {/* Enlace que desplaza hasta la sección de SubBanners */}
        <a href="#seccion-subbanners" className="benefit-card benefit-link">
          <img
            src="/benefits/camion.png"
            alt="Envíos rápidos"
          />
          <h3>Envíos rápidos</h3>
          <p>Compra segura y rápida</p>
        </a>

        {/* Enlace que desplaza hasta la sección de Regalos */}
        <a href="#regalos-por-precio" className="benefit-card benefit-link">
          <img
            src="/benefits/caja-de-regalo.png"
            alt="Regalos"
          />
          <h3>Regalos</h3>
          <p>Para toda ocasión</p>
        </a>

        <div className="benefit-card">
          <img
            src="/benefits/tarjeta-de-credito.png"
            alt="Pagos seguros"
          />
          <h3>Pagos seguros</h3>
          <p>Múltiples métodos de pago</p>
        </div>

        <div className="benefit-card">
          <img
            src="/benefits/estrella.png"
            alt="Grandes marcas"
          />
          <h3>Grandes marcas</h3>
          <p>Los mejores juguetes</p>
        </div>
      </section>

      {/* Productos Destacados arriba */}
      <FeaturedProducts />

      {/* Marcas/Categorías abajo */}
      <Categories />

      <SubBanner />

      <GiftsByPrice />
    </main>
  );
}

export default Home;