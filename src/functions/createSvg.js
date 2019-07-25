import placeAttributes from "./placeAttributes";

export default
/**
 * Creates opening svg tag with attributes
 * @param {object} attributes
 */
function createSvg(attributes) {
  return `<svg${placeAttributes(attributes)}>`;
}
