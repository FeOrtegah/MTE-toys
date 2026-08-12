import { Link } from "react-router-dom";
import subbanners from "../../data/subbanners";
import "../../css/SubBanner.css";

function SubBanner() {
  return (
    <section id="seccion-subbanners" className="subbanner-container">
      {subbanners.map((subbanner) => (
        <Link 
          to={subbanner.link} 
          key={subbanner.id} 
          className="subbanner-card"
        >
          <img 
            src={subbanner.image} 
            alt={subbanner.title} 
          />
        </Link>
      ))}
    </section>
  );
}

export default SubBanner;