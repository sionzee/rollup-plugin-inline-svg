import { extname } from 'path';

import removeSVGTagAttrs from "./functions/removeSVGTagAttrs";
import removeTagAttrs from "./functions/removeTagAttrs";
import removeTags from "./functions/removeTags";
import validateSvgAttributes from "./functions/validateSvgAttributes";
import validateSvgNodes from "./functions/validateSvgNodes";

/**
 *
 * @param {{removeSVGTagAttrs: boolean, removeTags: boolean, removingTags: Array.<string>, warnTags: Array.<string>, warnTagAttrs: Array.<string>, removingTagAttrs: Array.<string>}} options
 * @return {{transform(*, *=): (null|*), name: string}|null|{code: string, map: {mappings: string}}}
 */
export default function svgInline(options = {}) {
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
      else {
        let content = code.trim();
        /* istanbul ignore else */
        if (options.warnTagAttrs) validateSvgAttributes(id, content, options.warnTagAttrs);
        /* istanbul ignore else */
        if (options.warnTags) validateSvgNodes(id, content, options.warnTags);
        if (options.removeSVGTagAttrs) content = removeSVGTagAttrs(content);
        if (options.removingTagAttrs.length > 0) content = removeTagAttrs(content, options.removingTagAttrs);
        if (options.removeTags) content = removeTags(content, options.removingTags);
        return {code: `export default '${content. replace(/(\r\n|\n|\r)/gm,"")}'`, map: {mappings: ''}};
      }
    }
  };
}
