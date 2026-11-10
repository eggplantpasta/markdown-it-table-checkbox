'use strict';

const marker = /^\[([xX ])\]$/;

module.exports = function tableCheckbox(md, {
  disabled = true,
  idPrefix = 'cbx_table_'
} = {}) {
  md.core.ruler.after('inline', 'table_checkbox', (state) => {
    let nextId = 0;

    for (let index = 1; index < state.tokens.length; index++) {
      const inline = state.tokens[index];
      const previous = state.tokens[index - 1];
      if (inline.type !== 'inline' ||
          (previous.type !== 'td_open' && previous.type !== 'th_open')) {
        continue;
      }

      const match = marker.exec(inline.content);
      if (!match) continue;

      const checkbox = new state.Token('table_checkbox_input', 'input', 0);
      checkbox.attrSet('type', 'checkbox');
      checkbox.attrSet('id', idPrefix + nextId++);
      if (match[1] !== ' ') checkbox.attrSet('checked', 'true');
      if (disabled) checkbox.attrSet('disabled', 'true');

      inline.children = [checkbox];
    }
  });
};
