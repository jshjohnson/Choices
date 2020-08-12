import { expect } from 'chai';
import sinon from 'sinon';
import Dropdown from './dropdown';
import { DEFAULT_CLASSNAMES } from '../constants';
import { containsClassNames } from '../lib/utils';

describe('components/dropdown', () => {
  let instance;
  let choicesElement;
  let classNames;

  beforeEach(() => {
    choicesElement = document.createElement('div');
    document.body.appendChild(choicesElement);
    classNames = {
      ...DEFAULT_CLASSNAMES,
      activeState: `${DEFAULT_CLASSNAMES.activeState} other`,
    };
    instance = new Dropdown({
      element: choicesElement,
      type: 'text',
      classNames,
    });
  });

  afterEach(() => {
    document.body.innerHTML = '';
    instance = null;
    classNames = null;
  });

  describe('constructor', () => {
    it('assigns choices element to instance', () => {
      expect(instance.element).to.eql(choicesElement);
    });

    it('assigns classnames to instance', () => {
      expect(instance.classNames).to.eql(classNames);
    });
  });

  describe('distanceFromTopWindow', () => {
    let top;
    let dimensions;
    let getBoundingClientRectStub;

    beforeEach(() => {
      top = 100;
      dimensions = {
        bottom: 121,
        height: 0,
        left: 0,
        right: 0,
        top,
        width: 0,
      };

      getBoundingClientRectStub = sinon
        .stub(instance.element, 'getBoundingClientRect')
        .returns(dimensions);
    });

    afterEach(() => {
      getBoundingClientRectStub.restore();
    });

    it('determines how far the top of our element is from the top of the viewport', () => {
      const expectedResponse = dimensions.bottom;
      const actualResponse = instance.distanceFromTopWindow;
      expect(actualResponse).to.equal(expectedResponse);
    });
  });

  describe('getChild', () => {
    let childElement;
    const childClass = 'test-element';

    beforeEach(() => {
      childElement = document.createElement('span');
      childElement.classList.add(childClass);
      instance.element.appendChild(childElement);
    });

    it('returns child element', () => {
      const expectedResponse = childElement;
      const actualResponse = instance.getChild(`.${childClass}`);
      expect(expectedResponse).to.eql(actualResponse);
    });
  });

  describe('show', () => {
    let actualResponse;

    beforeEach(() => {
      actualResponse = instance.show();
    });

    afterEach(() => {
      instance.hide();
    });

    it('adds active class', () => {
      expect(
        containsClassNames(instance.element, classNames.activeState),
      ).to.equal(true);
    });

    it('sets expanded attribute', () => {
      expect(instance.element.getAttribute('aria-expanded')).to.equal('true');
    });

    it('sets isActive instance flag', () => {
      expect(instance.isActive).to.equal(true);
    });

    it('returns instance', () => {
      expect(actualResponse).to.eql(instance);
    });
  });

  describe('hide', () => {
    let actualResponse;

    beforeEach(() => {
      actualResponse = instance.hide();
    });

    afterEach(() => {
      instance.show();
    });

    it('adds active class', () => {
      expect(
        containsClassNames(instance.element, classNames.activeState),
      ).to.equal(false);
    });

    it('sets expanded attribute', () => {
      expect(instance.element.getAttribute('aria-expanded')).to.equal('false');
    });

    it('sets isActive instance flag', () => {
      expect(instance.isActive).to.equal(false);
    });

    it('returns instance', () => {
      expect(actualResponse).to.eql(instance);
    });
  });
});
