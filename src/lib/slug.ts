/**
 * Convert a string to a URL-friendly slug
 * @param text - The text to convert to slug
 * @returns URL-friendly slug
 */
export function createSlug(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
    .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
}

/**
 * Convert product name to slug
 * @param productName - Product name from API
 * @returns URL-friendly slug
 */
export function productNameToSlug(productName: string): string {
  return createSlug(productName);
}

