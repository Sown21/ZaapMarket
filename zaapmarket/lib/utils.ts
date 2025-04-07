export const formatNumber = (value: bigint | number): string => {
  return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
}; 