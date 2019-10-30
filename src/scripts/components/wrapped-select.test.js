import { expect } from 'chai';
import { stub, spy } from 'sinon';
import WrappedElement from './wrapped-element';
import WrappedSelect from './wrapped-select';
import { DEFAULT_CLASSNAMES } from '../constants';
import Templates from '../templates';

describe('components/wrappedSelect', () => {
  let instance;
  let element;

  beforeEach(() => {
    element = document.createElement('select');
    element.id = 'target';
    for (let i = 0; i <= 4; i++) {
      const option = document.createElement('option');

      if (i === 0) {
        option.value = '';
        option.innerHTML = 'Placeholder label';
      } else {
        option.value = `Value ${i}`;
        option.innerHTML = `Label ${i}`;
      }

      if (i === 1) {
        option.setAttribute('placeholder', '');
      }

      element.appendChild(option);
    }
    document.body.appendChild(element);

    instance = new WrappedSelect({
      element: document.getElementById('target'),
      classNames: DEFAULT_CLASSNAMES,
      template: spy(Templates.option),
    });
  });

  afterEach(() => {
    document.body.innerHTML = '';
    instance = null;
  });

  describe('constructor', () => {
    it('assigns choices element to class', () => {
      expect(instance.element).to.eql(element);
    });

    it('assigns classnames to class', () => {
      expect(instance.classNames).to.eql(DEFAULT_CLASSNAMES);
    });
  });

  describe('inherited methods', () => {
    ['conceal', 'reveal', 'enable', 'disable'].forEach(method => {
      beforeEach(() => {
        stub(WrappedElement.prototype, method);
      });

      afterEach(() => {
        WrappedElement.prototype[method].restore();
      });

      describe(method, () => {
        it(`calls super.${method}`, () => {
          expect(WrappedElement.prototype[method].called).to.equal(false);
          instance[method]();
          expect(WrappedElement.prototype[method].called).to.equal(true);
        });
      });
    });
  });

  describe('placeholderOption getter', () => {
    it('returns option element with empty value attribute', () => {
      expect(instance.placeholderOption).to.be.instanceOf(HTMLOptionElement);
      expect(instance.placeholderOption.value).to.equal('');
    });

    it('returns option element with placeholder attribute as fallback', () => {
      instance.element.removeChild(instance.element.firstChild);

      expect(instance.placeholderOption).to.be.instanceOf(HTMLOptionElement);
      expect(instance.placeholderOption.value).to.equal('Value 1');
    });
  });

  describe('options getter', () => {
    it('returns all option elements', () => {
      const { options } = instance;
      expect(options).to.be.an('array');
      options.forEach(option => {
        expect(option).to.be.instanceOf(HTMLOptionElement);
      });
    });
  });

  describe('optionGroups getter', () => {
    it('returns an array of all option groups', () => {
      for (let i = 1; i <= 3; i++) {
        const group = document.createElement('optgroup');
        instance.element.appendChild(group);
      }

      const { optionGroups } = instance;
      expect(optionGroups.length).to.equal(3);
      optionGroups.forEach(option => {
        expect(option).to.be.instanceOf(HTMLOptGroupElement);
      });
    });
  });

  describe('options setter', () => {
    const options = [
      {
        value: '1',
        label: 'Test 1',
        selected: false,
        disabled: true,
      },
      {
        value: '2',
        label: 'Test 2',
        selected: true,
        disabled: false,
      },
    ];

    it('creates an option element for each passed object, adds it to select', () => {
      instance.element.options.length = 0;
      instance.options = options;
      expect(instance.element.options.length).to.equal(2);
      expect(instance.element.options[0].value).to.equal(options[0].value);
      expect(instance.element.options[1].value).to.equal(options[1].value);
    });
  });
});
