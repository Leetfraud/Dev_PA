export const formatNumber = (num) => {
  if (!Number.isFinite(num)) return '0';
  if (num >= 1000000) {
    return `${(num / 1000000).toFixed(1)}M`;
  }
  if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}k`;
  }
  return num.toString();
};

export const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(date);
};

export const formatDateRelative = (dateString) => {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.floor((now - date) / 1000);

  let interval = Math.floor(seconds / 31536000);
  if (interval > 1) return `${interval} years ago`;

  interval = Math.floor(seconds / 2592000);
  if (interval > 1) return `${interval} months ago`;

  interval = Math.floor(seconds / 86400);
  if (interval > 1) return `${interval} days ago`;

  interval = Math.floor(seconds / 3600);
  if (interval > 1) return `${interval} hours ago`;

  interval = Math.floor(seconds / 60);
  if (interval > 1) return `${interval} minutes ago`;

  return 'just now';
};

export const getLanguageColor = (language) => {
  const colors = {
    JavaScript: '#F7DF1E',
    TypeScript: '#2B7A0B',
    Python: '#3776AB',
    Java: '#007396',
    'C++': '#00599C',
    C: '#555599',
    Go: '#00ADD8',
    Rust: '#CE422B',
    Ruby: '#CC342D',
    PHP: '#777BB4',
    Swift: '#FA7343',
    Kotlin: '#7F52FF',
    'C#': '#239120',
    Shell: '#22D3EE',
    HTML: '#E34C26',
    CSS: '#563D7C',
    React: '#61DAFB',
  };
  return colors[language] || '#64748B';
};

export const truncateText = (text, length = 100) => {
  if (!text) return '';
  if (text.length <= length) return text;
  return text.substring(0, length) + '...';
};

export const capitalize = (str) => {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};
