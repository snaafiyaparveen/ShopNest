import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { useAuth } from './AuthContext'
import * as cartApi from '../api/cart'

const CartContext = createContext(null)

const GUEST_CART_KEY = 'shopnest_guest_cart'

function loadGuestCart() {
  try {
    return JSON.parse(localStorage.getItem(GUEST_CART_KEY)) || []
  } catch {
    return []
  }
}

function normalizeCart(cart) {
  return (
    cart?.items?.map((i) => ({
      cartItemId: i.cartItemId,
      productId: i.productId,
      product: {
        id: i.productId,
        name: i.productName,
        imageUrl: i.imageUrl,
        price: i.price,
      },
      quantity: i.quantity,
    })) || []
  )
}

export function CartProvider({ children }) {
  const { user } = useAuth()

  const [items, setItems] = useState([])
  const [isOpen, setIsOpen] = useState(false)
  const [lastAdded, setLastAdded] = useState(null)

  /*
   * ============================================================
   * GUEST CART
   * ============================================================
   */

  useEffect(() => {
    if (!user) {
      setItems(loadGuestCart())
    }
  }, [user])

  useEffect(() => {
    if (!user) {
      localStorage.setItem(
        GUEST_CART_KEY,
        JSON.stringify(items)
      )
    }
  }, [items, user])

  /*
   * ============================================================
   * SIGNED-IN CART
   * ============================================================
   *
   * Try to load the backend cart.
   *
   * If the backend is unavailable or returns 403,
   * we do not destroy the cart currently displayed in the UI.
   */

  useEffect(() => {
    if (!user) return

    cartApi
      .getCart()
      .then((cart) => {
        setItems(normalizeCart(cart))
      })
      .catch(() => {
        /*
         * Backend cart unavailable.
         *
         * Keep the current cart instead of replacing it
         * with an empty cart.
         */
      })
  }, [user])

  /*
   * ============================================================
   * ADD ITEM
   * ============================================================
   */

  const addItem = async (product, quantity = 1) => {
    setLastAdded(product)
    setIsOpen(true)

    /*
     * Immediately update the UI.
     *
     * This makes the cart responsive even if the backend
     * is slow or unavailable.
     */
    setItems((prev) => {
      const existing = prev.find(
        (item) => item.productId === product.id
      )

      if (existing) {
        return prev.map((item) =>
          item.productId === product.id
            ? {
                ...item,
                quantity: item.quantity + quantity,
              }
            : item
        )
      }

      return [
        ...prev,
        {
          cartItemId: `local-${product.id}`,
          productId: product.id,
          product,
          quantity,
        },
      ]
    })

    /*
     * For logged-in users, also try to save it to backend.
     *
     * If backend fails, the local UI cart remains intact.
     */
    if (user) {
      try {
        const cart = await cartApi.addToCart(
          product.id,
          quantity
        )

        setItems(normalizeCart(cart))
      } catch {
        /*
         * Keep optimistic local cart.
         */
      }
    }
  }

  /*
   * ============================================================
   * UPDATE QUANTITY
   * ============================================================
   */

  const updateQuantity = async (cartItemId, quantity) => {
    /*
     * Update UI immediately.
     */
    setItems((prev) => {
      if (quantity <= 0) {
        return prev.filter(
          (item) => item.cartItemId !== cartItemId
        )
      }

      return prev.map((item) =>
        item.cartItemId === cartItemId
          ? {
              ...item,
              quantity,
            }
          : item
      )
    })

    /*
     * Local cart does not need backend synchronization.
     */
    if (
      !user ||
      String(cartItemId).startsWith('local-')
    ) {
      return
    }

    /*
     * Try backend update.
     *
     * If it fails, keep the UI state.
     */
    try {
      await cartApi.updateCartItem(
        cartItemId,
        quantity
      )
    } catch {
      /*
       * Keep optimistic UI state.
       */
    }
  }

  /*
   * ============================================================
   * REMOVE ITEM
   * ============================================================
   */

  const removeItem = async (cartItemId) => {
    /*
     * IMPORTANT:
     *
     * Remove from UI FIRST.
     *
     * Previously the UI depended too much on the backend
     * response. Since your backend is currently returning
     * 403 for cart operations, that made deletion unreliable.
     */
    setItems((prev) =>
      prev.filter(
        (item) => item.cartItemId !== cartItemId
      )
    )

    /*
     * Local cart item.
     * Nothing else needs to happen.
     */
    if (
      !user ||
      String(cartItemId).startsWith('local-')
    ) {
      return
    }

    /*
     * Try to delete it from backend.
     *
     * Even if backend returns 403, the item is already
     * removed from the UI.
     */
    try {
      await cartApi.removeCartItem(cartItemId)
    } catch {
      /*
       * Backend failed.
       *
       * Keep item removed from UI.
       */
    }
  }

  /*
   * ============================================================
   * CLEAR CART
   * ============================================================
   *
   * Used after successful demo payment.
   */

  const clearCart = async () => {
    /*
     * Clear UI immediately.
     */
    setItems([])

    /*
     * Clear guest/local cart.
     */
    localStorage.removeItem(GUEST_CART_KEY)

    /*
     * We are deliberately not calling an unknown backend
     * clear-cart endpoint here yet.
     *
     * We'll handle backend cart cleanup once we inspect
     * your cart API class.
     */
  }

  /*
   * ============================================================
   * TOTAL ITEMS
   * ============================================================
   */

  const totalItems = useMemo(
    () =>
      items.reduce(
        (sum, item) => sum + item.quantity,
        0
      ),
    [items]
  )

  /*
   * ============================================================
   * TOTAL AMOUNT
   * ============================================================
   */

  const totalAmount = useMemo(
    () =>
      items.reduce(
        (sum, item) =>
          sum +
          Number(item.product.price) *
            item.quantity,
        0
      ),
    [items]
  )

  /*
   * ============================================================
   * CONTEXT
   * ============================================================
   */

  return (
    <CartContext.Provider
      value={{
        items,
        totalItems,
        totalAmount,

        addItem,
        updateQuantity,
        removeItem,
        clearCart,

        isOpen,
        setIsOpen,

        lastAdded,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () =>
  useContext(CartContext)