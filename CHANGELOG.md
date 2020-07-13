# rollup-plugin-inline-svg changelog

## 2.0.0
####  Added support for Rollup 2 and backward compatibility for v1
This plugin is already used within many Rollup 1 projects and there it no replacement now.\
I have set peerDependency to `rollup: "*"` so it allows to be installed next to rollup 1 and rollup 2.

#### Added typescript definition file
Some IDEs are working better with typescript project even inside javascript environment.\
So I bet it is better to have ts definition file.

#### Use simple quotes when exporting svg module
(#4, thanks for PR to **mvcds**)\
This should bring support for browsers what don't support template literals. 

#### Support for escaped quotes
Regexes were written in a way to search for " or ' quotes but haven't take in account\
the possibility of escaped characters. Since v2.0.0 is safe to have attribute like: `attr="te\"st"`.

#### Support for mixed quotes
This issue is similar to previous one, but in this case we are mixing the quotes:\
`attr="hell'o"` where Regexes looks for ["'] and the `o"` part is skipped.

### Others
- Improved readme content
- Replaced regex escaping for String.raw
- Bump all packages version

## 1.1.1
- *warnTags* and *warnTagAttrs* are now called before *removingTags* and *removingTagAttrs*.
- Filled in missing changelog for 1.1.0.

## 1.1.0
### Added

#### removingTags
Removes whole tags based on array with forbidden tags. Eg. 
Array with forbidden tags: ["title"]
SVG: "<svg><title>test</title></svg>"
After calling function removeForbiddenNode(SVG, Array) the SVG will be "<svg></svg>".
This is enabled only when `removeTags` is set to true.

#### removingTagAttrs
Removes attributes based on array with forbidden attributes. Eg. 
Array with forbidden attributes: ["test"]
SVG: "<svg test="hey">...</svg>"
After calling function removeTagAttrs(SVG, Array) the SVG will be "<svg>...</svg>".

#### warnTags
Calls `console.warn` when forbidden tag is present.
Array with forbidden tags: ["title"]
SVG: "<svg><title>test</title></svg>"
After calling function validateSvgNodes(_filename_, SVG, Array) the SVG will be "<svg><title>test</title></svg>".
But there will be warning from console about used `title` tag

#### warnTagAttrs
Calls `console.warn` when forbidden attribute is present.
Array with forbidden attributes: ["test"]
SVG: "<svg test="hey">...</svg>"
After calling function validateSvgAttributes(_filename_, SVG, Array) the SVG will be "<svg test="hey">...</svg>".
But there will be warning from console about used `test` attribute

## 1.0.0

* Initial release
