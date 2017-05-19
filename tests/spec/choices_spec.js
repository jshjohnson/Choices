import 'whatwg-fetch';
import 'es6-promise';
import Choices from '../../assets/scripts/src/choices.js';

if (typeof Object.assign != 'function') {
  Object.assign = function (target, varArgs) { // .length of function is 2
    if (target == null) { // TypeError if undefined or null
      throw new TypeError('Cannot convert undefined or null to object');
    }

    var to = Object(target);

    for (var index = 1; index < arguments.length; index++) {
      var nextSource = arguments[index];

      if (nextSource != null) { // Skip over if undefined or null
        for (var nextKey in nextSource) {
          // Avoid bugs when hasOwnProperty is shadowed
          if (Object.prototype.hasOwnProperty.call(nextSource, nextKey)) {
            to[nextKey] = nextSource[nextKey];
          }
        }
      }
    }
    return to;
  };
}

describe('Choices', () => {

  afterEach(function() {
    this.choices.destroy();
  });

  describe('should initialize Choices', () => {

    beforeEach(function() {
      this.input = document.createElement('input');
      this.input.type = 'text';
      this.input.className = 'js-choices';

      document.body.appendChild(this.input);
      this.choices = new Choices(this.input);
    });

    it('should be defined', function() {
      expect(this.choices).toBeDefined();
    });

    it('should have initalised', function() {
      expect(this.choices.initialised).toBe(true);
    });

    it('should not re-initialise if passed element again', function() {
      const reinitialise = new Choices(this.choices.passedElement);
      spyOn(reinitialise, '_createTemplates');
      expect(reinitialise._createTemplates).not.toHaveBeenCalled();
    })

    it('should have a blank state', function() {
      expect(this.choices.currentState.items.length).toEqual(0);
      expect(this.choices.currentState.groups.length).toEqual(0);
      expect(this.choices.currentState.choices.length).toEqual(0);
    });

    it('should have config options', function() {
      expect(this.choices.config.silent).toEqual(jasmine.any(Boolean));
      expect(this.choices.config.items).toEqual(jasmine.any(Array));
      expect(this.choices.config.choices).toEqual(jasmine.any(Array));
      expect(this.choices.config.maxItemCount).toEqual(jasmine.any(Number));
      expect(this.choices.config.addItems).toEqual(jasmine.any(Boolean));
      expect(this.choices.config.removeItems).toEqual(jasmine.any(Boolean));
      expect(this.choices.config.removeItemButton).toEqual(jasmine.any(Boolean));
      expect(this.choices.config.editItems).toEqual(jasmine.any(Boolean));
      expect(this.choices.config.duplicateItems).toEqual(jasmine.any(Boolean));
      expect(this.choices.config.delimiter).toEqual(jasmine.any(String));
      expect(this.choices.config.paste).toEqual(jasmine.any(Boolean));
      expect(this.choices.config.searchEnabled).toEqual(jasmine.any(Boolean));
      expect(this.choices.config.searchChoices).toEqual(jasmine.any(Boolean));
      expect(this.choices.config.searchFloor).toEqual(jasmine.any(Number));
      expect(this.choices.config.searchPlaceholderValue).toEqual(null);
      expect(this.choices.config.searchFields).toEqual(jasmine.any(Array) || jasmine.any(String));
      expect(this.choices.config.position).toEqual(jasmine.any(String));
      expect(this.choices.config.regexFilter).toEqual(null);
      expect(this.choices.config.sortFilter).toEqual(jasmine.any(Function));
      expect(this.choices.config.shouldSort).toEqual(jasmine.any(Boolean));
      expect(this.choices.config.placeholderValue).toEqual(null);
      expect(this.choices.config.prependValue).toEqual(null);
      expect(this.choices.config.appendValue).toEqual(null);
      expect(this.choices.config.loadingText).toEqual(jasmine.any(String));
      expect(this.choices.config.noResultsText).toEqual(jasmine.any(String));
      expect(this.choices.config.noChoicesText).toEqual(jasmine.any(String));
      expect(this.choices.config.itemSelectText).toEqual(jasmine.any(String));
      expect(this.choices.config.classNames).toEqual(jasmine.any(Object));
      expect(this.choices.config.callbackOnInit).toEqual(null);
      expect(this.choices.config.callbackOnCreateTemplates).toEqual(null);
    });

    it('should expose public methods', function() {
      expect(this.choices.init).toEqual(jasmine.any(Function));
      expect(this.choices.destroy).toEqual(jasmine.any(Function));
      expect(this.choices.render).toEqual(jasmine.any(Function));
      expect(this.choices.renderGroups).toEqual(jasmine.any(Function));
      expect(this.choices.renderItems).toEqual(jasmine.any(Function));
      expect(this.choices.renderChoices).toEqual(jasmine.any(Function));
      expect(this.choices.highlightItem).toEqual(jasmine.any(Function));
      expect(this.choices.unhighlightItem).toEqual(jasmine.any(Function));
      expect(this.choices.highlightAll).toEqual(jasmine.any(Function));
      expect(this.choices.unhighlightAll).toEqual(jasmine.any(Function));
      expect(this.choices.removeItemsByValue).toEqual(jasmine.any(Function));
      expect(this.choices.removeActiveItems).toEqual(jasmine.any(Function));
      expect(this.choices.removeHighlightedItems).toEqual(jasmine.any(Function));
      expect(this.choices.showDropdown).toEqual(jasmine.any(Function));
      expect(this.choices.hideDropdown).toEqual(jasmine.any(Function));
      expect(this.choices.toggleDropdown).toEqual(jasmine.any(Function));
      expect(this.choices.getValue).toEqual(jasmine.any(Function));
      expect(this.choices.setValue).toEqual(jasmine.any(Function));
      expect(this.choices.setValueByChoice).toEqual(jasmine.any(Function));
      expect(this.choices.setChoices).toEqual(jasmine.any(Function));
      expect(this.choices.disable).toEqual(jasmine.any(Function));
      expect(this.choices.enable).toEqual(jasmine.any(Function));
      expect(this.choices.ajax).toEqual(jasmine.any(Function));
      expect(this.choices.clearStore).toEqual(jasmine.any(Function));
      expect(this.choices.clearInput).toEqual(jasmine.any(Function));
    });

    it('should hide passed input', function() {
      expect(this.choices.passedElement.style.display).toEqual('none');
    });

    it('should create an outer container', function() {
      expect(this.choices.containerOuter).toEqual(jasmine.any(HTMLElement));
    });

    it('should create an inner container', function() {
      expect(this.choices.containerInner).toEqual(jasmine.any(HTMLElement));
    });

    it('should create a choice list', function() {
      expect(this.choices.choiceList).toEqual(jasmine.any(HTMLElement));
    });

    it('should create an item list', function() {
      expect(this.choices.itemList).toEqual(jasmine.any(HTMLElement));
    });

    it('should create an input', function() {
      expect(this.choices.input).toEqual(jasmine.any(HTMLElement));
    });

    it('should create a dropdown', function() {
      expect(this.choices.dropdown).toEqual(jasmine.any(HTMLElement));
    });
  });

  describe('should accept text inputs', function() {
    beforeEach(function() {
      this.input = document.createElement('input');
      this.input.type = 'text';
      this.input.className = 'js-choices';
      this.input.placeholder = 'Placeholder text';

      document.body.appendChild(this.input);
    });

    it('should accept a user inputted value', function() {
      this.choices = new Choices(this.input);

      this.choices.input.focus();
      this.choices.input.value = 'test';

      this.choices._onKeyDown({
        target: this.choices.input,
        keyCode: 13,
        ctrlKey: false
      });

      expect(this.choices.currentState.items[0].value).toContain(this.choices.input.value);
    });

    it('should copy the passed placeholder to the cloned input', function() {
      this.choices = new Choices(this.input);

      expect(this.choices.input.placeholder).toEqual(this.input.placeholder);
    });

    it('should not allow duplicates if duplicateItems is false', function() {
      this.choices = new Choices(this.input, {
        duplicateItems: false,
        items: ['test 1'],
      });

      this.choices.input.focus();
      this.choices.input.value = 'test 1';

      this.choices._onKeyDown({
        target: this.choices.input,
        keyCode: 13,
        ctrlKey: false
      });

      expect(this.choices.currentState.items[this.choices.currentState.items.length - 1]).not.toContain(this.choices.input.value);
    });

    it('should filter input if regexFilter is passed', function() {
      this.choices = new Choices(this.input, {
        regexFilter: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      });

      this.choices.input.focus();
      this.choices.input.value = 'josh@joshuajohnson.co.uk';

      this.choices._onKeyDown({
        target: this.choices.input,
        keyCode: 13,
        ctrlKey: false
      });

      this.choices.input.focus();
      this.choices.input.value = 'not an email address';

      this.choices._onKeyDown({
        target: this.choices.input,
        keyCode: 13,
        ctrlKey: false
      });

      const lastItem = this.choices.currentState.items[this.choices.currentState.items.length - 1];

      expect(lastItem.value).toEqual('josh@joshuajohnson.co.uk');
      expect(lastItem.value).not.toEqual('not an email address');
    });

    it('should prepend and append values if passed', function() {
      this.choices = new Choices(this.input, {
        prependValue: 'item-',
        appendValue: '-value',
      });

      this.choices.input.focus();
      this.choices.input.value = 'test';

      this.choices._onKeyDown({
        target: this.choices.input,
        keyCode: 13,
        ctrlKey: false
      });

      const lastItem = this.choices.currentState.items[this.choices.currentState.items.length - 1];

      expect(lastItem.value).not.toEqual('test');
      expect(lastItem.value).toEqual('item-test-value');
    });
  });

  describe('should accept single select inputs', function() {
    beforeEach(function() {
      this.input = document.createElement('select');
      this.input.className = 'js-choices';

      for (let i = 1; i < 4; i++) {
        const option = document.createElement('option');

        option.value = `Value ${i}`;
        option.innerHTML = `Label ${i}`;

        this.input.appendChild(option);
      }

      document.body.appendChild(this.input);
    });

    it('should open the choice list on focussing', function() {
      this.choices = new Choices(this.input);
      this.choices.input.focus();
      expect(this.choices.dropdown.classList).toContain(this.choices.config.classNames.activeState);
    });

    it('should select the first choice', function() {
      this.choices = new Choices(this.input);
      expect(this.choices.currentState.items[0].value).toContain('Value 1');
    });

    it('should highlight the choices on keydown', function() {
      this.choices = new Choices(this.input);
      this.choices.input.focus();

      for (var i = 0; i < 2; i++) {
        // Key down to third choice
        this.choices._onKeyDown({
          target: this.choices.input,
          keyCode: 40,
          ctrlKey: false,
          preventDefault: () => {}
        });
      }

      expect(this.choices.highlightPosition).toBe(2);
    });

    it('should select choice on enter key press', function() {
      this.choices = new Choices(this.input);
      this.choices.input.focus();

      // Key down to second choice
      this.choices._onKeyDown({
        target: this.choices.input,
        keyCode: 40,
        ctrlKey: false,
        preventDefault: () => {}
      });

      // Key down to select choice
      this.choices._onKeyDown({
        target: this.choices.input,
        keyCode: 13,
        ctrlKey: false,
        preventDefault: () => {}
      });

      expect(this.choices.currentState.items.length).toBe(2);
    });

    it('should trigger add/change event on selection', function() {
      this.choices = new Choices(this.input);

      const changeSpy = jasmine.createSpy('changeSpy');
      const addSpy = jasmine.createSpy('addSpy');
      const passedElement = this.choices.passedElement;

      passedElement.addEventListener('change', changeSpy);
      passedElement.addEventListener('addItem', addSpy);

      this.choices.input.focus();

      // Key down to second choice
      this.choices._onKeyDown({
        target: this.choices.input,
        keyCode: 40,
        ctrlKey: false,
        preventDefault: () => {}
      });

      // Key down to select choice
      this.choices._onKeyDown({
        target: this.choices.input,
        keyCode: 13,
        ctrlKey: false,
        preventDefault: () => {}
      });

      const returnValue = changeSpy.calls.mostRecent().args[0].detail.value;
      expect(returnValue).toEqual(jasmine.any(String));
      expect(changeSpy).toHaveBeenCalled();
      expect(addSpy).toHaveBeenCalled();
    });

    it('should open the dropdown on click', function() {
      this.choices = new Choices(this.input);
      const container = this.choices.containerOuter;
      this.choices._onClick({
        target: container,
        ctrlKey: false,
        preventDefault: () => {}
      });

      expect(document.activeElement === this.choices.input && container.classList.contains('is-open')).toBe(true);
    });

    it('should close the dropdown on double click', function() {
      this.choices = new Choices(this.input);
      const container = this.choices.containerOuter,
        openState = this.choices.config.classNames.openState;

      this.choices._onClick({
        target: container,
        ctrlKey: false,
        preventDefault: () => {}
      });

      this.choices._onClick({
        target: container,
        ctrlKey: false,
        preventDefault: () => {}
      });

      expect(document.activeElement === this.choices.input && container.classList.contains(openState)).toBe(false);
    });

    it('should trigger showDropdown on dropdown opening', function() {
      this.choices = new Choices(this.input);
      const container = this.choices.containerOuter;

      const showDropdownSpy = jasmine.createSpy('showDropdownSpy');
      const passedElement = this.choices.passedElement;

      passedElement.addEventListener('showDropdown', showDropdownSpy);

      this.choices.input.focus();

      this.choices._onClick({
        target: container,
        ctrlKey: false,
        preventDefault: () => {}
      });

      expect(showDropdownSpy).toHaveBeenCalled();
    });

    it('should trigger hideDropdown on dropdown closing', function() {
      this.choices = new Choices(this.input);
      const container = this.choices.containerOuter;

      const hideDropdownSpy = jasmine.createSpy('hideDropdownSpy');
      const passedElement = this.choices.passedElement;

      passedElement.addEventListener('hideDropdown', hideDropdownSpy);

      this.choices.input.focus();

      this.choices._onClick({
        target: container,
        ctrlKey: false,
        preventDefault: () => {}
      });

      this.choices._onClick({
        target: container,
        ctrlKey: false,
        preventDefault: () => {}
      });

      expect(hideDropdownSpy).toHaveBeenCalled();
    });

    it('should filter choices when searching', function() {
      this.choices = new Choices(this.input);

      const searchSpy = jasmine.createSpy('searchSpy');
      const passedElement = this.choices.passedElement;

      passedElement.addEventListener('search', searchSpy);

      this.choices.input.focus();
      this.choices.input.value = '3 ';

      // Key down to search
      this.choices._onKeyUp({
        target: this.choices.input,
        keyCode: 13,
        ctrlKey: false
      });

      const mostAccurateResult = this.choices.currentState.choices.filter(function (choice) {
        return choice.active;
      });

      expect(this.choices.isSearching && mostAccurateResult[0].value === 'Value 3').toBe(true);
      expect(searchSpy).toHaveBeenCalled();
    });

    it('shouldn\'t filter choices when searching', function() {
      this.choices = new Choices(this.input, {
        searchChoices: false
      });

      this.choices.setValue(['Javascript', 'HTML', 'Jasmine']);

      const searchSpy = jasmine.createSpy('searchSpy');
      const passedElement = this.choices.passedElement;

      passedElement.addEventListener('search', searchSpy);

      this.choices.input.focus();
      this.choices.input.value = 'Javascript';

      // Key down to search
      this.choices._onKeyUp({
        target: this.choices.input,
        keyCode: 13,
        ctrlKey: false
      });

      const activeOptions = this.choices.currentState.choices.filter(function (choice) {
        return choice.active;
      });

      expect(activeOptions.length).toEqual(this.choices.currentState.choices.length);
      expect(searchSpy).toHaveBeenCalled();
    });

    it('shouldn\'t sort choices if shouldSort is false', function() {
      this.choices = new Choices(this.input, {
        shouldSort: false,
        choices: [{
          value: 'Value 5',
          label: 'Label Five'
        }, {
          value: 'Value 6',
          label: 'Label Six'
        }, {
          value: 'Value 7',
          label: 'Label Seven'
        }, ],
      });

      expect(this.choices.currentState.choices[0].value).toEqual('Value 5');
    });

    it('should sort choices if shouldSort is false', function() {
      this.choices = new Choices(this.input, {
        shouldSort: true,
        choices: [{
          value: 'Value 5',
          label: 'Label Five'
        }, {
          value: 'Value 6',
          label: 'Label Six'
        }, {
          value: 'Value 7',
          label: 'Label Seven'
        }, ],
      });

      expect(this.choices.currentState.choices[0].value).toEqual('Value 1');
    });

    it('should set placeholder as first option if shouldSort true', function() {
      const option = document.createElement('option');
      option.setAttribute('selected', '');
      option.setAttribute('placeholder', '');
      option.setAttribute('disabled', '');
      option.innerHTML = 'Placeholder';
      this.input.appendChild(option);

      this.choices = new Choices(this.input, { shouldSort: true });
      expect(this.choices.currentState.choices[0].value).toEqual('Placeholder');
    });

    it('should set placeholder after click on remove item button', function() {
      const option = document.createElement('option');
      option.setAttribute('placeholder', '');
      option.setAttribute('disabled', '');
      option.innerHTML = 'Placeholder';
      this.input.appendChild(option);

      this.choices = new Choices(this.input, { removeItemButton: true });

      const removeItemButton = this.choices.containerOuter.querySelector('[data-button]');

      this.choices._onClick({
        target: removeItemButton,
        ctrlKey: false,
        preventDefault: () => {}
      });

      expect(this.choices.currentState.items[1].value).toBe('Placeholder');
      expect(this.choices.currentState.items[1].active).toBe(true);
    });
  });

  describe('should accept multiple select inputs', function() {
    beforeEach(function() {
      this.input = document.createElement('select');
      this.input.className = 'js-choices';
      this.input.setAttribute('multiple', '');

      for (let i = 1; i < 4; i++) {
        const option = document.createElement('option');

        option.value = `Value ${i}`;
        option.innerHTML = `Value ${i}`;

        if (i % 2) {
          option.selected = true;
        }

        this.input.appendChild(option);
      }

      document.body.appendChild(this.input);

      this.choices = new Choices(this.input, {
        placeholderValue: 'Placeholder text',
        preselectItem: true,
        choices: [{
          value: 'One',
          label: 'Label One',
          selected: true,
          disabled: false
        }, {
          value: 'Two',
          label: 'Label Two',
          disabled: true
        }, {
          value: 'Three',
          label: 'Label Three'
        }, ],
      });
    });

    it('should add any pre-defined values', function() {
      expect(this.choices.currentState.items.length).toBeGreaterThan(1);
    });

    it('should add options defined in the config + pre-defined options', function() {
      expect(this.choices.currentState.choices.length).toEqual(6);
    });

    it('should add a placeholder defined in the config to the search input', function() {
      expect(this.choices.input.placeholder).toEqual('Placeholder text');
    });
  });

  describe('should handle public methods on select input types', function() {
    beforeEach(function() {
      this.input = document.createElement('select');
      this.input.className = 'js-choices';
      this.input.multiple = true;
      this.input.placeholder = 'Placeholder text';

      for (let i = 1; i < 10; i++) {
        const option = document.createElement('option');

        option.value = `Value ${i}`;
        option.innerHTML = `Value ${i}`;

        if (i % 2) {
          option.selected = true;
        }

        this.input.appendChild(option);
      }

      document.body.appendChild(this.input);
      this.choices = new Choices(this.input);
    });

    it('should handle highlightItem()', function() {
      const items = this.choices.currentState.items;
      const randomItem = items[Math.floor(Math.random() * items.length)];

      this.choices.highlightItem(randomItem);

      expect(randomItem.highlighted).toBe(true);
    });

    it('should handle unhighlightItem()', function() {
      const items = this.choices.currentState.items;
      const randomItem = items[Math.floor(Math.random() * items.length)];

      this.choices.unhighlightItem(randomItem);

      expect(randomItem.highlighted).toBe(false);
    });

    it('should handle highlightAll()', function() {
      const items = this.choices.currentState.items;

      this.choices.highlightAll();

      const unhighlightedItems = items.some((item) => item.highlighted === false);

      expect(unhighlightedItems).toBe(false);
    });

    it('should handle unhighlightAll()', function() {
      const items = this.choices.currentState.items;

      this.choices.unhighlightAll();

      const highlightedItems = items.some((item) => item.highlighted === true);

      expect(highlightedItems).toBe(false);
    });

    it('should handle removeHighlightedItems()', function() {
      const items = this.choices.currentState.items;
      this.choices.highlightAll();
      this.choices.removeHighlightedItems();

      const activeItems = items.some((item) => item.active === true);

      expect(activeItems).toBe(false);
    });

    it('should handle showDropdown()', function() {
      this.choices.showDropdown();
      const hasOpenState = this.choices.containerOuter.classList.contains(this.choices.config.classNames.openState);
      const hasAttr = this.choices.containerOuter.getAttribute('aria-expanded') === 'true';
      const hasActiveState = this.choices.dropdown.classList.contains(this.choices.config.classNames.activeState);
      expect(hasOpenState && hasAttr && hasActiveState).toBe(true);
    });

    it('should handle hideDropdown()', function() {
      this.choices.showDropdown();
      this.choices.hideDropdown();
      const hasOpenState = this.choices.containerOuter.classList.contains(this.choices.config.classNames.openState);
      const hasAttr = this.choices.containerOuter.getAttribute('aria-expanded') === 'true';
      const hasActiveState = this.choices.dropdown.classList.contains(this.choices.config.classNames.activeState);

      expect(hasOpenState && hasAttr && hasActiveState).toBe(false);
    });

    it('should handle toggleDropdown()', function() {
      spyOn(this.choices, 'hideDropdown');
      this.choices.showDropdown();
      this.choices.toggleDropdown();
      expect(this.choices.hideDropdown).toHaveBeenCalled();
    });

    it('should handle hideDropdown()', function() {
      this.choices.showDropdown();
      expect(this.choices.containerOuter.classList).toContain(this.choices.config.classNames.openState);
    });

    it('should handle getValue()', function() {
      const valueObjects = this.choices.getValue();
      const valueStrings = this.choices.getValue(true);

      expect(valueStrings[0]).toEqual(jasmine.any(String));
      expect(valueObjects[0]).toEqual(jasmine.any(Object));
      expect(valueObjects).toEqual(jasmine.any(Array));
      expect(valueObjects.length).toEqual(5);
    });

    it('should handle setValue()', function() {
      this.choices.setValue(['Set value 1', 'Set value 2', 'Set value 3']);
      const valueStrings = this.choices.getValue(true);

      expect(valueStrings[valueStrings.length - 1]).toBe('Set value 3');
      expect(valueStrings[valueStrings.length - 2]).toBe('Set value 2');
      expect(valueStrings[valueStrings.length - 3]).toBe('Set value 1');
    });

    it('should handle setValueByChoice()', function() {
      const choices = this.choices.store.getChoicesFilteredByActive();
      const randomChoice = choices[Math.floor(Math.random() * choices.length)];

      this.choices.highlightAll();
      this.choices.removeHighlightedItems();
      this.choices.setValueByChoice(randomChoice.value);

      const value = this.choices.getValue(true);

      expect(value[0]).toBe(randomChoice.value);
    });

    it('should handle setChoices()', function() {
      this.choices.setChoices([{
        label: 'Group one',
        id: 1,
        disabled: false,
        choices: [{
          value: 'Child One',
          label: 'Child One',
          selected: true
        }, {
          value: 'Child Two',
          label: 'Child Two',
          disabled: true
        }, {
          value: 'Child Three',
          label: 'Child Three'
        }, ]
      }, {
        label: 'Group two',
        id: 2,
        disabled: false,
        choices: [{
          value: 'Child Four',
          label: 'Child Four',
          disabled: true
        }, {
          value: 'Child Five',
          label: 'Child Five'
        }, {
          value: 'Child Six',
          label: 'Child Six'
        }, ]
      }], 'value', 'label');


      const groups = this.choices.currentState.groups;
      const choices = this.choices.currentState.choices;

      expect(groups[groups.length - 1].value).toEqual('Group two');
      expect(groups[groups.length - 2].value).toEqual('Group one');
      expect(choices[choices.length - 1].value).toEqual('Child Six');
      expect(choices[choices.length - 2].value).toEqual('Child Five');
    });

    it('should handle setChoices() with blank values', function() {
      this.choices.setChoices([{
        label: 'Choice one',
        value: 'one'
      }, {
        label: 'Choice two',
        value: ''
      }], 'value', 'label', true);


      const choices = this.choices.currentState.choices;
      expect(choices[0].value).toEqual('one');
      expect(choices[1].value).toEqual('');
    });

    it('should handle clearStore()', function() {
      this.choices.clearStore();

      expect(this.choices.currentState.items).toEqual([]);
      expect(this.choices.currentState.choices).toEqual([]);
      expect(this.choices.currentState.groups).toEqual([]);
    });

    it('should handle disable()', function() {
      this.choices.disable();

      expect(this.choices.input.disabled).toBe(true);
      expect(this.choices.containerOuter.classList.contains(this.choices.config.classNames.disabledState)).toBe(true);
      expect(this.choices.containerOuter.getAttribute('aria-disabled')).toBe('true');
    });

    it('should handle enable()', function() {
      this.choices.enable();

      expect(this.choices.input.disabled).toBe(false);
      expect(this.choices.containerOuter.classList.contains(this.choices.config.classNames.disabledState)).toBe(false);
      expect(this.choices.containerOuter.hasAttribute('aria-disabled')).toBe(false);
    });

    it('should handle ajax()', function() {
      spyOn(this.choices, 'ajax');

      this.choices.ajax((callback) => {
        fetch('https://restcountries.eu/rest/v1/all')
          .then((response) => {
            response.json().then((data) => {
              callback(data, 'alpha2Code', 'name');
            });
          })
          .catch((error) => {
            console.log(error);
          });
      });

      expect(this.choices.ajax).toHaveBeenCalledWith(jasmine.any(Function));
    });
  });

  describe('should handle public methods on select-one input types', function() {
    beforeEach(function() {
      this.input = document.createElement('select');
      this.input.className = 'js-choices';
      this.input.placeholder = 'Placeholder text';

      for (let i = 1; i < 10; i++) {
        const option = document.createElement('option');

        option.value = `Value ${i}`;
        option.innerHTML = `Value ${i}`;

        if (i % 2) {
          option.selected = true;
        }

        this.input.appendChild(option);
      }

      document.body.appendChild(this.input);
      this.choices = new Choices(this.input);
    });

    it('should handle disable()', function() {
      this.choices.disable();

      expect(this.choices.containerOuter.getAttribute('tabindex')).toBe('-1');
    });

    it('should handle enable()', function() {
      this.choices.enable();

      expect(this.choices.containerOuter.getAttribute('tabindex')).toBe('0');
    });
  });

  describe('should handle public methods on text input types', function() {
    beforeEach(function() {
      this.input = document.createElement('input');
      this.input.type = 'text';
      this.input.className = 'js-choices';
      this.input.value = 'Value 1, Value 2, Value 3, Value 4';

      document.body.appendChild(this.input);
      this.choices = new Choices(this.input);
    });

    it('should handle clearInput()', function() {
      this.choices.clearInput();
      expect(this.choices.input.value).toBe('');
    });

    it('should handle removeItemsByValue()', function() {
      const items = this.choices.currentState.items;
      const randomItem = items[Math.floor(Math.random() * items.length)];

      this.choices.removeItemsByValue(randomItem.value);
      expect(randomItem.active).toBe(false);
    });
  });

  describe('should react to config options', function() {
    beforeEach(function() {
      this.input = document.createElement('select');
      this.input.className = 'js-choices';
      this.input.setAttribute('multiple', '');

      for (let i = 1; i < 4; i++) {
        const option = document.createElement('option');

        option.value = `Value ${i}`;
        option.innerHTML = `Value ${i}`;

        if (i % 2) {
          option.selected = true;
        }

        this.input.appendChild(option);
      }

      document.body.appendChild(this.input);
    });

    it('should flip the dropdown', function() {
      this.choices = new Choices(this.input, {
        position: 'top'
      });

      const container = this.choices.containerOuter;
      this.choices.input.focus();
      expect(container.classList.contains(this.choices.config.classNames.flippedState)).toBe(true);
    });

    it('shouldn\'t flip the dropdown', function() {
      this.choices = new Choices(this.input, {
        position: 'bottom'
      });

      const container = this.choices.containerOuter;
      this.choices.input.focus();
      expect(container.classList.contains(this.choices.config.classNames.flippedState)).toBe(false);
    });
  });
});
