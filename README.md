# markdown-it-table-checkbox

Render `[x]`, `[X]` and `[ ]` as checkboxes in Markdown tables. Works with markdown-it 13, 14 and 15 when the `table` rule is enabled. Raw HTML can stay disabled.

## Install

After the package is published to npm, run:

```sh
npm install markdown-it markdown-it-table-checkbox
```

To try the package before publication, run `npm pack` in this repository. In the project where you want to use it, run `npm install /path/to/markdown-it-table-checkbox-1.0.0.tgz`. Keep your existing markdown-it dependency if it is in the supported range.

## Use

```js
const MarkdownIt = require('markdown-it');
const tableCheckbox = require('markdown-it-table-checkbox');

const md = new MarkdownIt().use(tableCheckbox);
```

```markdown
| Item      | Done |
| --------- | ---- |
| Check rig | [x]  |
| Test VHF  | [X]  |
| Fuel up   | [ ]  |
```

The first two boxes render checked. The third is unchecked and omits the `checked` attribute. The generated inputs are:

```html
<input type="checkbox" id="cbx_table_0" checked="true" disabled="true">
<input type="checkbox" id="cbx_table_1" checked="true" disabled="true">
<input type="checkbox" id="cbx_table_2" disabled="true">
```

A marker must fill a table cell, with optional surrounding padding. Both header and body cells work. A backslash escape, inline code, or additional cell text preserves the marker as ordinary Markdown. For example, `| \[x] |` displays `[x]` as text.

### Options

| Option | Default | Effect |
| --- | --- | --- |
| `disabled` | `true` | Set to `false` to let readers toggle the inputs in the browser. Changes are local to the page. |
| `idPrefix` | `'cbx_table_'` | Prefix for input IDs. Numbering starts at zero for each render. Use a distinct prefix for each separately rendered fragment inserted into the same page. |

## Task lists and Eleventy

The table plugin works alongside [markdown-it-task-checkbox](https://github.com/linsir/markdown-it-task-checkbox) in either registration order. Its default ID prefix differs from the task-list plugin’s `cbx_` prefix. If you customize the prefixes, keep them distinct.

### Greenroom

[Greenroom](https://github.com/eggplantpasta/greenroom) uses Build Awesome One on top of Eleventy. Its build dependencies live in `.build`, and it uses markdown-it 14.3.1 in the current lockfile.

From the root of a Greenroom checkout, install the packed plugin:

```sh
npm --prefix .build install /path/to/markdown-it-table-checkbox-1.0.0.tgz
```

After npm publication, use `npm --prefix .build install markdown-it-table-checkbox`. For a site build on another machine, install from npm or make the tarball available to that build.

In [`.build/greenroom.config.js`](https://github.com/eggplantpasta/greenroom/blob/main/.build/greenroom.config.js), add the import:

```js
import tableCheckbox from 'markdown-it-table-checkbox';
```

Extend the existing Markdown hook:

```js
$config.amendLibrary("md", (mdLib) => {
  mdLib.use(markdownItTaskCheckbox);
  mdLib.use(tableCheckbox);
});
```

Add a table to a Markdown post, run `npm --prefix .build run build`, and check the rendered post in `.build/_site/`.

### Other Eleventy projects

Register the plugin on your existing markdown-it instance. If you configure the library yourself, a minimal CommonJS example is:

```js
const MarkdownIt = require('markdown-it');
const taskCheckbox = require('markdown-it-task-checkbox');
const tableCheckbox = require('markdown-it-table-checkbox');

module.exports = function (eleventyConfig) {
  const md = new MarkdownIt()
    .use(taskCheckbox)
    .use(tableCheckbox);

  eleventyConfig.setLibrary('md', md);
};
```

Use the default markdown-it preset, or enable its `table` rule explicitly with `md.enable('table')` when using a preset that disables it.

GitHub’s Markdown renderer uses its own parser. To see the checkboxes on GitHub Pages, render the Markdown with Eleventy and publish the generated HTML.

## Test and release

Use Node.js 22 or newer for local development.

```sh
npm ci
npm test
npm pack --dry-run
```

To release on npm, sign in with the publishing account, confirm the package name, and run `npm publish`.

## License

[MIT](LICENSE)
