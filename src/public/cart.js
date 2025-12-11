// public/cart.js

const apiUrl = '.'; // same pattern as index.js

function formatCurrency(amount) {
  return '$' + amount.toLocaleString('en-US', { maximumFractionDigits: 0 });
}

async function fetchCart() {
  const res = await fetch(`${apiUrl}/cart`);
  if (!res.ok) throw new Error('Failed to fetch cart');
  return res.json();
}

async function postCheckout() {
  const res = await fetch(`${apiUrl}/cart/checkout`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
  });
  if (!res.ok) throw new Error('Checkout failed');
  return res.json();
}

function renderCart(cart) {
  const emptyMsg = document.getElementById('cartEmptyMessage');
  const tableWrapper = document.getElementById('cartTableWrapper');
  const tbody = document.getElementById('cartTableBody');
  const subtotalEl = document.getElementById('cartSubtotal');
  const discountRateEl = document.getElementById('cartDiscountRate');
  const discountAmountEl = document.getElementById('cartDiscountAmount');
  const finalTotalEl = document.getElementById('cartFinalTotal');

  if (!cart || !cart.items || cart.items.length === 0) {
    emptyMsg.textContent = 'Your cart is currently empty.';
    emptyMsg.classList.remove('hidden');
    tableWrapper.classList.add('hidden');
  } else {
    emptyMsg.classList.add('hidden');
    tableWrapper.classList.remove('hidden');
    tbody.innerHTML = '';

    cart.items.forEach((item) => {
      const lineTotal = item.unitPrice * item.quantity;
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${item.name}</td>
        <td>${item.type || 'Car'}</td>
        <td>${formatCurrency(item.unitPrice)}</td>
        <td>${item.quantity}</td>
        <td>${formatCurrency(lineTotal)}</td>
      `;
      tbody.appendChild(tr);
    });
  }

  const totals = cart.totals || {
    subtotal: 0,
    discountRate: 0,
    discountAmount: 0,
    total: 0,
  };

  subtotalEl.textContent = formatCurrency(totals.subtotal);
  discountRateEl.textContent = `${Math.round(totals.discountRate * 100)}%`;
  discountAmountEl.textContent = formatCurrency(totals.discountAmount);
  finalTotalEl.textContent = formatCurrency(totals.total);
}

async function loadCart() {
  const checkoutMsg = document.getElementById('checkoutMessage');
  checkoutMsg.textContent = '';
  try {
    const cart = await fetchCart();
    renderCart(cart);
  } catch (err) {
    console.error(err);
    document.getElementById('cartEmptyMessage').textContent =
      'Error loading cart.';
  }
}

async function handleCheckout() {
  const btn = document.getElementById('checkoutButton');
  const msg = document.getElementById('checkoutMessage');
  btn.disabled = true;
  msg.textContent = 'Processing checkout...';

  try {
    const result = await postCheckout();
    const { totals } = result;
    msg.textContent = `Checkout successful. You paid ${formatCurrency(
      totals.total
    )}. Cart has been cleared.`;
    await loadCart();
  } catch (err) {
    console.error(err);
    msg.textContent = 'Checkout failed. Please try again.';
  } finally {
    btn.disabled = false;
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const checkoutBtn = document.getElementById('checkoutButton');
  const refreshBtn = document.getElementById('refreshCartButton');

  if (checkoutBtn) checkoutBtn.addEventListener('click', handleCheckout);
  if (refreshBtn) refreshBtn.addEventListener('click', loadCart);

  loadCart();
});
