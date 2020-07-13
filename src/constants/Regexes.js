export default {
  SVG: /(<svg[\w\W]+?<\/svg>)/,
  ATTRS_SINGLE: /([a-zA-Z-]+)='(.*?)'/gm,
  ATTRS_MULTI: /([a-zA-Z-]+)="(.*?)"/gm,
  SVG_ATTRS: /(<svg[\w\W]+?>)/,
  WIDTH_ATTR: /<svg[\w\W]+?(width=["'][\w\W]+?["']\s?)[\w\W]+?>/,
  HEIGHT_ATTR: /<svg[\w\W]+?(height=["'][\w\W]+?["']\s?)[\w\W]+?>/m,
  MULTILINES: /(\r\n|\n|\r)/gm,

  ESCAPE_SINGLE_QUOTE: /(\\')/gm,
  ESCAPE_MULTI_QUOTE: /(\\")/gm,

  /**
   * Creates regex for attr match
   * @param {string} attr
   * @return {RegExp}
   */
  createRegexForAttributePresence: (attr) => new RegExp(String.raw`\s${attr}=["'][\w\W]+?["']`),

  /**
   * Creates regex for tag match
   * @param {string} tag
   * @return {RegExp}
   */
  createRegexForTag: (tag) => new RegExp(String.raw`<${tag}[\w\W]+?>?[\w\W]+?<?\/${tag}>`, "g")
};
