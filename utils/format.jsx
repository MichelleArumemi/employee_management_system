// utility.js

// Currency formatter (e.g., INR, USD)
export function formatCurrency(amount, currency = 'INR') {
  if (isNaN(amount)) return '-';
  return amount.toLocaleString('en-IN', {
    style: 'currency',
    currency,
    maximumFractionDigits: 2,
  });
}

// Date formatter (YYYY-MM-DD to readable)
export function formatDate(date) {
  if (!date) return '';
  const d = new Date(date);
  if (isNaN(d)) return '';
  return d.toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
  });
}