import test from 'ava';
import inlineSvg from '../dist/rollup-plugin-inline-svg';

/**
 * Prepends and appends `` to the string
 */
function appendQuotes(string) {
  return `\`${string}\``;
}

const TEST_SVG1 = `<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:a="http://ns.adobe.com/AdobeSVGViewerExtensions/3.0/" x="0px" y="0px" width="20px" height="20px" viewBox="0 0 20 20" enable-background="new 0 0 20 20" xml:space="preserve"></svg>`;
const TEST_SVG1_RES = `<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:a="http://ns.adobe.com/AdobeSVGViewerExtensions/3.0/" x="0px" y="0px" viewBox="0 0 20 20" enable-background="new 0 0 20 20" xml:space="preserve"></svg>`;

const TEST_SVG_FORBIDDEN_NODES = `<svg><title>Test Name</title><path>test<style>Or Style</style></path><desc>Description?</desc></svg>`;
const TEST_SVG_FORBIDDEN_NODES_RES = `<svg><path>test</path></svg>`;

const TEST_SVG_FORBIDDEN_ATTRS = `<svg test="hello" version="1.1" id="nope"></svg>`;
const TEST_SVG_FORBIDDEN_ATTRS_RES = `<svg version="1.1"></svg>`;

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
  t.is(result.code, `export default ${appendQuotes(TEST_SVG1)}`);
});

test("Svg without width and height", (t) => {
  const result = inlineSvg().transform(TEST_SVG1, "remove_width_height_attrs.svg");
  t.is(result.code, `export default ${appendQuotes(TEST_SVG1_RES)}`);
});

test("Remove forbidden attributes from svg", (t) => {
  const result = inlineSvg({removingTagAttrs: ["test", "id"]}).transform(TEST_SVG_FORBIDDEN_ATTRS, "forbidden_attrs.svg");
  t.is(result.code, `export default ${appendQuotes(TEST_SVG_FORBIDDEN_ATTRS_RES)}`);
});

test("Remove forbidden nodes from svg", (t) => {
  const result = inlineSvg({removeTags: true, removingTags: ["title", "style", "desc"]}).transform(TEST_SVG_FORBIDDEN_NODES, "forbidden_nodes.svg");
  t.is(result.code, `export default ${appendQuotes(TEST_SVG_FORBIDDEN_NODES_RES)}`);
});

const warn = console.warn;

function spyWarn(callback) {
  console.warn = (...args) => {
    callback(args[0]);
    warn(...args);
  };
}

function releaseWarn() {
  console.warn = warn;
}

test("Warn about forbidden attributes", (t) => {
  spyWarn(message => {
    t.is(message, "rollup-plugin-inline-svg: file forbidden_attrs.svg has forbidden attrs: test, id");
  });
  inlineSvg({warnTagAttrs: ["test", "id"]}).transform(TEST_SVG_FORBIDDEN_ATTRS, "forbidden_attrs.svg");
  releaseWarn();
});

test("Warn about forbidden tags", (t) => {
  spyWarn(message => {
    t.is(message, "rollup-plugin-inline-svg: file forbidden_nodes.svg has forbidden nodes: style, title");

  });
  inlineSvg({warnTags: ["style", "title"]}).transform(TEST_SVG_FORBIDDEN_NODES, "forbidden_nodes.svg");
  releaseWarn();
});
