import { useCart } from "../../context/CartContext";
import { useNavigate } from "react-router-dom";
import "../../css/AddedToCartModal.css";

function AddedToCartModal() {
  const {
    showAddedModal,
    addedItem,
    closeAddedModal,
  } = useCart();

  const navigate = useNavigate();

  if (!showAddedModal) {
    return null;
  }

  const isCombo =
    addedItem?.type === "combo";

  const handleGoToCart = () => {
    closeAddedModal();
    navigate("/carrito");
  };

  const handleContinueShopping = () => {
    closeAddedModal();
  };

  return (
    <div
      className="added-modal-overlay"
      onClick={handleContinueShopping}
    >
      <div
        className="added-modal"
        onClick={(event) =>
          event.stopPropagation()
        }
      >
        <div className="added-check">
          ✓
        </div>

        <h2>
          {isCombo
            ? "Combo agregado correctamente"
            : "Producto agregado correctamente"}
        </h2>

        {addedItem?.name && (
          <p className="added-product-name">
            {addedItem.name}
          </p>
        )}

        <div className="added-modal-actions">
          <button
            type="button"
            className="go-cart-btn"
            onClick={handleGoToCart}
          >
            Ir al carrito
          </button>

          <button
            type="button"
            className="continue-shopping-btn"
            onClick={handleContinueShopping}
          >
            Seguir comprando
          </button>
        </div>
      </div>
    </div>
  );
}

export default AddedToCartModal;