import Regexes from "../constants/Regexes";
import hasAttribute from "./hasAttribute";

export default
/**
 * Checks if svg is containing forbidden attributes and throws a warnings
 * @param {string} id
 * @param {string} content
 * @param {Array.<string>} forbiddenAttributes
 */
function validateSvgAttributes(id, content, forbiddenAttributes) {
  const match = content.match(Regexes.SVG_ATTRS);
  /* istanbul ignore else */
  if (match) {
    const svg = match[1];
    const presentAttributes = [];
    forbiddenAttributes.forEach(attr => {
      /* istanbul ignore else */
      if (hasAttribute(svg, attr)) {
        presentAttributes.push(attr);
      }
    });
    /* istanbul ignore else */
    if (presentAttributes.length > 0) {
      console.warn('rollup-plugin-inline-svg: file ' + id + ' has forbidden attrs: ' + presentAttributes.join(', '));
    }
    return presentAttributes;
  } else return [];
}
