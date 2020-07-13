export default
/**
 * Escape simple quotes '
 * @param {string} content
 * @return {string}
 */
function escapeQuotes(content) {
  return content.replace(/([^\\])'/gm, "$1\\'");
}
