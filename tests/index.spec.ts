import {it, describe, expect} from "vitest"
import {AstNode, SvgProcessor} from "../src/svg-processor";

describe('InlineSvg', () => {
  it(`not svg file`, () => {
    const html = `<title>Title here</title>`
    expect(
      () => SvgProcessor.process(html, {fileName: 'test.svg'})
    ).toThrowError('rollup-plugin-inline-svg: file test.svg is not a valid svg. The root element is not a svg tag.')
  });

  it(`multiple roots`, () => {
    const html = `<svg>Title here</svg><svg>Title here</svg>`
    expect(
      () => SvgProcessor.process(html, {fileName: 'test.svg'})
    ).toThrowError('rollup-plugin-inline-svg: file test.svg contains more than one root element')
  });

  it(`not tag`, () => {
    const html = ``
    expect(
      () => SvgProcessor.process(html, {fileName: 'test.svg'})
    ).toThrowError('rollup-plugin-inline-svg: file test.svg is not a valid svg. The root element is not a svg tag.')
  });

  it(`forbidden.tags`, () => {
    const html = `<svg><title>Title here</title></svg>`
    expect(
      SvgProcessor.process(html, {fileName: 'test.svg', forbidden: {tags: ['title']}})
    ).toEqual(`<svg>Title here</svg>`)
  });

  it(`forbidden.tags with remove`, () => {
    const html = `<svg><title>Title here</title></svg>`
    expect(
      SvgProcessor.process(html, {fileName: 'test.svg', forbidden: {tags: ['title:remove']}})
    ).toEqual(`<svg></svg>`)
  });

  it(`forbidden.attrs`, () => {
    const html = `<svg width="55px"></svg>`
    expect(
      SvgProcessor.process(html, {fileName: 'test.svg', forbidden: {attrs: ['width']}})
    ).toEqual(`<svg></svg>`)
  });

  it(`traverse`, () => {
    const html = `<svg width="55px"><div></div></svg>`
    const objs: AstNode[] = []
    SvgProcessor.process(html, {fileName: 'test.svg', traverse: node => objs.push(node)})
    expect(
      objs
    ).toEqual(
      [
        {
          "name": "svg",
          "type": "tag",
          "voidElement": false,
          "attrs": { "width": "55px" },
          "children": [{"attrs": {}, "children": [], "name": "div", "type": "tag", "voidElement": false}],
        },
        {"attrs": {}, "children": [], "name": "div", "type": "tag", "voidElement": false}
      ]
    )
  });
})