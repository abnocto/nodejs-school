/**
 * @param {Number} initialSum
 * @param {Number} maxAllowedSum
 * @returns {Number}
 */
export function getValidSum(initialSum, maxAllowedSum) {
  let sum = parseInt(initialSum, 10);
  const isValid = sum > 0 && Number.isFinite(sum);
  if (!isValid) sum = 0;
  if (sum > maxAllowedSum) sum = maxAllowedSum;
  return sum > 0 ? sum : 0;
}
