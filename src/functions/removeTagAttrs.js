import Regexes from "../constants/Regexes";
import extractAttributes from "./extractAttributes";
import createSvg from "./createSvg";

export default
/**
 * Removes attributes from html based on forbiddenAttributes array
 * @param {string} content
 * @param {Array.<string>} forbiddenAttributes
 * @return {string}
 */
function removeTagAttrs(content, forbiddenAttributes) {
  const match = content.match(Regexes.SVG_ATTRS);
  /* istanbul ignore else */
  if (match) {
    const svg = match[1];
    const attributes = extractAttributes(svg);
    forbiddenAttributes.forEach(attr => {
      /* istanbul ignore else */
      if (attributes[attr] != null) {
        delete attributes[attr];
      }
    });

    content = content.replace(svg, createSvg(attributes));
  }
  return content;
}
