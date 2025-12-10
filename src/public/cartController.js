const cartModel = require('../public/cartModel');

// GET /cart
async function getCart(req, res, next) {
  try {
    const cart = await cartModel.getCart();
    res.json(cart);
  } catch (err) {
    next(err);
  }
}

// POST /cart
async function addToCart(req, res, next) {
  try {
    const { productId, name, type, unitPrice, quantity } = req.body;

    const parsedProductId = Number(productId);
    const parsedUnitPrice = Number(unitPrice);
    const parsedQuantity = Number(quantity || 1);

    if (
      Number.isNaN(parsedProductId) ||
      !name ||
      Number.isNaN(parsedUnitPrice)
    ) {
      return res
        .status(400)
        .json({ error: 'productId, name and unitPrice are required and must be valid numbers.' });
    }

    const updatedCart = await cartModel.addItem({
      productId: parsedProductId,
      name,
      type,
      unitPrice: parsedUnitPrice,
      quantity: parsedQuantity,
    });

    res.status(201).json(updatedCart);
  } catch (err) {
    next(err);
  }
}

// POST /cart/checkout
async function checkout(req, res, next) {
  try {
    const result = await cartModel.checkoutCart();
    res.json({
      message: 'Checkout successful.',
      items: result.items,
      totals: result.totals,
    });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getCart,
  addToCart,
  checkout,
};
