const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// Discounts:
// < 250000          -> 0%
// >= 250000 & <500k -> 10%
// >= 500000         -> 15%

function getDiscountRate(subtotal) {
  if (subtotal >= 500000) return 0.15;
  if (subtotal >= 250000) return 0.1;
  return 0;
}

function calculateTotals(items) {
  const subtotal = items.reduce(
    (sum, item) => sum + item.unitPrice * item.quantity,
    0
  );

  const discountRate = getDiscountRate(subtotal);
  const discountAmount = subtotal * discountRate;
  const total = subtotal - discountAmount;

  return {
    subtotal,
    discountRate,
    discountAmount,
    total,
  };
}

// Get all cart items and totals
async function getCart() {
  const items = await prisma.cartItem.findMany({
    orderBy: { createdAt: 'asc' },
  });
  const totals = calculateTotals(items);
  return { items, totals };
}

// Add / merge item in cart
async function addItem({ productId, name, type, unitPrice, quantity = 1 }) {
  if (!productId || !name || typeof unitPrice !== 'number' || Number.isNaN(unitPrice)) {
    throw new Error('Missing or invalid fields: productId, name, unitPrice.');
  }

  // Check if this product already exists in cart
  const existing = await prisma.cartItem.findFirst({
    where: { productId },
  });

  if (existing) {
    await prisma.cartItem.update({
      where: { id: existing.id },
      data: { quantity: existing.quantity + quantity },
    });
  } else {
    await prisma.cartItem.create({
      data: {
        productId,
        name,
        type: type || 'Car',
        unitPrice,
        quantity,
      },
    });
  }

  return getCart();
}

// Clear cart table
async function clearCart() {
  await prisma.cartItem.deleteMany({});
  return getCart();
}

// Checkout: snapshot + clear
async function checkoutCart() {
  const cartBefore = await getCart();
  await prisma.cartItem.deleteMany({});
  return cartBefore;
}

module.exports = {
  getCart,
  addItem,
  clearCart,
  checkoutCart,
};
