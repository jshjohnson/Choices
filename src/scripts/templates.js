import classNames from 'classnames';
import { strToEl } from './lib/utils';

export const TEMPLATES = {
  containerOuter(
    globalClasses,
    direction,
    isSelectElement,
    isSelectOneElement,
    searchEnabled,
    passedElementType,
  ) {
    const tabIndex = isSelectOneElement ? 'tabindex="0"' : '';
    let role = isSelectElement ? 'role="listbox"' : '';
    let ariaAutoComplete = '';

    if (isSelectElement && searchEnabled) {
      role = 'role="combobox"';
      ariaAutoComplete = 'aria-autocomplete="list"';
    }

    return strToEl(`
      <div
        class="${globalClasses.containerOuter}"
        data-type="${passedElementType}"
        ${role}
        ${tabIndex}
        ${ariaAutoComplete}
        aria-haspopup="true"
        aria-expanded="false"
        dir="${direction}"
        >
      </div>
    `);
  },
  containerInner(globalClasses) {
    return strToEl(`
      <div class="${globalClasses.containerInner}"></div>
    `);
  },
  itemList(globalClasses, isSelectOneElement) {
    const localClasses = classNames(globalClasses.list, {
      [globalClasses.listSingle]: isSelectOneElement,
      [globalClasses.listItems]: !isSelectOneElement,
    });

    return strToEl(`
      <div class="${localClasses}"></div>
    `);
  },
  placeholder(globalClasses, value) {
    return strToEl(`
      <div class="${globalClasses.placeholder}">
        ${value}
      </div>
    `);
  },
  item(globalClasses, data, removeItemButton) {
    const ariaSelected = data.active ? 'aria-selected="true"' : '';
    const ariaDisabled = data.disabled ? 'aria-disabled="true"' : '';

    let localClasses = classNames(globalClasses.item, {
      [globalClasses.highlightedState]: data.highlighted,
      [globalClasses.itemSelectable]: !data.highlighted,
      [globalClasses.placeholder]: data.placeholder,
    });

    if (removeItemButton) {
      localClasses = classNames(globalClasses.item, {
        [globalClasses.highlightedState]: data.highlighted,
        [globalClasses.itemSelectable]: !data.disabled,
        [globalClasses.placeholder]: data.placeholder,
      });

      return strToEl(`
        <div
          class="${localClasses}"
          data-item
          data-id="${data.id}"
          data-value="${data.value}"
          data-custom-properties='${data.customProperties}'
          data-deletable
          ${ariaSelected}
          ${ariaDisabled}
          >
          ${data.label}<!--
       --><button
            type="button"
            class="${globalClasses.button}"
            data-button
            aria-label="Remove item: '${data.value}'"
            >
            Remove item
          </button>
        </div>
      `);
    }

    return strToEl(`
      <div
        class="${localClasses}"
        data-item
        data-id="${data.id}"
        data-value="${data.value}"
        ${ariaSelected}
        ${ariaDisabled}
        >
        ${data.label}
      </div>
    `);
  },
  choiceList(globalClasses, isSelectOneElement) {
    const ariaMultiSelectable = !isSelectOneElement
      ? 'aria-multiselectable="true"'
      : '';

    return strToEl(`
      <div
        class="${globalClasses.list}"
        dir="ltr"
        role="listbox"
        ${ariaMultiSelectable}
        >
      </div>
    `);
  },
  choiceGroup(globalClasses, data) {
    const ariaDisabled = data.disabled ? 'aria-disabled="true"' : '';
    const localClasses = classNames(globalClasses.group, {
      [globalClasses.itemDisabled]: data.disabled,
    });

    return strToEl(`
      <div
        class="${localClasses}"
        data-group
        data-id="${data.id}"
        data-value="${data.value}"
        role="group"
        ${ariaDisabled}
        >
        <div class="${globalClasses.groupHeading}">${data.value}</div>
      </div>
    `);
  },
  choice(globalClasses, data, itemSelectText) {
    const role = data.groupId > 0 ? 'role="treeitem"' : 'role="option"';
    const localClasses = classNames(
      globalClasses.item,
      globalClasses.itemChoice,
      {
        [globalClasses.itemDisabled]: data.disabled,
        [globalClasses.itemSelectable]: !data.disabled,
        [globalClasses.placeholder]: data.placeholder,
      },
    );

    return strToEl(`
      <div
        class="${localClasses}"
        data-select-text="${itemSelectText}"
        data-choice
        data-id="${data.id}"
        data-value="${data.value}"
        ${
          data.disabled
            ? 'data-choice-disabled aria-disabled="true"'
            : 'data-choice-selectable'
        }
        id="${data.elementId}"
        ${role}
        >
        ${data.label}
      </div>
    `);
  },
  input(globalClasses) {
    const localClasses = classNames(
      globalClasses.input,
      globalClasses.inputCloned,
    );

    return strToEl(`
      <input
        type="text"
        class="${localClasses}"
        autocomplete="off"
        autocapitalize="off"
        spellcheck="false"
        role="textbox"
        aria-autocomplete="list"
        >
    `);
  },
  dropdown(globalClasses) {
    const localClasses = classNames(
      globalClasses.list,
      globalClasses.listDropdown,
    );

    return strToEl(`
      <div
        class="${localClasses}"
        aria-expanded="false"
        >
      </div>
    `);
  },
  notice(globalClasses, label, type = '') {
    const localClasses = classNames(
      globalClasses.item,
      globalClasses.itemChoice,
      {
        [globalClasses.noResults]: type === 'no-results',
        [globalClasses.noChoices]: type === 'no-choices',
      },
    );

    return strToEl(`
      <div class="${localClasses}">
        ${label}
      </div>
    `);
  },
  option(data) {
    return strToEl(`
      <option value="${data.value}" ${data.active ? 'selected' : ''} ${
      data.disabled ? 'disabled' : ''
    } ${
      data.customProperties
        ? `data-custom-properties=${data.customProperties}`
        : ''
    }>${data.label}</option>
    `);
  },
};

export default TEMPLATES;
