/**
 * Capitalizes the first letter of a given string.
 * @param str The input string
 * @returns The input string with its first letter capitalized
 */
export function capitalizeFirstLetter(str: string): string {
  if (str.length === 0) return str
  return str.charAt(0).toUpperCase() + str.slice(1)
}
