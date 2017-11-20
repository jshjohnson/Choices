/* eslint-disable no-unused-expressions */
import 'whatwg-fetch';
import 'es6-promise';
import 'core-js/fn/object/assign';
import 'custom-event-autopolyfill';
import { expect } from 'chai';
import sinon from 'sinon';

import Choices from './choices';
import Dropdown from './components/dropdown';
import Container from './components/container';
import Input from './components/input';
import List from './components/list';
import WrappedInput from './components/wrapped-input';
import WrappedSelect from './components/wrapped-select';

describe('Choices', () => {
  describe('initialize Choices', () => {
    let input;
    let instance;

    beforeEach(() => {
      input = document.createElement('input');
      input.type = 'text';
      input.className = 'js-choices';

      document.body.appendChild(input);
      instance = new Choices(input);
    });

    afterEach(() => {
      instance.destroy();
    });

    it('is defined', () => {
      expect(instance).to.not.be.undefined;
    });

    it('initialises', () => {
      expect(instance.initialised).to.be.true;
    });

    it('does not re-initialise if passed element again', () => {
      const reinitialise = new Choices(instance.passedElement.element);
      sinon.spy(reinitialise, '_createTemplates');
      expect(reinitialise._createTemplates.callCount).to.equal(0);
    });

    it('has a blank state', () => {
      expect(instance.currentState.items.length).to.equal(0);
      expect(instance.currentState.groups.length).to.equal(0);
      expect(instance.currentState.choices.length).to.equal(0);
    });

    it('has expected config options', () => {
      expect(instance.config.silent).to.be.a('boolean');
      expect(instance.config.items).to.be.an('array');
      expect(instance.config.choices).to.be.an('array');
      expect(instance.config.renderChoiceLimit).to.be.a('number');
      expect(instance.config.maxItemCount).to.be.a('number');
      expect(instance.config.addItems).to.be.a('boolean');
      expect(instance.config.removeItems).to.be.a('boolean');
      expect(instance.config.removeItemButton).to.be.a('boolean');
      expect(instance.config.editItems).to.be.a('boolean');
      expect(instance.config.duplicateItems).to.be.a('boolean');
      expect(instance.config.delimiter).to.be.a('string');
      expect(instance.config.paste).to.be.a('boolean');
      expect(instance.config.searchEnabled).to.be.a('boolean');
      expect(instance.config.searchChoices).to.be.a('boolean');
      expect(instance.config.searchFloor).to.be.a('number');
      expect(instance.config.searchResultLimit).to.be.a('number');
      expect(instance.config.searchFields, 'should be string or array').to.satisfy(searchFields =>
         Array.isArray(searchFields) || typeof searchFields === 'string');
      expect(instance.config.position).to.be.a('string');
      expect(instance.config.regexFilter).to.be.null;
      expect(instance.config.sortFilter).to.be.a('function');
      expect(instance.config.shouldSort).to.be.a('boolean');
      expect(instance.config.shouldSortItems).to.be.a('boolean');
      expect(instance.config.placeholder).to.be.a('boolean');
      expect(instance.config.placeholderValue).to.be.null;
      expect(instance.config.prependValue).to.be.null;
      expect(instance.config.appendValue).to.be.null;
      expect(instance.config.renderSelectedChoices).to.be.a('string');
      expect(instance.config.loadingText).to.be.a('string');
      expect(instance.config.noResultsText).to.be.a('string');
      expect(instance.config.noChoicesText).to.be.a('string');
      expect(instance.config.itemSelectText).to.be.a('string');
      expect(instance.config.classNames).to.be.an('object');
      expect(instance.config.callbackOnInit).to.be.null;
      expect(instance.config.callbackOnCreateTemplates).to.be.null;
    });

    it('exposes public methods', () => {
      expect(instance.init).to.be.a('function');
      expect(instance.destroy).to.be.a('function');
      expect(instance.render).to.be.a('function');
      expect(instance.renderGroups).to.be.a('function');
      expect(instance.renderItems).to.be.a('function');
      expect(instance.renderChoices).to.be.a('function');
      expect(instance.highlightItem).to.be.a('function');
      expect(instance.unhighlightItem).to.be.a('function');
      expect(instance.highlightAll).to.be.a('function');
      expect(instance.unhighlightAll).to.be.a('function');
      expect(instance.removeItemsByValue).to.be.a('function');
      expect(instance.removeActiveItems).to.be.a('function');
      expect(instance.removeHighlightedItems).to.be.a('function');
      expect(instance.showDropdown).to.be.a('function');
      expect(instance.hideDropdown).to.be.a('function');
      expect(instance.toggleDropdown).to.be.a('function');
      expect(instance.getValue).to.be.a('function');
      expect(instance.setValue).to.be.a('function');
      expect(instance.setChoiceByValue).to.be.a('function');
      expect(instance.setChoices).to.be.a('function');
      expect(instance.disable).to.be.a('function');
      expect(instance.enable).to.be.a('function');
      expect(instance.ajax).to.be.a('function');
      expect(instance.clearStore).to.be.a('function');
      expect(instance.clearInput).to.be.a('function');
    });

    it('hides passed input', () => {
      expect(instance.passedElement.element.style.display).to.equal('none');
    });

    it('creates an outer container', () => {
      expect(instance.containerOuter).to.be.an.instanceof(Container);
    });

    it('creates an inner container', () => {
      expect(instance.containerInner).to.be.an.instanceof(Container);
    });

    it('creates a choice list', () => {
      expect(instance.choiceList).to.be.an.instanceof(List);
    });

    it('creates an item list', () => {
      expect(instance.itemList).to.be.an.instanceof(List);
    });

    it('creates an input', () => {
      expect(instance.input).to.be.an.instanceof(Input);
    });

    it('creates a dropdown', () => {
      expect(instance.dropdown).to.be.an.instanceof(Dropdown);
    });

    it('backs up and recovers original styles', () => {
      const origStyle = 'background-color: #ccc; margin: 5px padding: 10px;';

      instance.destroy();
      input.setAttribute('style', origStyle);
      instance = new Choices(input);

      let style = input.getAttribute('data-choice-orig-style');
      expect(style).to.equal(origStyle);

      instance.destroy();
      style = input.getAttribute('data-choice-orig-style');
      expect(style).to.be.null;

      style = input.getAttribute('style');
      expect(style).to.equal(origStyle);
    });
  });

  describe('text inputs', () => {
    let input;
    let instance;

    beforeEach(() => {
      input = document.createElement('input');
      input.type = 'text';
      input.className = 'js-choices';
      input.placeholder = 'Placeholder text';

      document.body.appendChild(input);
    });

    afterEach(() => {
      instance.destroy();
    });

    it('wraps passed input', () => {
      instance = new Choices(input);
      expect(instance.passedElement).to.be.an.instanceof(WrappedInput);
    });

    it('accepts a user inputted value', () => {
      instance = new Choices(input);

      instance.input.element.focus();
      instance.input.element.value = 'test';

      instance._onKeyDown({
        target: instance.input.element,
        keyCode: 13,
        ctrlKey: false,
      });

      expect(instance.currentState.items[0].value).to.include(instance.input.element.value);
    });

    it('copys the passed placeholder to the cloned input', () => {
      instance = new Choices(input);

      expect(instance.input.element.placeholder).to.equal(input.placeholder);
    });

    it('doesn\'t allow duplicate items if duplicateItems is false', () => {
      instance = new Choices(input, {
        duplicateItems: false,
        items: ['test 1'],
      });

      instance.input.element.focus();
      instance.input.element.value = 'test 1';

      instance._onKeyDown({
        target: instance.input.element,
        keyCode: 13,
        ctrlKey: false,
      });

      expect(instance.currentState.items[instance.currentState.items.length - 1].value).to.equal(instance.input.element.value);
    });

    it('filters input if regexFilter is passed', () => {
      instance = new Choices(input, {
        regexFilter: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      });

      instance.input.element.focus();
      instance.input.element.value = 'josh@joshuajohnson.co.uk';

      instance._onKeyDown({
        target: instance.input.element,
        keyCode: 13,
        ctrlKey: false,
      });

      instance.input.element.focus();
      instance.input.element.value = 'not an email address';

      instance._onKeyDown({
        target: instance.input.element,
        keyCode: 13,
        ctrlKey: false,
      });

      const lastItem = instance.currentState.items[instance.currentState.items.length - 1];

      expect(lastItem.value).to.equal('josh@joshuajohnson.co.uk');
      expect(lastItem.value).not.to.equal('not an email address');
    });

    it('prepends and appends values if passed', () => {
      instance = new Choices(input, {
        prependValue: 'item-',
        appendValue: '-value',
      });

      instance.input.element.focus();
      instance.input.element.value = 'test';

      instance._onKeyDown({
        target: instance.input.element,
        keyCode: 13,
        ctrlKey: false,
      });

      const lastItem = instance.currentState.items[instance.currentState.items.length - 1];

      expect(lastItem.value).not.to.equal('test');
      expect(lastItem.value).to.equal('item-test-value');
    });
  });

  describe('single select inputs', () => {
    let input;
    let instance;

    beforeEach(() => {
      input = document.createElement('select');
      input.className = 'js-choices';
      input.placeholder = 'Placeholder text';

      for (let i = 1; i < 4; i++) {
        const option = document.createElement('option');

        option.value = `Value ${i}`;
        option.innerHTML = `Label ${i}`;

        input.appendChild(option);
      }

      document.body.appendChild(input);
    });

    afterEach(() => {
      instance.destroy();
    });

    it('wraps passed input', () => {
      instance = new Choices(input);
      expect(instance.passedElement).to.be.an.instanceof(WrappedSelect);
    });

    it('opens the choice list on focusing', () => {
      instance = new Choices(input);
      instance.input.element.focus();
      expect(instance.dropdown.element.classList.contains(instance.config.classNames.activeState)).to.be.true;
    });

    it('selects the first choice', () => {
      instance = new Choices(input);
      expect(instance.currentState.items[0].value).to.include('Value 1');
    });

    it('highlights the choices on keydown', () => {
      instance = new Choices(input, {
        renderChoiceLimit: -1,
      });
      instance.input.element.focus();

      for (let i = 0; i < 2; i++) {
        // Key down to third choice
        instance._onKeyDown({
          target: instance.input.element,
          keyCode: 40,
          ctrlKey: false,
          preventDefault: () => {},
        });
      }

      expect(instance.highlightPosition).to.equal(2);
    });

    it('selects choice on enter key press', () => {
      instance = new Choices(input);
      instance.input.element.focus();

      // Key down to second choice
      instance._onKeyDown({
        target: instance.input.element,
        keyCode: 40,
        ctrlKey: false,
        preventDefault: () => {},
      });

      // Key down to select choice
      instance._onKeyDown({
        target: instance.input.element,
        keyCode: 13,
        ctrlKey: false,
        preventDefault: () => {},
      });

      expect(instance.currentState.items.length).to.equal(2);
    });

    it('triggers add/change event on selection', () => {
      instance = new Choices(input);

      const onChangeStub = sinon.stub();
      const addSpyStub = sinon.stub();
      const passedElement = instance.passedElement;

      passedElement.element.addEventListener('change', onChangeStub);
      passedElement.element.addEventListener('addItem', addSpyStub);

      instance.input.element.focus();

      // Key down to second choice
      instance._onKeyDown({
        target: instance.input.element,
        keyCode: 40,
        ctrlKey: false,
        preventDefault: () => {},
      });

      // Key down to select choice
      instance._onKeyDown({
        target: instance.input.element,
        keyCode: 13,
        ctrlKey: false,
        preventDefault: () => {},
      });

      const returnValue = onChangeStub.lastCall.args[0].detail.value;
      expect(returnValue).to.be.a('string');
      expect(onChangeStub.callCount).to.equal(1);
      expect(addSpyStub.callCount).to.equal(1);
    });

    it('opens the dropdown on click', () => {
      instance = new Choices(input);
      const container = instance.containerOuter.element;
      instance._onClick({
        target: container,
        ctrlKey: false,
        preventDefault: () => {},
      });

      expect(document.activeElement === instance.input.element && container.classList.contains('is-open')).to.be.true;
    });

    it('closes the dropdown on double click', () => {
      instance = new Choices(input);
      const container = instance.containerOuter.element;
      const openState = instance.config.classNames.openState;

      instance._onClick({
        target: container,
        ctrlKey: false,
        preventDefault: () => {},
      });

      instance._onClick({
        target: container,
        ctrlKey: false,
        preventDefault: () => {},
      });

      expect(document.activeElement === instance.input.element && container.classList.contains(openState)).to.be.false;
    });

    it('triggers showDropdown on dropdown opening', () => {
      instance = new Choices(input);
      const container = instance.containerOuter.element;

      const showDropdownStub = sinon.spy();
      const passedElement = instance.passedElement;

      passedElement.element.addEventListener('showDropdown', showDropdownStub);

      instance.input.focus();

      instance._onClick({
        target: container,
        ctrlKey: false,
        preventDefault: () => {},
      });

      expect(showDropdownStub.callCount).to.equal(1);
    });

    it('triggers hideDropdown on dropdown closing', () => {
      instance = new Choices(input);

      const container = instance.containerOuter.element;
      const hideDropdownStub = sinon.stub();
      const passedElement = instance.passedElement;

      passedElement.element.addEventListener('hideDropdown', hideDropdownStub);

      instance.input.element.focus();

      instance._onClick({
        target: container,
        ctrlKey: false,
        preventDefault: () => {},
      });

      instance._onClick({
        target: container,
        ctrlKey: false,
        preventDefault: () => {},
      });

      expect(hideDropdownStub.callCount).to.equal(1);
    });

    it('filters choices when searching', () => {
      instance = new Choices(input);

      const onSearchStub = sinon.spy();
      const passedElement = instance.passedElement;

      passedElement.element.addEventListener('search', onSearchStub);

      instance.input.element.focus();
      instance.input.element.value = '3 ';

      // Key down to search
      instance._onKeyUp({
        target: instance.input.element,
        keyCode: 13,
        ctrlKey: false,
      });

      const mostAccurateResult = instance.currentState.choices.find(choice => choice.active);

      expect(instance.isSearching && mostAccurateResult.value === 'Value 3').to.be.true;
      expect(onSearchStub.callCount).to.equal(1);
    });

    it('doesn\'t filter choices when searching', () => {
      instance = new Choices(input, {
        searchChoices: false,
      });

      instance.setValue(['Javascript', 'HTML', 'Jasmine']);

      const onSearchStub = sinon.spy();
      const passedElement = instance.passedElement;

      passedElement.element.addEventListener('search', onSearchStub);

      instance.input.element.focus();
      instance.input.element.value = 'Javascript';

      // Key down to search
      instance._onKeyUp({
        target: instance.input.element,
        keyCode: 13,
        ctrlKey: false,
      });

      const activeOptions = instance.currentState.choices.filter(choice => choice.active);

      expect(activeOptions.length).to.equal(instance.currentState.choices.length);
      expect(onSearchStub.callCount).to.equal(1);
    });

    it('doesn\'t sort choices if shouldSort is false', () => {
      instance = new Choices(input, {
        shouldSort: false,
        choices: [
          {
            value: 'Value 5',
            label: 'Label Five',
          }, {
            value: 'Value 6',
            label: 'Label Six',
          }, {
            value: 'Value 7',
            label: 'Label Seven',
          },
        ],
      });

      expect(instance.currentState.choices[0].value).to.equal('Value 5');
    });

    it('sorts choices if shouldSort is true', () => {
      instance = new Choices(input, {
        shouldSort: true,
        choices: [
          {
            value: 'Value 5',
            label: 'Label Five',
          }, {
            value: 'Value 6',
            label: 'Label Six',
          }, {
            value: 'Value 7',
            label: 'Label Seven',
          },
        ],
      });

      expect(instance.currentState.choices[0].value).to.equal('Value 1');
    });
  });

  describe('multiple select inputs', () => {
    let input;
    let instance;

    beforeEach(() => {
      input = document.createElement('select');
      input.className = 'js-choices';
      input.setAttribute('multiple', '');

      for (let i = 1; i < 4; i++) {
        const option = document.createElement('option');

        option.value = `Value ${i}`;
        option.innerHTML = `Value ${i}`;

        if (i % 2) {
          option.selected = true;
        }

        input.appendChild(option);
      }

      document.body.appendChild(input);

      instance = new Choices(input, {
        placeholderValue: 'Placeholder text',
        choices: [
          {
            value: 'One',
            label: 'Label One',
            selected: true,
            disabled: false,
          }, {
            value: 'Two',
            label: 'Label Two',
            disabled: true,
          }, {
            value: 'Three',
            label: 'Label Three',
          },
        ],
      });
    });

    afterEach(() => {
      instance.destroy();
    });

    it('wraps passed input', () => {
      expect(instance.passedElement).to.be.an.instanceof(WrappedSelect);
    });

    it('adds any pre-defined values', () => {
      expect(instance.currentState.items.length).to.be.above(1);
    });

    it('adds options defined in the config + pre-defined options', () => {
      expect(instance.currentState.choices.length).to.equal(6);
    });

    it('adds a placeholder defined in the config to the search input', () => {
      expect(instance.input.element.placeholder).to.equal('Placeholder text');
    });
  });

  describe('handles public methods on select input types', () => {
    let input;
    let instance;

    beforeEach(() => {
      input = document.createElement('select');
      input.className = 'js-choices';
      input.multiple = true;
      input.placeholder = 'Placeholder text';

      for (let i = 1; i < 10; i++) {
        const option = document.createElement('option');

        option.value = `Value ${i}`;
        option.innerHTML = `Value ${i}`;

        if (i % 2) {
          option.selected = true;
        }

        input.appendChild(option);
      }

      document.body.appendChild(input);
      instance = new Choices(input);
    });

    afterEach(() => {
      instance.destroy();
    });

    it('handles highlightItem()', () => {
      const items = instance.currentState.items;
      const randomItem = items[Math.floor(Math.random() * items.length)];

      instance.highlightItem(randomItem);

      expect(randomItem.highlighted).to.be.true;
    });

    it('handles unhighlightItem()', () => {
      const items = instance.currentState.items;
      const randomItem = items[Math.floor(Math.random() * items.length)];

      instance.unhighlightItem(randomItem);

      expect(randomItem.highlighted).to.be.false;
    });

    it('handles highlightAll()', () => {
      const items = instance.currentState.items;

      instance.highlightAll();

      const unhighlightedItems = items.some(item => item.highlighted === false);

      expect(unhighlightedItems).to.be.false;
    });

    it('handles unhighlightAll()', () => {
      const items = instance.currentState.items;

      instance.unhighlightAll();

      const highlightedItems = items.some(item => item.highlighted === true);

      expect(highlightedItems).to.be.false;
    });

    it('handles removeHighlightedItems()', () => {
      const items = instance.currentState.items;
      instance.highlightAll();
      instance.removeHighlightedItems();

      const activeItems = items.some(item => item.active === true);

      expect(activeItems).to.be.false;
    });

    it('handles showDropdown()', () => {
      instance.showDropdown();

      const hasOpenState = instance.containerOuter.element.classList.contains(instance.config.classNames.openState);
      const hasAttr = instance.containerOuter.element.getAttribute('aria-expanded') === 'true';
      const hasActiveState = instance.dropdown.element.classList.contains(instance.config.classNames.activeState);

      expect(hasOpenState && hasAttr && hasActiveState).to.be.true;
    });

    it('handles hideDropdown()', () => {
      instance.showDropdown();
      instance.hideDropdown();

      const hasOpenState = instance.containerOuter.element.classList.contains(instance.config.classNames.openState);
      const hasAttr = instance.containerOuter.element.getAttribute('aria-expanded') === 'true';
      const hasActiveState = instance.dropdown.element.classList.contains(instance.config.classNames.activeState);


      expect(hasOpenState && hasAttr && hasActiveState).to.be.false;
    });

    it('handles toggleDropdown()', () => {
      sinon.spy(instance, 'hideDropdown');
      instance.showDropdown();
      instance.toggleDropdown();
      expect(instance.hideDropdown.callCount).to.equal(1);
    });

    it('handles getValue()', () => {
      const valueObjects = instance.getValue();
      const valueStrings = instance.getValue(true);

      expect(valueStrings[0]).to.be.a('string');
      expect(valueObjects[0]).to.be.an('object');
      expect(valueObjects).to.be.an('array');
      expect(valueObjects.length).to.equal(5);
    });

    it('handles setValue()', () => {
      instance.setValue(['Set value 1', 'Set value 2', 'Set value 3']);
      const valueStrings = instance.getValue(true);

      expect(valueStrings[valueStrings.length - 1]).to.equal('Set value 3');
      expect(valueStrings[valueStrings.length - 2]).to.equal('Set value 2');
      expect(valueStrings[valueStrings.length - 3]).to.equal('Set value 1');
    });

    it('handles setChoiceByValue()', () => {
      const choices = instance.store.getChoicesFilteredByActive();
      const randomChoice = choices[Math.floor(Math.random() * choices.length)];

      instance.highlightAll();
      instance.removeHighlightedItems();
      instance.setChoiceByValue(randomChoice.value);

      const value = instance.getValue(true);

      expect(value[0]).to.equal(randomChoice.value);
    });

    it('handles setChoices()', () => {
      instance.setChoices([{
        label: 'Group one',
        id: 1,
        disabled: false,
        choices: [
          {
            value: 'Child One',
            label: 'Child One',
            selected: true,
          }, {
            value: 'Child Two',
            label: 'Child Two',
            disabled: true,
          }, {
            value: 'Child Three',
            label: 'Child Three',
          },
        ],
      }, {
        label: 'Group two',
        id: 2,
        disabled: false,
        choices: [
          {
            value: 'Child Four',
            label: 'Child Four',
            disabled: true,
          }, {
            value: 'Child Five',
            label: 'Child Five',
          }, {
            value: 'Child Six',
            label: 'Child Six',
          },
        ],
      }], 'value', 'label');


      const groups = instance.currentState.groups;
      const choices = instance.currentState.choices;

      expect(groups[groups.length - 1].value).to.equal('Group two');
      expect(groups[groups.length - 2].value).to.equal('Group one');
      expect(choices[choices.length - 1].value).to.equal('Child Six');
      expect(choices[choices.length - 2].value).to.equal('Child Five');
    });

    it('handles setChoices() with blank values', () => {
      instance.setChoices([{
        label: 'Choice one',
        value: 'one',
      }, {
        label: 'Choice two',
        value: '',
      }], 'value', 'label', true);


      const choices = instance.currentState.choices;
      expect(choices[0].value).to.equal('one');
      expect(choices[1].value).to.equal('');
    });

    it('handles clearStore()', () => {
      instance.clearStore();

      expect(instance.currentState.items).to.have.lengthOf(0);
      expect(instance.currentState.choices).to.have.lengthOf(0);
      expect(instance.currentState.groups).to.have.lengthOf(0);
    });

    it('handles disable()', () => {
      instance.disable();

      expect(instance.input.element.disabled).to.be.true;
      expect(
        instance.containerOuter.element.classList.contains(
          instance.config.classNames.disabledState,
        ),
      ).to.be.true;
      expect(instance.containerOuter.element.getAttribute('aria-disabled')).to.equal('true');
    });

    it('handles enable()', () => {
      instance.enable();

      expect(instance.input.element.disabled).to.be.false;
      expect(
        instance.containerOuter.element.classList.contains(
          instance.config.classNames.disabledState,
        ),
      ).to.be.false;
      expect(instance.containerOuter.element.hasAttribute('aria-disabled')).to.be.false;
    });

    it('handles ajax()', () => {
      const dummyFn = sinon.spy();

      instance.ajax(dummyFn);

      expect(dummyFn.callCount).to.equal(1);
    });
  });

  describe('handles public methods on select-one input types', () => {
    let input;
    let instance;

    beforeEach(() => {
      input = document.createElement('select');
      input.className = 'js-choices';
      input.placeholder = 'Placeholder text';

      for (let i = 1; i < 10; i++) {
        const option = document.createElement('option');

        option.value = `Value ${i}`;
        option.innerHTML = `Value ${i}`;

        if (i % 2) {
          option.selected = true;
        }

        input.appendChild(option);
      }

      document.body.appendChild(input);
      instance = new Choices(input);
    });

    afterEach(() => {
      instance.destroy();
    });

    it('handles disable()', () => {
      instance.disable();

      expect(instance.containerOuter.element.getAttribute('tabindex')).to.equal('-1');
    });

    it('handles enable()', () => {
      instance.enable();

      expect(instance.containerOuter.element.getAttribute('tabindex')).to.equal('0');
    });
  });

  describe('handles public methods on text input types', () => {
    let input;
    let instance;

    beforeEach(() => {
      input = document.createElement('input');
      input.type = 'text';
      input.className = 'js-choices';
      input.value = 'Value 1, Value 2, Value 3, Value 4';

      document.body.appendChild(input);
      instance = new Choices(input);
    });

    afterEach(() => {
      instance.destroy();
    });

    it('handles clearInput()', () => {
      instance.clearInput();
      expect(instance.input.element.value).to.equal('');
    });

    it('handles removeItemsByValue()', () => {
      const items = instance.currentState.items;
      const randomItem = items[Math.floor(Math.random() * items.length)];

      instance.removeItemsByValue(randomItem.value);
      expect(randomItem.active).to.be.false;
    });
  });

  describe('reacts to config options', () => {
    let input;
    let instance;

    beforeEach(() => {
      input = document.createElement('select');
      input.className = 'js-choices';
      input.setAttribute('multiple', '');

      for (let i = 1; i < 4; i++) {
        const option = document.createElement('option');

        option.value = `Value ${i}`;
        option.innerHTML = `Value ${i}`;

        if (i % 2) {
          option.selected = true;
        }

        input.appendChild(option);
      }

      document.body.appendChild(input);
    });

    afterEach(() => {
      instance.destroy();
    });

    it('should flip the dropdown', () => {
      instance = new Choices(input, {
        position: 'top',
      });

      const container = instance.containerOuter.element;
      instance.input.element.focus();
      expect(container.classList.contains(instance.config.classNames.flippedState)).to.be.true;
    });

    it('shouldn\'t flip the dropdown', () => {
      instance = new Choices(input, {
        position: 'bottom',
      });

      const container = instance.containerOuter.element;
      instance.input.element.focus();
      expect(container.classList.contains(instance.config.classNames.flippedState)).to.be.false;
    });

    it('should render selected choices', () => {
      instance = new Choices(input, {
        renderSelectedChoices: 'always',
        renderChoiceLimit: -1,
      });

      const renderedChoices = instance.choiceList.element.querySelectorAll('.choices__item');
      expect(renderedChoices.length).to.equal(3);
    });

    it('shouldn\'t render selected choices', () => {
      instance = new Choices(input, {
        renderSelectedChoices: 'auto',
        renderChoiceLimit: -1,
      });

      const renderedChoices = instance.choiceList.element.querySelectorAll('.choices__item');
      expect(renderedChoices.length).to.equal(1);
    });

    it('shouldn\'t render choices up to a render limit', () => {
      // Remove existing choices (to make test simpler)
      while (input.firstChild) {
        input.removeChild(input.firstChild);
      }

      instance = new Choices(input, {
        choices: [
          {
            value: 'Option 1',
            selected: false,
          },
          {
            value: 'Option 2',
            selected: false,
          },
          {
            value: 'Option 3',
            selected: false,
          },
          {
            value: 'Option 4',
            selected: false,
          },
          {
            value: 'Option 5',
            selected: false,
          },
        ],
        renderSelectedChoices: 'auto',
        renderChoiceLimit: 4,
      });

      const renderedChoices = instance.choiceList.element.querySelectorAll('.choices__item');
      expect(renderedChoices.length).to.equal(4);
    });
  });

  describe('allows custom properties provided by the user on items or choices', () => {
    let input;
    let instance;

    beforeEach(() => {
      input = document.createElement('select');
      input.className = 'js-choices';
      input.setAttribute('multiple', '');

      document.body.appendChild(input);
    });

    afterEach(() => {
      instance.destroy();
    });

    it('allows the user to supply custom properties for a choice that will be inherited by the item when the user selects the choice', () => {
      const expectedCustomProperties = {
        isBestOptionEver: true,
      };

      instance = new Choices(input);
      instance.setChoices([{
        value: '42',
        label: 'My awesome choice',
        selected: false,
        disabled: false,
        customProperties: expectedCustomProperties,
      }], 'value', 'label', true);

      instance.setChoiceByValue('42');
      const selectedItems = instance.getValue();

      expect(selectedItems.length).to.equal(1);
      expect(selectedItems[0].customProperties).to.equal(expectedCustomProperties);
    });

    it('allows the user to supply custom properties when directly creating a selected item', () => {
      const expectedCustomProperties = {
        isBestOptionEver: true,
      };

      instance = new Choices(input);

      instance.setValue([{
        value: 'bar',
        label: 'foo',
        customProperties: expectedCustomProperties,
      }]);
      const selectedItems = instance.getValue();

      expect(selectedItems.length).to.equal(1);
      expect(selectedItems[0].customProperties).to.equal(expectedCustomProperties);
    });
  });
});
