import Fuse from 'fuse.js';
import merge from 'deepmerge';

import './lib/delegate-events';
import Store from './store/store';
import {
  Dropdown,
  Container,
  Input,
  List,
  WrappedInput,
  WrappedSelect,
} from './components';
import { DEFAULT_CONFIG, EVENTS, KEY_CODES } from './constants';
import { TEMPLATES } from './templates';
import {
  addChoice,
  filterChoices,
  activateChoices,
  clearChoices,
} from './actions/choices';
import { addItem, removeItem, highlightItem } from './actions/items';
import { addGroup } from './actions/groups';
import { clearAll, resetTo } from './actions/misc';
import { setIsLoading } from './actions/general';
import {
  isScrolledIntoView,
  getAdjacentEl,
  getType,
  isType,
  strToEl,
  sortByScore,
  generateId,
  findAncestorByAttrName,
  fetchFromObject,
  isIE11,
  existsInArray,
  cloneObject,
  diff,
} from './lib/utils';

/**
 * Choices
 * @author Josh Johnson<josh@joshuajohnson.co.uk>
 */
class Choices {
  constructor(element = '[data-choice]', userConfig = {}) {
    if (isType('String', element)) {
      const elements = Array.from(document.querySelectorAll(element));

      // If there are multiple elements, create a new instance
      // for each element besides the first one (as that already has an instance)
      if (elements.length > 1) {
        return this._generateInstances(elements, userConfig);
      }
    }

    this.config = merge.all(
      [DEFAULT_CONFIG, Choices.userDefaults, userConfig],
      // When merging array configs, replace with a copy of the userConfig array,
      // instead of concatenating with the default array
      { arrayMerge: (destinationArray, sourceArray) => [...sourceArray] },
    );

    const invalidConfigOptions = diff(this.config, DEFAULT_CONFIG);
    if (invalidConfigOptions.length) {
      console.warn(
        'Unknown config option(s) passed',
        invalidConfigOptions.join(', '),
      );
    }

    if (!['auto', 'always'].includes(this.config.renderSelectedChoices)) {
      this.config.renderSelectedChoices = 'auto';
    }

    // Retrieve triggering element (i.e. element with 'data-choice' trigger)
    const passedElement = isType('String', element)
      ? document.querySelector(element)
      : element;

    if (!passedElement) {
      if (!this.config.silent) {
        console.error(
          'Could not find passed element or passed element was of an invalid type',
        );
      }

      return;
    }

    this._isTextElement = passedElement.type === 'text';
    this._isSelectOneElement = passedElement.type === 'select-one';
    this._isSelectMultipleElement = passedElement.type === 'select-multiple';
    this._isSelectElement =
      this._isSelectOneElement || this._isSelectMultipleElement;

    if (this._isTextElement) {
      this.passedElement = new WrappedInput({
        element: passedElement,
        classNames: this.config.classNames,
        delimiter: this.config.delimiter,
      });
    } else if (this._isSelectElement) {
      this.passedElement = new WrappedSelect({
        element: passedElement,
        classNames: this.config.classNames,
        template: data => this.config.templates.option(data),
      });
    }

    if (!this.passedElement) {
      return console.error('Passed element was of an invalid type');
    }

    this.initialised = false;

    this._store = new Store(this.render);
    this._initialState = {};
    this._currentState = {};
    this._prevState = {};
    this._currentValue = '';
    this._canSearch = this.config.searchEnabled;
    this._isScrollingOnIe = false;
    this._highlightPosition = 0;
    this._wasTap = true;
    this._placeholderValue = this._generatePlaceholderValue();
    this._baseId = generateId(this.passedElement.element, 'choices-');
    this._direction = this.passedElement.element.getAttribute('dir') || 'ltr';
    this._idNames = {
      itemChoice: 'item-choice',
    };
    // Assign preset choices from passed object
    this._presetChoices = this.config.choices;
    // Assign preset items from passed object first
    this._presetItems = this.config.items;
    // Then add any values passed from attribute
    if (this.passedElement.value) {
      this._presetItems = this._presetItems.concat(
        this.passedElement.value.split(this.config.delimiter),
      );
    }

    this._render = this._render.bind(this);
    this._onFocus = this._onFocus.bind(this);
    this._onBlur = this._onBlur.bind(this);
    this._onKeyUp = this._onKeyUp.bind(this);
    this._onKeyDown = this._onKeyDown.bind(this);
    this._onClick = this._onClick.bind(this);
    this._onTouchMove = this._onTouchMove.bind(this);
    this._onTouchEnd = this._onTouchEnd.bind(this);
    this._onMouseDown = this._onMouseDown.bind(this);
    this._onMouseOver = this._onMouseOver.bind(this);
    this._onFormReset = this._onFormReset.bind(this);
    this._onAKey = this._onAKey.bind(this);
    this._onEnterKey = this._onEnterKey.bind(this);
    this._onEscapeKey = this._onEscapeKey.bind(this);
    this._onDirectionKey = this._onDirectionKey.bind(this);
    this._onDeleteKey = this._onDeleteKey.bind(this);

    if (!this.config.silent) {
      if (this.config.shouldSortItems === true && this._isSelectOneElement) {
        console.warn(
          "shouldSortElements: Type of passed element is 'select-one', falling back to false.",
        );
      }

      // If element has already been initialised with Choices, fail silently
      if (this.passedElement.element.getAttribute('data-choice') === 'active') {
        console.warn(
          'Trying to initialise Choices on element already initialised',
        );
      }
    }

    // Let's go
    this.init();
  }

  /* ========================================
  =            Public functions            =
  ======================================== */

  init() {
    if (this.initialised) {
      return;
    }

    this._createTemplates();
    this._createElements();
    this._createStructure();

    // Set initial state (We need to clone the state because some reducers
    // modify the inner objects properties in the state) 🤢
    this._initialState = cloneObject(this._store.state);
    this._store.subscribe(this._render);
    this._render();
    this._addEventListeners();

    const shouldDisable =
      !this.config.addItems ||
      this.passedElement.element.hasAttribute('disabled');

    if (shouldDisable) {
      this.disable();
    }

    this.initialised = true;

    const { callbackOnInit } = this.config;
    // Run callback if it is a function
    if (callbackOnInit && isType('Function', callbackOnInit)) {
      callbackOnInit.call(this);
    }
  }

  destroy() {
    if (!this.initialised) {
      return;
    }

    this._removeEventListeners();
    this.passedElement.reveal();
    this.containerOuter.unwrap(this.passedElement.element);

    if (this._isSelectElement) {
      this.passedElement.options = this._presetChoices;
    }

    this.clearStore();

    this.config.templates = null;
    this.initialised = false;
  }

  enable() {
    if (this.passedElement.isDisabled) {
      this.passedElement.enable();
    }

    if (this.containerOuter.isDisabled) {
      this._addEventListeners();
      this.input.enable();
      this.containerOuter.enable();
    }

    return this;
  }

  disable() {
    if (!this.passedElement.isDisabled) {
      this.passedElement.disable();
    }

    if (!this.containerOuter.isDisabled) {
      this._removeEventListeners();
      this.input.disable();
      this.containerOuter.disable();
    }

    return this;
  }

  highlightItem(item, runEvent = true) {
    if (!item) {
      return this;
    }

    const { id, groupId = -1, value = '', label = '' } = item;
    const group = groupId >= 0 ? this._store.getGroupById(groupId) : null;

    this._store.dispatch(highlightItem(id, true));

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

  unhighlightItem(item) {
    if (!item) {
      return this;
    }

    const { id, groupId = -1, value = '', label = '' } = item;
    const group = groupId >= 0 ? this._store.getGroupById(groupId) : null;

    this._store.dispatch(highlightItem(id, false));
    this.passedElement.triggerEvent(EVENTS.highlightItem, {
      id,
      value,
      label,
      groupValue: group && group.value ? group.value : null,
    });

    return this;
  }

  highlightAll() {
    this._store.items.forEach(item => this.highlightItem(item));
    return this;
  }

  unhighlightAll() {
    this._store.items.forEach(item => this.unhighlightItem(item));
    return this;
  }

  removeActiveItemsByValue(value) {
    this._store.activeItems
      .filter(item => item.value === value)
      .forEach(item => this._removeItem(item));

    return this;
  }

  removeActiveItems(excludedId) {
    this._store.activeItems
      .filter(({ id }) => id !== excludedId)
      .forEach(item => this._removeItem(item));

    return this;
  }

  removeHighlightedItems(runEvent = false) {
    this._store.highlightedActiveItems.forEach(item => {
      this._removeItem(item);
      // If this action was performed by the user
      // trigger the event
      if (runEvent) {
        this._triggerChange(item.value);
      }
    });

    return this;
  }

  showDropdown(preventInputFocus) {
    if (this.dropdown.isActive) {
      return this;
    }

    requestAnimationFrame(() => {
      this.dropdown.show();
      this.containerOuter.open(this.dropdown.distanceFromTopWindow());

      if (!preventInputFocus && this._canSearch) {
        this.input.focus();
      }

      this.passedElement.triggerEvent(EVENTS.showDropdown, {});
    });

    return this;
  }

  hideDropdown(preventInputBlur) {
    if (!this.dropdown.isActive) {
      return this;
    }

    requestAnimationFrame(() => {
      this.dropdown.hide();
      this.containerOuter.close();

      if (!preventInputBlur && this._canSearch) {
        this.input.removeActiveDescendant();
        this.input.blur();
      }

      this.passedElement.triggerEvent(EVENTS.hideDropdown, {});
    });

    return this;
  }

  getValue(valueOnly = false) {
    const values = this._store.activeItems.reduce((selectedItems, item) => {
      const itemValue = valueOnly ? item.value : item;
      selectedItems.push(itemValue);
      return selectedItems;
    }, []);

    return this._isSelectOneElement ? values[0] : values;
  }

  setValue(args) {
    if (!this.initialised) {
      return this;
    }

    [...args].forEach(value => this._setChoiceOrItem(value));
    return this;
  }

  setChoiceByValue(value) {
    if (!this.initialised || this._isTextElement) {
      return this;
    }

    // If only one value has been passed, convert to array
    const choiceValue = isType('Array', value) ? value : [value];

    // Loop through each value and
    choiceValue.forEach(val => this._findAndSelectChoiceByValue(val));

    return this;
  }

  setChoices(choices = [], value = '', label = '', replaceChoices = false) {
    if (!this._isSelectElement || !value) {
      return this;
    }

    // Clear choices if needed
    if (replaceChoices) {
      this.clearChoices();
    }

    this.containerOuter.removeLoadingState();
    const addGroupsAndChoices = groupOrChoice => {
      if (groupOrChoice.choices) {
        this._addGroup({
          group: groupOrChoice,
          id: groupOrChoice.id || null,
          valueKey: value,
          labelKey: label,
        });
      } else {
        this._addChoice({
          value: groupOrChoice[value],
          label: groupOrChoice[label],
          isSelected: groupOrChoice.selected,
          isDisabled: groupOrChoice.disabled,
          customProperties: groupOrChoice.customProperties,
          placeholder: groupOrChoice.placeholder,
        });
      }
    };

    this._setLoading(true);
    choices.forEach(addGroupsAndChoices);
    this._setLoading(false);

    return this;
  }

  clearChoices() {
    this._store.dispatch(clearChoices());
  }

  clearStore() {
    this._store.dispatch(clearAll());
    return this;
  }

  clearInput() {
    const shouldSetInputWidth = !this._isSelectOneElement;
    this.input.clear(shouldSetInputWidth);

    if (!this._isTextElement && this._canSearch) {
      this._isSearching = false;
      this._store.dispatch(activateChoices(true));
    }

    return this;
  }

  ajax(fn) {
    if (!this.initialised || !this._isSelectElement || !fn) {
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

  _render() {
    if (this._store.isLoading()) {
      return;
    }

    this._currentState = this._store.state;

    const stateChanged =
      this._currentState.choices !== this._prevState.choices ||
      this._currentState.groups !== this._prevState.groups ||
      this._currentState.items !== this._prevState.items;
    const shouldRenderChoices = this._isSelectElement;
    const shouldRenderItems =
      this._currentState.items !== this._prevState.items;

    if (!stateChanged) {
      return;
    }

    if (shouldRenderChoices) {
      this._renderChoices();
    }

    if (shouldRenderItems) {
      this._renderItems();
    }

    this._prevState = this._currentState;
  }

  _renderChoices() {
    const { activeGroups, activeChoices } = this._store;
    let choiceListFragment = document.createDocumentFragment();

    this.choiceList.clear();

    if (this.config.resetScrollPosition) {
      requestAnimationFrame(() => this.choiceList.scrollToTop());
    }

    // If we have grouped options
    if (activeGroups.length >= 1 && !this._isSearching) {
      // If we have a placeholder choice along with groups
      const activePlaceholders = activeChoices.filter(
        activeChoice =>
          activeChoice.placeholder === true && activeChoice.groupId === -1,
      );
      if (activePlaceholders.length >= 1) {
        choiceListFragment = this._createChoicesFragment(
          activePlaceholders,
          choiceListFragment,
        );
      }
      choiceListFragment = this._createGroupsFragment(
        activeGroups,
        activeChoices,
        choiceListFragment,
      );
    } else if (activeChoices.length >= 1) {
      choiceListFragment = this._createChoicesFragment(
        activeChoices,
        choiceListFragment,
      );
    }

    // If we have choices to show
    if (
      choiceListFragment.childNodes &&
      choiceListFragment.childNodes.length > 0
    ) {
      const { activeItems } = this._store;
      const canAddItem = this._canAddItem(activeItems, this.input.value);

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

      if (this._isSearching) {
        notice = isType('Function', this.config.noResultsText)
          ? this.config.noResultsText()
          : this.config.noResultsText;

        dropdownItem = this._getTemplate('notice', notice, 'no-results');
      } else {
        notice = isType('Function', this.config.noChoicesText)
          ? this.config.noChoicesText()
          : this.config.noChoicesText;

        dropdownItem = this._getTemplate('notice', notice, 'no-choices');
      }

      this.choiceList.append(dropdownItem);
    }
  }

  _renderItems() {
    const activeItems = this._store.activeItems || [];
    this.itemList.clear();

    // Create a fragment to store our list items
    // (so we don't have to update the DOM for each item)
    const itemListFragment = this._createItemsFragment(activeItems);

    // If we have items to add, append them
    if (itemListFragment.childNodes) {
      this.itemList.append(itemListFragment);
    }
  }

  _createGroupsFragment(groups, choices, fragment) {
    const groupFragment = fragment || document.createDocumentFragment();
    const getGroupChoices = group =>
      choices.filter(choice => {
        if (this._isSelectOneElement) {
          return choice.groupId === group.id;
        }
        return (
          choice.groupId === group.id &&
          (this.config.renderSelectedChoices === 'always' || !choice.selected)
        );
      });

    // If sorting is enabled, filter groups
    if (this.config.shouldSort) {
      groups.sort(this.config.sortFn);
    }

    groups.forEach(group => {
      const groupChoices = getGroupChoices(group);
      if (groupChoices.length >= 1) {
        const dropdownGroup = this._getTemplate('choiceGroup', group);
        groupFragment.appendChild(dropdownGroup);
        this._createChoicesFragment(groupChoices, groupFragment, true);
      }
    });

    return groupFragment;
  }

  _createChoicesFragment(choices, fragment, withinGroup = false) {
    // Create a fragment to store our list items (so we don't have to update the DOM for each item)
    const choicesFragment = fragment || document.createDocumentFragment();
    const {
      renderSelectedChoices,
      searchResultLimit,
      renderChoiceLimit,
    } = this.config;
    const filter = this._isSearching ? sortByScore : this.config.sortFn;
    const appendChoice = choice => {
      const shouldRender =
        renderSelectedChoices === 'auto'
          ? this._isSelectOneElement || !choice.selected
          : true;
      if (shouldRender) {
        const dropdownItem = this._getTemplate(
          'choice',
          choice,
          this.config.itemSelectText,
        );
        choicesFragment.appendChild(dropdownItem);
      }
    };

    let rendererableChoices = choices;

    if (renderSelectedChoices === 'auto' && !this._isSelectOneElement) {
      rendererableChoices = choices.filter(choice => !choice.selected);
    }

    // Split array into placeholders and "normal" choices
    const { placeholderChoices, normalChoices } = rendererableChoices.reduce(
      (acc, choice) => {
        if (choice.placeholder) {
          acc.placeholderChoices.push(choice);
        } else {
          acc.normalChoices.push(choice);
        }
        return acc;
      },
      { placeholderChoices: [], normalChoices: [] },
    );

    // If sorting is enabled or the user is searching, filter choices
    if (this.config.shouldSort || this._isSearching) {
      normalChoices.sort(filter);
    }

    let choiceLimit = rendererableChoices.length;

    // Prepend placeholeder
    const sortedChoices = [...placeholderChoices, ...normalChoices];

    if (this._isSearching) {
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

  _createItemsFragment(items, fragment = null) {
    // Create fragment to add elements to
    const { shouldSortItems, sortFn, removeItemButton } = this.config;
    const itemListFragment = fragment || document.createDocumentFragment();

    // If sorting is enabled, filter items
    if (shouldSortItems && !this._isSelectOneElement) {
      items.sort(sortFn);
    }

    if (this._isTextElement) {
      // Update the value of the hidden input
      this.passedElement.value = items;
    } else {
      // Update the options of the hidden input
      this.passedElement.options = items;
    }

    const addItemToFragment = item => {
      // Create new list element
      const listItem = this._getTemplate('item', item, removeItemButton);
      // Append it to list
      itemListFragment.appendChild(listItem);
    };

    // Add each list item to list
    items.forEach(item => addItemToFragment(item));

    return itemListFragment;
  }

  _triggerChange(value) {
    if (value === undefined || value === null) {
      return;
    }

    this.passedElement.triggerEvent(EVENTS.change, {
      value,
    });
  }

  _selectPlaceholderChoice() {
    const { placeholderChoice } = this._store;

    if (placeholderChoice) {
      this._addItem({
        value: placeholderChoice.value,
        label: placeholderChoice.label,
        choiceId: placeholderChoice.id,
        groupId: placeholderChoice.groupId,
        placeholder: placeholderChoice.placeholder,
      });

      this._triggerChange(placeholderChoice.value);
    }
  }

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
    const itemToRemove = activeItems.find(
      item => item.id === parseInt(itemId, 10),
    );

    // Remove item associated with button
    this._removeItem(itemToRemove);
    this._triggerChange(itemToRemove.value);

    if (this._isSelectOneElement) {
      this._selectPlaceholderChoice();
    }
  }

  _handleItemAction(activeItems, element, hasShiftKey = false) {
    if (
      !activeItems ||
      !element ||
      !this.config.removeItems ||
      this._isSelectOneElement
    ) {
      return;
    }

    const passedId = element.getAttribute('data-id');

    // We only want to select one item with a click
    // so we deselect any items that aren't the target
    // unless shift is being pressed
    activeItems.forEach(item => {
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

  _handleChoiceAction(activeItems, element) {
    if (!activeItems || !element) {
      return;
    }

    // If we are clicking on an option
    const id = element.getAttribute('data-id');
    const choice = this._store.getChoiceById(id);
    const passedKeyCode =
      activeItems[0] && activeItems[0].keyCode ? activeItems[0].keyCode : null;
    const hasActiveDropdown = this.dropdown.isActive;

    // Update choice keyCode
    choice.keyCode = passedKeyCode;

    this.passedElement.triggerEvent(EVENTS.choice, {
      choice,
    });

    if (choice && !choice.selected && !choice.disabled) {
      const canAddItem = this._canAddItem(activeItems, choice.value);

      if (canAddItem.response) {
        this._addItem({
          value: choice.value,
          label: choice.label,
          choiceId: choice.id,
          groupId: choice.groupId,
          customProperties: choice.customProperties,
          placeholder: choice.placeholder,
          keyCode: choice.keyCode,
        });

        this._triggerChange(choice.value);
      }
    }

    this.clearInput();

    // We wont to close the dropdown if we are dealing with a single select box
    if (hasActiveDropdown && this._isSelectOneElement) {
      this.hideDropdown(true);
      this.containerOuter.focus();
    }
  }

  _handleBackspace(activeItems) {
    if (!this.config.removeItems || !activeItems) {
      return;
    }

    const lastItem = activeItems[activeItems.length - 1];
    const hasHighlightedItems = activeItems.some(item => item.highlighted);

    // If editing the last item is allowed and there are not other selected items,
    // we can edit the item value. Otherwise if we can remove items, remove all selected items
    if (this.config.editItems && !hasHighlightedItems && lastItem) {
      this.input.value = lastItem.value;
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

  _setLoading(isLoading) {
    this._store.dispatch(setIsLoading(isLoading));
  }

  _handleLoadingState(setLoading = true) {
    let placeholderItem = this.itemList.getChild(
      `.${this.config.classNames.placeholder}`,
    );

    if (setLoading) {
      this.disable();
      this.containerOuter.addLoadingState();

      if (this._isSelectOneElement) {
        if (!placeholderItem) {
          placeholderItem = this._getTemplate(
            'placeholder',
            this.config.loadingText,
          );
          this.itemList.append(placeholderItem);
        } else {
          placeholderItem.innerHTML = this.config.loadingText;
        }
      } else {
        this.input.placeholder = this.config.loadingText;
      }
    } else {
      this.enable();
      this.containerOuter.removeLoadingState();

      if (this._isSelectOneElement) {
        placeholderItem.innerHTML = this._placeholderValue || '';
      } else {
        this.input.placeholder = this._placeholderValue || '';
      }
    }
  }

  _handleSearch(value) {
    if (!value || !this.input.isFocussed) {
      return;
    }

    const { choices } = this._store;
    const { searchFloor, searchChoices } = this.config;
    const hasUnactiveChoices = choices.some(option => !option.active);

    // Check that we have a value to search and the input was an alphanumeric character
    if (value && value.length >= searchFloor) {
      const resultCount = searchChoices ? this._searchChoices(value) : 0;
      // Trigger search event
      this.passedElement.triggerEvent(EVENTS.search, {
        value,
        resultCount,
      });
    } else if (hasUnactiveChoices) {
      // Otherwise reset choices to active
      this._isSearching = false;
      this._store.dispatch(activateChoices(true));
    }
  }

  _canAddItem(activeItems, value) {
    let canAddItem = true;
    let notice = isType('Function', this.config.addItemText)
      ? this.config.addItemText(value)
      : this.config.addItemText;

    if (!this._isSelectOneElement) {
      const isDuplicateValue = existsInArray(activeItems, value);

      if (
        this.config.maxItemCount > 0 &&
        this.config.maxItemCount <= activeItems.length
      ) {
        // If there is a max entry limit and we have reached that limit
        // don't update
        canAddItem = false;
        notice = isType('Function', this.config.maxItemText)
          ? this.config.maxItemText(this.config.maxItemCount)
          : this.config.maxItemText;
      }

      if (
        !this.config.duplicateItemsAllowed &&
        isDuplicateValue &&
        canAddItem
      ) {
        canAddItem = false;
        notice = isType('Function', this.config.uniqueItemText)
          ? this.config.uniqueItemText(value)
          : this.config.uniqueItemText;
      }

      if (
        this._isTextElement &&
        this.config.addItems &&
        canAddItem &&
        isType('Function', this.config.addItemFilterFn) &&
        !this.config.addItemFilterFn(value)
      ) {
        canAddItem = false;
        notice = isType('Function', this.config.customAddItemText)
          ? this.config.customAddItemText(value)
          : this.config.customAddItemText;
      }
    }

    return {
      response: canAddItem,
      notice,
    };
  }

  _ajaxCallback() {
    return (results, value, label) => {
      if (!results || !value) {
        return;
      }

      const parsedResults = isType('Object', results) ? [results] : results;

      if (
        parsedResults &&
        isType('Array', parsedResults) &&
        parsedResults.length
      ) {
        // Remove loading states/text
        this._handleLoadingState(false);
        this._setLoading(true);
        // Add each result as a choice
        parsedResults.forEach(result => {
          if (result.choices) {
            this._addGroup({
              group: result,
              id: result.id || null,
              valueKey: value,
              labelKey: label,
            });
          } else {
            this._addChoice({
              value: fetchFromObject(result, value),
              label: fetchFromObject(result, label),
              isSelected: result.selected,
              isDisabled: result.disabled,
              customProperties: result.customProperties,
              placeholder: result.placeholder,
            });
          }
        });

        this._setLoading(false);

        if (this._isSelectOneElement) {
          this._selectPlaceholderChoice();
        }
      } else {
        // No results, remove loading state
        this._handleLoadingState(false);
      }
    };
  }

  _searchChoices(value) {
    const newValue = isType('String', value) ? value.trim() : value;
    const currentValue = isType('String', this._currentValue)
      ? this._currentValue.trim()
      : this._currentValue;

    if (newValue.length < 1 && newValue === `${currentValue} `) {
      return 0;
    }

    // If new value matches the desired length and is not the same as the current value with a space
    const haystack = this._store.searchableChoices;
    const needle = newValue;
    const keys = [...this.config.searchFields];
    const options = Object.assign(this.config.fuseOptions, { keys });
    const fuse = new Fuse(haystack, options);
    const results = fuse.search(needle);

    this._currentValue = newValue;
    this._highlightPosition = 0;
    this._isSearching = true;
    this._store.dispatch(filterChoices(results));

    return results.length;
  }

  _addEventListeners() {
    window.delegateEvent.add('keyup', this._onKeyUp);
    window.delegateEvent.add('keydown', this._onKeyDown);
    window.delegateEvent.add('click', this._onClick);
    window.delegateEvent.add('touchmove', this._onTouchMove);
    window.delegateEvent.add('touchend', this._onTouchEnd);
    window.delegateEvent.add('mousedown', this._onMouseDown);
    window.delegateEvent.add('mouseover', this._onMouseOver);

    if (this._isSelectOneElement) {
      this.containerOuter.element.addEventListener('focus', this._onFocus);
      this.containerOuter.element.addEventListener('blur', this._onBlur);
    }

    this.input.element.addEventListener('focus', this._onFocus);
    this.input.element.addEventListener('blur', this._onBlur);

    if (this.input.element.form) {
      this.input.element.form.addEventListener('reset', this._onFormReset);
    }

    this.input.addEventListeners();
  }

  _removeEventListeners() {
    window.delegateEvent.remove('keyup', this._onKeyUp);
    window.delegateEvent.remove('keydown', this._onKeyDown);
    window.delegateEvent.remove('click', this._onClick);
    window.delegateEvent.remove('touchmove', this._onTouchMove);
    window.delegateEvent.remove('touchend', this._onTouchEnd);
    window.delegateEvent.remove('mousedown', this._onMouseDown);
    window.delegateEvent.remove('mouseover', this._onMouseOver);

    if (this._isSelectOneElement) {
      this.containerOuter.element.removeEventListener('focus', this._onFocus);
      this.containerOuter.element.removeEventListener('blur', this._onBlur);
    }

    this.input.element.removeEventListener('focus', this._onFocus);
    this.input.element.removeEventListener('blur', this._onBlur);

    if (this.input.element.form) {
      this.input.element.form.removeEventListener('reset', this._onFormReset);
    }

    this.input.removeEventListeners();
  }

  _onKeyDown(event) {
    const { target, keyCode, ctrlKey, metaKey } = event;

    if (
      target !== this.input.element &&
      !this.containerOuter.element.contains(target)
    ) {
      return;
    }

    const { activeItems } = this._store;
    const hasFocusedInput = this.input.isFocussed;
    const hasActiveDropdown = this.dropdown.isActive;
    const hasItems = this.itemList.hasChildren;
    const keyString = String.fromCharCode(keyCode);

    const {
      BACK_KEY,
      DELETE_KEY,
      ENTER_KEY,
      A_KEY,
      ESC_KEY,
      UP_KEY,
      DOWN_KEY,
      PAGE_UP_KEY,
      PAGE_DOWN_KEY,
    } = KEY_CODES;
    const hasCtrlDownKeyPressed = ctrlKey || metaKey;

    // If a user is typing and the dropdown is not active
    if (!this._isTextElement && /[a-zA-Z0-9-_ ]/.test(keyString)) {
      this.showDropdown();
    }

    // Map keys to key actions
    const keyDownActions = {
      [A_KEY]: this._onAKey,
      [ENTER_KEY]: this._onEnterKey,
      [ESC_KEY]: this._onEscapeKey,
      [UP_KEY]: this._onDirectionKey,
      [PAGE_UP_KEY]: this._onDirectionKey,
      [DOWN_KEY]: this._onDirectionKey,
      [PAGE_DOWN_KEY]: this._onDirectionKey,
      [DELETE_KEY]: this._onDeleteKey,
      [BACK_KEY]: this._onDeleteKey,
    };

    // If keycode has a function, run it
    if (keyDownActions[keyCode]) {
      keyDownActions[keyCode]({
        event,
        target,
        keyCode,
        metaKey,
        activeItems,
        hasFocusedInput,
        hasActiveDropdown,
        hasItems,
        hasCtrlDownKeyPressed,
      });
    }
  }

  _onKeyUp({ target, keyCode }) {
    if (target !== this.input.element) {
      return;
    }

    const { value } = this.input;
    const { activeItems } = this._store;
    const canAddItem = this._canAddItem(activeItems, value);
    const { BACK_KEY: backKey, DELETE_KEY: deleteKey } = KEY_CODES;

    // We are typing into a text input and have a value, we want to show a dropdown
    // notice. Otherwise hide the dropdown
    if (this._isTextElement) {
      const canShowDropdownNotice = canAddItem.notice && value;
      if (canShowDropdownNotice) {
        const dropdownItem = this._getTemplate('notice', canAddItem.notice);
        this.dropdown.element.innerHTML = dropdownItem.outerHTML;
        this.showDropdown(true);
      } else {
        this.hideDropdown(true);
      }
    } else {
      const userHasRemovedValue =
        (keyCode === backKey || keyCode === deleteKey) && !target.value;
      const canReactivateChoices = !this._isTextElement && this._isSearching;
      const canSearch = this._canSearch && canAddItem.response;

      if (userHasRemovedValue && canReactivateChoices) {
        this._isSearching = false;
        this._store.dispatch(activateChoices(true));
      } else if (canSearch) {
        this._handleSearch(this.input.value);
      }
    }

    this._canSearch = this.config.searchEnabled;
  }

  _onAKey({ hasItems, hasCtrlDownKeyPressed }) {
    // If CTRL + A or CMD + A have been pressed and there are items to select
    if (hasCtrlDownKeyPressed && hasItems) {
      this._canSearch = false;

      const shouldHightlightAll =
        this.config.removeItems &&
        !this.input.value &&
        this.input.element === document.activeElement;

      if (shouldHightlightAll) {
        this.highlightAll();
      }
    }
  }

  _onEnterKey({ event, target, activeItems, hasActiveDropdown }) {
    const { ENTER_KEY: enterKey } = KEY_CODES;
    const targetWasButton = target.hasAttribute('data-button');

    if (this._isTextElement && target.value) {
      const { value } = this.input;
      const canAddItem = this._canAddItem(activeItems, value);

      if (canAddItem.response) {
        this.hideDropdown(true);
        this._addItem({ value });
        this._triggerChange(value);
        this.clearInput();
      }
    }

    if (targetWasButton) {
      this._handleButtonAction(activeItems, target);
      event.preventDefault();
    }

    if (hasActiveDropdown) {
      const highlightedChoice = this.dropdown.getChild(
        `.${this.config.classNames.highlightedState}`,
      );

      if (highlightedChoice) {
        // add enter keyCode value
        if (activeItems[0]) {
          activeItems[0].keyCode = enterKey; // eslint-disable-line no-param-reassign
        }
        this._handleChoiceAction(activeItems, highlightedChoice);
      }

      event.preventDefault();
    } else if (this._isSelectOneElement) {
      this.showDropdown();
      event.preventDefault();
    }
  }

  _onEscapeKey({ hasActiveDropdown }) {
    if (hasActiveDropdown) {
      this.hideDropdown(true);
      this.containerOuter.focus();
    }
  }

  _onDirectionKey({ event, hasActiveDropdown, keyCode, metaKey }) {
    const {
      DOWN_KEY: downKey,
      PAGE_UP_KEY: pageUpKey,
      PAGE_DOWN_KEY: pageDownKey,
    } = KEY_CODES;

    // If up or down key is pressed, traverse through options
    if (hasActiveDropdown || this._isSelectOneElement) {
      this.showDropdown();
      this._canSearch = false;

      const directionInt =
        keyCode === downKey || keyCode === pageDownKey ? 1 : -1;
      const skipKey =
        metaKey || keyCode === pageDownKey || keyCode === pageUpKey;
      const selectableChoiceIdentifier = '[data-choice-selectable]';

      let nextEl;
      if (skipKey) {
        if (directionInt > 0) {
          nextEl = Array.from(
            this.dropdown.element.querySelectorAll(selectableChoiceIdentifier),
          ).pop();
        } else {
          nextEl = this.dropdown.element.querySelector(
            selectableChoiceIdentifier,
          );
        }
      } else {
        const currentEl = this.dropdown.element.querySelector(
          `.${this.config.classNames.highlightedState}`,
        );
        if (currentEl) {
          nextEl = getAdjacentEl(
            currentEl,
            selectableChoiceIdentifier,
            directionInt,
          );
        } else {
          nextEl = this.dropdown.element.querySelector(
            selectableChoiceIdentifier,
          );
        }
      }

      if (nextEl) {
        // We prevent default to stop the cursor moving
        // when pressing the arrow
        if (
          !isScrolledIntoView(nextEl, this.choiceList.element, directionInt)
        ) {
          this.choiceList.scrollToChoice(nextEl, directionInt);
        }
        this._highlightChoice(nextEl);
      }

      // Prevent default to maintain cursor position whilst
      // traversing dropdown options
      event.preventDefault();
    }
  }

  _onDeleteKey({ event, target, hasFocusedInput, activeItems }) {
    // If backspace or delete key is pressed and the input has no value
    if (hasFocusedInput && !target.value && !this._isSelectOneElement) {
      this._handleBackspace(activeItems);
      event.preventDefault();
    }
  }

  _onTouchMove() {
    if (this._wasTap) {
      this._wasTap = false;
    }
  }

  _onTouchEnd(event) {
    const { target } = event || event.touches[0];
    const touchWasWithinContainer =
      this._wasTap && this.containerOuter.element.contains(target);

    if (touchWasWithinContainer) {
      const containerWasExactTarget =
        target === this.containerOuter.element ||
        target === this.containerInner.element;

      if (containerWasExactTarget) {
        if (this._isTextElement) {
          this.input.focus();
        } else if (this._isSelectMultipleElement) {
          this.showDropdown();
        }
      }

      // Prevents focus event firing
      event.stopPropagation();
    }

    this._wasTap = true;
  }

  _onMouseDown(event) {
    const { target, shiftKey } = event;
    // If we have our mouse down on the scrollbar and are on IE11...
    if (this.choiceList.element.contains(target) && isIE11()) {
      this._isScrollingOnIe = true;
    }

    if (
      !this.containerOuter.element.contains(target) ||
      target === this.input.element
    ) {
      return;
    }

    const { activeItems } = this._store;
    const hasShiftKey = shiftKey;
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

    event.preventDefault();
  }

  _onMouseOver({ target }) {
    const targetWithinDropdown =
      target === this.dropdown || this.dropdown.element.contains(target);
    const shouldHighlightChoice =
      targetWithinDropdown && target.hasAttribute('data-choice');

    if (shouldHighlightChoice) {
      this._highlightChoice(target);
    }
  }

  _onClick({ target }) {
    const clickWasWithinContainer = this.containerOuter.element.contains(
      target,
    );

    if (clickWasWithinContainer) {
      if (!this.dropdown.isActive && !this.containerOuter.isDisabled) {
        if (this._isTextElement) {
          if (document.activeElement !== this.input.element) {
            this.input.focus();
          }
        } else {
          this.showDropdown();
          this.containerOuter.focus();
        }
      } else if (
        this._isSelectOneElement &&
        target !== this.input.element &&
        !this.dropdown.element.contains(target)
      ) {
        this.hideDropdown();
      }
    } else {
      const hasHighlightedItems = this._store.highlightedActiveItems.length > 0;

      if (hasHighlightedItems) {
        this.unhighlightAll();
      }

      this.containerOuter.removeFocusState();
      this.hideDropdown(true);
    }
  }

  _onFocus({ target }) {
    const focusWasWithinContainer = this.containerOuter.element.contains(
      target,
    );

    if (!focusWasWithinContainer) {
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
          this.showDropdown(true);
        }
      },
      'select-multiple': () => {
        if (target === this.input.element) {
          this.showDropdown(true);
          // If element is a select box, the focused element is the container and the dropdown
          // isn't already open, focus and show dropdown
          this.containerOuter.addFocusState();
        }
      },
    };

    focusActions[this.passedElement.element.type]();
  }

  _onBlur({ target }) {
    const blurWasWithinContainer = this.containerOuter.element.contains(target);

    if (blurWasWithinContainer && !this._isScrollingOnIe) {
      const { activeItems } = this._store;
      const hasHighlightedItems = activeItems.some(item => item.highlighted);
      const blurActions = {
        text: () => {
          if (target === this.input.element) {
            this.containerOuter.removeFocusState();
            if (hasHighlightedItems) {
              this.unhighlightAll();
            }
            this.hideDropdown(true);
          }
        },
        'select-one': () => {
          this.containerOuter.removeFocusState();
          if (
            target === this.input.element ||
            (target === this.containerOuter.element && !this._canSearch)
          ) {
            this.hideDropdown(true);
          }
        },
        'select-multiple': () => {
          if (target === this.input.element) {
            this.containerOuter.removeFocusState();
            this.hideDropdown(true);
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
      this._isScrollingOnIe = false;
      this.input.element.focus();
    }
  }

  _onFormReset() {
    this._store.dispatch(resetTo(this._initialState));
  }

  _highlightChoice(el = null) {
    const choices = Array.from(
      this.dropdown.element.querySelectorAll('[data-choice-selectable]'),
    );

    if (!choices.length) {
      return;
    }

    let passedEl = el;
    const highlightedChoices = Array.from(
      this.dropdown.element.querySelectorAll(
        `.${this.config.classNames.highlightedState}`,
      ),
    );

    // Remove any highlighted choices
    highlightedChoices.forEach(choice => {
      choice.classList.remove(this.config.classNames.highlightedState);
      choice.setAttribute('aria-selected', 'false');
    });

    if (passedEl) {
      this._highlightPosition = choices.indexOf(passedEl);
    } else {
      // Highlight choice based on last known highlight location
      if (choices.length > this._highlightPosition) {
        // If we have an option to highlight
        passedEl = choices[this._highlightPosition];
      } else {
        // Otherwise highlight the option before
        passedEl = choices[choices.length - 1];
      }

      if (!passedEl) {
        passedEl = choices[0];
      }
    }

    passedEl.classList.add(this.config.classNames.highlightedState);
    passedEl.setAttribute('aria-selected', 'true');
    this.passedElement.triggerEvent(EVENTS.highlightChoice, { el: passedEl });

    if (this.dropdown.isActive) {
      // IE11 ignores aria-label and blocks virtual keyboard
      // if aria-activedescendant is set without a dropdown
      this.input.setActiveDescendant(passedEl.id);
      this.containerOuter.setActiveDescendant(passedEl.id);
    }
  }

  _addItem({
    value,
    label = null,
    choiceId = -1,
    groupId = -1,
    customProperties = null,
    placeholder = false,
    keyCode = null,
  }) {
    let passedValue = isType('String', value) ? value.trim() : value;

    const passedKeyCode = keyCode;
    const passedCustomProperties = customProperties;
    const { items } = this._store;
    const passedLabel = label || passedValue;
    const passedOptionId = parseInt(choiceId, 10) || -1;
    const group = groupId >= 0 ? this._store.getGroupById(groupId) : null;
    const id = items ? items.length + 1 : 1;

    // If a prepended value has been passed, prepend it
    if (this.config.prependValue) {
      passedValue = this.config.prependValue + passedValue.toString();
    }

    // If an appended value has been passed, append it
    if (this.config.appendValue) {
      passedValue += this.config.appendValue.toString();
    }

    this._store.dispatch(
      addItem({
        value: passedValue,
        label: passedLabel,
        id,
        choiceId: passedOptionId,
        groupId,
        customProperties,
        placeholder,
        keyCode: passedKeyCode,
      }),
    );

    if (this._isSelectOneElement) {
      this.removeActiveItems(id);
    }

    // Trigger change event
    this.passedElement.triggerEvent(EVENTS.addItem, {
      id,
      value: passedValue,
      label: passedLabel,
      customProperties: passedCustomProperties,
      groupValue: group && group.value ? group.value : undefined,
      keyCode: passedKeyCode,
    });

    return this;
  }

  _removeItem(item) {
    if (!item || !isType('Object', item)) {
      return this;
    }

    const { id, value, label, choiceId, groupId } = item;
    const group = groupId >= 0 ? this._store.getGroupById(groupId) : null;

    this._store.dispatch(removeItem(id, choiceId));

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

  _addChoice({
    value,
    label = null,
    isSelected = false,
    isDisabled = false,
    groupId = -1,
    customProperties = null,
    placeholder = false,
    keyCode = null,
  }) {
    if (typeof value === 'undefined' || value === null) {
      return;
    }

    // Generate unique id
    const { choices } = this._store;
    const choiceLabel = label || value;
    const choiceId = choices ? choices.length + 1 : 1;
    const choiceElementId = `${this._baseId}-${this._idNames.itemChoice}-${choiceId}`;

    this._store.dispatch(
      addChoice({
        value,
        label: choiceLabel,
        id: choiceId,
        groupId,
        disabled: isDisabled,
        elementId: choiceElementId,
        customProperties,
        placeholder,
        keyCode,
      }),
    );

    if (isSelected) {
      this._addItem({
        value,
        label: choiceLabel,
        choiceId,
        customProperties,
        placeholder,
        keyCode,
      });
    }
  }

  _addGroup({ group, id, valueKey = 'value', labelKey = 'label' }) {
    const groupChoices = isType('Object', group)
      ? group.choices
      : Array.from(group.getElementsByTagName('OPTION'));
    const groupId = id || Math.floor(new Date().valueOf() * Math.random());
    const isDisabled = group.disabled ? group.disabled : false;

    if (groupChoices) {
      this._store.dispatch(addGroup(group.label, groupId, true, isDisabled));

      const addGroupChoices = choice => {
        const isOptDisabled =
          choice.disabled || (choice.parentNode && choice.parentNode.disabled);

        this._addChoice({
          value: choice[valueKey],
          label: isType('Object', choice) ? choice[labelKey] : choice.innerHTML,
          isSelected: choice.selected,
          isDisabled: isOptDisabled,
          groupId,
          customProperties: choice.customProperties,
          placeholder: choice.placeholder,
        });
      };

      groupChoices.forEach(addGroupChoices);
    } else {
      this._store.dispatch(
        addGroup(group.label, group.id, false, group.disabled),
      );
    }
  }

  _getTemplate(template, ...args) {
    if (!template) {
      return null;
    }

    const { templates, classNames } = this.config;
    return templates[template].call(this, classNames, ...args);
  }

  _createTemplates() {
    const { callbackOnCreateTemplates } = this.config;
    let userTemplates = {};

    if (
      callbackOnCreateTemplates &&
      isType('Function', callbackOnCreateTemplates)
    ) {
      userTemplates = callbackOnCreateTemplates.call(this, strToEl);
    }

    this.config.templates = merge(TEMPLATES, userTemplates);
  }

  _createElements() {
    this.containerOuter = new Container({
      element: this._getTemplate(
        'containerOuter',
        this._direction,
        this._isSelectElement,
        this._isSelectOneElement,
        this.config.searchEnabled,
        this.passedElement.element.type,
      ),
      classNames: this.config.classNames,
      type: this.passedElement.element.type,
      position: this.config.position,
    });

    this.containerInner = new Container({
      element: this._getTemplate('containerInner'),
      classNames: this.config.classNames,
      type: this.passedElement.element.type,
      position: this.config.position,
    });

    this.input = new Input({
      element: this._getTemplate('input', this._placeholderValue),
      classNames: this.config.classNames,
      type: this.passedElement.element.type,
    });

    this.choiceList = new List({
      element: this._getTemplate('choiceList', this._isSelectOneElement),
    });

    this.itemList = new List({
      element: this._getTemplate('itemList', this._isSelectOneElement),
    });

    this.dropdown = new Dropdown({
      element: this._getTemplate('dropdown'),
      classNames: this.config.classNames,
      type: this.passedElement.element.type,
    });
  }

  _createStructure() {
    // Hide original element
    this.passedElement.conceal();
    // Wrap input in container preserving DOM ordering
    this.containerInner.wrap(this.passedElement.element);
    // Wrapper inner container with outer container
    this.containerOuter.wrap(this.containerInner.element);

    if (this._isSelectOneElement) {
      this.input.placeholder = this.config.searchPlaceholderValue || '';
    } else if (this._placeholderValue) {
      this.input.placeholder = this._placeholderValue;
      this.input.setWidth(true);
    }

    this.containerOuter.element.appendChild(this.containerInner.element);
    this.containerOuter.element.appendChild(this.dropdown.element);
    this.containerInner.element.appendChild(this.itemList.element);

    if (!this._isTextElement) {
      this.dropdown.element.appendChild(this.choiceList.element);
    }

    if (!this._isSelectOneElement) {
      this.containerInner.element.appendChild(this.input.element);
    } else if (this.config.searchEnabled) {
      this.dropdown.element.insertBefore(
        this.input.element,
        this.dropdown.element.firstChild,
      );
    }

    if (this._isSelectElement) {
      this._addPredefinedChoices();
    } else if (this._isTextElement) {
      this._addPredefinedItems();
    }
  }

  _addPredefinedChoices() {
    const passedGroups = this.passedElement.optionGroups;

    this._highlightPosition = 0;
    this._isSearching = false;
    this._setLoading(true);

    if (passedGroups && passedGroups.length) {
      // If we have a placeholder option
      const placeholderChoice = this.passedElement.placeholderOption;
      if (
        placeholderChoice &&
        placeholderChoice.parentNode.tagName === 'SELECT'
      ) {
        this._addChoice({
          value: placeholderChoice.value,
          label: placeholderChoice.innerHTML,
          isSelected: placeholderChoice.selected,
          isDisabled: placeholderChoice.disabled,
          placeholder: true,
        });
      }

      passedGroups.forEach(group =>
        this._addGroup({
          group,
          id: group.id || null,
        }),
      );
    } else {
      const passedOptions = this.passedElement.options;
      const filter = this.config.sortFn;
      const allChoices = this._presetChoices;

      // Create array of options from option elements
      passedOptions.forEach(o => {
        allChoices.push({
          value: o.value,
          label: o.innerHTML,
          selected: o.selected,
          disabled: o.disabled || o.parentNode.disabled,
          placeholder: o.hasAttribute('placeholder'),
          customProperties: o.getAttribute('data-custom-properties'),
        });
      });

      // If sorting is enabled or the user is searching, filter choices
      if (this.config.shouldSort) allChoices.sort(filter);

      // Determine whether there is a selected choice
      const hasSelectedChoice = allChoices.some(choice => choice.selected);
      const handleChoice = (choice, index) => {
        const { value, label, customProperties, placeholder } = choice;

        if (this._isSelectElement) {
          // If the choice is actually a group
          if (choice.choices) {
            this._addGroup({
              group: choice,
              id: choice.id || null,
            });
          } else {
            // If there is a selected choice already or the choice is not
            // the first in the array, add each choice normally
            // Otherwise pre-select the first choice in the array if it's a single select
            const shouldPreselect =
              this._isSelectOneElement && !hasSelectedChoice && index === 0;
            const isSelected = shouldPreselect ? true : choice.selected;
            const isDisabled = shouldPreselect ? false : choice.disabled;

            this._addChoice({
              value,
              label,
              isSelected,
              isDisabled,
              customProperties,
              placeholder,
            });
          }
        } else {
          this._addChoice({
            value,
            label,
            isSelected: choice.selected,
            isDisabled: choice.disabled,
            customProperties,
            placeholder,
          });
        }
      };

      // Add each choice
      allChoices.forEach((choice, index) => handleChoice(choice, index));
    }

    this._setLoading(false);
  }

  _addPredefinedItems() {
    const handlePresetItem = item => {
      const itemType = getType(item);
      if (itemType === 'Object' && item.value) {
        this._addItem({
          value: item.value,
          label: item.label,
          choiceId: item.id,
          customProperties: item.customProperties,
          placeholder: item.placeholder,
        });
      } else if (itemType === 'String') {
        this._addItem({
          value: item,
        });
      }
    };

    this._presetItems.forEach(item => handlePresetItem(item));
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
        if (!this._isTextElement) {
          this._addChoice({
            value: item.value,
            label: item.label,
            isSelected: true,
            isDisabled: false,
            customProperties: item.customProperties,
            placeholder: item.placeholder,
          });
        } else {
          this._addItem({
            value: item.value,
            label: item.label,
            choiceId: item.id,
            customProperties: item.customProperties,
            placeholder: item.placeholder,
          });
        }
      },
      string: () => {
        if (!this._isTextElement) {
          this._addChoice({
            value: item,
            label: item,
            isSelected: true,
            isDisabled: false,
          });
        } else {
          this._addItem({
            value: item,
          });
        }
      },
    };

    handleType[itemType]();
  }

  _findAndSelectChoiceByValue(val) {
    const { choices } = this._store;
    // Check 'value' property exists and the choice isn't already selected
    const foundChoice = choices.find(choice =>
      this.config.itemComparer(choice.value, val),
    );

    if (foundChoice && !foundChoice.selected) {
      this._addItem({
        value: foundChoice.value,
        label: foundChoice.label,
        choiceId: foundChoice.id,
        groupId: foundChoice.groupId,
        customProperties: foundChoice.customProperties,
        placeholder: foundChoice.placeholder,
        keyCode: foundChoice.keyCode,
      });
    }
  }

  _generateInstances(elements, config) {
    return elements.reduce(
      (instances, element) => {
        instances.push(new Choices(element, config));
        return instances;
      },
      [this],
    );
  }

  _generatePlaceholderValue() {
    if (this._isSelectOneElement) {
      return false;
    }

    return this.config.placeholder
      ? this.config.placeholderValue ||
          this.passedElement.element.getAttribute('placeholder')
      : false;
  }

  /* =====  End of Private functions  ====== */
}

Choices.userDefaults = {};

export default Choices;
