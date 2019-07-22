import test from 'ava';
// import path, { posix } from 'path';
// import { rollup } from 'rollup';
import inlineSvg from '../dist/rollup-plugin-inline-svg';

const TEST_SVG1 = `<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:a="http://ns.adobe.com/AdobeSVGViewerExtensions/3.0/" x="0px" y="0px" width="20px" height="20px" viewBox="0 0 20 20" enable-background="new 0 0 20 20" xml:space="preserve"></svg>`;
const TEST_SVG1_RES = JSON.stringify(`<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:a="http://ns.adobe.com/AdobeSVGViewerExtensions/3.0/" x="0px" y="0px" viewBox="0 0 20 20" enable-background="new 0 0 20 20" xml:space="preserve"></svg>`);

test('type', (t) => {
  t.is(typeof inlineSvg, 'function');
});

test('instance', (t) => {
  const result = inlineSvg();
  t.is(typeof result, 'object');
});

test('defaults', (t) => {
  const options = {};
  const result = inlineSvg(options);
  t.is(typeof result, 'object');
  t.is(typeof options.removeSVGTagAttrs, "boolean");
});

test("Simple svg", (t) => {
  const result = inlineSvg({removeSVGTagAttrs: false}).transform(TEST_SVG1, "test_svg.svg");
  t.is(result.code, `export default ${JSON.stringify(TEST_SVG1)}`);
});

test("Svg without width and height", (t) => {
  const result = inlineSvg().transform(TEST_SVG1, "test_svg.svg");
  t.is(result.code, `export default ${TEST_SVG1_RES}`);
});
