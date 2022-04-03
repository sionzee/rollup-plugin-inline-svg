# rollup-plugin-inline-svg
A rollup plugin for inlining svg files

[![Build Status](https://travis-ci.org/sionzeecz/rollup-plugin-inline-svg.svg?branch=master)](https://travis-ci.org/sionzeecz/rollup-plugin-inline-svg) 
[![Coverage Status](https://coveralls.io/repos/github/sionzeecz/rollup-plugin-inline-svg/badge.svg?branch=master)](https://coveralls.io/github/sionzeecz/rollup-plugin-inline-svg?branch=master)

## Features
- Checking validity of SVG files
- Filtering out attributes and tags with unwrap or delete action
- Traversing AST of SVG files
- Zero configuration config

## Installation

```bash
pnpm install --save-dev rollup-plugin-inline-svg
npm install --save-dev rollup-plugin-inline-svg
yarn add --dev rollup-plugin-inline-svg
```

## Configuration
In your `rollup.config.js` file
```javascript
import InlineSvg from 'rollup-plugin-inline-svg';

export default {
  // Omitted Fields
  plugins: [InlineSvg()],
}
```
or more advanced configuration
```javascript

import InlineSvg, {markAsRemoved} from 'rollup-plugin-inline-svg';

export default {
  // Omitted Fields
  plugins: [
    InlineSvg({
      forbidden: {
        tags: ['div', 'style:remove'],
        attrs: ['width', 'height'],
      },
      include: ['src/**/*.ts'],
      exclude: ['*.spec.ts'],
      traverse: (node: AstNode) => {
        if(node?.name === 'div' && node?.attrs?.['id'] !== undefined) {
          // remove all divs with id attributes
          markAsRemoved(node) // or markAsUnwrapped
        }
      },
    })
  ],
}
```

> Note: You can read about the options in CHANGELOG.md

## Usage
```typescript
import UserIcon from "@icons/user.svg"

document.querySelectorAll(`.icon.user`).forEach((node) => {
  node.innerHTML = UserIcon;
})
```

> Note: If you are not using custom module resolution, you should append .svg to import path.

## License
MIT, see `LICENSE` for more information.
