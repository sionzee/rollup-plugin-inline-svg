import Regexes from "../constants/Regexes";
import removeForbiddenNode from "./removeForbiddenNode";

export default
/**
 * Removes tags from html based on forbiddenTags array
 * @param {string} content
 * @param {Array.<string>} forbiddenTags
 * @return {string}
 */
function removeTags(content, forbiddenTags) {
  const match = content.match(Regexes.SVG);
  /* istanbul ignore else */
  if (match) {
    const svg = match[1];
    let result = svg;
    forbiddenTags.forEach(tag => {
      result = removeForbiddenNode(result, tag);
    });
    content = content.replace(svg, result);
  }
  return content;
}
