import React, {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

const CartContext = createContext();

const CART_STORAGE_KEY = "mte_toys_cart";

// =====================================================
// NORMALIZAR PRODUCTOS
// =====================================================

const normalizeProduct = (product) => {
  if (!product) return null;

  return {
    ...product,

    id: product.id || product._id,

    type: "producto",

    quantity:
      Number(product.quantity) > 0
        ? Number(product.quantity)
        : 1,

    price:
      Number(product.price) || 0,

    stock:
      product.stock !== undefined
        ? Number(product.stock)
        : undefined,
  };
};

// =====================================================
// NORMALIZAR COMBOS
// =====================================================

const normalizeCombo = (combo) => {
  if (!combo) return null;

  return {
    ...combo,

    id: combo.id || combo._id,

    type: "combo",

    quantity:
      Number(combo.quantity) > 0
        ? Number(combo.quantity)
        : 1,

    price:
      Number(combo.price ?? combo.precioCombo) || 0,

    stock:
      combo.stock !== undefined
        ? Number(combo.stock)
        : undefined,
  };
};

// =====================================================
// RECUPERAR CARRITO
// =====================================================

const getInitialCart = () => {
  try {
    const savedCart =
      localStorage.getItem(CART_STORAGE_KEY);

    if (!savedCart) {
      return [];
    }

    const parsedCart = JSON.parse(savedCart);

    if (!Array.isArray(parsedCart)) {
      return [];
    }

    return parsedCart
      .map((item) => {
        if (item.type === "combo") {
          return normalizeCombo(item);
        }

        return normalizeProduct(item);
      })
      .filter(Boolean);
  } catch (error) {
    console.error(
      "Error recuperando carrito:",
      error
    );

    return [];
  }
};

// =====================================================
// PROVIDER
// =====================================================

export const CartProvider = ({ children }) => {
  const [cart, setCart] =
    useState(getInitialCart);

  const [showAddedModal, setShowAddedModal] =
    useState(false);

  const [addedItem, setAddedItem] =
    useState(null);

  // ===================================================
  // GUARDAR CARRITO EN LOCALSTORAGE
  // ===================================================

  useEffect(() => {
    try {
      localStorage.setItem(
        CART_STORAGE_KEY,
        JSON.stringify(cart)
      );
    } catch (error) {
      console.error(
        "Error guardando carrito:",
        error
      );
    }
  }, [cart]);

  // ===================================================
  // AGREGAR PRODUCTO
  // ===================================================

  const addToCart = (
    product,
    options = {}
  ) => {
    const normalizedProduct =
      normalizeProduct(product);

    if (!normalizedProduct?.id) {
      console.error(
        "No se puede agregar un producto sin ID"
      );

      return;
    }

    const {
      showModal = true,
    } = options;

    if (showModal) {
      setAddedItem(normalizedProduct);
      setShowAddedModal(true);
    }

    setCart((currentCart) => {
      const existingItem =
        currentCart.find(
          (item) =>
            item.type === "producto" &&
            item.id ===
              normalizedProduct.id
        );

      // -----------------------------------------------
      // PRODUCTO YA EXISTE
      // -----------------------------------------------

      if (existingItem) {
        return currentCart.map(
          (item) => {
            if (
              item.type === "producto" &&
              item.id ===
                normalizedProduct.id
            ) {
              const newQuantity =
                item.quantity + 1;

              if (
                item.stock !== undefined &&
                newQuantity > item.stock
              ) {
                return item;
              }

              return {
                ...item,
                quantity: newQuantity,
              };
            }

            return item;
          }
        );
      }

      // -----------------------------------------------
      // PRODUCTO NUEVO
      // -----------------------------------------------

      return [
        ...currentCart,
        {
          ...normalizedProduct,
          quantity: 1,
        },
      ];
    });
  };

  // ===================================================
  // AGREGAR COMBO
  // ===================================================

  const addComboToCart = (
    combo,
    options = {}
  ) => {
    const normalizedCombo =
      normalizeCombo(combo);

    if (!normalizedCombo?.id) {
      console.error(
        "No se puede agregar un combo sin ID"
      );

      return;
    }

    const {
      showModal = true,
    } = options;

    if (showModal) {
      setAddedItem(normalizedCombo);
      setShowAddedModal(true);
    }

    setCart((currentCart) => {
      const existingItem =
        currentCart.find(
          (item) =>
            item.type === "combo" &&
            item.id ===
              normalizedCombo.id
        );

      // -----------------------------------------------
      // COMBO YA EXISTE
      // -----------------------------------------------

      if (existingItem) {
        return currentCart.map(
          (item) => {
            if (
              item.type === "combo" &&
              item.id ===
                normalizedCombo.id
            ) {
              const newQuantity =
                item.quantity + 1;

              if (
                item.stock !== undefined &&
                newQuantity > item.stock
              ) {
                return item;
              }

              return {
                ...item,
                quantity: newQuantity,
              };
            }

            return item;
          }
        );
      }

      // -----------------------------------------------
      // COMBO NUEVO
      // -----------------------------------------------

      return [
        ...currentCart,
        {
          ...normalizedCombo,
          quantity: 1,
        },
      ];
    });
  };

  // ===================================================
  // ELIMINAR ITEM
  // ===================================================

  const removeFromCart = (
    productId,
    type = "producto"
  ) => {
    setCart((currentCart) =>
      currentCart.filter(
        (item) =>
          !(
            item.id === productId &&
            item.type === type
          )
      )
    );
  };

  // ===================================================
  // DISMINUIR CANTIDAD
  // ===================================================

  const decreaseQuantity = (
    productId,
    type = "producto"
  ) => {
    setCart((currentCart) =>
      currentCart
        .map((item) => {
          if (
            item.id === productId &&
            item.type === type
          ) {
            return {
              ...item,
              quantity:
                item.quantity - 1,
            };
          }

          return item;
        })
        .filter(
          (item) => item.quantity > 0
        )
    );
  };

  // ===================================================
  // AUMENTAR CANTIDAD
  // ===================================================

  const increaseQuantity = (
    productId,
    type = "producto"
  ) => {
    setCart((currentCart) =>
      currentCart.map((item) => {
        if (
          item.id === productId &&
          item.type === type
        ) {
          const newQuantity =
            item.quantity + 1;

          if (
            item.stock !== undefined &&
            newQuantity > item.stock
          ) {
            return item;
          }

          return {
            ...item,
            quantity: newQuantity,
          };
        }

        return item;
      })
    );
  };

  // ===================================================
  // CAMBIAR CANTIDAD
  // ===================================================

  const updateQuantity = (
    productId,
    quantity,
    type = "producto"
  ) => {
    let newQuantity = Number(quantity);

    if (
      !Number.isFinite(newQuantity) ||
      newQuantity < 1
    ) {
      newQuantity = 1;
    }

    newQuantity = Math.floor(newQuantity);

    setCart((currentCart) =>
      currentCart.map((item) => {
        if (
          item.id === productId &&
          item.type === type
        ) {
          if (
            item.stock !== undefined &&
            newQuantity > item.stock
          ) {
            return {
              ...item,
              quantity: item.stock,
            };
          }

          return {
            ...item,
            quantity: newQuantity,
          };
        }

        return item;
      })
    );
  };

  // ===================================================
  // VACIAR CARRITO
  // ===================================================

  const clearCart = () => {
    setCart([]);
  };

  // ===================================================
  // TOTAL
  // ===================================================

  const getCartTotal = () => {
    return cart.reduce(
      (total, item) =>
        total +
        Number(item.price || 0) *
          Number(item.quantity || 0),
      0
    );
  };

  // ===================================================
  // CANTIDAD TOTAL
  // ===================================================

  const getCartCount = () => {
    return cart.reduce(
      (total, item) =>
        total +
        Number(item.quantity || 0),
      0
    );
  };

  // ===================================================
  // CERRAR MODAL
  // ===================================================

  const closeAddedModal = () => {
    setShowAddedModal(false);
    setAddedItem(null);
  };

  // ===================================================
  // VALOR DEL CONTEXTO
  // ===================================================

  const value = {
    cart,

    addToCart,

    addComboToCart,

    removeFromCart,

    increaseQuantity,

    decreaseQuantity,

    updateQuantity,

    clearCart,

    getCartTotal,

    getCartCount,

    // IMPORTANTE:
    // Estas son funciones, no números.
    total: getCartTotal,

    cartCount: getCartCount,

    // Modal
    showAddedModal,

    addedItem,

    closeAddedModal,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

// =====================================================
// HOOK
// =====================================================

export const useCart = () => {
  const context =
    useContext(CartContext);

  if (!context) {
    throw new Error(
      "useCart debe utilizarse dentro de CartProvider"
    );
  }

  return context;
};