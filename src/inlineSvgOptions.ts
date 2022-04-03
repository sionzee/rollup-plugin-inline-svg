import {FilterPattern} from "@rollup/pluginutils";
import {AstNode} from "./svg-processor";

export interface InlineSvgOptions {
  forbidden?: {
    tags?: string[],
    attrs?: string[],
  },
  traverse?: (node: AstNode) => void,
  include?: FilterPattern,
  exclude?: FilterPattern,
}