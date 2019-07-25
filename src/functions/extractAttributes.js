import Regexes from "../constants/Regexes";

export default
/**
 * Extracts attributes from html to object
 * @param {string} html
 * @return {object}
 */
function extractAttributes(html) {
  const attributes = Object.create(null);
  let match;
  while ((match = Regexes.ATTRS.exec(html)) != null) {
    attributes[match[1]] = match[2];
  }
  return attributes;
}
