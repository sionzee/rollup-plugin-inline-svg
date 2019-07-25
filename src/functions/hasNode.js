import Regexes from "../constants/Regexes";

export default
/**
 * Cheks if svg has a node
 * @param {string} svg whole svg body
 * @param {string} node
 */
function hasNode(svg, node) {
  return svg.match(Regexes.createRegexForTag(node)) != null;
}
