import { Link } from "react-router-dom";
import giftsByPrice from "../../data/giftsByPrice";
import "../../css/GiftsByPrice.css";

function GiftsByPrice() {
  return (

    <section id="regalos-por-precio" className="gifts-section">
      <h2 className="gifts-title">Regalos por Precio</h2>

      <div className="gifts-container">
        {giftsByPrice.map((gift) => (
          <Link to={gift.link} key={gift.id} className="gift-card">
            <div className="gift-image-wrapper">
              <img src={gift.image} alt={gift.title} />
            </div>
            <div className="gift-content">
              <h3>{gift.title}</h3>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

export default GiftsByPrice;