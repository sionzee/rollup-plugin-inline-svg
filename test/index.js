import test from 'ava';
import inlineSvg from '../src/index';
import createSvg from "../src/functions/createSvg";
import placeAttributes from "../src/functions/placeAttributes";
import extractAttributes from "../src/functions/extractAttributes";
import hasAttribute from "../src/functions/hasAttribute";
import hasNode from "../src/functions/hasNode";
import removeForbiddenNode from "../src/functions/removeForbiddenNode";
import removeSVGTagAttrs from "../src/functions/removeSVGTagAttrs";
import removeTagAttrs from "../src/functions/removeTagAttrs";
import removeTags from "../src/functions/removeTags";
import validateSvgAttributes from "../src/functions/validateSvgAttributes";
import validateSvgNodes from "../src/functions/validateSvgNodes";

/**
 * Prepends and appends `` to the string
 */
function appendQuotes(string) {
  return `'${string}'`;
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

test("invalid extension", (t) => {
  t.is(inlineSvg().transform(null, ".exe"), null);
});

test("fn: Create Svg", (t) => {
  t.is(createSvg({test: "test"}), `<svg test="test">`);
});

test(`fn: Place Attributes`, (t) => {
  t.is(placeAttributes({test: "test"}), ` test="test"`);
});

test(`fn: Extract Attributes`, (t) => {
  t.deepEqual(extractAttributes(`<svg title="hello" id="5">`), {title: "hello", id: "5"});
});

test(`fn: Has Attribute`, (t) => {
  t.is(hasAttribute(`<svg test="hello">`, "test"), true);
  t.is(hasAttribute(`<svg test="hello">`, "nope"), false);
});

test(`fn: hasNode`, (t) => {
  t.is(hasNode(`<svg><test></test></svg>`, "test"), true);
  t.is(hasNode(`<svg><test></test></svg>`, "nope"), false);
});

test(`fn: Remove Forbidden Nodes`, (t) => {
  const html = removeForbiddenNode("<svg><title></title></svg>", "title");
  const result = "<svg></svg>";
  t.is(html, result);
});

test(`fn: Remove SVG Tag Attributes`, (t) => {
  const html = removeSVGTagAttrs("<svg width='10' height='200'></svg>");
  const result = "<svg ></svg>";
  t.is(html, result);
});

test(`fn: Remove Tag Attributes`, (t) => {
  const html = removeTagAttrs(`<svg test="hey" id="5"></svg>`, ["test"]);
  const result = `<svg id="5"></svg>`;
  t.is(html, result);
});

test(`fn: Remove Tags`, (t) => {
  const html = removeTags(`<svg><nope></nope></svg>`, ["nope"]);
  const result = `<svg></svg>`;
  t.is(html, result);
});

test(`fn: Validate SVG Attributes`, (t) => {
  t.deepEqual(validateSvgAttributes("invalid_attributes", "<svg id='5' test='hello'></svg>", ["test"]), ["test"]);
  t.deepEqual(validateSvgAttributes("invalid_attributes", "<svg id='5' test='hello'></svg>", ["asd"]), []);
});

test(`fn: Validate SVG Nodes`, (t) => {
  t.deepEqual(validateSvgNodes("nodes", "<svg><nope></nope><title></title></svg>", ["nope"]), ["nope"]);
  t.deepEqual(validateSvgNodes("nodes", "<svg><nope></nope><title></title></svg>", ["asd"]), []);
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
