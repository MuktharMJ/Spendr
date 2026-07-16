// Spendr Utility Helpers

export const formatINR = (n: number): string =>
  '₹' + Number(n).toLocaleString('en-IN', { maximumFractionDigits: 0 });

export const timeAgo = (timestamp: number): string => {
  const hours = Math.floor((Date.now() - timestamp) / (1000 * 60 * 60));
  if (hours < 1) return 'Just now';
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return days === 1 ? 'Yesterday' : `${days} days ago`;
};

export const generateId = (): string =>
  Date.now().toString(36) + Math.random().toString(36).slice(2, 8);

// Money Facts API — Day 8 notes
export const fetchMoneyFact = async (): Promise<string | null> => {
  try {
    const res = await fetch('https://uselessfacts.jsph.pl/api/v2/facts/random');
    if (!res.ok) return null;
    const data = await res.json();
    return data.text ?? null;
  } catch {
    return null;
  }
};
