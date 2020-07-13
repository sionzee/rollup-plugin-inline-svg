declare interface IInlineSvgOptions {
    removeSVGTagAttrs: boolean
    removeTags: boolean
    removingTags: Array<string>
    warnTags: Array<string>
    warnTagAttrs: Array<string>
    removingTagAttrs: Array<string>
}
declare function svgInline(options?: Partial<IInlineSvgOptions>): any;
declare module "rollup-plugin-inline-svg" {
    export = svgInline;
}
