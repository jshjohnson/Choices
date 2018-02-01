import Fuse from 'fuse.js';
import Store from './store/store';
import Dropdown from './components/dropdown';
import Container from './components/container';
import Input from './components/input';
import List from './components/list';
import WrappedInput from './components/wrapped-input';
import WrappedSelect from './components/wrapped-select';
import { DEFAULT_CONFIG, DEFAULT_CLASSNAMES, EVENTS, KEY_CODES, SCROLLING_SPEED } from './constants';
import { TEMPLATES } from './templates';
import { addChoice, filterChoices, activateChoices, clearChoices } from './actions/choices';
import { addItem, removeItem, highlightItem } from './actions/items';
import { addGroup } from './actions/groups';
import { clearAll } from './actions/misc';
import {
  isScrolledIntoView,
  getAdjacentEl,
  getType,
  isType,
  isElement,
  strToEl,
  extend,
  sortByAlpha,
  sortByScore,
  generateId,
  findAncestorByAttrName,
  regexFilter,
} from './lib/utils';
import './lib/polyfills';

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
        for (let i = 1; i < elements.length; i += 1) {
          const el = elements[i];
          /* eslint-disable no-new */
          new Choices(el, userConfig);
        }
      }
    }

    const defaultConfig = {
      ...DEFAULT_CONFIG,
      items: [],
      choices: [],
      classNames: DEFAULT_CLASSNAMES,
      sortFn: sortByAlpha,
    };

    // Merge options with user options
    this.config = extend(defaultConfig, Choices.userDefaults, userConfig);

    if (!['auto', 'always'].includes(this.config.renderSelectedChoices)) {
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
    const passedElement = isType('String', element) ? document.querySelector(element) : element;

    this.isTextElement = passedElement.type === 'text';
    this.isSelectOneElement = passedElement.type === 'select-one';
    this.isSelectMultipleElement = passedElement.type === 'select-multiple';
    this.isSelectElement = this.isSelectOneElement || this.isSelectMultipleElement;
    this.isValidElementType = this.isTextElement || this.isSelectElement;

    if (this.isTextElement) {
      this.passedElement = new WrappedInput(this, passedElement, this.config.classNames);
    } else if (this.isSelectElement) {
      this.passedElement = new WrappedSelect(this, passedElement, this.config.classNames);
    }

    if (!this.passedElement) {
      if (!this.config.silent) {
        console.error('Passed element not found');
      }
      return false;
    }

    this.isIe11 = !!(navigator.userAgent.match(/Trident/) && navigator.userAgent.match(/rv[ :]11/));
    this.isScrollingOnIe = false;

    if (this.config.shouldSortItems === true && this.isSelectOneElement) {
      if (!this.config.silent) {
        console.warn(
          'shouldSortElements: Type of passed element is \'select-one\', falling back to false.',
        );
      }
    }

    this.highlightPosition = 0;
    this.canSearch = this.config.searchEnabled;

    this.placeholder = false;
    if (!this.isSelectOneElement) {
      this.placeholder = this.config.placeholder ?
        (this.config.placeholderValue || this.passedElement.element.getAttribute('placeholder')) :
        false;
    }

    // Assign preset choices from passed object
    this.presetChoices = this.config.choices;
    // Assign preset items from passed object first
    this.presetItems = this.config.items;

    // Then add any values passed from attribute
    if (this.passedElement.getValue()) {
      this.presetItems = this.presetItems.concat(
        this.passedElement.getValue().split(this.config.delimiter),
      );
    }

    // Set unique base Id
    this.baseId = generateId(this.passedElement.element, 'choices-');

    this.idNames = {
      itemChoice: 'item-choice',
    };

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

    // Monitor touch taps/scrolls
    this.wasTap = true;

    // Cutting the mustard
    const cuttingTheMustard = 'classList' in document.documentElement;
    if (!cuttingTheMustard && !this.config.silent) {
      console.error('Choices: Your browser doesn\'t support Choices');
    }

    const canInit = isElement(this.passedElement.element) && this.isValidElementType;

    if (canInit) {
      // If element has already been initialised with Choices
      if (this.passedElement.element.getAttribute('data-choice') === 'active') {
        return false;
      }

      // Let's go
      this.init();
    } else if (!this.config.silent) {
      console.error('Incompatible input passed');
    }
  }

  /* ========================================
  =            Public functions            =
  ======================================== */

  /**
   * Initialise Choices
   * @return
   * @public
   */
  init() {
    if (this.initialised) {
      return;
    }

    // Set initialise flag
    this.initialised = true;
    // Create required elements
    this._createTemplates();
    // Generate input markup
    this._createStructure();
    // Subscribe store to render method
    this.store.subscribe(this.render);
    // Render any items
    this.render();
    // Trigger event listeners
    this._addEventListeners();

    const callback = this.config.callbackOnInit;
    // Run callback if it is a function
    if (callback && isType('Function', callback)) {
      callback.call(this);
    }
  }

  /**
   * Destroy Choices and nullify values
   * @return
   * @public
   */
  destroy() {
    if (!this.initialised) {
      return;
    }

    // Remove all event listeners
    this._removeEventListeners();
    this.passedElement.reveal();
    this.containerOuter.unwrap(this.passedElement.element);

    if (this.isSelectElement) {
      this.passedElement.setOptions(this.presetChoices);
    }

    // Clear data store
    this.clearStore();

    // Nullify instance-specific data
    this.config.templates = null;

    // Uninitialise
    this.initialised = false;
  }

  /**
 * Enable interaction with Choices
 * @return {Object} Class instance
 */
  enable() {
    if (!this.initialised) {
      return this;
    }

    this.passedElement.enable();

    if (this.containerOuter.isDisabled) {
      this._addEventListeners();
      this.input.enable();
      this.containerOuter.enable();
    }

    return this;
  }

  /**
   * Disable interaction with Choices
   * @return {Object} Class instance
   * @public
   */
  disable() {
    if (!this.initialised) {
      return this;
    }

    this.passedElement.disable();

    if (!this.containerOuter.isDisabled) {
      this._removeEventListeners();
      this.input.disable();
      this.containerOuter.disable();
    }

    return this;
  }

  /**
   * Render group choices into a DOM fragment and append to choice list
   * @param  {Array} groups    Groups to add to list
   * @param  {Array} choices   Choices to add to groups
   * @param  {DocumentFragment} fragment Fragment to add groups and options to (optional)
   * @return {DocumentFragment} Populated options fragment
   * @private
   */
  createGroupsFragment(groups, choices, fragment) {
    const groupFragment = fragment || document.createDocumentFragment();
    const getGroupChoices = group => choices.filter((choice) => {
      if (this.isSelectOneElement) {
        return choice.groupId === group.id;
      }
      return choice.groupId === group.id && (this.config.renderSelectedChoices === 'always' || !choice.selected);
    });


    // If sorting is enabled, filter groups
    if (this.config.shouldSort) {
      groups.sort(this.config.sortFn);
    }

    groups.forEach((group) => {
      const groupChoices = getGroupChoices(group);
      if (groupChoices.length >= 1) {
        const dropdownGroup = this._getTemplate('choiceGroup', group);
        groupFragment.appendChild(dropdownGroup);
        this.createChoicesFragment(groupChoices, groupFragment, true);
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
  createChoicesFragment(choices, fragment, withinGroup = false) {
    // Create a fragment to store our list items (so we don't have to update the DOM for each item)
    const choicesFragment = fragment || document.createDocumentFragment();
    const { renderSelectedChoices, searchResultLimit, renderChoiceLimit } = this.config;
    const filter = this.isSearching ? sortByScore : this.config.sortFn;
    const appendChoice = (choice) => {
      const shouldRender = renderSelectedChoices === 'auto' ?
        (this.isSelectOneElement || !choice.selected) :
        true;
      if (shouldRender) {
        const dropdownItem = this._getTemplate('choice', choice, this.config.itemSelectText);
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
    for (let i = 0; i < choiceLimit; i += 1) {
      if (sortedChoices[i]) {
        appendChoice(sortedChoices[i]);
      }
    }

    return choicesFragment;
  }

  /**
   * Render items into a DOM fragment and append to items list
   * @param  {Array} items    Items to add to list
   * @param  {DocumentFragment} [fragment] Fragment to add items to (optional)
   * @return
   * @private
   */
  createItemsFragment(items, fragment = null) {
    // Create fragment to add elements to
    const itemListFragment = fragment || document.createDocumentFragment();

    // If sorting is enabled, filter items
    if (this.config.shouldSortItems && !this.isSelectOneElement) {
      items.sort(this.config.sortFn);
    }

    if (this.isTextElement) {
      // Update the value of the hidden input
      this.passedElement.setValue(items);
    } else {
      // Update the options of the hidden input
      this.passedElement.setOptions(items);
    }

    const addItemToFragment = (item) => {
      // Create new list element
      const listItem = this._getTemplate('item', item, this.config.removeItemButton);
      // Append it to list
      itemListFragment.appendChild(listItem);
    };

    // Add each list item to list
    items.forEach(item => addItemToFragment(item));

    return itemListFragment;
  }

  /**
   * Render DOM with values
   * @return
   * @private
   */
  render() {
    this.currentState = this.store.getState();
    const stateChanged = (
      this.currentState.choices !== this.prevState.choices ||
      this.currentState.groups !== this.prevState.groups ||
      this.currentState.items !== this.prevState.items
    );

    if (!stateChanged) {
      return;
    }

    /* Choices */

    if (this.isSelectElement) {
      // Get active groups/choices
      const activeGroups = this.store.getGroupsFilteredByActive();
      const activeChoices = this.store.getChoicesFilteredByActive();

      let choiceListFragment = document.createDocumentFragment();

      // Clear choices
      this.choiceList.clear();

      // Scroll back to top of choices list
      if (this.config.resetScrollPosition) {
        this.choiceList.scrollTo(0);
      }

      // If we have grouped options
      if (activeGroups.length >= 1 && !this.isSearching) {
        // If we have a placeholder choice along with groups
        const activePlaceholders = activeChoices.filter(
          activeChoice => activeChoice.placeholder === true && activeChoice.groupId === -1,
        );
        if (activePlaceholders.length >= 1) {
          choiceListFragment = this.createChoicesFragment(activePlaceholders, choiceListFragment);
        }
        choiceListFragment = this.createGroupsFragment(activeGroups, activeChoices, choiceListFragment);
      } else if (activeChoices.length >= 1) {
        choiceListFragment = this.createChoicesFragment(activeChoices, choiceListFragment);
      }

      // If we have choices to show
      if (choiceListFragment.childNodes && choiceListFragment.childNodes.length > 0) {
        const activeItems = this.store.getItemsFilteredByActive();
        const canAddItem = this._canAddItem(activeItems, this.input.getValue());

        // ...and we can select them
        if (canAddItem.response) {
          // ...append them and highlight the first choice
          this.choiceList.append(choiceListFragment);
          this._highlightChoice();
        } else {
          // ...otherwise show a notice
          this.choiceList.append(this._getTemplate('notice', canAddItem.notice));
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

        this.choiceList.append(dropdownItem);
      }
    }

    /* Items */
    if (this.currentState.items !== this.prevState.items) {
      // Get active items (items that can be selected)
      const activeItems = this.store.getItemsFilteredByActive() || [];
      // Clear list
      this.itemList.clear();

      if (activeItems.length) {
        // Create a fragment to store our list items
        // (so we don't have to update the DOM for each item)
        const itemListFragment = this.createItemsFragment(activeItems);

        // If we have items to add, append them
        if (itemListFragment.childNodes) {
          this.itemList.append(itemListFragment);
        }
      }
    }

    this.prevState = this.currentState;
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

    const { id, groupId = -1, value = '', label = '' } = item;
    const group = groupId >= 0 ? this.store.getGroupById(groupId) : null;

    this.store.dispatch(highlightItem(id, true));

    if (runEvent) {
      this.passedElement.triggerEvent(EVENTS.highlightItem, {
        id,
        value,
        label,
        groupValue: group && group.value ? group.value : null,
      });
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

    const { id, groupId = -1, value = '', label = '' } = item;
    const group = groupId >= 0 ? this.store.getGroupById(groupId) : null;

    this.store.dispatch(highlightItem(id, false));
    this.passedElement.triggerEvent(EVENTS.highlightItem, {
      id,
      value,
      label,
      groupValue: group && group.value ? group.value : null,
    });

    return this;
  }

  /**
   * Highlight items within store
   * @return {Object} Class instance
   * @public
   */
  highlightAll() {
    const items = this.store.getItems();
    items.forEach(item => this.highlightItem(item));
    return this;
  }

  /**
   * Deselect items within store
   * @return {Object} Class instance
   * @public
   */
  unhighlightAll() {
    const items = this.store.getItems();
    items.forEach(item => this.unhighlightItem(item));
    return this;
  }

  /**
   * Remove an item from the store by its value
   * @param  {String} value Value to search for
   * @return {Object} Class instance
   * @public
   */
  removeActiveItemsByValue(value) {
    if (!value) {
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
      if (excludedId !== item.id) {
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
    const items = this.store.getItemsFilteredByHighlighted();

    items.forEach((item) => {
      this._removeItem(item);
      // If this action was performed by the user
      // trigger the event
      if (runEvent) {
        this._triggerChange(item.value);
      }
    });

    return this;
  }

  /**
   * Show dropdown to user by adding active state class
   * @return {Object} Class instance
   * @public
   */
  showDropdown(focusInput) {
    if (this.dropdown.isActive) {
      return this;
    }

    this.dropdown.show();
    this.containerOuter.open(this.dropdown.getVerticalPos());

    if (focusInput && this.canSearch) {
      this.input.focus();
    }

    this.passedElement.triggerEvent(EVENTS.showDropdown, {});

    return this;
  }

  /**
   * Hide dropdown from user
   * @return {Object} Class instance
   * @public
   */
  hideDropdown(blurInput) {
    if (!this.dropdown.isActive) {
      return this;
    }

    this.dropdown.hide();
    this.containerOuter.close();

    if (blurInput && this.canSearch) {
      this.input.removeActiveDescendant();
      this.input.blur();
    }

    this.passedElement.triggerEvent(EVENTS.hideDropdown, {});

    return this;
  }

  /**
   * Determine whether to hide or show dropdown based on its current state
   * @return {Object} Class instance
   * @public
   */
  toggleDropdown() {
    if (this.dropdown.isActive) {
      this.hideDropdown();
    } else {
      this.showDropdown(true);
    }

    return this;
  }

  /**
   * Get value(s) of input (i.e. inputted items (text) or selected choices (select))
   * @param {Boolean} valueOnly Get only values of selected items, otherwise return selected items
   * @return {Array/String} selected value (select-one) or
   *                        array of selected items (inputs & select-multiple)
   * @public
   */
  getValue(valueOnly = false) {
    const items = this.store.getItemsFilteredByActive();

    const values = items.reduce((selectedItems, item) => {
      const itemValue = valueOnly ? item.value : item;
      selectedItems.push(itemValue);
      return selectedItems;
    }, []);

    return this.isSelectOneElement ? values[0] : values;
  }

  /**
   * Set value of input. If the input is a select box, a choice will
   * be created and selected otherwise an item will created directly.
   * @param  {Array}   args  Array of value objects or value strings
   * @return {Object} Class instance
   * @public
   */
  setValue(args) {
    if (!this.initialised) {
      return this;
    }

    // Convert args to an iterable array
    const values = [...args];
    values.forEach(value => this._setChoiceOrItem(value));

    return this;
  }

  /**
   * Select value of select box via the value of an existing choice
   * @param {Array/String} value An array of strings of a single string
   * @return {Object} Class instance
   * @public
   */
  setChoiceByValue(value) {
    if (!this.initialised || this.isTextElement) {
      return this;
    }

    // If only one value has been passed, convert to array
    const choiceValue = isType('Array', value) ? value : [value];

    // Loop through each value and
    choiceValue.forEach(val => this._findAndSelectChoiceByValue(val));

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
  setChoices(choices = [], value = '', label = '', replaceChoices = false) {
    if (
      !this.isSelectElement ||
      !choices.length ||
      !value
    ) {
      return this;
    }

    // Clear choices if needed
    if (replaceChoices) {
      this._clearChoices();
    }

    this.containerOuter.removeLoadingState();
    const addGroupsAndChoices = (groupOrChoice) => {
      if (groupOrChoice.choices) {
        this._addGroup(
          groupOrChoice,
          (groupOrChoice.id || null),
          value,
          label,
        );
      } else {
        this._addChoice(
          groupOrChoice[value],
          groupOrChoice[label],
          groupOrChoice.selected,
          groupOrChoice.disabled,
          undefined,
          groupOrChoice.customProperties,
          groupOrChoice.placeholder,
        );
      }
    };

    choices.forEach(addGroupsAndChoices);

    return this;
  }

  /**
   * Clear items,choices and groups
   * @note Hard delete
   * @return {Object} Class instance
   * @public
   */
  clearStore() {
    this.store.dispatch(clearAll());
    return this;
  }

  /**
   * Set value of input to blank
   * @return {Object} Class instance
   * @public
   */
  clearInput() {
    const shouldSetInputWidth = !this.isSelectOneElement;
    this.input.clear(shouldSetInputWidth);

    if (!this.isTextElement && this.config.searchEnabled) {
      this.isSearching = false;
      this.store.dispatch(activateChoices(true));
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
    if (!this.initialised || !this.isSelectElement || !fn) {
      return this;
    }

    requestAnimationFrame(() => this._handleLoadingState(true));
    fn(this._ajaxCallback());

    return this;
  }

  /* =====  End of Public functions  ====== */

  /* =============================================
  =                Private functions            =
  ============================================= */

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

    this.passedElement.triggerEvent(EVENTS.change, {
      value,
    });
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
        placeholderChoice.placeholder,
      );
      this._triggerChange(placeholderChoice.value);
    }
  }


  /**
   * Process enter/click of an item button
   * @param {Array} activeItems The currently active items
   * @param  {Element} element Button being interacted with
   * @return
   * @private
   */
  _handleButtonAction(activeItems, element) {
    if (
      !activeItems ||
      !element ||
      !this.config.removeItems ||
      !this.config.removeItemButton
    ) {
      return;
    }

    const itemId = element.parentNode.getAttribute('data-id');
    const itemToRemove = activeItems.find(item => item.id === parseInt(itemId, 10));

   // Remove item associated with button
    this._removeItem(itemToRemove);
    this._triggerChange(itemToRemove.value);

    if (this.isSelectOneElement) {
      this._selectPlaceholderChoice();
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
    if (
      !activeItems ||
      !element ||
      !this.config.removeItems ||
      this.isSelectOneElement
    ) {
      return;
    }

    const passedId = element.getAttribute('data-id');

    // We only want to select one item with a click
    // so we deselect any items that aren't the target
    // unless shift is being pressed
    activeItems.forEach((item) => {
      if (item.id === parseInt(passedId, 10) && !item.highlighted) {
        this.highlightItem(item);
      } else if (!hasShiftKey && item.highlighted) {
        this.unhighlightItem(item);
      }
    });

    // Focus input as without focus, a user cannot do anything with a
    // highlighted item
    this.input.focus();
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
    const passedKeyCode = activeItems[0] && activeItems[0].keyCode ? activeItems[0].keyCode : null;
    const hasActiveDropdown = this.dropdown.isActive;

    // Update choice keyCode
    choice.keyCode = passedKeyCode;

    this.passedElement.triggerEvent(EVENTS.choice, {
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
          choice.keyCode,
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
    if (!this.config.removeItems || !activeItems) {
      return;
    }

    const lastItem = activeItems[activeItems.length - 1];
    const hasHighlightedItems = activeItems.some(item => item.highlighted);

    // If editing the last item is allowed and there are not other selected items,
    // we can edit the item value. Otherwise if we can remove items, remove all selected items
    if (this.config.editItems && !hasHighlightedItems && lastItem) {
      this.input.setValue(lastItem.value);
      this.input.setWidth();
      this._removeItem(lastItem);
      this._triggerChange(lastItem.value);
    } else {
      if (!hasHighlightedItems) {
        // Highlight last item if none already highlighted
        this.highlightItem(lastItem, false);
      }
      this.removeHighlightedItems(true);
    }
  }

  /**
   * Apply or remove a loading state to the component.
   * @param {Boolean} isLoading default value set to 'true'.
   * @return
   * @private
   */
  _handleLoadingState(isLoading = true) {
    let placeholderItem = this.itemList.getChild(`.${this.config.classNames.placeholder}`);
    if (isLoading) {
      this.containerOuter.addLoadingState();
      if (this.isSelectOneElement) {
        if (!placeholderItem) {
          placeholderItem = this._getTemplate('placeholder', this.config.loadingText);
          this.itemList.append(placeholderItem);
        } else {
          placeholderItem.innerHTML = this.config.loadingText;
        }
      } else {
        this.input.setPlaceholder(this.config.loadingText);
      }
    } else {
      this.containerOuter.removeLoadingState();

      if (this.isSelectOneElement) {
        placeholderItem.innerHTML = (this.placeholder || '');
      } else {
        this.input.setPlaceholder(this.placeholder || '');
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

    if (this.config.regexFilter && this.isTextElement && this.config.addItems && canAddItem) {
      // If a user has supplied a regular expression filter
      // determine whether we can update based on whether
      // our regular expression passes
      canAddItem = regexFilter(value, this.config.regexFilter);
    }

    // If no duplicates are allowed, and the value already exists
    // in the array
    const isUnique = !activeItems.some((item) => {
      if (isType('String', value)) {
        return item.value === value.trim();
      }

      return item.value === value;
    });

    if (!isUnique &&
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
        parsedResults.forEach((result) => {
          if (result.choices) {
            const groupId = (result.id || null);
            this._addGroup(
              result,
              groupId,
              value,
              label,
            );
          } else {
            this._addChoice(
              result[value],
              result[label],
              result.selected,
              result.disabled,
              undefined,
              result.customProperties,
              result.placeholder,
            );
          }
        });

        if (this.isSelectOneElement) {
          this._selectPlaceholderChoice();
        }
      } else {
        // No results, remove loading state
        this._handleLoadingState(false);
      }
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
    const currentValue = isType('String', this.currentValue) ?
      this.currentValue.trim() :
      this.currentValue;

    if (newValue.length < 1 && newValue === `${currentValue} `) {
      return 0;
    }

    // If new value matches the desired length and is not the same as the current value with a space
    const haystack = this.store.getSearchableChoices();
    const needle = newValue;
    const keys = isType('Array', this.config.searchFields) ?
      this.config.searchFields :
      [this.config.searchFields];
    const options = Object.assign(this.config.fuseOptions, { keys });
    const fuse = new Fuse(haystack, options);
    const results = fuse.search(needle);

    this.currentValue = newValue;
    this.highlightPosition = 0;
    this.isSearching = true;
    this.store.dispatch(filterChoices(results));

    return results.length;
  }

  /**
   * Determine the action when a user is searching
   * @param  {String} value Value entered by user
   * @return
   * @private
   */
  _handleSearch(value) {
    if (!value || !this.input.isFocussed) {
      return;
    }

    const choices = this.store.getChoices();
    const hasUnactiveChoices = choices.some(option => !option.active);

    // Check that we have a value to search and the input was an alphanumeric character
    if (value && value.length >= this.config.searchFloor) {
      const resultCount = this.config.searchChoices ? this._searchChoices(value) : 0;
      // Trigger search event
      this.passedElement.triggerEvent(EVENTS.search, {
        value,
        resultCount,
      });
    } else if (hasUnactiveChoices) {
      // Otherwise reset choices to active
      this.isSearching = false;
      this.store.dispatch(activateChoices(true));
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
      this.containerOuter.element.addEventListener('focus', this._onFocus);
      this.containerOuter.element.addEventListener('blur', this._onBlur);
    }

    this.input.element.addEventListener('focus', this._onFocus);
    this.input.element.addEventListener('blur', this._onBlur);

    this.input.addEventListeners();
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
      this.containerOuter.element.removeEventListener('focus', this._onFocus);
      this.containerOuter.element.removeEventListener('blur', this._onBlur);
    }

    this.input.element.removeEventListener('focus', this._onFocus);
    this.input.element.removeEventListener('blur', this._onBlur);

    this.input.removeEventListeners();
  }

  /**
   * Key down event
   * @param  {Object} e Event
   * @return
   */
  _onKeyDown(e) {
    if (e.target !== this.input.element && !this.containerOuter.element.contains(e.target)) {
      return;
    }

    const target = e.target;
    const activeItems = this.store.getItemsFilteredByActive();
    const hasFocusedInput = this.input.isFocussed;
    const hasActiveDropdown = this.dropdown.isActive;
    const hasItems = this.itemList.hasChildren;
    const keyString = String.fromCharCode(e.keyCode);
    const backKey = KEY_CODES.BACK_KEY;
    const deleteKey = KEY_CODES.DELETE_KEY;
    const enterKey = KEY_CODES.ENTER_KEY;
    const aKey = KEY_CODES.A_KEY;
    const escapeKey = KEY_CODES.ESC_KEY;
    const upKey = KEY_CODES.UP_KEY;
    const downKey = KEY_CODES.DOWN_KEY;
    const pageUpKey = KEY_CODES.PAGE_UP_KEY;
    const pageDownKey = KEY_CODES.PAGE_DOWN_KEY;
    const ctrlDownKey = (e.ctrlKey || e.metaKey);

    // If a user is typing and the dropdown is not active
    if (!this.isTextElement && /[a-zA-Z0-9-_ ]/.test(keyString)) {
      this.showDropdown(true);
    }

    this.canSearch = this.config.searchEnabled;

    const onAKey = () => {
      // If CTRL + A or CMD + A have been pressed and there are items to select
      if (ctrlDownKey && hasItems) {
        this.canSearch = false;
        if (
          this.config.removeItems &&
          !this.input.getValue() &&
          this.input.element === document.activeElement
        ) {
          // Highlight items
          this.highlightAll();
        }
      }
    };

    const onEnterKey = () => {
      // If enter key is pressed and the input has a value
      if (this.isTextElement && target.value) {
        const value = this.input.getValue();
        const canAddItem = this._canAddItem(activeItems, value);

        // All is good, add
        if (canAddItem.response) {
          this.hideDropdown();
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
        const highlighted = this.dropdown.getChild(`.${this.config.classNames.highlightedState}`);

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
        this.showDropdown(true);
        e.preventDefault();
      }
    };

    const onEscapeKey = () => {
      if (hasActiveDropdown) {
        this.hideDropdown();
        this.containerOuter.focus();
      }
    };

    const onDirectionKey = () => {
      // If up or down key is pressed, traverse through options
      if (hasActiveDropdown || this.isSelectOneElement) {
        // Show dropdown if focus
        this.showDropdown(true);

        this.canSearch = false;

        const directionInt = e.keyCode === downKey || e.keyCode === pageDownKey ? 1 : -1;
        const skipKey = e.metaKey || e.keyCode === pageDownKey || e.keyCode === pageUpKey;

        let nextEl;
        if (skipKey) {
          if (directionInt > 0) {
            nextEl = Array.from(
              this.dropdown.element.querySelectorAll('[data-choice-selectable]'),
            ).pop();
          } else {
            nextEl = this.dropdown.element.querySelector('[data-choice-selectable]');
          }
        } else {
          const currentEl = this.dropdown.element.querySelector(
            `.${this.config.classNames.highlightedState}`,
          );
          if (currentEl) {
            nextEl = getAdjacentEl(currentEl, '[data-choice-selectable]', directionInt);
          } else {
            nextEl = this.dropdown.element.querySelector('[data-choice-selectable]');
          }
        }

        if (nextEl) {
          // We prevent default to stop the cursor moving
          // when pressing the arrow
          if (!isScrolledIntoView(nextEl, this.choiceList.element, directionInt)) {
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
    if (e.target !== this.input.element) {
      return;
    }

    const value = this.input.getValue();
    const activeItems = this.store.getItemsFilteredByActive();
    const canAddItem = this._canAddItem(activeItems, value);

    // We are typing into a text input and have a value, we want to show a dropdown
    // notice. Otherwise hide the dropdown
    if (this.isTextElement) {
      if (value) {
        if (canAddItem.notice) {
          const dropdownItem = this._getTemplate('notice', canAddItem.notice);
          this.dropdown.element.innerHTML = dropdownItem.outerHTML;
        }

        if (canAddItem.response === true) {
          this.showDropdown();
        } else if (!canAddItem.notice) {
          this.hideDropdown();
        }
      } else {
        this.hideDropdown();
      }
    } else {
      const backKey = KEY_CODES.BACK_KEY;
      const deleteKey = KEY_CODES.DELETE_KEY;

      // If user has removed value...
      if ((e.keyCode === backKey || e.keyCode === deleteKey) && !e.target.value) {
        // ...and it is a multiple select input, activate choices (if searching)
        if (!this.isTextElement && this.isSearching) {
          this.isSearching = false;
          this.store.dispatch(activateChoices(true));
        }
      } else if (this.canSearch && canAddItem.response) {
        this._handleSearch(this.input.getValue());
      }
    }
    // Re-establish canSearch value from changes in _onKeyDown
    this.canSearch = this.config.searchEnabled;
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
    const target = (e.target || e.touches[0].target);

    // If a user tapped within our container...
    if (this.wasTap === true && this.containerOuter.element.contains(target)) {
      // ...and we aren't dealing with a single select box, show dropdown/focus input
      if (
        (target === this.containerOuter.element || target === this.containerInner.element) &&
        !this.isSelectOneElement
      ) {
        if (this.isTextElement) {
          // If text element, we only want to focus the input
          this.input.focus();
        } else {
            // If a select box, we want to show the dropdown
          this.showDropdown(true);
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

    if (this.containerOuter.element.contains(target) && target !== this.input.element) {
      const activeItems = this.store.getItemsFilteredByActive();
      const hasShiftKey = e.shiftKey;

      const buttonTarget = findAncestorByAttrName(target, 'data-button');
      const itemTarget = findAncestorByAttrName(target, 'data-item');
      const choiceTarget = findAncestorByAttrName(target, 'data-choice');

      if (buttonTarget) {
        this._handleButtonAction(activeItems, buttonTarget);
      } else if (itemTarget) {
        this._handleItemAction(activeItems, itemTarget, hasShiftKey);
      } else if (choiceTarget) {
        this._handleChoiceAction(activeItems, choiceTarget);
      }

      e.preventDefault();
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
    const targetWithinDropdown = (
      e.target === this.dropdown || this.dropdown.element.contains(e.target)
    );
    const shouldHighlightChoice = targetWithinDropdown && e.target.hasAttribute('data-choice');

    if (shouldHighlightChoice) {
      this._highlightChoice(e.target);
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
    const hasActiveDropdown = this.dropdown.isActive;
    const activeItems = this.store.getItemsFilteredByActive();

    // If target is something that concerns us
    if (this.containerOuter.element.contains(target)) {
      if (!hasActiveDropdown) {
        if (this.isTextElement) {
          if (document.activeElement !== this.input.element) {
            this.input.focus();
          }
        } else if (this.canSearch) {
          this.showDropdown(true);
        } else {
          this.showDropdown();
          // code smell
          this.containerOuter.focus();
        }
      } else if (
        this.isSelectOneElement &&
        target !== this.input.element &&
        !this.dropdown.element.contains(target)
      ) {
        this.hideDropdown(true);
      }
    } else {
      const hasHighlightedItems = activeItems.some(item => item.highlighted);

      // De-select any highlighted items
      if (hasHighlightedItems) {
        this.unhighlightAll();
      }

      // Remove focus state
      this.containerOuter.removeFocusState();

      // Close all other dropdowns
      this.hideDropdown();
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
    if (!this.containerOuter.element.contains(target)) {
      return;
    }

    const focusActions = {
      text: () => {
        if (target === this.input.element) {
          this.containerOuter.addFocusState();
        }
      },
      'select-one': () => {
        this.containerOuter.addFocusState();
        if (target === this.input.element) {
          // Show dropdown if it isn't already showing
          this.showDropdown();
        }
      },
      'select-multiple': () => {
        if (target === this.input.element) {
          // If element is a select box, the focused element is the container and the dropdown
          // isn't already open, focus and show dropdown
          this.containerOuter.addFocusState();
          this.showDropdown(true);
        }
      },
    };

    focusActions[this.passedElement.element.type]();
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
    if (this.containerOuter.element.contains(target) && !this.isScrollingOnIe) {
      const activeItems = this.store.getItemsFilteredByActive();
      const hasHighlightedItems = activeItems.some(item => item.highlighted);
      const blurActions = {
        text: () => {
          if (target === this.input.element) {
            // Remove the focus state
            this.containerOuter.removeFocusState();
            // De-select any highlighted items
            if (hasHighlightedItems) {
              this.unhighlightAll();
            }
            this.hideDropdown();
          }
        },
        'select-one': () => {
          this.containerOuter.removeFocusState();
          if (target === this.input.element ||
            (target === this.containerOuter.element && !this.canSearch)) {
            this.hideDropdown();
          }
        },
        'select-multiple': () => {
          if (target === this.input.element) {
            // Remove the focus state
            this.containerOuter.removeFocusState();
            this.hideDropdown();
            // De-select any highlighted items
            if (hasHighlightedItems) {
              this.unhighlightAll();
            }
          }
        },
      };

      blurActions[this.passedElement.element.type]();
    } else {
      // On IE11, clicking the scollbar blurs our input and thus
      // closes the dropdown. To stop this, we refocus our input
      // if we know we are on IE *and* are scrolling.
      this.isScrollingOnIe = false;
      this.input.element.focus();
    }
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

    const dropdownHeight = this.choiceList.element.offsetHeight;
    const choiceHeight = choice.offsetHeight;
    // Distance from bottom of element to top of parent
    const choicePos = choice.offsetTop + choiceHeight;
    // Scroll position of dropdown
    const containerScrollPos = this.choiceList.element.scrollTop + dropdownHeight;
    // Difference between the choice and scroll position
    const endPoint = direction > 0 ? (
      (this.choiceList.element.scrollTop + choicePos) - containerScrollPos
    ) : choice.offsetTop;

    const animateScroll = () => {
      const strength = SCROLLING_SPEED;
      const choiceListScrollTop = this.choiceList.element.scrollTop;
      let continueAnimation = false;
      let easing;
      let distance;

      if (direction > 0) {
        easing = (endPoint - choiceListScrollTop) / strength;
        distance = easing > 1 ? easing : 1;

        this.choiceList.scrollTo(choiceListScrollTop + distance);
        if (choiceListScrollTop < endPoint) {
          continueAnimation = true;
        }
      } else {
        easing = (choiceListScrollTop - endPoint) / strength;
        distance = easing > 1 ? easing : 1;

        this.choiceList.scrollTo(choiceListScrollTop - distance);
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
    const choices = Array.from(this.dropdown.element.querySelectorAll('[data-choice-selectable]'));

    if (!choices.length) {
      return;
    }

    let passedEl = el;
    const highlightedChoices = Array.from(
      this.dropdown.element.querySelectorAll(`.${this.config.classNames.highlightedState}`),
    );
    const hasActiveDropdown = this.dropdown.isActive;

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

    if (hasActiveDropdown) {
      // IE11 ignores aria-label and blocks virtual keyboard
      // if aria-activedescendant is set without a dropdown
      this.input.setActiveDescendant(passedEl.id);
      this.containerOuter.setActiveDescendant(passedEl.id);
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
  _addItem(
    value,
    label = null,
    choiceId = -1,
    groupId = -1,
    customProperties = null,
    placeholder = false,
    keyCode = null,
  ) {
    let passedValue = isType('String', value) ? value.trim() : value;
    const passedKeyCode = keyCode;
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
        passedKeyCode,
      ),
    );

    if (this.isSelectOneElement) {
      this.removeActiveItems(id);
    }

    // Trigger change event
    if (group && group.value) {
      this.passedElement.triggerEvent(EVENTS.addItem, {
        id,
        value: passedValue,
        label: passedLabel,
        groupValue: group.value,
        keyCode: passedKeyCode,
      });
    } else {
      this.passedElement.triggerEvent(EVENTS.addItem, {
        id,
        value: passedValue,
        label: passedLabel,
        keyCode: passedKeyCode,
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

    const { id, value, label, choiceId, groupId } = item;
    const group = groupId >= 0 ? this.store.getGroupById(groupId) : null;

    this.store.dispatch(removeItem(id, choiceId));

    if (group && group.value) {
      this.passedElement.triggerEvent(EVENTS.removeItem, {
        id,
        value,
        label,
        groupValue: group.value,
      });
    } else {
      this.passedElement.triggerEvent(EVENTS.removeItem, {
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
  _addChoice(
    value,
    label = null,
    isSelected = false,
    isDisabled = false,
    groupId = -1,
    customProperties = null,
    placeholder = false,
    keyCode = null,
  ) {
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
        keyCode,
      ),
    );

    if (isSelected) {
      this._addItem(
        value,
        choiceLabel,
        choiceId,
        undefined,
        customProperties,
        placeholder,
        keyCode,
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
      clearChoices(),
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
    const groupChoices = isType('Object', group) ?
      group.choices :
      Array.from(group.getElementsByTagName('OPTION'));
    const groupId = id || Math.floor(new Date().valueOf() * Math.random());
    const isDisabled = group.disabled ? group.disabled : false;

    if (groupChoices) {
      this.store.dispatch(
        addGroup(
          group.label,
          groupId,
          true,
          isDisabled,
        ),
      );

      const addGroupChoices = (choice) => {
        const isOptDisabled = choice.disabled || (choice.parentNode && choice.parentNode.disabled);
        this._addChoice(
          choice[valueKey],
          (isType('Object', choice)) ? choice[labelKey] : choice.innerHTML,
          choice.selected,
          isOptDisabled,
          groupId,
          choice.customProperties,
          choice.placeholder,
        );
      };

      groupChoices.forEach(addGroupChoices);
    } else {
      this.store.dispatch(
        addGroup(
          group.label,
          group.id,
          false,
          group.disabled,
        ),
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
    const globalClasses = this.config.classNames;
    return templates[template].call(this, globalClasses, ...args);
  }

  /**
   * Create HTML element based on type and arguments
   * @return
   * @private
   */
  _createTemplates() {
    // User's custom templates
    const callbackTemplate = this.config.callbackOnCreateTemplates;
    let userTemplates = {};
    if (callbackTemplate && isType('Function', callbackTemplate)) {
      userTemplates = callbackTemplate.call(this, strToEl);
    }

    this.config.templates = extend(TEMPLATES, userTemplates);
  }

  /**
   * Create DOM structure around passed select element
   * @return
   * @private
   */
  _createStructure() {
    const direction = this.passedElement.element.getAttribute('dir') || 'ltr';
    const containerOuter = this._getTemplate('containerOuter',
      direction,
      this.isSelectElement,
      this.isSelectOneElement,
      this.config.searchEnabled,
      this.passedElement.element.type,
    );
    const containerInner = this._getTemplate('containerInner');
    const itemList = this._getTemplate('itemList', this.isSelectOneElement);
    const choiceList = this._getTemplate('choiceList', this.isSelectOneElement);
    const input = this._getTemplate('input');
    const dropdown = this._getTemplate('dropdown');

    this.containerOuter = new Container(this, containerOuter, this.config.classNames);
    this.containerInner = new Container(this, containerInner, this.config.classNames);
    this.input = new Input(this, input, this.config.classNames);
    this.choiceList = new List(this, choiceList, this.config.classNames);
    this.itemList = new List(this, itemList, this.config.classNames);
    this.dropdown = new Dropdown(this, dropdown, this.config.classNames);

    this.passedElement.conceal();

    // Wrap input in container preserving DOM ordering
    this.containerInner.wrap(this.passedElement.element);
    // Wrapper inner container with outer container
    this.containerOuter.wrap(this.containerInner.element);

    if (this.isSelectOneElement) {
      this.input.setPlaceholder(this.config.searchPlaceholderValue || '');
    } else if (this.placeholder) {
      this.input.setPlaceholder(this.placeholder);
      this.input.setWidth(true);
    }

    if (!this.config.addItems) {
      this.disable();
    }

    this.containerOuter.element.appendChild(this.containerInner.element);
    this.containerOuter.element.appendChild(this.dropdown.element);
    this.containerInner.element.appendChild(itemList);

    if (!this.isTextElement) {
      dropdown.appendChild(choiceList);
    }

    if (!this.isSelectOneElement) {
      this.containerInner.element.appendChild(this.input.element);
    } else if (this.canSearch) {
      dropdown.insertBefore(input, dropdown.firstChild);
    }

    if (this.isSelectElement) {
      this._addPredefinedChoices();
    } else if (this.isTextElement) {
      this._addPredefinedItems();
    }
  }

  _addPredefinedChoices() {
    const passedGroups = this.passedElement.getOptionGroups();

    this.highlightPosition = 0;
    this.isSearching = false;

    if (passedGroups && passedGroups.length) {
      // If we have a placeholder option
      const placeholderChoice = this.passedElement.getPlaceholderOption();
      if (placeholderChoice && placeholderChoice.parentNode.tagName === 'SELECT') {
        this._addChoice(
          placeholderChoice.value,
          placeholderChoice.innerHTML,
          placeholderChoice.selected,
          placeholderChoice.disabled,
          undefined,
          undefined,
            /* placeholder */ true,
        );
      }

      passedGroups.forEach((group) => {
        this._addGroup(group, (group.id || null));
      });
    } else {
      const passedOptions = this.passedElement.getOptions();
      const filter = this.config.sortFn;
      const allChoices = this.presetChoices;

      // Create array of options from option elements
      passedOptions.forEach((o) => {
        allChoices.push({
          value: o.value,
          label: o.innerHTML,
          selected: o.selected,
          disabled: o.disabled || o.parentNode.disabled,
          placeholder: o.hasAttribute('placeholder'),
        });
      });

      // If sorting is enabled or the user is searching, filter choices
      if (this.config.shouldSort) {
        allChoices.sort(filter);
      }

      // Determine whether there is a selected choice
      const hasSelectedChoice = allChoices.some(choice => choice.selected);
      const handleChoice = (choice, index) => {
        if (this.isSelectElement) {
          // If the choice is actually a group
          if (choice.choices) {
            this._addGroup(choice, choice.id || null);
          } else {
            // If there is a selected choice already or the choice is not
            // the first in the array, add each choice normally
            // Otherwise pre-select the first choice in the array if it's a single select
            const shouldPreselect = this.isSelectOneElement && !hasSelectedChoice && index === 0;
            const isSelected = shouldPreselect ? true : choice.selected;
            const isDisabled = shouldPreselect ? false : choice.disabled;

            this._addChoice(
              choice.value,
              choice.label,
              isSelected,
              isDisabled,
              undefined,
              choice.customProperties,
              choice.placeholder,
            );
          }
        } else {
          this._addChoice(
            choice.value,
            choice.label,
            choice.selected,
            choice.disabled,
            undefined,
            choice.customProperties,
            choice.placeholder,
          );
        }
      };

      // Add each choice
      allChoices.forEach((choice, index) => handleChoice(choice, index));
    }
  }

  _addPredefinedItems() {
    const handlePresetItem = (item) => {
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
          item.placeholder,
        );
      } else if (itemType === 'String') {
        this._addItem(item);
      }
    };

    this.presetItems.forEach(item => handlePresetItem(item));
  }

  _setChoiceOrItem(item) {
    const itemType = getType(item).toLowerCase();
    const handleType = {
      object: () => {
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
            false, -1,
            item.customProperties,
            item.placeholder,
          );
        } else {
          this._addItem(
            item.value,
            item.label,
            item.id,
            undefined,
            item.customProperties,
            item.placeholder,
          );
        }
      },
      string: () => {
        if (!this.isTextElement) {
          this._addChoice(
            item,
            item,
            true,
            false, -1,
            null,
          );
        } else {
          this._addItem(item);
        }
      },
    };

    handleType[itemType]();
  }

  _findAndSelectChoiceByValue(val) {
    const choices = this.store.getChoices();
    // Check 'value' property exists and the choice isn't already selected
    const foundChoice = choices.find(choice => this.config.itemComparer(choice.value, val));

    if (foundChoice && !foundChoice.selected) {
      this._addItem(
        foundChoice.value,
        foundChoice.label,
        foundChoice.id,
        foundChoice.groupId,
        foundChoice.customProperties,
        foundChoice.placeholder,
        foundChoice.keyCode,
      );
    }
  }

  /* =====  End of Private functions  ====== */
}

Choices.userDefaults = {};

// We cannot export default here due to Webpack: https://github.com/webpack/webpack/issues/3929
module.exports = Choices;
