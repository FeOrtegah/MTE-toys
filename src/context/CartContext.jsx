import { createContext, useContext, useState } from "react";

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);

  function addToCart(product) {
    setCart((currentCart) => {
      const exist = currentCart.find(
        (item) => item.id === product.id
      );

      // Si el producto ya existe en el carrito
      if (exist) {
        // No permitir superar el stock disponible
        if (
          product.stock !== undefined &&
          product.stock !== null &&
          exist.quantity >= product.stock
        ) {
          return currentCart;
        }

        return currentCart.map((item) =>
          item.id === product.id
            ? {
                ...item,
                quantity: item.quantity + 1,
              }
            : item
        );
      }

      // Si no existe y no tiene stock, no agregar
      if (
        product.stock !== undefined &&
        product.stock !== null &&
        product.stock <= 0
      ) {
        return currentCart;
      }

      // Agregar producto nuevo
      return [
        ...currentCart,
        {
          ...product,
          quantity: 1,
        },
      ];
    });
  }

  function removeFromCart(id) {
    setCart((currentCart) =>
      currentCart.filter((item) => item.id !== id)
    );
  }

  function increase(id) {
    setCart((currentCart) =>
      currentCart.map((item) => {
        if (item.id !== id) {
          return item;
        }

        // No permitir superar el stock
        if (
          item.stock !== undefined &&
          item.stock !== null &&
          item.quantity >= item.stock
        ) {
          return item;
        }

        return {
          ...item,
          quantity: item.quantity + 1,
        };
      })
    );
  }

  function decrease(id) {
    setCart((currentCart) =>
      currentCart.map((item) =>
        item.id === id && item.quantity > 1
          ? {
              ...item,
              quantity: item.quantity - 1,
            }
          : item
      )
    );
  }

  function total() {
    return cart.reduce(
      (sum, item) =>
        sum + item.price * item.quantity,
      0
    );
  }

  function clearCart() {
    setCart([]);
  }

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        increase,
        decrease,
        total,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}