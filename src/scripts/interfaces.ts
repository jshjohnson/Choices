/* eslint-disable @typescript-eslint/no-explicit-any */
import { FuseOptions } from 'fuse.js';
import Choices from './choices';

export namespace Types {
  export type strToEl = (
    str: string,
  ) => HTMLElement | HTMLInputElement | HTMLOptionElement;
  export type stringFunction = () => string;
  export type noticeStringFunction = (value: string) => string;
  export type noticeLimitFunction = (maxItemCount: number) => string;
  export type filterFunction = (value: string) => boolean;
  export type valueCompareFunction = (
    value1: string,
    value2: string,
  ) => boolean;
}

export interface Choice {
  id?: number;
  customProperties?: Record<string, any>;
  disabled?: boolean;
  active?: boolean;
  elementId?: string;
  groupId?: number;
  keyCode?: number;
  label: string;
  placeholder?: boolean;
  selected?: boolean;
  value: string;
  score?: number;
  choices?: Choice[];
}

export interface Group {
  id?: number;
  active?: boolean;
  disabled?: boolean;
  value: any;
}
export interface Item extends Choice {
  choiceId?: number;
  highlighted?: boolean;
}

/**
 * Events fired by Choices behave the same as standard events. Each event is triggered on the element passed to Choices (accessible via `this.passedElement`. Arguments are accessible within the `event.detail` object.
 */
export interface EventMap {
  /**
   * Triggered each time an item is added (programmatically or by the user).
   *
   * **Input types affected:** text, select-one, select-multiple
   *
   * Arguments: id, value, label, groupValue, keyCode
   */
  addItem: CustomEvent<{
    id: number;
    value: string;
    label: string;
    groupValue: string;
    keyCode: number;
  }>;

  /**
   * Triggered each time an item is removed (programmatically or by the user).
   *
   * **Input types affected:** text, select-one, select-multiple
   *
   * Arguments: id, value, label, groupValue
   */
  removeItem: CustomEvent<{
    id: number;
    value: string;
    label: string;
    groupValue: string;
  }>;

  /**
   * Triggered each time an item is highlighted.
   *
   * **Input types affected:** text, select-multiple
   *
   * Arguments: id, value, label, groupValue
   */
  highlightItem: CustomEvent<{
    id: number;
    value: string;
    label: string;
    groupValue: string;
  }>;

  /**
   * Triggered each time an item is unhighlighted.
   *
   * **Input types affected:** text, select-multiple
   *
   * Arguments: id, value, label, groupValue
   */
  unhighlightItem: CustomEvent<{
    id: number;
    value: string;
    label: string;
    groupValue: string;
  }>;

  /**
   * Triggered each time a choice is selected **by a user**, regardless if it changes the value of the input.
   *
   * **Input types affected:** select-one, select-multiple
   *
   * Arguments: choice: Choice
   */
  choice: CustomEvent<{ choice: Choice }>;

  /**
   * Triggered each time an item is added/removed **by a user**.
   *
   * **Input types affected:** text, select-one, select-multiple
   *
   * Arguments: value
   */
  change: CustomEvent<{ value: string }>;

  /**
   * Triggered when a user types into an input to search choices.
   *
   * **Input types affected:** select-one, select-multiple
   *
   * Arguments: value, resultCount
   */
  search: CustomEvent<{ value: string; resultCount: number }>;

  /**
   * Triggered when the dropdown is shown.
   *
   * **Input types affected:** select-one, select-multiple
   *
   * Arguments: -
   */
  showDropdown: CustomEvent<undefined>;

  /**
   * Triggered when the dropdown is hidden.
   *
   * **Input types affected:** select-one, select-multiple
   *
   * Arguments: -
   */
  hideDropdown: CustomEvent<undefined>;

  /**
   * Triggered when a choice from the dropdown is highlighted.
   *
   * Input types affected: select-one, select-multiple
   * Arguments: el is the choice.passedElement that was affected.
   */
  highlightChoice: CustomEvent<{ el: PassedElement }>;
}

export interface KeyCodeMap {
  BACK_KEY: 46;
  DELETE_KEY: 8;
  ENTER_KEY: 13;
  A_KEY: 65;
  ESC_KEY: 27;
  UP_KEY: 38;
  DOWN_KEY: 40;
  PAGE_UP_KEY: 33;
  PAGE_DOWN_KEY: 34;
}

export type ActionType =
  | 'ADD_CHOICE'
  | 'FILTER_CHOICES'
  | 'ACTIVATE_CHOICES'
  | 'CLEAR_CHOICES'
  | 'ADD_GROUP'
  | 'ADD_ITEM'
  | 'REMOVE_ITEM'
  | 'HIGHLIGHT_ITEM'
  | 'CLEAR_ALL'
  | 'RESET_TO'
  | 'SET_IS_LOADING';

export interface Templates {
  containerOuter: (
    this: Choices,
    classNames: ClassNames,
    direction: HTMLElement['dir'],
    isSelectElement: boolean,
    isSelectOneElement: boolean,
    searchEnabled: boolean,
    passedElementType: PassedElement['type'],
  ) => HTMLElement;
  containerInner: (this: Choices, classNames: ClassNames) => HTMLElement;
  itemList: (
    this: Choices,
    classNames: ClassNames,
    isSelectOneElement: boolean,
  ) => HTMLElement;
  placeholder: (
    this: Choices,
    classNames: ClassNames,
    value: string,
  ) => HTMLElement;
  item: (
    this: Choices,
    classNames: ClassNames,
    data: Choice,
    removeItemButton: boolean,
  ) => HTMLElement;
  choiceList: (
    this: Choices,
    classNames: ClassNames,
    isSelectOneElement: boolean,
  ) => HTMLElement;
  choiceGroup: (
    this: Choices,
    classNames: ClassNames,
    data: Choice,
  ) => HTMLElement;
  choice: (
    this: Choices,
    classNames: ClassNames,
    data: Choice,
    selectText: string,
  ) => HTMLElement;
  input: (
    this: Choices,
    classNames: ClassNames,
    placeholderValue: string,
  ) => HTMLInputElement;
  dropdown: (this: Choices, classNames: ClassNames) => HTMLElement;
  notice: (
    this: Choices,
    classNames: ClassNames,
    label: string,
    type: '' | 'no-results' | 'no-choices',
  ) => HTMLElement;
  option: (data: object) => HTMLOptionElement;
}

/** Classes added to HTML generated by  By default classnames follow the BEM notation. */
export interface ClassNames {
  /** @default 'choices' */
  containerOuter: string;
  /** @default 'choices__inner' */
  containerInner: string;
  /** @default 'choices__input' */
  input: string;
  /** @default 'choices__input--cloned' */
  inputCloned: string;
  /** @default 'choices__list' */
  list: string;
  /** @default 'choices__list--multiple' */
  listItems: string;
  /** @default 'choices__list--single' */
  listSingle: string;
  /** @default 'choices__list--dropdown' */
  listDropdown: string;
  /** @default 'choices__item' */
  item: string;
  /** @default 'choices__item--selectable' */
  itemSelectable: string;
  /** @default 'choices__item--disabled' */
  itemDisabled: string;
  /** @default 'choices__item--choice' */
  itemChoice: string;
  /** @default 'choices__placeholder' */
  placeholder: string;
  /** @default 'choices__group' */
  group: string;
  /** @default 'choices__heading' */
  groupHeading: string;
  /** @default 'choices__button' */
  button: string;
  /** @default 'is-active' */
  activeState: string;
  /** @default 'is-focused' */
  focusState: string;
  /** @default 'is-open' */
  openState: string;
  /** @default 'is-disabled' */
  disabledState: string;
  /** @default 'is-highlighted' */
  highlightedState: string;
  /** @default 'is-selected' */
  selectedState: string;
  /** @default 'is-flipped' */
  flippedState: string;
  /** @default 'is-loading' */
  loadingState: string;
  /** @default 'has-no-results' */
  noResults: string;
  /** @default 'has-no-choices' */
  noChoices: string;
}

export interface PassedElement extends HTMLElement {
  classNames: ClassNames;
  element: (HTMLInputElement | HTMLSelectElement) & {
    // Extends HTMLElement addEventListener with Choices events
    addEventListener<K extends keyof EventMap>(
      type: K,
      listener: (
        this: HTMLInputElement | HTMLSelectElement,
        ev: EventMap[K],
      ) => void,
      options?: boolean | AddEventListenerOptions,
    ): void;
  };
  type: 'text' | 'select-one' | 'select-multiple';
  isDisabled: boolean;
  parentInstance: Choices;
}

/**
 * Choices options interface
 *
 * **Terminology**
 *
 * - **Choice:** A choice is a value a user can select. A choice would be equivalent to the `<option></option>` element within a select input.
 * - **Group:** A group is a collection of choices. A group should be seen as equivalent to a `<optgroup></optgroup>` element within a select input.
 * - **Item:** An item is an inputted value **_(text input)_** or a selected choice **_(select element)_**. In the context of a select element, an item is equivelent to a selected option element: `<option value="Hello" selected></option>` whereas in the context of a text input an item is equivelant to `<input type="text" value="Hello">`
 */
export interface Options {
  /**
   * Optionally suppress console errors and warnings.
   *
   * **Input types affected:** text, select-single, select-multiple
   *
   * @default false
   */
  silent: boolean;

  /**
   * Add pre-selected items (see terminology) to text input.
   *
   * **Input types affected:** text
   *
   * @example
   * ```
   * ['value 1', 'value 2', 'value 3']
   * ```
   *
   * @example
   * ```
   * [{
   *    value: 'Value 1',
   *    label: 'Label 1',
   *    id: 1
   *  },
   *  {
   *    value: 'Value 2',
   *    label: 'Label 2',
   *    id: 2,
   *    customProperties: {
   *      random: 'I am a custom property'
   *  }
   * }]
   * ```
   *
   * @default []
   */
  items: string[] | Choice[];

  /**
   * Add choices (see terminology) to select input.
   *
   * **Input types affected:** select-one, select-multiple
   *
   * @example
   * ```
   * [{
   *   value: 'Option 1',
   *   label: 'Option 1',
   *   selected: true,
   *   disabled: false,
   * },
   * {
   *   value: 'Option 2',
   *   label: 'Option 2',
   *   selected: false,
   *   disabled: true,
   *   customProperties: {
   *     description: 'Custom description about Option 2',
   *     random: 'Another random custom property'
   *   },
   * }]
   * ```
   *
   * @default []
   */
  choices: Choice[];

  /**
   * The amount of choices to be rendered within the dropdown list `("-1" indicates no limit)`. This is useful if you have a lot of choices where it is easier for a user to use the search area to find a choice.
   *
   * **Input types affected:** select-one, select-multiple
   *
   * @default -1
   */
  renderChoiceLimit: number;

  /**
   * The amount of items a user can input/select `("-1" indicates no limit)`.
   *
   * **Input types affected:** text, select-multiple
   *
   * @default -1
   */
  maxItemCount: number;

  /**
   * Whether a user can add items.
   *
   * **Input types affected:** text
   *
   * @default true
   */
  addItems: boolean;

  /**
   * A filter that will need to pass for a user to successfully add an item.
   *
   * **Input types affected:** text
   *
   * @default null
   */
  addItemFilter: string | RegExp | Types.filterFunction | null;

  /**
   * The text that is shown when a user has inputted a new item but has not pressed the enter key. To access the current input value, pass a function with a `value` argument (see the **default config** [https://github.com/jshjohnson/Choices#setup] for an example), otherwise pass a string.
   *
   * **Input types affected:** text
   *
   * @default
   * ```
   * (value) => `Press Enter to add <b>"${value}"</b>`;
   * ```
   */
  addItemText: string | Types.noticeStringFunction;

  /**
   * Whether a user can remove items.
   *
   * **Input types affected:** text, select-multiple
   *
   * @default true
   */
  removeItems: boolean;

  /**
   * Whether each item should have a remove button.
   *
   * **Input types affected:** text, select-one, select-multiple
   *
   * @default false
   */
  removeItemButton: boolean;

  /**
   * Whether a user can edit items. An item's value can be edited by pressing the backspace.
   *
   * **Input types affected:** text
   *
   * @default false
   */
  editItems: boolean;

  /**
   * Whether each inputted/chosen item should be unique.
   *
   * **Input types affected:** text, select-multiple
   *
   * @default true
   */
  duplicateItemsAllowed: boolean;

  /**
   * What divides each value. The default delimiter separates each value with a comma: `"Value 1, Value 2, Value 3"`.
   *
   * **Input types affected:** text
   *
   * @default ','
   */
  delimiter: string;

  /**
   * Whether a user can paste into the input.
   *
   * **Input types affected:** text, select-multiple
   *
   * @default true
   */
  paste: boolean;

  /**
   * Whether a search area should be shown.
   *
   * @note Multiple select boxes will always show search areas.
   *
   * **Input types affected:** select-one
   *
   * @default true
   */
  searchEnabled: boolean;

  /**
   * Whether choices should be filtered by input or not. If `false`, the search event will still emit, but choices will not be filtered.
   *
   * **Input types affected:** select-one
   *
   * @default true
   */
  searchChoices: boolean;

  /**
   * The minimum length a search value should be before choices are searched.
   *
   * **Input types affected:** select-one, select-multiple
   *
   * @default 1
   */
  searchFloor: number;

  /**
   * The maximum amount of search results to show.
   *
   * **Input types affected:** select-one, select-multiple
   *
   * @default 4
   */
  searchResultLimit: number;

  /**
   * Specify which fields should be used when a user is searching. If you have added custom properties to your choices, you can add these values thus: `['label', 'value', 'customProperties.example']`.
   *
   * Input types affected:select-one, select-multiple
   *
   * @default ['label', 'value']
   */
  searchFields: string[];

  /**
   * Whether the dropdown should appear above `(top)` or below `(bottom)` the input. By default, if there is not enough space within the window the dropdown will appear above the input, otherwise below it.
   *
   * **Input types affected:** select-one, select-multiple
   *
   * @default 'auto'
   */
  position: 'auto' | 'top';

  /**
   * Whether the scroll position should reset after adding an item.
   *
   * **Input types affected:** select-multiple
   *
   * @default true
   */
  resetScrollPosition: boolean;

  /**
   * Whether choices and groups should be sorted. If false, choices/groups will appear in the order they were given.
   *
   * **Input types affected:** select-one, select-multiple
   *
   * @default true
   */
  shouldSort: boolean;

  /**
   * Whether items should be sorted. If false, items will appear in the order they were selected.
   *
   * **Input types affected:** text, select-multiple
   *
   * @default false
   */
  shouldSortItems: boolean;

  /**
   * The function that will sort choices and items before they are displayed (unless a user is searching). By default choices and items are sorted by alphabetical order.
   *
   * **Input types affected:** select-one, select-multiple
   *
   * @example
   * ```
   * // Sorting via length of label from largest to smallest
   * const example = new Choices(element, {
   *   sorter: function(a, b) {
   *     return b.label.length - a.label.length;
   *   },
   * };
   * ```
   *
   * @default sortByAlpha
   */
  sorter: (current: Choice, next: Choice) => number;

  /**
   * Whether the input should show a placeholder. Used in conjunction with `placeholderValue`. If `placeholder` is set to true and no value is passed to `placeholderValue`, the passed input's placeholder attribute will be used as the placeholder value.
   *
   * **Input types affected:** text, select-multiple
   *
   * @note For single select boxes, the recommended way of adding a placeholder is as follows:
   * ```
   * <select>
   *   <option placeholder>This is a placeholder</option>
   *   <option>...</option>
   *   <option>...</option>
   *   <option>...</option>
   * </select>
   * ```
   *
   * @default true
   */
  placeholder: boolean;

  /**
   * The value of the inputs placeholder.
   *
   * **Input types affected:** text, select-multiple
   *
   * @default null
   */
  placeholderValue: string | null;

  /**
   * The value of the search inputs placeholder.
   *
   * **Input types affected:** select-one
   *
   * @default null
   */
  searchPlaceholderValue: string | null;

  /**
   * Prepend a value to each item added/selected.
   *
   * **Input types affected:** text, select-one, select-multiple
   *
   * @default null
   */
  prependValue: string | null;

  /**
   * Append a value to each item added/selected.
   *
   * **Input types affected:** text, select-one, select-multiple
   *
   * @default null
   */
  appendValue: string | null;

  /**
   * Whether selected choices should be removed from the list. By default choices are removed when they are selected in multiple select box. To always render choices pass `always`.
   *
   * **Input types affected:** select-one, select-multiple
   *
   * @default 'auto';
   */
  renderSelectedChoices: 'auto' | 'always';

  /**
   * The text that is shown whilst choices are being populated via AJAX.
   *
   * **Input types affected:** select-one, select-multiple
   *
   * @default 'Loading...'
   */
  loadingText: string;

  /**
   * The text that is shown when a user's search has returned no results. Optionally pass a function returning a string.
   *
   * **Input types affected:** select-one, select-multiple
   *
   * @default 'No results found'
   */
  noResultsText: string | Types.stringFunction;

  /**
   * The text that is shown when a user has selected all possible choices. Optionally pass a function returning a string.
   *
   * **Input types affected:** select-multiple
   *
   * @default 'No choices to choose from'
   */
  noChoicesText: string | Types.stringFunction;

  /**
   * The text that is shown when a user hovers over a selectable choice.
   *
   * **Input types affected:** select-multiple, select-one
   *
   * @default 'Press to select'
   */
  itemSelectText: string;

  /**
   * The text that is shown when a user has focus on the input but has already reached the **max item count** [https://github.com/jshjohnson/Choices#maxitemcount]. To access the max item count, pass a function with a `maxItemCount` argument (see the **default config** [https://github.com/jshjohnson/Choices#setup] for an example), otherwise pass a string.
   *
   * **Input types affected:** text
   *
   * @default
   * ```
   * (maxItemCount) => `Only ${maxItemCount} values can be added.`;
   * ```
   */
  maxItemText: string | Types.noticeLimitFunction;

  /**
   * If no duplicates are allowed, and the value already exists in the array.
   *
   * @default 'Only unique values can be added'
   */
  uniqueItemText: string | Types.noticeStringFunction;

  /**
   * The text that is shown when addItemFilter is passed and it returns false
   *
   * **Input types affected:** text
   *
   * @default 'Only values matching specific conditions can be added'
   */
  customAddItemText: string | Types.noticeStringFunction;

  /**
   * Compare choice and value in appropriate way (e.g. deep equality for objects). To compare choice and value, pass a function with a `valueComparer` argument (see the [default config](https://github.com/jshjohnson/Choices#setup) for an example).
   *
   * **Input types affected:** select-one, select-multiple
   *
   * @default
   * ```
   * (choice, item) => choice === item;
   * ```
   */
  valueComparer: Types.valueCompareFunction;

  /**
   * Classes added to HTML generated by  By default classnames follow the BEM notation.
   *
   * **Input types affected:** text, select-one, select-multiple
   */
  classNames: ClassNames;

  /**
   * Choices uses the great Fuse library for searching. You can find more options here: https://github.com/krisk/Fuse#options
   */
  fuseOptions: FuseOptions<Choice>;

  /**
   * Function to run once Choices initialises.
   *
   * **Input types affected:** text, select-one, select-multiple
   *
   * @note For each callback, this refers to the current instance of  This can be useful if you need access to methods `(this.disable())` or the config object `(this.config)`.
   *
   * @default null
   */
  callbackOnInit: ((this: Choices) => void) | null;

  /**
   * Function to run on template creation. Through this callback it is possible to provide custom templates for the various components of Choices (see terminology). For Choices to work with custom templates, it is important you maintain the various data attributes defined here [https://github.com/jshjohnson/Choices/blob/67f29c286aa21d88847adfcd6304dc7d068dc01f/assets/scripts/src/choices.js#L1993-L2067].
   *
   * **Input types affected:** text, select-one, select-multiple
   *
   * @note For each callback, this refers to the current instance of  This can be useful if you need access to methods `(this.disable())` or the config object `(this.config)`.
   *
   * @example
   * ```
   * const example = new Choices(element, {
   *   callbackOnCreateTemplates: function (template) {
   *     var classNames = this.config.classNames;
   *     return {
   *       item: (data) => {
   *         return template(`
   *           <div class="${classNames.item} ${data.highlighted ? classNames.highlightedState : classNames.itemSelectable}" data-item data-id="${data.id}" data-value="${data.value}" ${data.active ? 'aria-selected="true"' : ''} ${data.disabled ? 'aria-disabled="true"' : ''}>
   *             <span>&bigstar;</span> ${data.label}
   *           </div>
   *         `);
   *       },
   *       choice: (data) => {
   *         return template(`
   *           <div class="${classNames.item} ${classNames.itemChoice} ${data.disabled ? classNames.itemDisabled : classNames.itemSelectable}" data-select-text="${this.config.itemSelectText}" data-choice ${data.disabled ? 'data-choice-disabled aria-disabled="true"' : 'data-choice-selectable'} data-id="${data.id}" data-value="${data.value}" ${data.groupId > 0 ? 'role="treeitem"' : 'role="option"'}>
   *             <span>&bigstar;</span> ${data.label}
   *           </div>
   *         `);
   *       },
   *     };
   *   }
   * });
   * ```
   *
   * @default null
   */
  callbackOnCreateTemplates:
    | ((template: Types.strToEl) => Partial<Templates>)
    | null;
}

export interface KeyDownAction {
  event: KeyboardEvent;
  activeItems: Item[];
  hasFocusedInput: boolean;
  hasActiveDropdown: boolean;
  hasItems: boolean;
}

// @todo rename
export interface Notice {
  response: boolean;
  notice: string;
}

export interface State {
  choices: object[];
  groups: object[];
  items: object[];
  general: {
    loading: boolean;
  };
}
