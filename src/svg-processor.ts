import type { IDoc } from "html-to-ast/dist/types";
import type { InlineSvgOptions } from "./inlineSvgOptions";
import { parse, stringify } from "html-to-ast";

export interface ProcessingOptions extends InlineSvgOptions { fileName: string }
export type AstNode = ReturnType<typeof parse>[number]

export const markAsUnwrapped = (node: AstNode) => {
  node.attrs = {}
  node.name = 'element-marked-to-remove'
}

export const markAsRemoved = (node: AstNode) => {
  markAsUnwrapped(node)
  node.children = []
}

export const findSvgNode = (node: AstNode): AstNode | null => {
  let svgAst: AstNode | null = null
  SvgProcessor.traverse(node, node => {
    const name = node.name?.toLowerCase() ?? ''
    if(name === 'svg') {
      svgAst = node;
      return true
    }

    return false
  })
  return svgAst
}

export class SvgProcessor {

  static process(code: string, options: ProcessingOptions): string {
    const asts = parse(code.trim()) as AstNode[]

    if(asts.length > 1) {
      throw new Error(`rollup-plugin-inline-svg: file ${options.fileName} contains more than one root element`)
    }

    const ast = asts.find(node => findSvgNode(node) !== null)

    if(ast == null) {
      throw new Error(`rollup-plugin-inline-svg: file ${options.fileName} is not a valid svg. The 'svg' node was not found.`)
    }

    const requiresTraverse = options.forbidden !== undefined || options.traverse !== undefined
    if(requiresTraverse) {
      SvgProcessor.traverse(ast, node => {
        if(options?.forbidden?.attrs !== undefined && node.attrs !== undefined) {
          Object.keys(node.attrs).forEach(attrName => {
            if(options.forbidden!.attrs!.indexOf(attrName) >= 0)
              delete node.attrs![attrName]
          })
        }

        if((options?.forbidden?.tags?.indexOf(node.name ?? '') ?? -1) >= 0) {
          markAsUnwrapped(node)
        }

        if((options?.forbidden?.tags?.indexOf(node.name + ':remove') ?? -1) >= 0) {
          markAsRemoved(node)
        }

        options?.traverse?.(node);
      });
    }

    let transformedCode = stringify(asts as IDoc[])
    if(requiresTraverse) {
      transformedCode = transformedCode.replace(/<\/?element-marked-to-remove>/g, '')
    }
    return transformedCode
  }

  static traverse(node: AstNode, callbackFn: (node: AstNode) => boolean | void): void {
    if(!callbackFn(node) && node.children) node.children.forEach(child => this.traverse(child, callbackFn))
  }
}