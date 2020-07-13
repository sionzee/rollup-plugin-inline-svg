import Regexes from "../constants/Regexes";

export default
/**
 * Inlines node (removes multilines)
 * @param {string} content
 * @return {string}
 */
function inlineNode(content) {
  return content.replace(Regexes.MULTILINES, "");
}
