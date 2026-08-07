/**
 * Normalize a value that may be an array or a comma-separated string into an array.
 * Used for requiredDocuments, prerequisites, and subTasks from the API.
 *
 * @param {string|string[]|null|undefined} value
 * @returns {string[]}
 */
export function toArray(value) {
  if (value == null) return [];
  if (Array.isArray(value)) return value;
  if (typeof value === 'string') {
    return value
      .split(',')
      .map(s => s.trim())
      .filter(s => s.length > 0);
  }
  return [];
}
