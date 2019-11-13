// Type definitions for Choices.js
// Project: https://github.com/jshjohnson/Choices
// Definitions by:
//         Arthur vasconcelos <https://github.com/arthurvasconcelos>,
//         Josh Johnson <https://github.com/jshjohnson>,
//         Zack Schuster <https://github.com/zackschuster>
//         Konstantin Vyatkin <https://github.com/tinovyatkin>
// Definitions: https://github.com/jshjohnson/Choices

import { FuseOptions } from 'fuse.js';

// Choices Namespace
declare namespace Choices {
  namespace Types {
    type strToEl = (
      str: string,
    ) => HTMLElement | HTMLInputElement | HTMLOptionElement;
    type stringFunction = () => string;
    type noticeStringFunction = (value: string) => string;
    type noticeLimitFunction = (maxItemCount: number) => string;
    type filterFunction = (value: string) => boolean;
    type valueCompareFunction = (value1: string, value2: string) => boolean;
  }

  interface Choice {
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
  }

  interface Group {
    id?: number;
    active?: boolean;
    disabled?: boolean;
    value: any;
  }

  interface Item extends Choice {
    choiceId?: number;
    keyCode?: number;
    highlighted?: boolean;
  }

  /**
   * Events fired by Choices behave the same as standard events. Each event is triggered on the element passed to Choices (accessible via `this.passedElement`. Arguments are accessible within the `event.detail` object.
   */
  interface EventMap {
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
    choice: CustomEvent<{ choice: Choices.Choice }>;

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
    highlightChoice: CustomEvent<{ el: Choices.passedElement }>;
  }

  interface Templates {
    containerOuter: (
      this: Choices,
      classNames: ClassNames,
      direction: HTMLElement['dir'],
      isSelectElement: boolean,
      isSelectOneElement: boolean,
      searchEnabled: boolean,
      passedElementType: passedElement['type'],
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
    option: (data: Choice) => HTMLOptionElement;
  }

  /** Classes added to HTML generated by Choices. By default classnames follow the BEM notation. */
  interface ClassNames {
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

  interface passedElement {
    classNames: Choices.ClassNames;
    element: (HTMLInputElement | HTMLSelectElement) & {
      // Extends HTMLElement addEventListener with Choices events
      addEventListener<K extends keyof Choices.EventMap>(
        type: K,
        listener: (
          this: HTMLInputElement | HTMLSelectElement,
          ev: Choices.EventMap[K],
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
  interface Options {
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
    addItemFilter: string | RegExp | Choices.Types.filterFunction | null;

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
    addItemText: string | Choices.Types.noticeStringFunction;

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
    noResultsText: string | Choices.Types.stringFunction;

    /**
     * The text that is shown when a user has selected all possible choices. Optionally pass a function returning a string.
     *
     * **Input types affected:** select-multiple
     *
     * @default 'No choices to choose from'
     */
    noChoicesText: string | Choices.Types.stringFunction;

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
    maxItemText: string | Choices.Types.noticeLimitFunction;

    /**
     * If no duplicates are allowed, and the value already exists in the array.
     *
     * @default 'Only unique values can be added'
     */
    uniqueItemText: string | Choices.Types.noticeStringFunction;

    /**
     * The text that is shown when addItemFilter is passed and it returns false
     *
     * **Input types affected:** text
     *
     * @default 'Only values matching specific conditions can be added'
     */
    customAddItemText: string | Choices.Types.noticeStringFunction;

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
    valueComparer: Choices.Types.valueCompareFunction;

    /**
     * Classes added to HTML generated by Choices. By default classnames follow the BEM notation.
     *
     * **Input types affected:** text, select-one, select-multiple
     */
    classNames: Choices.ClassNames;

    /**
     * Choices uses the great Fuse library for searching. You can find more options here: https://github.com/krisk/Fuse#options
     */
    fuseOptions: FuseOptions<Choice>;

    /**
     * Function to run once Choices initialises.
     *
     * **Input types affected:** text, select-one, select-multiple
     *
     * @note For each callback, this refers to the current instance of Choices. This can be useful if you need access to methods `(this.disable())` or the config object `(this.config)`.
     *
     * @default null
     */
    callbackOnInit: ((this: Choices) => void) | null;

    /**
     * Function to run on template creation. Through this callback it is possible to provide custom templates for the various components of Choices (see terminology). For Choices to work with custom templates, it is important you maintain the various data attributes defined here [https://github.com/jshjohnson/Choices/blob/67f29c286aa21d88847adfcd6304dc7d068dc01f/assets/scripts/src/choices.js#L1993-L2067].
     *
     * **Input types affected:** text, select-one, select-multiple
     *
     * @note For each callback, this refers to the current instance of Choices. This can be useful if you need access to methods `(this.disable())` or the config object `(this.config)`.
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
      | ((template: Choices.Types.strToEl) => Partial<Choices.Templates>)
      | null;
  }
}

// Exporting default class
export default class Choices {
  static readonly defaults: {
    readonly options: Partial<Choices.Options>;
    readonly templates: Choices.Templates;
  };
  readonly config: Choices.Options;

  // State Tracking
  initialised: boolean;

  // Element
  readonly passedElement: Choices.passedElement;

  placeholder: boolean;

  constructor(
    selectorOrElement: string | HTMLInputElement | HTMLSelectElement,
    userConfig?: Partial<Choices.Options>,
  );

  /**
   * Creates a new instance of Choices, adds event listeners, creates templates and renders a Choices element to the DOM.
   *
   * @note This is called implicitly when a new instance of Choices is created. This would be used after a Choices instance had already been destroyed `(using destroy())`.
   *
   * **Input types affected:** text, select-multiple, select-one
   */
  init(): void;

  /**
   * Kills the instance of Choices, removes all event listeners and returns passed input to its initial state.
   *
   * **Input types affected:** text, select-multiple, select-one
   */
  destroy(): void;

  /** Select item (a selected item can be deleted) */
  highlightItem(item: Element, runEvent?: boolean): this;

  /** Deselect item */
  unhighlightItem(item: Element): this;

  /**
   * Highlight each chosen item (selected items can be removed).
   *
   * **Input types affected:** text, select-multiple
   */
  highlightAll(): this;

  /**
   * Un-highlight each chosen item.
   *
   * **Input types affected:** text, select-multiple
   */
  unhighlightAll(): this;

  /**
   * Remove each item by a given value.
   *
   * **Input types affected:** text, select-multiple
   */
  removeActiveItemsByValue(value: string): this;

  /**
   * Remove each selectable item.
   *
   * **Input types affected:** text, select-multiple
   */
  removeActiveItems(excludedId: number): this;

  /**
   * Remove each item the user has selected.
   *
   * **Input types affected:** text, select-multiple
   */
  removeHighlightedItems(runEvent?: boolean): this;

  /**
   * Show option list dropdown (only affects select inputs).
   *
   * **Input types affected:** select-one, select-multiple
   */
  showDropdown(focusInput?: boolean): this;

  /**
   * Hide option list dropdown (only affects select inputs).
   *
   * **Input types affected:** text, select-multiple
   */
  hideDropdown(blurInput?: boolean): this;

  /**
   * Get value(s) of input (i.e. inputted items (text) or selected choices (select)). Optionally pass an argument of `true` to only return values rather than value objects.
   *
   * **Input types affected:** text, select-one, select-multiple
   *
   * @example
   * ```
   * const example = new Choices(element);
   * const values = example.getValue(true); // returns ['value 1', 'value 2'];
   * const valueArray = example.getValue(); // returns [{ active: true, choiceId: 1, highlighted: false, id: 1, label: 'Label 1', value: 'Value 1'},  { active: true, choiceId: 2, highlighted: false, id: 2, label: 'Label 2', value: 'Value 2'}];
   * ```
   */
  getValue(valueOnly?: boolean): string | string[];

  /** Direct populate choices
   *
   * @param {string[] | Choices.Item[]} items
   */
  setValue(items: string[] | Choices.Item[]): this;

  /**
   * Set value of input based on existing Choice. `value` can be either a single string or an array of strings
   *
   * **Input types affected:** select-one, select-multiple
   *
   * @example
   * ```
   * const example = new Choices(element, {
   *   choices: [
   *     {value: 'One', label: 'Label One'},
   *     {value: 'Two', label: 'Label Two', disabled: true},
   *     {value: 'Three', label: 'Label Three'},
   *   ],
   * });
   *
   * example.setChoiceByValue('Two'); // Choice with value of 'Two' has now been selected.
   * ```
   */
  setChoiceByValue(value: string | string[]): this;

  /**
   * Set choices of select input via an array of objects (or function that returns array of object or promise of it),
   * a value field name and a label field name.
   * This behaves the same as passing items via the choices option but can be called after initialising Choices.
   * This can also be used to add groups of choices (see example 2); Optionally pass a true `replaceChoices` value to remove any existing choices.
   * Optionally pass a `customProperties` object to add additional data to your choices (useful when searching/filtering etc).
   *
   * **Input types affected:** select-one, select-multiple
   *
   * @param {string} [value = 'value'] - name of `value` field
   * @param {string} [label = 'label'] - name of 'label' field
   * @param {boolean} [replaceChoices = false] - whether to replace of add choices
   *
   * @example
   * ```js
   * const example = new Choices(element);
   *
   * example.setChoices([
   *   {value: 'One', label: 'Label One', disabled: true},
   *   {value: 'Two', label: 'Label Two', selected: true},
   *   {value: 'Three', label: 'Label Three'},
   * ], 'value', 'label', false);
   * ```
   *
   * @example
   * ```js
   * const example = new Choices(element);
   *
   * example.setChoices(async () => {
   *   try {
   *      const items = await fetch('/items');
   *      return items.json()
   *   } catch(err) {
   *      console.error(err)
   *   }
   * });
   * ```
   *
   * @example
   * ```js
   * const example = new Choices(element);
   *
   * example.setChoices([{
   *   label: 'Group one',
   *   id: 1,
   *   disabled: false,
   *   choices: [
   *     {value: 'Child One', label: 'Child One', selected: true},
   *     {value: 'Child Two', label: 'Child Two',  disabled: true},
   *     {value: 'Child Three', label: 'Child Three'},
   *   ]
   * },
   * {
   *   label: 'Group two',
   *   id: 2,
   *   disabled: false,
   *   choices: [
   *     {value: 'Child Four', label: 'Child Four', disabled: true},
   *     {value: 'Child Five', label: 'Child Five'},
   *     {value: 'Child Six', label: 'Child Six', customProperties: {
   *       description: 'Custom description about child six',
   *       random: 'Another random custom property'
   *     }},
   *   ]
   * }], 'value', 'label', false);
   * ```
   */
  setChoices<
    T extends object[] | ((instance: Choices) => object[] | Promise<object[]>)
  >(
    choices: T,
    value?: string,
    label?: string,
    replaceChoices?: boolean,
  ): T extends object[] ? this : Promise<this>;

  /**
   * Clear all choices from select.
   *
   * **Input types affected:** select-one, select-multiple
   */
  clearChoices(): this;

  /**
   * Removes all items, choices and groups. Use with caution.
   *
   * **Input types affected:** text, select-one, select-multiple
   */
  clearStore(): this;

  /**
   * Clear input of any user inputted text.
   *
   * **Input types affected:** text
   */
  clearInput(): this;

  /**
   * Enables input to accept new values/select further choices.
   *
   * **Input types affected:** text, select-one, select-multiple
   */
  enable(): this;

  /**
   * Disables input from accepting new value/selecting further choices.
   *
   * **Input types affected:** text, select-one, select-multiple
   */
  disable(): this;
}
