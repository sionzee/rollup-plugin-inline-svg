import Regexes from "../constants/Regexes";
import hasNode from "./hasNode";

export default

/**
 * Checks if svg is containing forbidden nodes and throws a warnings
 * @param {string} id
 * @param {string} content
 * @param {Array.<string>} forbiddenNodes
 */
function validateSvgNodes(id, content, forbiddenNodes) {
  const match = content.match(Regexes.SVG);
  /* istanbul ignore else */
  if (match) {
    const svg = match[1];
    const presentNodes = [];
    forbiddenNodes.forEach(node => {
      /* istanbul ignore else */
      if (hasNode(svg, node)) {
        presentNodes.push(node);
      }
    });
    /* istanbul ignore else */
    if (presentNodes.length > 0) {
      console.warn('rollup-plugin-inline-svg: file ' + id + ' has forbidden nodes: ' + presentNodes.join(', '));
    }
    return presentNodes;
  } else return [];
}
