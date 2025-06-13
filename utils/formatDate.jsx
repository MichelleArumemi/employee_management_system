// Format a date string or Date object to 'DD MMM YYYY' (e.g., '13 Jun 2025')
export function formatDate(date) {
  if (!date) return '';
  const d = new Date(date);
  if (isNaN(d)) return '';
  return d.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

export default formatDate;
