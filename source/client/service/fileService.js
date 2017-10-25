/**
 * Initiates file downloading
 * @param {Object} data
 * @param {String} filename
 * @param {String} type
 */
export function downloadFile(data, filename, type) {
  const file = new File([data], filename, { type });
  const url = URL.createObjectURL(file);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
}
