declare module "choices.js" {
  class Choices {
    passedElement: Element;

    constructor(element?: string | HTMLElement | HTMLCollectionOf<HTMLElement> | NodeList, userConfig?: Choices.Options);
    new(element?: string | HTMLElement | HTMLCollectionOf<HTMLElement> | NodeList, userConfig?: Choices.Options): this;

		/**
		 * Initialise Choices
		 * @return
		 * @public
		 */
    init(): void;

		/**
		 * Destroy Choices and nullify values
		 * @return
		 * @public
		 */
    destroy(): void;

		/**
		 * Render group choices into a DOM fragment and append to choice list
		 * @param  {Array} groups    Groups to add to list
		 * @param  {Array} choices   Choices to add to groups
		 * @param  {DocumentFragment} fragment Fragment to add groups and options to (optional)
		 * @return {DocumentFragment} Populated options fragment
		 * @private
		 */
    renderGroups(groups: any[], choices: any[], fragment?: DocumentFragment): DocumentFragment;

		/**
		 * Render choices into a DOM fragment and append to choice list
		 * @param  {Array} choices    Choices to add to list
		 * @param  {DocumentFragment} fragment Fragment to add choices to (optional)
		 * @return {DocumentFragment} Populated choices fragment
		 * @private
		 */
    renderChoices(choices: any[], fragment?: DocumentFragment): DocumentFragment;

		/**
		 * Render items into a DOM fragment and append to items list
		 * @param  {Array} items    Items to add to list
		 * @param  {DocumentFragment} fragment Fragrment to add items to (optional)
		 * @return
		 * @private
		 */
    renderItems(items: any[], fragment?: DocumentFragment): void;

		/**
		 * Render DOM with values
		 * @return
		 * @private
		 */
    render(): void;

		/**
		 * Select item (a selected item can be deleted)
		 * @param  {Element} item Element to select
		 * @param  {boolean} runEvent Whether to highlight immediately or not. Defaults to true.
		 * @return {Object} Class instance
		 * @public
		 */
    highlightItem(item: Element, runEvent?: boolean): this;

		/**
		 * Deselect item
		 * @param  {Element} item Element to de-select
		 * @return {Object} Class instance
		 * @public
		 */
    unhighlightItem(item: Element): this;

		/**
		 * Highlight items within store
		 * @return {Object} Class instance
		 * @public
		 */
    highlightAll(): this;

		/**
		 * Deselect items within store
		 * @return {Object} Class instance
		 * @public
		 */
    unhighlightAll(): this;

		/**
		 * Remove an item from the store by its value
		 * @param  {String} value Value to search for
		 * @return {Object} Class instance
		 * @public
		 */
    removeActiveItemsByValue(value: string): this;

		/**
		 * Remove all items from store array
		 * @note Removed items are soft deleted
		 * @param  {Number} excludedId Optionally exclude item by ID
		 * @return {Object} Class instance
		 * @public
		 */
    removeActiveItems(excludedId?: number): this;

		/**
		 * Remove all selected items from store
		 * @note Removed items are soft deleted
		 * @param {boolean} runEvent Whether to remove highlighted items immediately or not. Defaults to false.
		 * @return {Object} Class instance
		 * @public
		 */
    removeHighlightedItems(runEvent?: boolean): this;

		/**
		 * Show dropdown to user by adding active state class
		 * @param {boolean} focusInput Whether to focus the input or not. Defaults to false.
		 * @return {Object} Class instance
		 * @public
		 */
    showDropdown(focusInput?: boolean): this;

		/**
		 * Hide dropdown from user
		 * @param {boolean} focusInput Whether to blur input focus or not. Defaults to false.
		 * @return {Object} Class instance
		 * @public
		 */
    hideDropdown(blurInput?: boolean): this;

		/**
		 * Determine whether to hide or show dropdown based on its current state
		 * @return {Object} Class instance
		 * @public
		 */
    toggleDropdown(): this;

		/**
		 * Get value(s) of input (i.e. inputted items (text) or selected choices (select))
		 * @param {Boolean} valueOnly Get only values of selected items, otherwise return selected items
		 * @return {Array/String} selected value (select-one) or array of selected items (inputs & select-multiple)
		 * @public
		 */
    getValue(valueOnly?: boolean): string | string[];

		/**
		 * Set value of input. If the input is a select box, a choice will be created and selected otherwise
		 * an item will created directly.
		 * @param  {Array}   args  Array of value objects or value strings
		 * @return {Object} Class instance
		 * @public
		 */
    setValue(args: any[]): this;

		/**
		 * Select value of select box via the value of an existing choice
		 * @param {Array/String} value An array of strings of a single string
		 * @return {Object} Class instance
		 * @public
		 */
  setValueByChoice(value: string | string[]): this;

		/**
		 * Direct populate choices
		 * @param  {Array} choices - Choices to insert
		 * @param  {String} value - Name of 'value' property
		 * @param  {String} label - Name of 'label' property
		 * @param  {Boolean} replaceChoices Whether existing choices should be removed
		 * @return {Object} Class instance
		 * @public
		 */
    setChoices(choices: any[], value: string, label: string, replaceChoices?: boolean): this;

		/**
		 * Clear items,choices and groups
		 * @note Hard delete
		 * @return {Object} Class instance
		 * @public
		 */
    clearStore(): this;

		/**
		 * Set value of input to blank
		 * @return {Object} Class instance
		 * @public
		 */
    clearInput(): this;

		/**
		 * Enable interaction with Choices
		 * @return {Object} Class instance
		 */
    enable(): this;

		/**
		 * Disable interaction with Choices
		 * @return {Object} Class instance
		 * @public
		 */
    disable(): this;

		/**
		 * Populate options via ajax callback
		 * @param  {Function} fn Passed
		 * @return {Object} Class instance
		 * @public
		 */
    ajax(fn: (values: any) => any): this;
  }

  namespace Choices {
    interface Options {
      /**
       * Optionally suppress console errors and warnings.
			 *
			 * Input types affected: text, select-single, select-multiple
       * @default false
       */
      silent?: boolean;

			/**
			 * Add pre-selected items (see terminology) to text input.
			 *
			 * Pass an array of strings:
			 *
			 * ['value 1', 'value 2', 'value 3']
			 *
			 * Pass an array of objects:
			 *
			 * [{
			 *		value: 'Value 1',
			 *		label: 'Label 1',
			 *		id: 1
			 *	},
			 *	{
			 *		value: 'Value 2',
			 *		label: 'Label 2',
			 *		id: 2,
			 *		customProperties: {
			 *			random: 'I am a custom property'
			 *		}
			 * }]
			 *
			 * Input types affected: text
			 * @default []
			 */
      items?: any[];

			/**
			 * Add choices (see terminology) to select input.
			 *
			 * Pass an array of objects:
			 *
			 * [{
			 *		value: 'Option 1',
			 *		label: 'Option 1',
			 *		selected: true,
			 *		disabled: false,
			 *	},
			 *	{
			 *		value: 'Option 2',
			 *		label: 'Option 2',
			 *		selected: false,
			 *		disabled: true,
			 *		customProperties: {
			 *			description: 'Custom description about Option 2',
			 *			random: 'Another random custom property'
			 *		},
			 * }]
			 *
			 * Input types affected: select-one, select-multiple
			 * @default []
			 */
      choices?: any[];

			/**
			 * The amount of choices to be rendered within the dropdown list ("-1" indicates no limit). This is useful if you have a lot of choices where it is easier for a user to use the search area to find a choice.
			 *
			 * Input types affected: select-one, select-multiple
			 * @default -1
			 */
      renderChoiceLimit?: number;

			/**
			 * The amount of items a user can input/select ("-1" indicates no limit).
			 *
			 * Input types affected: text, select-multiple
			 * @default -1
			 */
      maxItemCount?: number;

			/**
			 * Whether a user can add items.
			 *
			 * Input types affected: text
			 * @default true
			 */
      addItems?: boolean;

			/**
			 * Whether a user can remove items.
			 *
			 * Input types affected: text, select-multiple
			 * @default true
			 */
      removeItems?: boolean;

			/**
			 * Whether each item should have a remove button.
			 *
			 * Input types affected: text, select-one, select-multiple
			 * @default false
			 */
      removeItemButton?: boolean;

			/**
			 * Whether a user can edit items. An item's value can be edited by pressing the backspace.
			 *
			 * Input types affected: text
			 * @default false
			 */
      editItems?: boolean;

			/**
			 * Whether each inputted/chosen item should be unique.
			 *
			 * Input types affected: text, select-multiple
			 * @default true
			 */
      duplicateItems?: boolean;

			/**
			 * What divides each value. The default delimiter seperates each value with a comma: "Value 1, Value 2, Value 3".
			 *
			 * Input types affected: text, select-multiple
			 * @default true
			 */
      delimiter?: string;

			/**
			 * Whether a user can paste into the input.
			 *
			 * Input types affected: text, select-multiple
			 * @default true
			 */
      paste?: boolean;

			/**
			 * Whether a search area should be shown. *Note:* Multiple select boxes will _always_ show search areas.
			 *
			 * Input types affected: select-one
			 * @default true
			 */
      searchEnabled?: boolean;

			/**
			 * Whether choices should be filtered by input or not. If false, the search event will still emit, but choices will not be filtered.
			 *
			 * Input types affected: select-one
			 * @default true
			 */
      searchChoices?: boolean;

			/**
			 * Specify which fields should be used when a user is searching. If you have added custom properties to your choices, you can add these values thus: ['label', 'value', 'customProperties.example'].
			 *
			 * Input types affected: select-one, select-multiple
			 * @default ['label', 'value']
			 */
      searchFields?: string[];

			/**
			 * The minimum length a search value should be before choices are searched.
			 *
			 * Input types affected: select-one, select-multiple
			 * @default 1
			 */
      searchFloor?: number;

			/**
			 * The maximum amount of search results to show.
			 *
			 * Input types affected: select-one, select-multiple
			 * @default 4
			 */
      searchResultLimit?: number;

			/**
			 * Whether the dropdown should appear above (top) or below (bottom) the input. By default, if there is not enough space within the window the dropdown will appear above the input, otherwise below it.
			 *
			 * Input types affected: select-one, select-multiple
			 * @default 'auto'
			 */
      position?: string;

			/**
			 * Whether the scroll position should reset after adding an item.
			 *
			 * Input types affected: select-multiple
			 * @default true
			 */
      resetScrollPosition?: boolean;

			/**
			 * A filter that will need to pass for a user to successfully add an item.
			 *
			 * Input types affected: text
			 * @default null
			 */
      regexFilter?: RegExp;

			/**
			 * Whether choices and groups should be sorted. If false, choices/groups will appear in the order they were given.
			 *
			 * Input types affected: select-one, select-multiple
			 * @default true
			 */
      shouldSort?: boolean;

			/**
			 * Whether items should be sorted. If false, items will appear in the order they were selected.
			 *
			 * Input types affected: text, select-multiple
			 * @default false
			 */
      shouldSortItems?: boolean;

			/**
			 * The function that will sort choices and items before they are displayed (unless a user is searching). By default choices and items are sorted by alphabetical order.
			 *
			 * Input types affected: select-one, select-multiple
			 *
			 * @example
			 *	// Sorting via length of label from largest to smallest
			 *	const example = new Choices(element, {
			 * 		sortFilter: function(a, b) {
			 * 			return b.label.length - a.label.length;
			 * 		},
			 *	};
			 *
			 * @default sortByAlpha
			 */
      sortFilter?: (current: any, next: any) => number;

			/**
			 * Whether the input should show a placeholder. Used in conjunction with placeholderValue. If placeholder is set to true and no value is passed to placeholderValue, the passed input's placeholder attribute will be used as the placeholder value.
			 *
			 * Note: For single select boxes, the recommended way of adding a placeholder is as follows:
			 * <select>
			 *   <option placeholder>This is a placeholder</option>
  		 *   <option>...</option>
			 *   <option>...</option>
			 *   <option>...</option>
			 * </select>
			 *
			 * Input types affected: text, select-multiple
			 * @default true
			 */
      placeholder?: boolean;

			/**
			 * The value of the inputs placeholder.
			 *
			 * Input types affected: text, select-multiple
			 * @default null
			 */
      placeholderValue?: string;

			/**
			 * The value of the search inputs placeholder.
			 *
			 * Input types affected: select-one
			 * @default null
			 */
      searchPlaceholderValue?: string;

			/**
			 * Prepend a value to each item added/selected.
			 *
			 * Input types affected: text, select-one, select-multiple
			 * @default null
			 */
      prependValue?: string;

			/**
			 * Append a value to each item added/selected.
			 *
			 * Input types affected: text, select-one, select-multiple
			 * @default null
			 */
      appendValue?: string;

			/**
			 * Whether selected choices should be removed from the list. By default choices are removed when they are selected in multiple select box. To always render choices pass always.
			 *
			 * Input types affected: select-one, select-multiple
			 * @default 'auto'
			 */
      renderSelectedChoices?: string;

			/**
			 * The text that is shown whilst choices are being populated via AJAX.
			 *
			 * Input types affected: select-one, select-multiple
			 * @default 'Loading...'
			 */
      loadingText?: string;

			/**
			 * The text that is shown when a user's search has returned no results. Optionally pass a function returning a string.
			 *
			 * Input types affected: select-one, select-multiple
			 * @default 'No results found'
			 */
      noResultsText?: string | (() => string);

			/**
			 * The text that is shown when a user has selected all possible choices. Optionally pass a function returning a string.
			 *
			 * Input types affected: select-multiple
			 * @default 'No choices to choose from'
			 */
      noChoicesText?: string | (() => string);

			/**
			 * The text that is shown when a user hovers over a selectable choice.
			 *
			 * Input types affected: select-one, select-multiple
			 * @default 'Press to select'
			 */
      itemSelectText?: string;

			/**
			 * The text that is shown when a user has inputted a new item but has not pressed the enter key. To access the current input value, pass a function with a value argument (see the [default config](https://github.com/jshjohnson/Choices#setup) for an example), otherwise pass a string.
			 *
			 * Input types affected: text
			 * @default 'Press Enter to add "${value}"'
			 */
      addItemText?: ((value: string) => string) | string;

			/**
			 * The text that is shown when a user has focus on the input but has already reached the max item count. To access the max item count, pass a function with a maxItemCount argument (see the [default config](https://github.com/jshjohnson/Choices#setup) for an example), otherwise pass a string.
			 *
			 * Input types affected: text
			 * @default 'Only ${maxItemCount} values can be added.'
			 */
      maxItemText?: (maxItemCount: number) => string,

			/**
			 * The text that is shown when a user has submitted a new item that is already present in the selected list. To access the current input value, pass a function with a value argument, otherwise pass a string.
			 *
			 * @default 'Only unique values can be added.'
			 */
      uniqueItemText?: ((value: string) => string) | string;

			/**
			 * Classes added to HTML generated by Choices. By default classnames follow the BEM notation.
			 */
      classNames?: {

				/**
				 * @default 'choices'
				 */
        containerOuter?: string;

				/**
				 * @default 'choices__inner'
				 */
        containerInner?: string;

				/**
				 * @default 'choices__input'
				 */
        input?: string;

				/**
				 * @default 'choices__input--cloned'
				 */
        inputCloned?: string;

				/**
				 * @default 'choices__list'
				 */
        list?: string;

				/**
				 * @default 'choices__list--multiple'
				 */
        listItems?: string;

				/**
				 * @default 'choices__list--single'
				 */
        listSingle?: string;

				/**
				 * @default 'choices__list--dropdown'
				 */
        listDropdown?: string;

				/**
				 * @default 'choices__item'
				 */
        item?: string;

				/**
				 * @default 'choices__item--selectable'
				 */
        itemSelectable?: string;

				/**
				 * @default 'choices__item--disabled'
				 */
        itemDisabled?: string;

				/**
				 * @default 'choices__item--choice'
				 */
        itemOption?: string;

				/**
				 * @default 'choices__group'
				 */
        group?: string;

				/**
				 * @default 'choices__heading'
				 */
        groupHeading?: string;

				/**
				 * @default 'choices__placeholder'
				 */
        placeholder?: string;

				/**
				 * @default 'choices__button'
				 */
        button?: string;

				/**
				 * @default 'is-active'
				 */
        activeState?: string;

				/**
				 * @default 'is-focused'
				 */
        focusState?: string;

				/**
				 * @default 'is-open'
				 */
        openState?: string;

				/**
				 * @default 'is-disabled'
				 */
        disabledState?: string;

				/**
				 * @default 'is-highlighted'
				 */
        highlightedState?: string;

				/**
				 * @default 'is-hidden'
				 */
        hiddenState?: string;

				/**
				 * @default 'is-flipped'
				 */
        flippedState?: string;

				/**
				 * @default 'is-loading'
				 */
        loadingState?: string;

				/**
				 * @default 'has-no-results'
				 */
        noResults?: string;

				/**
				 * @default 'has-no-choices'
				 */
        noChoices?: string;
      };

			/**
			 * Choices uses the great Fuse library for searching. You can find more options here: https://github.com/krisk/Fuse#options
			 */
      fuseOptions?: {
        [index: string]: any;
				/**
				 * @default 'score'
				 */
        include?: string;
      };

			/**
			 * Function to run once Choices initialises.
			 *
			 * Input types affected: text, select-one, select-multiple
			 *
			 * @default null
			 */
      callbackOnInit?: () => any;

			/**
			 * Function to run on template creation. Through this callback it is possible to provide custom templates for the various components of Choices (see terminology). For Choices to work with custom templates, it is important you maintain the various data attributes defined [here](https://github.com/jshjohnson/Choices/blob/67f29c286aa21d88847adfcd6304dc7d068dc01f/assets/scripts/src/choices.js#L1993-L2067).
			 *
			 * Input types affected: text, select-one, select-multiple
			 *
			 * @default null
			 */
      callbackOnCreateTemplates?: (template: string) => string;
    }
  }

  export = Choices;
}