import "../../css/Categories.css";
import { Link } from "react-router-dom";

function Categories() {
  const categories = [
    {
      image: "/categoria_logo/clogo1.webp",
      name: "Mattel",
      filter: "mattel",
    },
    {
      image: "/categoria_logo/clogo2.png",
      name: "Marvel",
      filter: "marvel",
    },
    {
      image: "/categoria_logo/clogo3.png",
      name: "Disney",
      filter: "disney",
    },
    {
      image: "/categoria_logo/clogo4.png",
      name: "Barbie",
      filter: "barbie",
    },
  ];

  return (
    <section className="categories-section">
      <h2>Compra por marca</h2>

      <div className="categories-container">
        {categories.map((category) => (
          <Link
            key={category.filter}
            to={`/productos?categoria=${encodeURIComponent(category.filter)}`}
            className="category-card"
          >
            <div className="category-icon">
              <img
                src={category.image}
                alt={`Productos ${category.name}`}
              />
            </div>

            <h3>{category.name}</h3>
          </Link>
        ))}
      </div>
    </section>
  );
}

export default Categories;