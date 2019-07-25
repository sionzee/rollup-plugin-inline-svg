import Regexes from "../constants/Regexes";

export default
/**
 * Removes nodes with children in `content` by `tag`
 * @param {string} content
 * @param {string} tag
 * @return {string}
 */
function removeForbiddenNode(content, tag) {
  const regex = Regexes.createRegexForTag(tag);
  let match;
  while ((match = regex.exec(content)) != null) {
    content = content.replace(match[0], "");
  }
  return content;
}
