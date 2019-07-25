import Regexes from "../constants/Regexes";

export default
/**
 * Checks if svg has an attribute
 * @param {string} svg opening part of svg
 * @param {string} attribute
 */
function hasAttribute(svg, attribute) {
  return svg.match(Regexes.createRegexForAttributePresence(attribute)) != null;
}
