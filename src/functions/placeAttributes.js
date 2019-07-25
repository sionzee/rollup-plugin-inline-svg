export default
/**
 * Places attributes from object to string
 * @param {object} attributes
 * @return {string}
 */
function placeAttributes(attributes) {
  const keys = Object.keys(attributes);
  return keys.reduce((str, attr) => str += ` ${attr}="${attributes[attr]}"`, "");
}
