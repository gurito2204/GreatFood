/**
 * Removes Vietnamese diacritics and converts to lowercase.
 * Used for fuzzy matching city names.
 */
const removeAccents = (str) => {
  return str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D")
    .toLowerCase();
};

export default removeAccents;
