import { extname } from 'path';

const ATTRS = /\s([\w\W]+?)=["']([\w\W]+?)["']/gm;

/**
 * Extracts attributes from html to object
 * @param {string} html
 * @return {object}
 */
function extractAttributes(html) {
  const attributes = Object.create(null);
  let match;
  while ((match = ATTRS.exec(html)) != null) {
    attributes[match[1]] = match[2];
  }
  return attributes;
}

/**
 * Places attributes from object to string
 * @param {object} attributes
 * @return {string}
 */
function placeAttributes(attributes) {
  const keys = Object.keys(attributes);
  return keys.reduce((str, attr) => str += ` ${attr}="${attributes[attr]}"`, "");
}

const createRegexForAttributePresence = (attr) => new RegExp(`\\s${attr}=["'][\\w\\W]+?["']`);

/**
 * Checks if svg has an attribute
 * @param {string} svg opening part of svg
 * @param {string} attribute
 */
function hasAttribute(svg, attribute) {
  return svg.match(createRegexForAttributePresence(attribute));
}

/**
 * Cheks if svg has a node
 * @param {string} svg whole svg body
 * @param {string} node
 */
function hasNode(svg, node) {
  return svg.match(createRegexForTag(node));
}

/**
 * Checks if svg is containing forbidden attributes and throws a warnings
 * @param {string} id
 * @param {string} content
 * @param {Array.<string>} forbiddenAttributes
 */
function validateSvgAttributes(id, content, forbiddenAttributes) {
  const match = content.match(SVG_ATTRS);
  if (match) {
    const svg = match[1];
    const presentAttributes = [];
    forbiddenAttributes.forEach(attr => {
      if (hasAttribute(svg, attr)) {
        presentAttributes.push(attr);
      }
    });
    if (presentAttributes.length > 0) {
      console.warn('rollup-plugin-inline-svg: file ' + id + ' has forbidden attrs: ' + presentAttributes.join(', '));
    }
  }
}

/**
 * Checks if svg is containing forbidden nodes and throws a warnings
 * @param {string} id
 * @param {string} content
 * @param {Array.<string>} forbiddenNodes
 */
function validateSvgNodes(id, content, forbiddenNodes) {
  const match = content.match(SVG);
  if (match) {
    const svg = match[1];
    const presentNodes = [];
    forbiddenNodes.forEach(node => {
      if (hasNode(svg, node)) {
        presentNodes.push(node);
      }
    });
    if (presentNodes.length > 0) {
      console.warn('rollup-plugin-inline-svg: file ' + id + ' has forbidden nodes: ' + presentNodes.join(', '));
    }
  }
}

/**
 * Creates opening svg tag with attributes
 * @param {object} attributes
 */
function createSvg(attributes) {
  return `<svg${placeAttributes(attributes)}>`;
}

const SVG_ATTRS = /(<svg[\w\W]+?>)/;

/**
 * Removes attributes from html based on forbiddenAttributes array
 * @param {string} content
 * @param {Array.<string>} forbiddenAttributes
 * @return {string}
 */
function removeTagAttrs(content, forbiddenAttributes) {
  const match = content.match(SVG_ATTRS);
  if (match) {
    const svg = match[1];
    const attributes = extractAttributes(svg);
    forbiddenAttributes.forEach(attr => {
      if (attributes[attr] != null) {
        delete attributes[attr];
      }
    });

    content = content.replace(svg, createSvg(attributes));
  }
  return content;
}

const SVG = /(<svg[\w\W]+?<\/svg>)/;

/**
 * Creates regex for tag match
 * @param {string} tag
 * @return {RegExp}
 */
const createRegexForTag = (tag) => new RegExp(`<${tag}[\\w\\W]+?>?[\\w\\W]+?<\\/${tag}>`, "g");

/**
 * Removes nodes with children in `content` by `tag`
 * @param {string} content
 * @param {string} tag
 * @return {string}
 */
function removeForbiddenNodes(content, tag) {
  const regex = createRegexForTag(tag);
  let match;
  while ((match = regex.exec(content)) != null) {
    content = content.replace(match[0], "");
  }
  return content;
}

/**
 * Removes tags from html based on forbiddenTags array
 * @param {string} content
 * @param {Array.<string>} forbiddenTags
 * @return {string}
 */
function removeTags(content, forbiddenTags) {
  const match = content.match(SVG);
  if (match) {
    const svg = match[1];
    let result = svg;
    forbiddenTags.forEach(tag => {
      result = removeForbiddenNodes(result, tag);
    });
    content = content.replace(svg, result);
  }
  return content;
}

const WIDTH_ATTR = /<svg[\w\W]+?(width=["'][\w\W]+?["']\s?)[\w\W]+?>/;
const HEIGHT_ATTR = /<svg[\w\W]+?(height=["'][\w\W]+?["']\s?)[\w\W]+?>/;

/**
 * Removes `width` and `height` attributes from <svg> tag
 * @param {string} content
 * @return {string}
 */
function removeSVGTagAttrs(content) {
  let match;
  if ((match = content.match(WIDTH_ATTR))) {
    content = content.replace(match[1], "");
  }
  if ((match = content.match(HEIGHT_ATTR))) {
    content = content.replace(match[1], "");
  }
  return content;
}


/**
 *
 * @param {{removeSVGTagAttrs: boolean, removeTags: boolean, removingTags: Array.<string>, warnTags: Array.<string>, warnTagAttrs: Array.<string>, removingTagAttrs: Array.<string>}} options
 * @return {{transform(*, *=): (null|*), name: string}|null|{code: string, map: {mappings: string}}}
 */
export default function svgInline(options = {}) {
  if (!options) options = {};
  if (typeof options.removeSVGTagAttrs !== "boolean") options.removeSVGTagAttrs = true;
  if (typeof options.removeTags !== "boolean") options.removeTags = false;
  if (!Array.isArray(options.removingTags)) options.removingTags = ['title', 'desc', 'defs', 'style'];
  if (!Array.isArray(options.warnTags)) options.warnTags = [];
  if (!Array.isArray(options.warnTagAttrs)) options.warnTagAttrs = [];
  if (!Array.isArray(options.removingTagAttrs)) options.removingTagAttrs = [];

  return {
    name: "svgInline",

    transform(code, id) {
      if (!extname(id).endsWith(".svg")) return null;
      let content = code.trim();
      if (options.removeSVGTagAttrs) content = removeSVGTagAttrs(content);
      if (options.removingTagAttrs.length > 0) content = removeTagAttrs(content, options.removingTagAttrs);
      if (options.removeTags) content = removeTags(content, options.removingTags);
      if (options.warnTagAttrs) validateSvgAttributes(id, content, options.warnTagAttrs);
      if (options.warnTags) validateSvgNodes(id, content, options.warnTags);
      return {code: `export default \`${content}\``, map: {mappings: ''}};
    }
  };
}
