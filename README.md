# rollup-plugin-inline-svg
Plugin for Rollup what transforms svg files into string on import. 

[![Build Status](https://travis-ci.org/sionzeecz/rollup-plugin-inline-svg.svg?branch=master)](https://travis-ci.org/sionzeecz/rollup-plugin-inline-svg) 
[![Coverage Status](https://coveralls.io/repos/github/sionzeecz/rollup-plugin-inline-svg/badge.svg?branch=master)](https://coveralls.io/github/sionzeecz/rollup-plugin-inline-svg?branch=master)

## Installation

```npm
npm install --save-dev rollup-plugin-inline-svg
```
OR
```npm
yarn add --dev rollup-plugin-inline-svg
```

## Configuration
```javascript
// rollup.config.js
import inlineSvg from 'rollup-plugin-inline-svg';

export default {
  input: "src/input.js",
  output: "dist/output.js",
  plugins: [
    inlineSvg({
      // Removes specified tags and its children. You can specify tags by setting removingTags query array.
      // default: false
      removeTags: false,
  
      // warning: this won't work unless you specify removeTags: true
      // default: ['title', 'desc', 'defs', 'style']
      removingTags: ['title', 'desc', 'defs', 'style'],
     
      // warns about present tags, ex: ['desc', 'defs', 'style']
      // default: []
      warnTags: [], 

      // Removes `width` and `height` attributes from <svg>.
      // default: true
      removeSVGTagAttrs: true,
  
      // Removes attributes from inside the <svg>.
      // default: []
      removingTagAttrs: [],
  
      // Warns to console about attributes from inside the <svg>.
      // default: []
      warnTagAttrs: []
    })
  ],
}
```

## Usage
```javascript
  import svg from "...test.svg"

  document.getElementById("test").innerHTML = svg; // svg = "<svg...>...</svg>"
```

>Note: Do not forget to append .svg extension or it will try to resolve with .js (or use plugin for resolving extensions)

This plugin is inspired by [svg-inline-loader](https://webpack.js.org/loaders/svg-inline-loader/) for webpack. 
I'm trying to make this plugin similar to the webpack one to make easier migration from webpack.

## License
MIT, see `LICENSE` for more information.
