/**
 * Format số tiền theo kiểu Việt Nam
 * 25000     → "25.000₫"
 * 150000    → "150.000₫"
 * 1500000   → "1.500.000₫"
 * "35.50"   → "36₫"  (làm tròn)
 * "25000₫"  → "25.000₫" (đã có ₫ thì strip rồi format lại)
 *
 * @param {number|string} value
 * @param {object} options
 * @param {boolean} options.showSymbol - Hiện ₫ cuối (default: true)
 * @param {boolean} options.showZero  - Hiện 0₫ hay "Miễn phí" (default: true)
 * @returns {string}
 */
export const formatPrice = (value, options = {}) => {
  const { showSymbol = true, showZero = true } = options;

  // Strip existing ₫, spaces, dots used as separators
  let raw = String(value || 0)
    .replace(/₫/g, "")
    .replace(/\s/g, "")
    .trim();

  // If the value looks like "20k - 50k", don't format, return as-is
  if (/[a-zA-Z]/.test(raw) && !/^[\d.,]+$/.test(raw)) {
    return String(value);
  }

  const num = Math.round(parseFloat(raw) || 0);

  if (num === 0 && !showZero) return "Miễn phí";

  // Use vi-VN locale → dots as thousand separators
  const formatted = num.toLocaleString("vi-VN");
  return showSymbol ? `${formatted}₫` : formatted;
};

/**
 * Format số tiền ngắn gọn cho badges/tags
 * 25000 → "25k"
 * 150000 → "150k"
 * 1500000 → "1.5M"
 */
export const formatPriceShort = (value) => {
  const num = Math.round(parseFloat(String(value || 0).replace(/₫/g, "")) || 0);
  if (num >= 1000000) return `${(num / 1000000).toFixed(1).replace(/\.0$/, "")}M`;
  if (num >= 1000) return `${Math.round(num / 1000)}k`;
  return `${num}`;
};
