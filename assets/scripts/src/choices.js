import Fuse from 'fuse.js';
import classNames from 'classnames';
import Store from './store/index.js';
import {
  setIsLoading,
  addItem,
  removeItem,
  highlightItem,
  addChoice,
  filterChoices,
  activateChoices,
  addGroup,
  clearAll,
  clearChoices,
}
from './actions/index';
import {
  isScrolledIntoView,
  getAdjacentEl,
  wrap,
  getType,
  isType,
  isElement,
  strToEl,
  stripHTML,
  extend,
  getWidthOfInput,
  sortByAlpha,
  sortByScore,
  generateId,
  triggerEvent,
  findAncestorByAttrName
}
from './lib/utils.js';
import './lib/polyfills.js';

/**
 * Choices
 */
class Choices {
  constructor(element = '[data-choice]', userConfig = {}) {
    // If there are multiple elements, create a new instance
    // for each element besides the first one (as that already has an instance)
    if (isType('String', element)) {
      const elements = document.querySelectorAll(element);
      if (elements.length > 1) {
        for (let i = 1; i < elements.length; i++) {
          const el = elements[i];
          new Choices(el, userConfig);
        }
      }
    }

    const defaultConfig = {
      silent: false,
      items: [],
      choices: [],
      renderChoiceLimit: -1,
      maxItemCount: -1,
      addItems: true,
      removeItems: true,
      removeItemButton: false,
      editItems: false,
      duplicateItems: true,
      delimiter: ',',
      paste: true,
      searchEnabled: true,
      searchChoices: true,
      searchFloor: 1,
      searchResultLimit: 4,
      searchFields: ['label', 'value'],
      position: 'auto',
      resetScrollPosition: true,
      regexFilter: null,
      shouldSort: true,
      shouldSortItems: false,
      sortFilter: sortByAlpha,
      placeholder: true,
      placeholderValue: null,
      searchPlaceholderValue: null,
      prependValue: null,
      appendValue: null,
      renderSelectedChoices: 'auto',
      loadingText: 'Loading...',
      noResultsText: 'No results found',
      noChoicesText: 'No choices to choose from',
      itemSelectText: 'Press to select',
      addItemText: (value) => {
        return `Press Enter to add <b>"${stripHTML(value)}"</b>`;
      },
      maxItemText: (maxItemCount) => {
        return `Only ${maxItemCount} values can be added.`;
      },
      itemComparer: (choice, item) => {
        return choice === item;
      },
      uniqueItemText: 'Only unique values can be added.',
      classNames: {
        containerOuter: 'choices',
        containerInner: 'choices__inner',
        input: 'choices__input',
        inputCloned: 'choices__input--cloned',
        list: 'choices__list',
        listItems: 'choices__list--multiple',
        listSingle: 'choices__list--single',
        listDropdown: 'choices__list--dropdown',
        item: 'choices__item',
        itemSelectable: 'choices__item--selectable',
        itemDisabled: 'choices__item--disabled',
        itemChoice: 'choices__item--choice',
        placeholder: 'choices__placeholder',
        group: 'choices__group',
        groupHeading: 'choices__heading',
        button: 'choices__button',
        activeState: 'is-active',
        focusState: 'is-focused',
        openState: 'is-open',
        disabledState: 'is-disabled',
        highlightedState: 'is-highlighted',
        hiddenState: 'is-hidden',
        flippedState: 'is-flipped',
        loadingState: 'is-loading',
        noResults: 'has-no-results',
        noChoices: 'has-no-choices'
      },
      fuseOptions: {
        include: 'score'
      },
      callbackOnInit: null,
      callbackOnCreateTemplates: null
    };

    this.idNames = {
      itemChoice: 'item-choice'
    };

    // Merge options with user options
    this.config = extend(defaultConfig, userConfig);

    if (this.config.renderSelectedChoices !== 'auto' && this.config.renderSelectedChoices !== 'always') {
      if (!this.config.silent) {
        console.warn(
          'renderSelectedChoices: Possible values are \'auto\' and \'always\'. Falling back to \'auto\'.'
        );
      }
      this.config.renderSelectedChoices = 'auto';
    }

    // Create data store
    this.store = new Store(this.render);

    // State tracking
    this.initialised = false;
    this.currentState = {};
    this.prevState = {};
    this.currentValue = '';

    // Retrieve triggering element (i.e. element with 'data-choice' trigger)
    this.element = element;
    this.passedElement = isType('String', element) ? document.querySelector(element) : element;

    if (!this.passedElement) {
      if (!this.config.silent) {
        console.error('Passed element not found');
      }
      return;
    }

    this.isTextElement = this.passedElement.type === 'text';
    this.isSelectOneElement = this.passedElement.type === 'select-one';
    this.isSelectMultipleElement = this.passedElement.type === 'select-multiple';
    this.isSelectElement = this.isSelectOneElement || this.isSelectMultipleElement;
    this.isValidElementType = this.isTextElement || this.isSelectElement;
    this.isIe11 = !!(navigator.userAgent.match(/Trident/) && navigator.userAgent.match(/rv[ :]11/));
    this.isScrollingOnIe = false;


    if (this.config.shouldSortItems === true && this.isSelectOneElement) {
      if (!this.config.silent) {
        console.warn('shouldSortElements: Type of passed element is \'select-one\', falling back to false.');
      }
    }

    this.highlightPosition = 0;
    this.canSearch = this.config.searchEnabled;

    this.placeholder = false;
    if (!this.isSelectOneElement) {
      this.placeholder = this.config.placeholder ?
      (this.config.placeholderValue || this.passedElement.getAttribute('placeholder')) :
      false;
    }

    // Assign preset choices from passed object
    this.presetChoices = this.config.choices;

    // Assign preset items from passed object first
    this.presetItems = this.config.items;

    // Then add any values passed from attribute
    if (this.passedElement.value) {
      this.presetItems = this.presetItems.concat(
        this.passedElement.value.split(this.config.delimiter)
      );
    }

    // Set unique base Id
    this.baseId = generateId(this.passedElement, 'choices-');

    // Bind methods
    this.render = this.render.bind(this);

    // Bind event handlers
    this._onFocus = this._onFocus.bind(this);
    this._onBlur = this._onBlur.bind(this);
    this._onKeyUp = this._onKeyUp.bind(this);
    this._onKeyDown = this._onKeyDown.bind(this);
    this._onClick = this._onClick.bind(this);
    this._onTouchMove = this._onTouchMove.bind(this);
    this._onTouchEnd = this._onTouchEnd.bind(this);
    this._onMouseDown = this._onMouseDown.bind(this);
    this._onMouseOver = this._onMouseOver.bind(this);
    this._onPaste = this._onPaste.bind(this);
    this._onInput = this._onInput.bind(this);

    // Monitor touch taps/scrolls
    this.wasTap = true;

    // Cutting the mustard
    const cuttingTheMustard = 'classList' in document.documentElement;
    if (!cuttingTheMustard && !this.config.silent) {
      console.error('Choices: Your browser doesn\'t support Choices');
    }

    const canInit = isElement(this.passedElement) && this.isValidElementType;

    if (canInit) {
      // If element has already been initialised with Choices
      if (this.passedElement.getAttribute('data-choice') === 'active') {
        return;
      }

      // Let's go
      this.init();
    } else if (!this.config.silent) {
      console.error('Incompatible input passed');
    }
  }

  /*========================================
  =            Public functions            =
  ========================================*/

  /**
   * Initialise Choices
   * @return
   * @public
   */
  init() {
    if (this.initialised === true) {
      return;
    }

    const callback = this.config.callbackOnInit;

    // Set initialise flag
    this.initialised = true;
    // Create required elements
    this._createTemplates();
    // Generate input markup
    this._createInput();
    // Subscribe store to render method
    this.store.subscribe(this.render);
    // Render any items
    this.render();
    // Trigger event listeners
    this._addEventListeners();

    // Run callback if it is a function
    if (callback) {
      if (isType('Function', callback)) {
        callback.call(this);
      }
    }
  }

  /**
   * Destroy Choices and nullify values
   * @return
   * @public
   */
  destroy() {
    if (this.initialised === false) {
      return;
    }

    // Remove all event listeners
    this._removeEventListeners();

    // Reinstate passed element
    this.passedElement.classList.remove(this.config.classNames.input, this.config.classNames.hiddenState);
    this.passedElement.removeAttribute('tabindex');
    // Recover original styles if any
    const origStyle = this.passedElement.getAttribute('data-choice-orig-style');
    if (Boolean(origStyle)) {
      this.passedElement.removeAttribute('data-choice-orig-style');
      this.passedElement.setAttribute('style', origStyle);
    } else {
      this.passedElement.removeAttribute('style');
    }
    this.passedElement.removeAttribute('aria-hidden');
    this.passedElement.removeAttribute('data-choice');

    // Re-assign values - this is weird, I know
    this.passedElement.value = this.passedElement.value;

    // Move passed element back to original position
    this.containerOuter.parentNode.insertBefore(this.passedElement, this.containerOuter);
    // Remove added elements
    this.containerOuter.parentNode.removeChild(this.containerOuter);

    // Clear data store
    this.clearStore();

    // Nullify instance-specific data
    this.config.templates = null;

    // Uninitialise
    this.initialised = false;
  }

  /**
   * Render group choices into a DOM fragment and append to choice list
   * @param  {Array} groups    Groups to add to list
   * @param  {Array} choices   Choices to add to groups
   * @param  {DocumentFragment} fragment Fragment to add groups and options to (optional)
   * @return {DocumentFragment} Populated options fragment
   * @private
   */
  renderGroups(groups, choices, fragment) {
    const groupFragment = fragment || document.createDocumentFragment();
    const filter = this.config.sortFilter;

    // If sorting is enabled, filter groups
    if (this.config.shouldSort) {
      groups.sort(filter);
    }

    groups.forEach((group) => {
      // Grab options that are children of this group
      const groupChoices = choices.filter((choice) => {
        if (this.isSelectOneElement) {
          return choice.groupId === group.id;
        }
        return choice.groupId === group.id && !choice.selected;
      });

      if (groupChoices.length >= 1) {
        const dropdownGroup = this._getTemplate('choiceGroup', group);
        groupFragment.appendChild(dropdownGroup);
        this.renderChoices(groupChoices, groupFragment, true);
      }
    });

    return groupFragment;
  }

  /**
   * Render choices into a DOM fragment and append to choice list
   * @param  {Array} choices    Choices to add to list
   * @param  {DocumentFragment} fragment Fragment to add choices to (optional)
   * @return {DocumentFragment} Populated choices fragment
   * @private
   */
  renderChoices(choices, fragment, withinGroup = false) {
    // Create a fragment to store our list items (so we don't have to update the DOM for each item)
    const choicesFragment = fragment || document.createDocumentFragment();
    const { renderSelectedChoices, searchResultLimit, renderChoiceLimit } = this.config;
    const filter = this.isSearching ? sortByScore : this.config.sortFilter;
    const appendChoice = (choice) => {
      const shouldRender = renderSelectedChoices === 'auto' ?
        (this.isSelectOneElement || !choice.selected) :
        true;
      if (shouldRender) {
        const dropdownItem = this._getTemplate('choice', choice);
        choicesFragment.appendChild(dropdownItem);
      }
    };

    let rendererableChoices = choices;

    if (renderSelectedChoices === 'auto' && !this.isSelectOneElement) {
      rendererableChoices = choices.filter(choice => !choice.selected);
    }

    // Split array into placeholders and "normal" choices
    const { placeholderChoices, normalChoices } = rendererableChoices.reduce((acc, choice) => {
      if (choice.placeholder) {
        acc.placeholderChoices.push(choice);
      } else {
        acc.normalChoices.push(choice);
      }
      return acc;
    }, { placeholderChoices: [], normalChoices: [] });

    // If sorting is enabled or the user is searching, filter choices
    if (this.config.shouldSort || this.isSearching) {
      normalChoices.sort(filter);
    }

    let choiceLimit = rendererableChoices.length;

    // Prepend placeholeder
    const sortedChoices = [...placeholderChoices, ...normalChoices];

    if (this.isSearching) {
      choiceLimit = searchResultLimit;
    } else if (renderChoiceLimit > 0 && !withinGroup) {
      choiceLimit = renderChoiceLimit;
    }

    // Add each choice to dropdown within range
    for (let i = 0; i < choiceLimit; i++) {
      if (sortedChoices[i]) {
        appendChoice(sortedChoices[i]);
      }
    };

    return choicesFragment;
  }

  /**
   * Render items into a DOM fragment and append to items list
   * @param  {Array} items    Items to add to list
   * @param  {DocumentFragment} [fragment] Fragment to add items to (optional)
   * @return
   * @private
   */
  renderItems(items, fragment = null) {
    // Create fragment to add elements to
    const itemListFragment = fragment || document.createDocumentFragment();

    // If sorting is enabled, filter items
    if (this.config.shouldSortItems && !this.isSelectOneElement) {
      items.sort(this.config.sortFilter);
    }

    if (this.isTextElement) {
      // Simplify store data to just values
      const itemsFiltered = this.store.getItemsReducedToValues(items);
      const itemsFilteredString = itemsFiltered.join(this.config.delimiter);
      // Update the value of the hidden input
      this.passedElement.setAttribute('value', itemsFilteredString);
      this.passedElement.value = itemsFilteredString;
    } else {
      const selectedOptionsFragment = document.createDocumentFragment();

      // Add each list item to list
      items.forEach((item) => {
        // Create a standard select option
        const option = this._getTemplate('option', item);
        // Append it to fragment
        selectedOptionsFragment.appendChild(option);
      });

      // Update selected choices
      this.passedElement.innerHTML = '';
      this.passedElement.appendChild(selectedOptionsFragment);
    }

    // Add each list item to list
    items.forEach((item) => {
      // Create new list element
      const listItem = this._getTemplate('item', item);
      // Append it to list
      itemListFragment.appendChild(listItem);
    });

    return itemListFragment;
  }

  /**
   * Render DOM with values
   * @return
   * @private
   */
  render() {
    if(this.store.isLoading()) {
      return;
    }

    this.currentState = this.store.getState();

    // Only render if our state has actually changed
    if (this.currentState !== this.prevState) {
      // Choices
      if (
        this.currentState.choices !== this.prevState.choices ||
        this.currentState.groups !== this.prevState.groups ||
        this.currentState.items !== this.prevState.items
      ) {
        if (this.isSelectElement) {
          // Get active groups/choices
          const activeGroups = this.store.getGroupsFilteredByActive();
          const activeChoices = this.store.getChoicesFilteredByActive();

          let choiceListFragment = document.createDocumentFragment();

          // Clear choices
          this.choiceList.innerHTML = '';

          // Scroll back to top of choices list
          if (this.config.resetScrollPosition) {
            this.choiceList.scrollTop = 0;
          }

          // If we have grouped options
          if (activeGroups.length >= 1 && this.isSearching !== true) {
            choiceListFragment = this.renderGroups(activeGroups, activeChoices, choiceListFragment);
          } else if (activeChoices.length >= 1) {
            choiceListFragment = this.renderChoices(activeChoices, choiceListFragment);
          }

          const activeItems = this.store.getItemsFilteredByActive();
          const canAddItem = this._canAddItem(activeItems, this.input.value);

          // If we have choices to show
          if (choiceListFragment.childNodes && choiceListFragment.childNodes.length > 0) {
            // ...and we can select them
            if (canAddItem.response) {
              // ...append them and highlight the first choice
              this.choiceList.appendChild(choiceListFragment);
              this._highlightChoice();
            } else {
              // ...otherwise show a notice
              this.choiceList.appendChild(this._getTemplate('notice', canAddItem.notice));
            }
          } else {
            // Otherwise show a notice
            let dropdownItem;
            let notice;

            if (this.isSearching) {
              notice = isType('Function', this.config.noResultsText) ?
                this.config.noResultsText() :
                this.config.noResultsText;

              dropdownItem = this._getTemplate('notice', notice, 'no-results');
            } else {
              notice = isType('Function', this.config.noChoicesText) ?
                this.config.noChoicesText() :
                this.config.noChoicesText;

              dropdownItem = this._getTemplate('notice', notice, 'no-choices');
            }

            this.choiceList.appendChild(dropdownItem);
          }
        }
      }

      // Items
      if (this.currentState.items !== this.prevState.items) {
        // Get active items (items that can be selected)
        const activeItems = this.store.getItemsFilteredByActive();

        // Clear list
        this.itemList.innerHTML = '';

        if (activeItems && activeItems) {
          // Create a fragment to store our list items
          // (so we don't have to update the DOM for each item)
          const itemListFragment = this.renderItems(activeItems);

          // If we have items to add
          if (itemListFragment.childNodes) {
            // Update list
            this.itemList.appendChild(itemListFragment);
          }
        }
      }

      this.prevState = this.currentState;
    }
  }

  /**
   * Select item (a selected item can be deleted)
   * @param  {Element} item Element to select
   * @param  {Boolean} [runEvent=true] Whether to trigger 'highlightItem' event
   * @return {Object} Class instance
   * @public
   */
  highlightItem(item, runEvent = true) {
    if (!item) {
      return this;
    }

    const id = item.id;
    const groupId = item.groupId;
    const group = groupId >= 0 ? this.store.getGroupById(groupId) : null;

    this.store.dispatch(
      highlightItem(id, true)
    );

    if (runEvent) {
      if (group && group.value) {
        triggerEvent(this.passedElement, 'highlightItem', {
          id,
          value: item.value,
          label: item.label,
          groupValue: group.value
        });
      } else {
        triggerEvent(this.passedElement, 'highlightItem', {
          id,
          value: item.value,
          label: item.label,
        });
      }
    }

    return this;
  }

  /**
   * Deselect item
   * @param  {Element} item Element to de-select
   * @return {Object} Class instance
   * @public
   */
  unhighlightItem(item) {
    if (!item) {
      return this;
    }

    const id = item.id;
    const groupId = item.groupId;
    const group = groupId >= 0 ? this.store.getGroupById(groupId) : null;

    this.store.dispatch(
      highlightItem(id, false)
    );

    if (group && group.value) {
      triggerEvent(this.passedElement, 'unhighlightItem', {
        id,
        value: item.value,
        label: item.label,
        groupValue: group.value
      });
    } else {
      triggerEvent(this.passedElement, 'unhighlightItem', {
        id,
        value: item.value,
        label: item.label,
      });
    }

    return this;
  }

  /**
   * Highlight items within store
   * @return {Object} Class instance
   * @public
   */
  highlightAll() {
    const items = this.store.getItems();
    items.forEach((item) => {
      this.highlightItem(item);
    });

    return this;
  }

  /**
   * Deselect items within store
   * @return {Object} Class instance
   * @public
   */
  unhighlightAll() {
    const items = this.store.getItems();
    items.forEach((item) => {
      this.unhighlightItem(item);
    });

    return this;
  }

  /**
   * Remove an item from the store by its value
   * @param  {String} value Value to search for
   * @return {Object} Class instance
   * @public
   */
  removeItemsByValue(value) {
    if (!value || !isType('String', value)) {
      return this;
    }

    const items = this.store.getItemsFilteredByActive();

    items.forEach((item) => {
      if (item.value === value) {
        this._removeItem(item);
      }
    });

    return this;
  }

  /**
   * Remove all items from store array
   * @note Removed items are soft deleted
   * @param  {Number} excludedId Optionally exclude item by ID
   * @return {Object} Class instance
   * @public
   */
  removeActiveItems(excludedId) {
    const items = this.store.getItemsFilteredByActive();

    items.forEach((item) => {
      if (item.active && excludedId !== item.id) {
        this._removeItem(item);
      }
    });

    return this;
  }

  /**
   * Remove all selected items from store
   * @note Removed items are soft deleted
   * @return {Object} Class instance
   * @public
   */
  removeHighlightedItems(runEvent = false) {
    const items = this.store.getItemsFilteredByActive();

    items.forEach((item) => {
      if (item.highlighted && item.active) {
        this._removeItem(item);
        // If this action was performed by the user
        // trigger the event
        if (runEvent) {
          this._triggerChange(item.value);
        }
      }
    });

    return this;
  }

  /**
   * Show dropdown to user by adding active state class
   * @return {Object} Class instance
   * @public
   */
  showDropdown(focusInput = false) {
    const body = document.body;
    const html = document.documentElement;
    const winHeight = Math.max(
        body.scrollHeight,
        body.offsetHeight,
        html.clientHeight,
        html.scrollHeight,
        html.offsetHeight
      );

    this.containerOuter.classList.add(this.config.classNames.openState);
    this.containerOuter.setAttribute('aria-expanded', 'true');
    this.dropdown.classList.add(this.config.classNames.activeState);
    this.dropdown.setAttribute('aria-expanded', 'true');

    const dimensions = this.dropdown.getBoundingClientRect();
    const dropdownPos = Math.ceil(dimensions.top + window.scrollY + this.dropdown.offsetHeight);

    // If flip is enabled and the dropdown bottom position is greater than the window height flip the dropdown.
    let shouldFlip = false;
    if (this.config.position === 'auto') {
      shouldFlip = dropdownPos >= winHeight;
    } else if (this.config.position === 'top') {
      shouldFlip = true;
    }

    if (shouldFlip) {
      this.containerOuter.classList.add(this.config.classNames.flippedState);
    }

    // Optionally focus the input if we have a search input
    if (focusInput && this.canSearch && document.activeElement !== this.input) {
      this.input.focus();
    }

    triggerEvent(this.passedElement, 'showDropdown', {});

    return this;
  }

  /**
   * Hide dropdown from user
   * @return {Object} Class instance
   * @public
   */
  hideDropdown(blurInput = false) {
    // A dropdown flips if it does not have space within the page
    const isFlipped = this.containerOuter.classList.contains(this.config.classNames.flippedState);

    this.containerOuter.classList.remove(this.config.classNames.openState);
    this.containerOuter.setAttribute('aria-expanded', 'false');
    this.dropdown.classList.remove(this.config.classNames.activeState);
    this.dropdown.setAttribute('aria-expanded', 'false');

    if (isFlipped) {
      this.containerOuter.classList.remove(this.config.classNames.flippedState);
    }

    // Optionally blur the input if we have a search input
    if (blurInput && this.canSearch && document.activeElement === this.input) {
      this.input.blur();
    }

    triggerEvent(this.passedElement, 'hideDropdown', {});

    return this;
  }

  /**
   * Determine whether to hide or show dropdown based on its current state
   * @return {Object} Class instance
   * @public
   */
  toggleDropdown() {
    const hasActiveDropdown = this.dropdown.classList.contains(this.config.classNames.activeState);
    if (hasActiveDropdown) {
      this.hideDropdown();
    } else {
      this.showDropdown(true);
    }

    return this;
  }

  /**
   * Get value(s) of input (i.e. inputted items (text) or selected choices (select))
   * @param {Boolean} valueOnly Get only values of selected items, otherwise return selected items
   * @return {Array/String} selected value (select-one) or array of selected items (inputs & select-multiple)
   * @public
   */
  getValue(valueOnly = false) {
    const items = this.store.getItemsFilteredByActive();
    const selectedItems = [];

    items.forEach((item) => {
      if (this.isTextElement) {
        selectedItems.push(valueOnly ? item.value : item);
      } else if (item.active) {
        selectedItems.push(valueOnly ? item.value : item);
      }
    });

    if (this.isSelectOneElement) {
      return selectedItems[0];
    }

    return selectedItems;
  }

  /**
   * Set value of input. If the input is a select box, a choice will be created and selected otherwise
   * an item will created directly.
   * @param  {Array}   args  Array of value objects or value strings
   * @return {Object} Class instance
   * @public
   */
  setValue(args) {
    if (this.initialised === true) {
      // Convert args to an iterable array
      const values = [...args],
        handleValue = (item) => {
          const itemType = getType(item);
          if (itemType === 'Object') {
            if (!item.value) {
              return;
            }

            // If we are dealing with a select input, we need to create an option first
            // that is then selected. For text inputs we can just add items normally.
            if (!this.isTextElement) {
              this._addChoice(
                item.value,
                item.label,
                true,
                false,
                -1,
                item.customProperties,
                item.placeholder
              );
            } else {
              this._addItem(
                item.value,
                item.label,
                item.id,
                undefined,
                item.customProperties,
                item.placeholder
              );
            }
          } else if (itemType === 'String') {
            if (!this.isTextElement) {
              this._addChoice(
                item,
                item,
                true,
                false,
                -1,
                null
              );
            } else {
              this._addItem(item);
            }
          }
        };

      if (values.length > 1) {
        values.forEach((value) => {
          handleValue(value);
        });
      } else {
        handleValue(values[0]);
      }
    }
    return this;
  }

  /**
   * Select value of select box via the value of an existing choice
   * @param {Array/String} value An array of strings of a single string
   * @return {Object} Class instance
   * @public
   */
  setValueByChoice(value) {
    if (!this.isTextElement) {
      const choices = this.store.getChoices();
      // If only one value has been passed, convert to array
      const choiceValue = isType('Array', value) ? value : [value];

      // Loop through each value and
      choiceValue.forEach((val) => {
        const foundChoice = choices.find((choice) => {
          // Check 'value' property exists and the choice isn't already selected
          return this.config.itemComparer(choice.value, val);
        });

        if (foundChoice) {
          if (!foundChoice.selected) {
            this._addItem(
              foundChoice.value,
              foundChoice.label,
              foundChoice.id,
              foundChoice.groupId,
              foundChoice.customProperties,
              foundChoice.placeholder,
              foundChoice.keyCode
            );
          } else if (!this.config.silent) {
            console.warn('Attempting to select choice already selected');
          }
        } else if (!this.config.silent) {
          console.warn('Attempting to select choice that does not exist');
        }
      });
    }
    return this;
  }

  /**
   * Direct populate choices
   * @param  {Array} choices - Choices to insert
   * @param  {String} value - Name of 'value' property
   * @param  {String} label - Name of 'label' property
   * @param  {Boolean} replaceChoices Whether existing choices should be removed
   * @return {Object} Class instance
   * @public
   */
  setChoices(choices, value, label, replaceChoices = false) {
    if (this.initialised === true) {
      if (this.isSelectElement) {
        if (!isType('Array', choices) || !value) {
          return this;
        }

        // Clear choices if needed
        if (replaceChoices) {
          this._clearChoices();
        }

        this._setLoading(true);

        // Add choices if passed
        if (choices && choices.length) {
          this.containerOuter.classList.remove(this.config.classNames.loadingState);
          choices.forEach((result) => {
            if (result.choices) {
              this._addGroup(
                result,
                (result.id || null),
                value,
                label
              );
            } else {
              this._addChoice(
                result[value],
                result[label],
                result.selected,
                result.disabled,
                undefined,
                result.customProperties,
                result.placeholder
              );
            }
          });
        }

        this._setLoading(false);

      }
    }
    return this;
  }

  /**
   * Clear items,choices and groups
   * @note Hard delete
   * @return {Object} Class instance
   * @public
   */
  clearStore() {
    this.store.dispatch(
      clearAll()
    );
    return this;
  }

  /**
   * Set value of input to blank
   * @return {Object} Class instance
   * @public
   */
  clearInput() {
    if (this.input.value){
      this.input.value = '';
    }
    if (!this.isSelectOneElement) {
      this._setInputWidth();
    }
    if (!this.isTextElement && this.config.searchEnabled) {
      this.isSearching = false;
      this.store.dispatch(
        activateChoices(true)
      );
    }
    return this;
  }

  /**
   * Enable interaction with Choices
   * @return {Object} Class instance
   */
  enable() {
    if (this.initialised) {
      this.passedElement.disabled = false;
      const isDisabled = this.containerOuter.classList.contains(this.config.classNames.disabledState);
      if (isDisabled) {
        this._addEventListeners();
        this.passedElement.removeAttribute('disabled');
        this.input.removeAttribute('disabled');
        this.containerOuter.classList.remove(this.config.classNames.disabledState);
        this.containerOuter.removeAttribute('aria-disabled');
        if (this.isSelectOneElement) {
          this.containerOuter.setAttribute('tabindex', '0');
        }
      }
    }
    return this;
  }

  /**
   * Disable interaction with Choices
   * @return {Object} Class instance
   * @public
   */
  disable() {
    if (this.initialised) {
      this.passedElement.disabled = true;
      const isEnabled = !this.containerOuter.classList.contains(this.config.classNames.disabledState);
      if (isEnabled) {
        this._removeEventListeners();
        this.passedElement.setAttribute('disabled', '');
        this.input.setAttribute('disabled', '');
        this.containerOuter.classList.add(this.config.classNames.disabledState);
        this.containerOuter.setAttribute('aria-disabled', 'true');
        if (this.isSelectOneElement) {
          this.containerOuter.setAttribute('tabindex', '-1');
        }
      }
    }
    return this;
  }

  /**
   * Populate options via ajax callback
   * @param  {Function} fn Function that actually makes an AJAX request
   * @return {Object} Class instance
   * @public
   */
  ajax(fn) {
    if (this.initialised === true) {
      if (this.isSelectElement) {
        // Show loading text
        requestAnimationFrame(() => {
          this._handleLoadingState(true);
        });
        // Run callback
        fn(this._ajaxCallback());
      }
    }
    return this;
  }

  /*=====  End of Public functions  ======*/

  /*=============================================
  =                Private functions            =
  =============================================*/

  /**
   * Call change callback
   * @param  {String} value - last added/deleted/selected value
   * @return
   * @private
   */
  _triggerChange(value) {
    if (!value) {
      return;
    }

    triggerEvent(this.passedElement, 'change', {
      value
    });
  }

  /**
   * Process enter/click of an item button
   * @param {Array} activeItems The currently active items
   * @param  {Element} element Button being interacted with
   * @return
   * @private
   */
  _handleButtonAction(activeItems, element) {
    if (!activeItems || !element) {
      return;
    }

    // If we are clicking on a button
    if (this.config.removeItems && this.config.removeItemButton) {
      const itemId = element.parentNode.getAttribute('data-id');
      const itemToRemove = activeItems.find((item) => item.id === parseInt(itemId, 10));

      // Remove item associated with button
      this._removeItem(itemToRemove);
      this._triggerChange(itemToRemove.value);

      if (this.isSelectOneElement) {
        this._selectPlaceholderChoice();
      }
    }
  }

  /**
   * Select placeholder choice
   */
  _selectPlaceholderChoice() {
    const placeholderChoice = this.store.getPlaceholderChoice();

    if (placeholderChoice) {
      this._addItem(
        placeholderChoice.value,
        placeholderChoice.label,
        placeholderChoice.id,
        placeholderChoice.groupId,
        null,
        placeholderChoice.placeholder
      );
      this._triggerChange(placeholderChoice.value);
    }
  }

  /**
   * Process click of an item
   * @param {Array} activeItems The currently active items
   * @param  {Element} element Item being interacted with
   * @param  {Boolean} hasShiftKey Whether the user has the shift key active
   * @return
   * @private
   */
  _handleItemAction(activeItems, element, hasShiftKey = false) {
    if (!activeItems || !element) {
      return;
    }

    // If we are clicking on an item
    if (this.config.removeItems && !this.isSelectOneElement) {
      const passedId = element.getAttribute('data-id');

      // We only want to select one item with a click
      // so we deselect any items that aren't the target
      // unless shift is being pressed
      activeItems.forEach((item) => {
        if (item.id === parseInt(passedId, 10) && !item.highlighted) {
          this.highlightItem(item);
        } else if (!hasShiftKey) {
          if (item.highlighted) {
            this.unhighlightItem(item);
          }
        }
      });

      // Focus input as without focus, a user cannot do anything with a
      // highlighted item
      if (document.activeElement !== this.input) {
        this.input.focus();
      }
    }
  }

  /**
   * Process click of a choice
   * @param {Array} activeItems The currently active items
   * @param  {Element} element Choice being interacted with
   * @return
   */
  _handleChoiceAction(activeItems, element) {
    if (!activeItems || !element) {
      return;
    }

    // If we are clicking on an option
    const id = element.getAttribute('data-id');
    const choice = this.store.getChoiceById(id);
    const passedKeyCode  = activeItems[0] && activeItems[0].keyCode ? activeItems[0].keyCode : null;
    const hasActiveDropdown = this.dropdown.classList.contains(this.config.classNames.activeState);

    // Update choice keyCode
    choice.keyCode = passedKeyCode;

    triggerEvent(this.passedElement, 'choice', {
      choice,
    });

    if (choice && !choice.selected && !choice.disabled) {
      const canAddItem = this._canAddItem(activeItems, choice.value);

      if (canAddItem.response) {
        this._addItem(
          choice.value,
          choice.label,
          choice.id,
          choice.groupId,
          choice.customProperties,
          choice.placeholder,
          choice.keyCode
        );
        this._triggerChange(choice.value);
      }
    }

    this.clearInput();

    // We wont to close the dropdown if we are dealing with a single select box
    if (hasActiveDropdown && this.isSelectOneElement) {
      this.hideDropdown();
      this.containerOuter.focus();
    }
  }

  /**
   * Process back space event
   * @param  {Array} activeItems items
   * @return
   * @private
   */
  _handleBackspace(activeItems) {
    if (this.config.removeItems && activeItems) {
      const lastItem = activeItems[activeItems.length - 1];
      const hasHighlightedItems = activeItems.some(item => item.highlighted);

      // If editing the last item is allowed and there are not other selected items,
      // we can edit the item value. Otherwise if we can remove items, remove all selected items
      if (this.config.editItems && !hasHighlightedItems && lastItem) {
        this.input.value = lastItem.value;
        this._setInputWidth();
        this._removeItem(lastItem);
        this._triggerChange(lastItem.value);
      } else {
        if (!hasHighlightedItems) {
          this.highlightItem(lastItem, false);
        }
        this.removeHighlightedItems(true);
      }
    }
  }

  /**
   * Validates whether an item can be added by a user
   * @param {Array} activeItems The currently active items
   * @param  {String} value     Value of item to add
   * @return {Object}           Response: Whether user can add item
   *                            Notice: Notice show in dropdown
   */
  _canAddItem(activeItems, value) {
    let canAddItem = true;
    let notice = isType('Function', this.config.addItemText) ?
      this.config.addItemText(value) :
      this.config.addItemText;

    if (this.isSelectMultipleElement || this.isTextElement) {
      if (this.config.maxItemCount > 0 && this.config.maxItemCount <= activeItems.length) {
        // If there is a max entry limit and we have reached that limit
        // don't update
        canAddItem = false;
        notice = isType('Function', this.config.maxItemText) ?
          this.config.maxItemText(this.config.maxItemCount) :
          this.config.maxItemText;
      }
    }

    if (this.isTextElement && this.config.addItems && canAddItem) {
      // If a user has supplied a regular expression filter
      if (this.config.regexFilter) {
        // Determine whether we can update based on whether
        // our regular expression passes
        canAddItem = this._regexFilter(value);
      }
    }

    // If no duplicates are allowed, and the value already exists
    // in the array
    const isUnique = !activeItems.some((item) => {
      if (isType('String', value)) {
        return item.value === value.trim();
      }

      return item.value === value;
    });

    if (
      !isUnique &&
      !this.config.duplicateItems &&
      !this.isSelectOneElement &&
      canAddItem
    ) {
      canAddItem = false;
      notice = isType('Function', this.config.uniqueItemText) ?
        this.config.uniqueItemText(value) :
        this.config.uniqueItemText;
    }

    return {
      response: canAddItem,
      notice,
    };
  }

  /**
   * Apply or remove a loading state to the component.
   * @param {Boolean} setLoading default value set to 'true'.
   * @return
   * @private
   */
  _handleLoadingState(setLoading = true) {
    let placeholderItem = this.itemList.querySelector(`.${this.config.classNames.placeholder}`);
    if (setLoading) {
      this.containerOuter.classList.add(this.config.classNames.loadingState);
      this.containerOuter.setAttribute('aria-busy', 'true');
      if (this.isSelectOneElement) {
        if (!placeholderItem) {
          placeholderItem = this._getTemplate('placeholder', this.config.loadingText);
          this.itemList.appendChild(placeholderItem);
        } else {
          placeholderItem.innerHTML = this.config.loadingText;
        }
      } else {
        this.input.placeholder = this.config.loadingText;
      }
    } else {
      // Remove loading states/text
      this.containerOuter.classList.remove(this.config.classNames.loadingState);

      if (this.isSelectOneElement) {
        placeholderItem.innerHTML = (this.placeholder || '');
      } else {
        this.input.placeholder = (this.placeholder || '');
      }
    }
  }

  /**
   * Retrieve the callback used to populate component's choices in an async way.
   * @returns {Function} The callback as a function.
   * @private
   */
  _ajaxCallback() {
    return (results, value, label) => {
      if (!results || !value) {
        return;
      }

      const parsedResults = isType('Object', results) ? [results] : results;

      if (parsedResults && isType('Array', parsedResults) && parsedResults.length) {
        // Remove loading states/text
        this._handleLoadingState(false);
        // Add each result as a choice

        this._setLoading(true);

        parsedResults.forEach((result) => {
          if (result.choices) {
            const groupId = (result.id || null);
            this._addGroup(
              result,
              groupId,
              value,
              label
            );
          } else {
            this._addChoice(
              result[value],
              result[label],
              result.selected,
              result.disabled,
              undefined,
              result.customProperties,
              result.placeholder
            );
          }
        });

        this._setLoading(false);

        if (this.isSelectOneElement) {
          this._selectPlaceholderChoice();
        }
      } else {
        // No results, remove loading state
        this._handleLoadingState(false);
      }

      this.containerOuter.removeAttribute('aria-busy');
    };
  }

  /**
   * Filter choices based on search value
   * @param  {String} value Value to filter by
   * @return
   * @private
   */
  _searchChoices(value) {
    const newValue = isType('String', value) ? value.trim() : value;
    const currentValue = isType('String', this.currentValue) ? this.currentValue.trim() : this.currentValue;

    // If new value matches the desired length and is not the same as the current value with a space
    if (newValue.length >= 1 && newValue !== `${currentValue} `) {
      const haystack = this.store.getSearchableChoices();
      const needle = newValue;
      const keys = isType('Array', this.config.searchFields) ? this.config.searchFields : [this.config.searchFields];
      const options = Object.assign(this.config.fuseOptions, { keys });
      const fuse = new Fuse(haystack, options);
      const results = fuse.search(needle);

      this.currentValue = newValue;
      this.highlightPosition = 0;
      this.isSearching = true;
      this.store.dispatch(
        filterChoices(results)
      );

      return results.length;
    }

    return 0;
  }

  /**
   * Determine the action when a user is searching
   * @param  {String} value Value entered by user
   * @return
   * @private
   */
  _handleSearch(value) {
    if (!value) {
      return;
    }

    const choices = this.store.getChoices();
    const hasUnactiveChoices = choices.some(option => !option.active);

    // Run callback if it is a function
    if (this.input === document.activeElement) {
      // Check that we have a value to search and the input was an alphanumeric character
      if (value && value.length >= this.config.searchFloor) {
        let resultCount = 0;
        // Check flag to filter search input
        if (this.config.searchChoices) {
          // Filter available choices
          resultCount = this._searchChoices(value);
        }
        // Trigger search event
        triggerEvent(this.passedElement, 'search', {
          value,
          resultCount
        });
      } else if (hasUnactiveChoices) {
        // Otherwise reset choices to active
        this.isSearching = false;
        this.store.dispatch(
          activateChoices(true)
        );
      }
    }
  }

  /**
   * Trigger event listeners
   * @return
   * @private
   */
  _addEventListeners() {
    document.addEventListener('keyup', this._onKeyUp);
    document.addEventListener('keydown', this._onKeyDown);
    document.addEventListener('click', this._onClick);
    document.addEventListener('touchmove', this._onTouchMove);
    document.addEventListener('touchend', this._onTouchEnd);
    document.addEventListener('mousedown', this._onMouseDown);
    document.addEventListener('mouseover', this._onMouseOver);

    if (this.isSelectOneElement) {
      this.containerOuter.addEventListener('focus', this._onFocus);
      this.containerOuter.addEventListener('blur', this._onBlur);
    }

    this.input.addEventListener('input', this._onInput);
    this.input.addEventListener('paste', this._onPaste);
    this.input.addEventListener('focus', this._onFocus);
    this.input.addEventListener('blur', this._onBlur);
  }

  /**
   * Remove event listeners
   * @return
   * @private
   */
  _removeEventListeners() {
    document.removeEventListener('keyup', this._onKeyUp);
    document.removeEventListener('keydown', this._onKeyDown);
    document.removeEventListener('click', this._onClick);
    document.removeEventListener('touchmove', this._onTouchMove);
    document.removeEventListener('touchend', this._onTouchEnd);
    document.removeEventListener('mousedown', this._onMouseDown);
    document.removeEventListener('mouseover', this._onMouseOver);

    if (this.isSelectOneElement) {
      this.containerOuter.removeEventListener('focus', this._onFocus);
      this.containerOuter.removeEventListener('blur', this._onBlur);
    }

    this.input.removeEventListener('input', this._onInput);
    this.input.removeEventListener('paste', this._onPaste);
    this.input.removeEventListener('focus', this._onFocus);
    this.input.removeEventListener('blur', this._onBlur);
  }

  /**
   * Set the correct input width based on placeholder
   * value or input value
   * @return
   */
  _setInputWidth() {
    if (this.placeholder) {
      // If there is a placeholder, we only want to set the width of the input when it is a greater
      // length than 75% of the placeholder. This stops the input jumping around.
      if (this.input.value && this.input.value.length >= (this.placeholder.length / 1.25)) {
        this.input.style.width = getWidthOfInput(this.input);
      }
    } else {
      // If there is no placeholder, resize input to contents
      this.input.style.width = getWidthOfInput(this.input);
    }
  }

  /**
   * Key down event
   * @param  {Object} e Event
   * @return
   */
  _onKeyDown(e) {
    if (e.target !== this.input && !this.containerOuter.contains(e.target)) {
      return;
    }

    const target = e.target;
    const activeItems = this.store.getItemsFilteredByActive();
    const hasFocusedInput = this.input === document.activeElement;
    const hasActiveDropdown = this.dropdown.classList.contains(this.config.classNames.activeState);
    const hasItems = this.itemList && this.itemList.children;
    const keyString = String.fromCharCode(e.keyCode);

    const backKey = 46;
    const deleteKey = 8;
    const enterKey = 13;
    const aKey = 65;
    const escapeKey = 27;
    const upKey = 38;
    const downKey = 40;
    const pageUpKey = 33;
    const pageDownKey = 34;
    const ctrlDownKey = e.ctrlKey || e.metaKey;

    // If a user is typing and the dropdown is not active
    if (!this.isTextElement && /[a-zA-Z0-9-_ ]/.test(keyString) && !hasActiveDropdown) {
      this.showDropdown(true);
    }

    this.canSearch = this.config.searchEnabled;

    const onAKey = () => {
      // If CTRL + A or CMD + A have been pressed and there are items to select
      if (ctrlDownKey && hasItems) {
        this.canSearch = false;
        if (this.config.removeItems && !this.input.value && this.input === document.activeElement) {
          // Highlight items
          this.highlightAll();
        }
      }
    };

    const onEnterKey = () => {
      // If enter key is pressed and the input has a value
      if (this.isTextElement && target.value) {
        const value = this.input.value;
        const canAddItem = this._canAddItem(activeItems, value);

        // All is good, add
        if (canAddItem.response) {
          if (hasActiveDropdown) {
            this.hideDropdown();
          }
          this._addItem(value);
          this._triggerChange(value);
          this.clearInput();
        }
      }

      if (target.hasAttribute('data-button')) {
        this._handleButtonAction(activeItems, target);
        e.preventDefault();
      }

      if (hasActiveDropdown) {
        e.preventDefault();
        const highlighted = this.dropdown.querySelector(`.${this.config.classNames.highlightedState}`);

        // If we have a highlighted choice
        if (highlighted) {
          // add enter keyCode value
          if (activeItems[0]) {
            activeItems[0].keyCode = enterKey;
          }
          this._handleChoiceAction(activeItems, highlighted);
        }

      } else if (this.isSelectOneElement) {
        // Open single select dropdown if it's not active
        if (!hasActiveDropdown) {
          this.showDropdown(true);
          e.preventDefault();
        }
      }
    };

    const onEscapeKey = () => {
      if (hasActiveDropdown) {
        this.toggleDropdown();
        this.containerOuter.focus();
      }
    };

    const onDirectionKey = () => {
      // If up or down key is pressed, traverse through options
      if (hasActiveDropdown || this.isSelectOneElement) {
        // Show dropdown if focus
        if (!hasActiveDropdown) {
          this.showDropdown(true);
        }

        this.canSearch = false;

        const directionInt = e.keyCode === downKey || e.keyCode === pageDownKey ? 1 : -1;
        const skipKey = e.metaKey || e.keyCode === pageDownKey || e.keyCode === pageUpKey;

        let nextEl;
        if (skipKey) {
          if (directionInt > 0) {
            nextEl = Array.from(this.dropdown.querySelectorAll('[data-choice-selectable]')).pop();
          } else {
            nextEl = this.dropdown.querySelector('[data-choice-selectable]');
          }
        } else {
          const currentEl = this.dropdown.querySelector(`.${this.config.classNames.highlightedState}`);
          if (currentEl) {
            nextEl = getAdjacentEl(currentEl, '[data-choice-selectable]', directionInt);
          } else {
            nextEl = this.dropdown.querySelector('[data-choice-selectable]');
          }
        }

        if (nextEl) {
          // We prevent default to stop the cursor moving
          // when pressing the arrow
          if (!isScrolledIntoView(nextEl, this.choiceList, directionInt)) {
            this._scrollToChoice(nextEl, directionInt);
          }
          this._highlightChoice(nextEl);
        }

        // Prevent default to maintain cursor position whilst
        // traversing dropdown options
        e.preventDefault();
      }
    };

    const onDeleteKey = () => {
      // If backspace or delete key is pressed and the input has no value
      if (hasFocusedInput && !e.target.value && !this.isSelectOneElement) {
        this._handleBackspace(activeItems);
        e.preventDefault();
      }
    };

    // Map keys to key actions
    const keyDownActions = {
      [aKey]: onAKey,
      [enterKey]: onEnterKey,
      [escapeKey]: onEscapeKey,
      [upKey]: onDirectionKey,
      [pageUpKey]: onDirectionKey,
      [downKey]: onDirectionKey,
      [pageDownKey]: onDirectionKey,
      [deleteKey]: onDeleteKey,
      [backKey]: onDeleteKey,
    };

    // If keycode has a function, run it
    if (keyDownActions[e.keyCode]) {
      keyDownActions[e.keyCode]();
    }
  }

  /**
   * Key up event
   * @param  {Object} e Event
   * @return
   * @private
   */
  _onKeyUp(e) {
    if (e.target !== this.input) {
      return;
    }

    const value = this.input.value;
    const activeItems = this.store.getItemsFilteredByActive();
    const canAddItem = this._canAddItem(activeItems, value);

    // We are typing into a text input and have a value, we want to show a dropdown
    // notice. Otherwise hide the dropdown
    if (this.isTextElement) {
      const hasActiveDropdown = this.dropdown.classList.contains(this.config.classNames.activeState);
      if (value) {

        if (canAddItem.notice) {
          const dropdownItem = this._getTemplate('notice', canAddItem.notice);
          this.dropdown.innerHTML = dropdownItem.outerHTML;
        }

        if (canAddItem.response === true) {
          if (!hasActiveDropdown) {
            this.showDropdown();
          }
        } else if (!canAddItem.notice && hasActiveDropdown) {
          this.hideDropdown();
        }
      } else if (hasActiveDropdown) {
        this.hideDropdown();
      }
    } else {
      const backKey = 46;
      const deleteKey = 8;

      // If user has removed value...
      if ((e.keyCode === backKey || e.keyCode === deleteKey) && !e.target.value) {
        // ...and it is a multiple select input, activate choices (if searching)
        if (!this.isTextElement && this.isSearching) {
          this.isSearching = false;
          this.store.dispatch(
            activateChoices(true)
          );
        }
      } else if (this.canSearch && canAddItem.response) {
        this._handleSearch(this.input.value);
      }
    }
    // Re-establish canSearch value from changes in _onKeyDown
    this.canSearch = this.config.searchEnabled;
  }

  /**
   * Input event
   * @return
   * @private
   */
  _onInput() {
    if (!this.isSelectOneElement) {
      this._setInputWidth();
    }
  }

  /**
   * Touch move event
   * @return
   * @private
   */
  _onTouchMove() {
    if (this.wasTap === true) {
      this.wasTap = false;
    }
  }

  /**
   * Touch end event
   * @param  {Object} e Event
   * @return
   * @private
   */
  _onTouchEnd(e) {
    const target = e.target || e.touches[0].target;
    const hasActiveDropdown = this.dropdown.classList.contains(this.config.classNames.activeState);

    // If a user tapped within our container...
    if (this.wasTap === true && this.containerOuter.contains(target)) {
      // ...and we aren't dealing with a single select box, show dropdown/focus input
      if ((target === this.containerOuter || target === this.containerInner) && !this.isSelectOneElement) {
        if (this.isTextElement) {
          // If text element, we only want to focus the input (if it isn't already)
          if (document.activeElement !== this.input) {
            this.input.focus();
          }
        } else {
          if (!hasActiveDropdown) {
            // If a select box, we want to show the dropdown
            this.showDropdown(true);
          }
        }
      }
      // Prevents focus event firing
      e.stopPropagation();
    }

    this.wasTap = true;
  }

  /**
   * Mouse down event
   * @param  {Object} e Event
   * @return
   * @private
   */
  _onMouseDown(e) {
    const target = e.target;

    // If we have our mouse down on the scrollbar and are on IE11...
    if (target === this.choiceList && this.isIe11) {
      this.isScrollingOnIe = true;
    }

    if (this.containerOuter.contains(target) && target !== this.input) {
      let foundTarget;
      const activeItems = this.store.getItemsFilteredByActive();
      const hasShiftKey = e.shiftKey;

      if (foundTarget = findAncestorByAttrName(target, 'data-button')) {
        this._handleButtonAction(activeItems, foundTarget);
      } else if (foundTarget = findAncestorByAttrName(target, 'data-item')) {
        this._handleItemAction(activeItems, foundTarget, hasShiftKey);
      } else if (foundTarget = findAncestorByAttrName(target, 'data-choice')) {
        this._handleChoiceAction(activeItems, foundTarget);
      }

      e.preventDefault();
    }
  }

  /**
   * Click event
   * @param  {Object} e Event
   * @return
   * @private
   */
  _onClick(e) {
    const target = e.target;
    const hasActiveDropdown = this.dropdown.classList.contains(this.config.classNames.activeState);
    const activeItems = this.store.getItemsFilteredByActive();

    // If target is something that concerns us
    if (this.containerOuter.contains(target)) {
      // Handle button delete
      if (target.hasAttribute('data-button')) {
        this._handleButtonAction(activeItems, target);
      }

      if (!hasActiveDropdown) {
        if (this.isTextElement) {
          if (document.activeElement !== this.input) {
            this.input.focus();
          }
        } else {
          if (this.canSearch) {
            this.showDropdown(true);
          } else {
            this.showDropdown();
            this.containerOuter.focus();
          }
        }
      } else if (this.isSelectOneElement && target !== this.input && !this.dropdown.contains(target)) {
        this.hideDropdown(true);
      }
    } else {
      const hasHighlightedItems = activeItems.some(item => item.highlighted);

      // De-select any highlighted items
      if (hasHighlightedItems) {
        this.unhighlightAll();
      }

      // Remove focus state
      this.containerOuter.classList.remove(this.config.classNames.focusState);

      // Close all other dropdowns
      if (hasActiveDropdown) {
        this.hideDropdown();
      }
    }
  }

  /**
   * Mouse over (hover) event
   * @param  {Object} e Event
   * @return
   * @private
   */
  _onMouseOver(e) {
    // If the dropdown is either the target or one of its children is the target
    if (e.target === this.dropdown || this.dropdown.contains(e.target)) {
      if (e.target.hasAttribute('data-choice')) this._highlightChoice(e.target);
    }
  }

  /**
   * Paste event
   * @param  {Object} e Event
   * @return
   * @private
   */
  _onPaste(e) {
    // Disable pasting into the input if option has been set
    if (e.target === this.input && !this.config.paste) {
      e.preventDefault();
    }
  }

  /**
   * Focus event
   * @param  {Object} e Event
   * @return
   * @private
   */
  _onFocus(e) {
    const target = e.target;
    // If target is something that concerns us
    if (this.containerOuter.contains(target)) {
      const hasActiveDropdown = this.dropdown.classList.contains(this.config.classNames.activeState);
      const focusActions = {
        text: () => {
          if (target === this.input) {
            this.containerOuter.classList.add(this.config.classNames.focusState);
          }
        },
        'select-one': () => {
          this.containerOuter.classList.add(this.config.classNames.focusState);
          if (target === this.input) {
            // Show dropdown if it isn't already showing
            if (!hasActiveDropdown) {
              this.showDropdown();
            }
          }
        },
        'select-multiple': () => {
          if (target === this.input) {
            // If element is a select box, the focused element is the container and the dropdown
            // isn't already open, focus and show dropdown
            this.containerOuter.classList.add(this.config.classNames.focusState);

            if (!hasActiveDropdown) {
              this.showDropdown(true);
            }
          }
        },
      };

      focusActions[this.passedElement.type]();
    }
  }

  /**
   * Blur event
   * @param  {Object} e Event
   * @return
   * @private
   */
  _onBlur(e) {
    const target = e.target;
    // If target is something that concerns us
    if (this.containerOuter.contains(target) && !this.isScrollingOnIe) {
      const activeItems = this.store.getItemsFilteredByActive();
      const hasActiveDropdown = this.dropdown.classList.contains(this.config.classNames.activeState);
      const hasHighlightedItems = activeItems.some(item => item.highlighted);
      const blurActions = {
        text: () => {
          if (target === this.input) {
            // Remove the focus state
            this.containerOuter.classList.remove(this.config.classNames.focusState);
            // De-select any highlighted items
            if (hasHighlightedItems) {
              this.unhighlightAll();
            }
            // Hide dropdown if it is showing
            if (hasActiveDropdown) {
              this.hideDropdown();
            }
          }
        },
        'select-one': () => {
          this.containerOuter.classList.remove(this.config.classNames.focusState);
          if (target === this.containerOuter) {
            // Hide dropdown if it is showing
            if (hasActiveDropdown && !this.canSearch) {
              this.hideDropdown();
            }
          }
          if (target === this.input && hasActiveDropdown) {
            // Hide dropdown if it is showing
            this.hideDropdown();
          }
        },
        'select-multiple': () => {
          if (target === this.input) {
            // Remove the focus state
            this.containerOuter.classList.remove(this.config.classNames.focusState);
            // Hide dropdown if it is showing
            if (hasActiveDropdown) {
              this.hideDropdown();
            }
            // De-select any highlighted items
            if (hasHighlightedItems) {
              this.unhighlightAll();
            }
          }
        },
      };

      blurActions[this.passedElement.type]();
    } else {
      // On IE11, clicking the scollbar blurs our input and thus
      // closes the dropdown. To stop this, we refocus our input
      // if we know we are on IE *and* are scrolling.
      this.isScrollingOnIe = false;
      this.input.focus();
    }
  }

  /**
   * Tests value against a regular expression
   * @param  {string} value   Value to test
   * @return {Boolean}        Whether test passed/failed
   * @private
   */
  _regexFilter(value) {
    if (!value) {
      return false;
    }

    const regex = this.config.regexFilter;
    const expression = new RegExp(regex.source, 'i');
    return expression.test(value);
  }

  /**
   * Scroll to an option element
   * @param  {HTMLElement} choice  Option to scroll to
   * @param  {Number} direction  Whether option is above or below
   * @return
   * @private
   */
  _scrollToChoice(choice, direction) {
    if (!choice) {
      return;
    }

    const dropdownHeight = this.choiceList.offsetHeight;
    const choiceHeight = choice.offsetHeight;
    // Distance from bottom of element to top of parent
    const choicePos = choice.offsetTop + choiceHeight;
    // Scroll position of dropdown
    const containerScrollPos = this.choiceList.scrollTop + dropdownHeight;
    // Difference between the choice and scroll position
    const endPoint = direction > 0 ? ((this.choiceList.scrollTop + choicePos) - containerScrollPos) : choice.offsetTop;

    const animateScroll = () => {
      const strength = 4;
      const choiceListScrollTop = this.choiceList.scrollTop;
      let continueAnimation = false;
      let easing;
      let distance;

      if (direction > 0) {
        easing = (endPoint - choiceListScrollTop) / strength;
        distance = easing > 1 ? easing : 1;

        this.choiceList.scrollTop = choiceListScrollTop + distance;
        if (choiceListScrollTop < endPoint) {
          continueAnimation = true;
        }
      } else {
        easing = (choiceListScrollTop - endPoint) / strength;
        distance = easing > 1 ? easing : 1;

        this.choiceList.scrollTop = choiceListScrollTop - distance;
        if (choiceListScrollTop > endPoint) {
          continueAnimation = true;
        }
      }

      if (continueAnimation) {
        requestAnimationFrame((time) => {
          animateScroll(time, endPoint, direction);
        });
      }
    };

    requestAnimationFrame((time) => {
      animateScroll(time, endPoint, direction);
    });
  }

  /**
   * Highlight choice
   * @param  {HTMLElement} [el] Element to highlight
   * @return
   * @private
   */
  _highlightChoice(el = null) {
    // Highlight first element in dropdown
    const choices = Array.from(this.dropdown.querySelectorAll('[data-choice-selectable]'));
    let passedEl = el;

    if (choices && choices.length) {
      const highlightedChoices = Array.from(this.dropdown.querySelectorAll(`.${this.config.classNames.highlightedState}`));

      // Remove any highlighted choices
      highlightedChoices.forEach((choice) => {
        choice.classList.remove(this.config.classNames.highlightedState);
        choice.setAttribute('aria-selected', 'false');
      });

      if (passedEl) {
        this.highlightPosition = choices.indexOf(passedEl);
      } else {
        // Highlight choice based on last known highlight location
        if (choices.length > this.highlightPosition) {
          // If we have an option to highlight
          passedEl = choices[this.highlightPosition];
        } else {
          // Otherwise highlight the option before
          passedEl = choices[choices.length - 1];
        }

        if (!passedEl) {
          passedEl = choices[0];
        }
      }

      // Highlight given option, and set accessiblity attributes
      passedEl.classList.add(this.config.classNames.highlightedState);
      passedEl.setAttribute('aria-selected', 'true');
      this.containerOuter.setAttribute('aria-activedescendant', passedEl.id);
    }
  }

  /**
   * Add item to store with correct value
   * @param {String} value Value to add to store
   * @param {String} [label] Label to add to store
   * @param {Number} [choiceId=-1] ID of the associated choice that was selected
   * @param {Number} [groupId=-1] ID of group choice is within. Negative number indicates no group
   * @param {Object} [customProperties] Object containing user defined properties
   * @return {Object} Class instance
   * @public
   */
  _addItem(value, label = null, choiceId = -1, groupId = -1, customProperties = null, placeholder = false, keyCode = null) {
    let passedValue = isType('String', value) ? value.trim() : value;
    let passedKeyCode = keyCode;
    const items = this.store.getItems();
    const passedLabel = label || passedValue;
    const passedOptionId = parseInt(choiceId, 10) || -1;

    // Get group if group ID passed
    const group = groupId >= 0 ? this.store.getGroupById(groupId) : null;

    // Generate unique id
    const id = items ? items.length + 1 : 1;

    // If a prepended value has been passed, prepend it
    if (this.config.prependValue) {
      passedValue = this.config.prependValue + passedValue.toString();
    }

    // If an appended value has been passed, append it
    if (this.config.appendValue) {
      passedValue += this.config.appendValue.toString();
    }

    this.store.dispatch(
      addItem(
        passedValue,
        passedLabel,
        id,
        passedOptionId,
        groupId,
        customProperties,
        placeholder,
        passedKeyCode
      )
    );

    if (this.isSelectOneElement) {
      this.removeActiveItems(id);
    }

    // Trigger change event
    if (group && group.value) {
      triggerEvent(this.passedElement, 'addItem', {
        id,
        value: passedValue,
        label: passedLabel,
        groupValue: group.value,
        keyCode: passedKeyCode
      });
    } else {
      triggerEvent(this.passedElement, 'addItem', {
        id,
        value: passedValue,
        label: passedLabel,
        keyCode: passedKeyCode
      });
    }

    return this;
  }

  /**
   * Remove item from store
   * @param {Object} item Item to remove
   * @return {Object} Class instance
   * @public
   */
  _removeItem(item) {
    if (!item || !isType('Object', item)) {
      return this;
    }

    const id = item.id;
    const value = item.value;
    const label = item.label;
    const choiceId = item.choiceId;
    const groupId = item.groupId;
    const group = groupId >= 0 ? this.store.getGroupById(groupId) : null;

    this.store.dispatch(
      removeItem(id, choiceId)
    );

    if (group && group.value) {
      triggerEvent(this.passedElement, 'removeItem', {
        id,
        value,
        label,
        groupValue: group.value,
      });
    } else {
      triggerEvent(this.passedElement, 'removeItem', {
        id,
        value,
        label,
      });
    }

    return this;
  }

  /**
   * Add choice to dropdown
   * @param {String} value Value of choice
   * @param {String} [label] Label of choice
   * @param {Boolean} [isSelected=false] Whether choice is selected
   * @param {Boolean} [isDisabled=false] Whether choice is disabled
   * @param {Number} [groupId=-1] ID of group choice is within. Negative number indicates no group
   * @param {Object} [customProperties] Object containing user defined properties
   * @return
   * @private
   */
  _addChoice(value, label = null, isSelected = false, isDisabled = false, groupId = -1, customProperties = null, placeholder = false, keyCode = null) {
    if (typeof value === 'undefined' || value === null) {
      return;
    }

    // Generate unique id
    const choices = this.store.getChoices();
    const choiceLabel = label || value;
    const choiceId = choices ? choices.length + 1 : 1;
    const choiceElementId = `${this.baseId}-${this.idNames.itemChoice}-${choiceId}`;

    this.store.dispatch(
      addChoice(
        value,
        choiceLabel,
        choiceId,
        groupId,
        isDisabled,
        choiceElementId,
        customProperties,
        placeholder,
        keyCode
      )
    );

    if (isSelected) {
      this._addItem(
        value,
        choiceLabel,
        choiceId,
        undefined,
        customProperties,
        placeholder,
        keyCode
      );
    }
  }

  /**
   * Clear all choices added to the store.
   * @return
   * @private
   */
  _clearChoices() {
    this.store.dispatch(
      clearChoices()
    );
  }

  /**
   * Add group to dropdown
   * @param {Object} group Group to add
   * @param {Number} id Group ID
   * @param {String} [valueKey] name of the value property on the object
   * @param {String} [labelKey] name of the label property on the object
   * @return
   * @private
   */
  _addGroup(group, id, valueKey = 'value', labelKey = 'label') {
    const groupChoices = isType('Object', group) ? group.choices : Array.from(group.getElementsByTagName('OPTION'));
    const groupId = id ? id : Math.floor(new Date().valueOf() * Math.random());
    const isDisabled = group.disabled ? group.disabled : false;

    if (groupChoices) {
      this.store.dispatch(
        addGroup(
          group.label,
          groupId,
          true,
          isDisabled
        )
      );

      groupChoices.forEach((option) => {
        const isOptDisabled = option.disabled || (option.parentNode && option.parentNode.disabled);
        this._addChoice(
          option[valueKey],
          (isType('Object', option)) ? option[labelKey] : option.innerHTML,
          option.selected,
          isOptDisabled,
          groupId,
          option.customProperties,
          option.placeholder
        );
      });
    } else {
      this.store.dispatch(
        addGroup(
          group.label,
          group.id,
          false,
          group.disabled
        )
      );
    }
  }

  /**
   * Get template from name
   * @param  {String}    template Name of template to get
   * @param  {...}       args     Data to pass to template
   * @return {HTMLElement}        Template
   * @private
   */
  _getTemplate(template, ...args) {
    if (!template) {
      return null;
    }
    const templates = this.config.templates;
    return templates[template](...args);
  }

  /**
   * Create HTML element based on type and arguments
   * @return
   * @private
   */
  _createTemplates() {
    const globalClasses = this.config.classNames;
    const templates = {
      containerOuter: (direction) => {
        return strToEl(`
          <div
            class="${globalClasses.containerOuter}"
            ${this.isSelectElement ? (this.config.searchEnabled ?
              'role="combobox" aria-autocomplete="list"' :
              'role="listbox"') :
              ''
            }
            data-type="${this.passedElement.type}"
            ${this.isSelectOneElement ?
              'tabindex="0"' :
              ''
            }
            aria-haspopup="true"
            aria-expanded="false"
            dir="${direction}"
            >
          </div>
        `);
      },
      containerInner: () => {
        return strToEl(`
          <div class="${globalClasses.containerInner}"></div>
        `);
      },
      itemList: () => {
        const localClasses = classNames(
          globalClasses.list,
          {
            [globalClasses.listSingle]: (this.isSelectOneElement),
            [globalClasses.listItems]: (!this.isSelectOneElement)
          }
        );

        return strToEl(`
          <div class="${localClasses}"></div>
        `);
      },
      placeholder: (value) => {
        return strToEl(`
          <div class="${globalClasses.placeholder}">
            ${value}
          </div>
        `);
      },
      item: (data) => {
        let localClasses = classNames(
          globalClasses.item,
          {
            [globalClasses.highlightedState]: data.highlighted,
            [globalClasses.itemSelectable]: !data.highlighted,
            [globalClasses.placeholder]: data.placeholder
          }
        );

        if (this.config.removeItemButton) {
          localClasses = classNames(
            globalClasses.item,
            {
              [globalClasses.highlightedState]: data.highlighted,
              [globalClasses.itemSelectable]: !data.disabled,
              [globalClasses.placeholder]: data.placeholder
            }
          );

          return strToEl(`
            <div
              class="${localClasses}"
              data-item
              data-id="${data.id}"
              data-value="${data.value}"
              data-deletable
              ${data.active ?
                'aria-selected="true"' :
                ''
              }
              ${data.disabled ?
                'aria-disabled="true"' :
                ''
              }
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
            ${data.active ?
              'aria-selected="true"' :
              ''
            }
            ${data.disabled ?
              'aria-disabled="true"' :
              ''
            }
            >
            ${data.label}
          </div>
        `);
      },
      choiceList: () => {
        return strToEl(`
          <div
            class="${globalClasses.list}"
            dir="ltr"
            role="listbox"
            ${!this.isSelectOneElement ?
              'aria-multiselectable="true"' :
              ''
            }
            >
          </div>
        `);
      },
      choiceGroup: (data) => {
        let localClasses = classNames(
          globalClasses.group,
          {
            [globalClasses.itemDisabled]: data.disabled
          }
        );

        return strToEl(`
          <div
            class="${localClasses}"
            data-group
            data-id="${data.id}"
            data-value="${data.value}"
            role="group"
            ${data.disabled ?
              'aria-disabled="true"' :
              ''
            }
            >
            <div class="${globalClasses.groupHeading}">${data.value}</div>
          </div>
        `);
      },
      choice: (data) => {
        let localClasses = classNames(
          globalClasses.item,
          globalClasses.itemChoice,
          {
            [globalClasses.itemDisabled]: data.disabled,
            [globalClasses.itemSelectable]: !data.disabled,
            [globalClasses.placeholder]: data.placeholder
          }
        );

        return strToEl(`
          <div
            class="${localClasses}"
            data-select-text="${this.config.itemSelectText}"
            data-choice
            data-id="${data.id}"
            data-value="${data.value}"
            ${data.disabled ?
              'data-choice-disabled aria-disabled="true"' :
              'data-choice-selectable'
            }
            id="${data.elementId}"
            ${data.groupId > 0 ?
              'role="treeitem"' :
              'role="option"'
            }
            >
            ${data.label}
          </div>
        `);
      },
      input: () => {
        let localClasses = classNames(
          globalClasses.input,
          globalClasses.inputCloned
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
      dropdown: () => {
        let localClasses = classNames(
          globalClasses.list,
          globalClasses.listDropdown
        );

        return strToEl(`
          <div
            class="${localClasses}"
            aria-expanded="false"
            >
          </div>
        `);
      },
      notice: (label, type = '') => {
        let localClasses = classNames(
          globalClasses.item,
          globalClasses.itemChoice,
          {
            [globalClasses.noResults]: (type === 'no-results'),
            [globalClasses.noChoices]: (type === 'no-choices'),
          }
        );

        return strToEl(`
          <div class="${localClasses}">
            ${label}
          </div>
        `);
      },
      option: (data) => {
        return strToEl(`
          <option value="${data.value}" selected>${data.label}</option>
        `);
      },
    };

    // User's custom templates
    const callbackTemplate = this.config.callbackOnCreateTemplates;
    let userTemplates = {};
    if (callbackTemplate && isType('Function', callbackTemplate)) {
      userTemplates = callbackTemplate.call(this, strToEl);
    }

    this.config.templates = extend(templates, userTemplates);
  }

  _setLoading(isLoading) {
    this.store.dispatch(
      setIsLoading(isLoading)
    );
  }

  /**
   * Create DOM structure around passed select element
   * @return
   * @private
   */
  _createInput() {
    const direction = this.passedElement.getAttribute('dir') || 'ltr';
    const containerOuter = this._getTemplate('containerOuter', direction);
    const containerInner = this._getTemplate('containerInner');
    const itemList = this._getTemplate('itemList');
    const choiceList = this._getTemplate('choiceList');
    const input = this._getTemplate('input');
    const dropdown = this._getTemplate('dropdown');

    this.containerOuter = containerOuter;
    this.containerInner = containerInner;
    this.input = input;
    this.choiceList = choiceList;
    this.itemList = itemList;
    this.dropdown = dropdown;

    // Hide passed input
    this.passedElement.classList.add(
      this.config.classNames.input,
      this.config.classNames.hiddenState
    );

    // Remove element from tab index
    this.passedElement.tabIndex = '-1';

    // Backup original styles if any
    const origStyle = this.passedElement.getAttribute('style');

    if (Boolean(origStyle)) {
      this.passedElement.setAttribute('data-choice-orig-style', origStyle);
    }

    this.passedElement.setAttribute('style', 'display:none;');
    this.passedElement.setAttribute('aria-hidden', 'true');
    this.passedElement.setAttribute('data-choice', 'active');

    // Wrap input in container preserving DOM ordering
    wrap(this.passedElement, containerInner);

    // Wrapper inner container with outer container
    wrap(containerInner, containerOuter);

    if (this.isSelectOneElement) {
      input.placeholder = this.config.searchPlaceholderValue || '';
    } else if (this.placeholder) {
      input.placeholder = this.placeholder;
      input.style.width = getWidthOfInput(input);
    }

    if (!this.config.addItems) {
      this.disable();
    }

    containerOuter.appendChild(containerInner);
    containerOuter.appendChild(dropdown);
    containerInner.appendChild(itemList);

    if (!this.isTextElement) {
      dropdown.appendChild(choiceList);
    }

    if (this.isSelectMultipleElement || this.isTextElement) {
      containerInner.appendChild(input);
    } else if (this.canSearch) {
      dropdown.insertBefore(input, dropdown.firstChild);
    }

    if (this.isSelectElement) {
      const passedGroups = Array.from(this.passedElement.getElementsByTagName('OPTGROUP'));

      this.highlightPosition = 0;
      this.isSearching = false;

      this._setLoading(true);

      if (passedGroups && passedGroups.length) {
        passedGroups.forEach((group) => {
          this._addGroup(group, (group.id || null));
        });
      } else {
        const passedOptions = Array.from(this.passedElement.options);
        const filter = this.config.sortFilter;
        const allChoices = this.presetChoices;

        // Create array of options from option elements
        passedOptions.forEach((o) => {
          allChoices.push({
            value: o.value,
            label: o.innerHTML,
            selected: o.selected,
            disabled: o.disabled || o.parentNode.disabled,
            placeholder: o.hasAttribute('placeholder')
          });
        });

        // If sorting is enabled or the user is searching, filter choices
        if (this.config.shouldSort) {
          allChoices.sort(filter);
        }

        // Determine whether there is a selected choice
        const hasSelectedChoice = allChoices.some(choice => choice.selected);

        // Add each choice
        allChoices.forEach((choice, index) => {
          // Pre-select first choice if it's a single select
          if (this.isSelectOneElement) {
            // If there is a selected choice already or the choice is not
            // the first in the array, add each choice normally
            // Otherwise pre-select the first choice in the array
            const shouldPreselect = (hasSelectedChoice || (!hasSelectedChoice && index > 0));
            this._addChoice(
              choice.value,
              choice.label,
              (shouldPreselect) ? choice.selected : true,
              (shouldPreselect) ? choice.disabled : false,
              undefined,
              choice.customProperties,
              choice.placeholder
            );
          } else {
            this._addChoice(
              choice.value,
              choice.label,
              choice.selected,
              choice.disabled,
              undefined,
              choice.customProperties,
              choice.placeholder
            );
          }
        });
      }

      this._setLoading(false);

    } else if (this.isTextElement) {
      // Add any preset values seperated by delimiter
      this.presetItems.forEach((item) => {
        const itemType = getType(item);
        if (itemType === 'Object') {
          if (!item.value) {
            return;
          }
          this._addItem(
            item.value,
            item.label,
            item.id,
            undefined,
            item.customProperties,
            item.placeholder
          );
        } else if (itemType === 'String') {
          this._addItem(item);
        }
      });
    }
  }

  /*=====  End of Private functions  ======*/
}

module.exports = Choices;
