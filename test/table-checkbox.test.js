'use strict';

const assert = require('node:assert/strict');
const { test } = require('node:test');
const taskCheckbox = require('markdown-it-task-checkbox');
const tableCheckbox = require('..');

const table = '| [x] | Uppercase | Pending |\n| --- | :---: | --- |\n| Text | [X] | [ ] |';

for (const [version, MarkdownIt] of [
  [13, require('markdown-it-v13')],
  [14, require('markdown-it-v14')],
  [15, require('markdown-it')]
]) {
  test(`markdown-it ${version} renders all markers with HTML disabled`, () => {
    const md = new MarkdownIt({ html: false }).use(tableCheckbox);
    const html = md.render(table);

    assert.match(html, /<th><input type="checkbox" id="cbx_table_0" checked="true" disabled="true"><\/th>/);
    assert.match(html, /<td style="text-align:center"><input type="checkbox" id="cbx_table_1" checked="true" disabled="true"><\/td>/);
    assert.match(html, /<td><input type="checkbox" id="cbx_table_2" disabled="true"><\/td>/);
    assert.equal(md.render(table), html);
  });

  test(`markdown-it ${version} preserves other Markdown and disabled tables`, () => {
    const source = [
      '[x]',
      '',
      '- [x] List item',
      '',
      '| Status | Status | Status | Status |',
      '| --- | --- | --- | --- |',
      '| \\[x] | `[x]` | [x] text | [x](/link) |',
      '| **[X]** | [  ] | &#91;x] | [y] |',
      '',
      '```md',
      '| [x] |',
      '| --- |',
      '```'
    ].join('\n');

    const plain = new MarkdownIt();
    const withPlugin = new MarkdownIt().use(tableCheckbox);
    assert.equal(withPlugin.render(source), plain.render(source));
    withPlugin.disable('table');
    assert.equal(withPlugin.render(table), plain.disable('table').render(table));
  });

  test(`markdown-it ${version} supports enabled inputs, escaped IDs and XHTML`, () => {
    const md = new MarkdownIt({ xhtmlOut: true }).use(tableCheckbox, {
      disabled: false,
      idPrefix: 'status"'
    });
    const html = md.render(table);
    assert.match(html, /<input type="checkbox" id="status&quot;0" checked="true" \/>/);
    assert.match(html, /<input type="checkbox" id="status&quot;2" \/>/);
  });

  test(`markdown-it ${version} supports the task-list plugin in either order`, () => {
    const list = '- [x] Done\n- [ ] Pending\n';
    const listHtml = new MarkdownIt().use(taskCheckbox).render(list);
    const tableHtml = new MarkdownIt().use(tableCheckbox).render(table);

    for (const plugins of [[tableCheckbox, taskCheckbox], [taskCheckbox, tableCheckbox]]) {
      const md = new MarkdownIt().use(plugins[0]).use(plugins[1]);
      const html = md.render(list + '\n' + table + '\n\n' + table);
      assert.ok(html.startsWith(listHtml + tableHtml));
      const ids = Array.from(html.matchAll(/<input [^>]*id="([^"]+)"/g), match => match[1]);
      assert.deepEqual(ids, [
        'cbx_0', 'cbx_1', 'cbx_table_0', 'cbx_table_1', 'cbx_table_2',
        'cbx_table_3', 'cbx_table_4', 'cbx_table_5'
      ]);
    }
  });
}
