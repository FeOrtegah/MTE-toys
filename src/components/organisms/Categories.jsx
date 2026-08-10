import "../../css/Categories.css";
import { Link } from "react-router-dom";

function Categories() {
  const categories = [
    {
      image: "/categoria_logo/clogo1.webp",
      filter: "Mattel"
    },
    {
      image: "/categoria_logo/clogo2.png",
      filter: "Marvel"
    },
    {
      image: "/categoria_logo/clogo3.png",
      filter: "Disney"
    },
    {
      image: "/categoria_logo/clogo4.png",
      filter: "Barbie"
    }
  ];

  return (
    <section className="categories-section">
      <h2>Compra por marca</h2>

      <div className="categories-container">
        {categories.map((category) => (
          <Link
            key={category.name}
            to={`/productos?brand=${encodeURIComponent(category.filter)}`}
            className="category-card"
          >
            <div className="category-icon">
              <img src={category.image} alt={category.name} />
            </div>
            <h3>{category.name}</h3>
          </Link>
        ))}
      </div>
    </section>
  );
}

export default Categories;