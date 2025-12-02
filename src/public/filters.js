//Code for the js filter functionality, assisted by AI
document.addEventListener('DOMContentLoaded', () => {
  const pills = document.querySelectorAll('.filters-bar .filter-pill');
  const products = document.querySelectorAll('.product-grid .product-card');

  pills.forEach(pill => {
    pill.addEventListener('click', () => {
      if (pill.classList.contains('active')) return;

      // Remove active from all pills, add to clicked
      pills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');

      const filter = pill.textContent.trim();

      if (filter.toLowerCase() === 'all') {
        // Show all products
        products.forEach(p => p.style.display = '');
      } else {
        // Show only matching product-type
        products.forEach(p => {
          const type = p.dataset.productType;
          p.style.display = type === filter ? '' : 'none';
        });
      }
    });
  });
});