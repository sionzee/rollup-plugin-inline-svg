import {createFilter} from '@rollup/pluginutils';
import {InlineSvgOptions} from "./inlineSvgOptions";
import {SvgProcessor} from "./svg-processor";

const defaultOptions: InlineSvgOptions = {
  include: ['**/*.svg']
}

export default function InlineSvg(options: InlineSvgOptions = {}) {
  options = {...defaultOptions, ...options};
  const filter = createFilter(options.include, options.exclude)

  return {
    name: "InlineSvg",

    transform(code: string, id: string) {
      if(!filter(id)) return;
      return {code: `export default '${SvgProcessor.process(code, {...options, fileName: id})}'`, map: {mappings: ''}};
    },
  };
}
