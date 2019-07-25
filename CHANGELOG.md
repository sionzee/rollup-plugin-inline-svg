# rollup-plugin-inline-svg changelog

## 1.1.0
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
