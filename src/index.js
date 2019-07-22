import { extname } from 'path';

const WIDTH_ATTR = /<svg[\w\W]+?(width=["'][\w\W]+?["']\s?)[\w\W]+?>/;
const HEIGHT_ATTR = /<svg[\w\W]+?(height=["'][\w\W]+?["']\s?)[\w\W]+?>/;

function removeSVGTagAttrs(content) {
  let match = null;
  if ((match = content.match(WIDTH_ATTR))) {
    content = content.replace(match[1], "");
  }
  if ((match = content.match(HEIGHT_ATTR))) {
    content = content.replace(match[1], "");
  }
  return content;
}

/**
 * @param {{removeSVGTagAttrs: boolean}} options
 */
export default function svgInline(options = {}) {
  if (!options) options = {};
  if (typeof options.removeSVGTagAttrs !== "boolean") options.removeSVGTagAttrs = true;

  return {
    name: "svgInline",

    transform(code, id) {
      if (!extname(id).endsWith(".svg")) return null;
      let content = code.trim();
      if (options.removeSVGTagAttrs) content = removeSVGTagAttrs(content);
      return {code: `export default ${JSON.stringify(content)}`, map: {mappings: ''}};
    }
  };
}
