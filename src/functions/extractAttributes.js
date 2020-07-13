import Regexes from "../constants/Regexes";

export default
/**
 * Extracts attributes from html to object
 * @param {string} html
 * @return {object}
 */
function extractAttributes(html) {
  const attributes = Object.create(null);

  const tempHtml = html
    .replace(Regexes.ESCAPE_SINGLE_QUOTE, "$ESCP_S_Q$")
    .replace(Regexes.ESCAPE_MULTI_QUOTE, "$ESCP_M_Q$");

  for (const match of tempHtml.matchAll(Regexes.ATTRS_SINGLE)) {
    attributes[match[1]] = match[2]
      .replace(/\$ESCP_S_Q\$/gm, "\\'");
  }

  for (const match of tempHtml.matchAll(Regexes.ATTRS_MULTI)) {
    attributes[match[1]] = match[2]
      .replace(/\$ESCP_M_Q\$/gm, '\\"');
  }

  return attributes;
}
