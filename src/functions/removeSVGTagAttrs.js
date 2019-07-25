import Regexes from "../constants/Regexes";

export default
/**
 * Removes `width` and `height` attributes from <svg> tag
 * @param {string} content
 * @return {string}
 */
function removeSVGTagAttrs(content) {
  let match = content.match(Regexes.WIDTH_ATTR);
  /* istanbul ignore else */
  if (match != null) {
    content = content.replace(match[1], "");
  }
  match = content.match(Regexes.HEIGHT_ATTR);
  /* istanbul ignore else */
  if (match != null) {
    content = content.replace(match[1], "");
  }
  return content;
}
