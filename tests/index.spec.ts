import {it, describe, expect} from "vitest"
import {AstNode, SvgProcessor} from "../src/svg-processor";

describe('InlineSvg', () => {
  it(`not svg file`, () => {
    const html = `<title>Title here</title>`
    expect(
      () => SvgProcessor.process(html, {fileName: 'test.svg'})
    ).toThrowError('rollup-plugin-inline-svg: file test.svg is not a valid svg. The \'svg\' node was not found.')
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
    ).toThrowError('rollup-plugin-inline-svg: file test.svg is not a valid svg. The \'svg\' node was not found.')
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

  it('svg with metadata', () => {
    const svg = `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">
<svg
    xmlns="http://www.w3.org/2000/svg"
    xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" id="mdi-axis-arrow-info" width="24" height="24" viewBox="0 0 24 24">
    <path d="truncated" />
</svg>`
    SvgProcessor.process(svg, {fileName: 'test.svg'})
    // process shouldn't throw an error
  })
})