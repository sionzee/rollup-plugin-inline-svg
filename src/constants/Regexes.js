export default {
  SVG: /(<svg[\w\W]+?<\/svg>)/,
  ATTRS: /\s([\w\W]+?)=["']([\w\W]+?)["']/gm,
  SVG_ATTRS: /(<svg[\w\W]+?>)/,
  WIDTH_ATTR: /<svg[\w\W]+?(width=["'][\w\W]+?["']\s?)[\w\W]+?>/,
  HEIGHT_ATTR: /<svg[\w\W]+?(height=["'][\w\W]+?["']\s?)[\w\W]+?>/m,

  /**
   * Creates regex for attr match
   * @param {string} attr
   * @return {RegExp}
   */
  createRegexForAttributePresence: (attr) => new RegExp(`\\s${attr}=["'][\\w\\W]+?["']`),

  /**
   * Creates regex for tag match
   * @param {string} tag
   * @return {RegExp}
   */
  createRegexForTag: (tag) => new RegExp(`<${tag}[\\w\\W]+?>?[\\w\\W]+?<?\\/${tag}>`, "g")
};
