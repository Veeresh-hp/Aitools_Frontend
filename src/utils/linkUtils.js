/**
 * Appends a referral parameter to a URL.
 * @param {string} url - The URL to modify.
 * @returns {string} - The URL with the referral parameter appended.
 */
export const addRefToUrl = (url) => {
  if (!url) return url;
  try {
    const urlObj = new URL(url);
    urlObj.searchParams.set('ref', 'myalltools.vercel.app');
    return urlObj.toString();
  } catch (e) {
    // If URL parsing fails (e.g. relative URLs or invalid strings), return as is
    console.warn('Invalid URL provided to addRefToUrl:', url);
    return url;
  }
};
