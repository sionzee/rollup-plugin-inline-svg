# rollup-plugin-inline-svg
Adds support for importing svg files with inline mode for Rollup.

## Installation

```npm
npm install --save-dev rollup-plugin-inline-svg
```
OR
```npm
yarn add --dev rollup-plugin-inline-svg
```

## Usage
```javascript
// rollup.config.js
import inlineSvg from 'rollup-plugin-inline-svg';

export default {
  input: "src/input.js",
  output: "dist/output.js",
  plugins: [
    inlineSvg({
      // Removes `width` and `height` attributes from <svg>.
      // default: true
      removeSVGTagAttrs: true
    })
  ],
}
```

You can use svg files in your bundle now. Example:
```javascript
  import svgIcon from "path-to-icons/checkbox.svg"
  document.getElementById("test").innerHTML = svgIcon;
```

>Note: Do not forget to append .svg extension or it will try to resolve with .js (or use plugin for resolving extensions)

## License
MIT, see `LICENSE` for more information.
