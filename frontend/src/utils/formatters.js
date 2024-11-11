export const formatNumber = (num) => {
    return new Intl.NumberFormat('en-SG').format(num);
  };
  
  export const formatPercent = (num) => {
    return `${num >= 0 ? '+' : ''}${num.toFixed(2)}%`;
  };
  
  export const formatPrice = (price) => {
    return `$${formatNumber(price)}`;
  };