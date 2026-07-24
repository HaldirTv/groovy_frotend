/** Returns the language URL prefix ('/en' or '') based on saved preference. */
export const getLangPrefix = (): string => {
  const saved = localStorage.getItem('lang') || 'uk'
  return saved === 'en' ? '/en' : ''
}
