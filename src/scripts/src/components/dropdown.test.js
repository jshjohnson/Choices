import { expect } from 'chai';
import sinon from 'sinon';
import Dropdown from './dropdown';
import { DEFAULT_CLASSNAMES, DEFAULT_CONFIG } from '../constants';

describe('components/dropdown', () => {
  let instance;
  let choicesInstance;
  let choicesElement;

  beforeEach(() => {
    choicesInstance = {
      config: {
        ...DEFAULT_CONFIG,
      },
    };

    choicesElement = document.createElement('div');
    document.body.appendChild(choicesElement);
    instance = new Dropdown(choicesInstance, choicesElement, DEFAULT_CLASSNAMES);
  });

  afterEach(() => {
    document.body.innerHTML = '';
    instance = null;
  });

  describe('constructor', () => {
    it('assigns choices instance to instance', () => {
      expect(instance.parentInstance).to.eql(choicesInstance);
    });

    it('assigns choices element to instance', () => {
      expect(instance.element).to.eql(choicesElement);
    });

    it('assigns classnames to instance', () => {
      expect(instance.classNames).to.eql(DEFAULT_CLASSNAMES);
    });
  });

  describe('distanceFromTopWindow', () => {
    let top;
    let offset;
    let dimensions;
    let getBoundingClientRectStub;

    beforeEach(() => {
      top = 100;
      offset = 50;
      dimensions = {
        bottom: 0,
        height: 0,
        left: 0,
        right: 0,
        top,
        width: 0,
      };

      getBoundingClientRectStub = sinon.stub(instance.element, 'getBoundingClientRect').returns(dimensions);

      window.pageYOffset = 50;
    });

    afterEach(() => {
      getBoundingClientRectStub.restore();
    });

    it('determines how far the top of our element is from the top of the window', () => {
      const expectedResponse = top + offset;
      const actualResponse = instance.distanceFromTopWindow();
      expect(actualResponse).to.equal(expectedResponse);
    });

    it('assigns dimensions to instance', () => {
      instance.distanceFromTopWindow();
      const expectedResponse = dimensions;
      expect(instance.dimensions).to.equal(expectedResponse);
    });

    it('assigns posisiton to instance', () => {
      instance.distanceFromTopWindow();
      const expectedResponse = top + offset;
      expect(instance.position).to.equal(expectedResponse);
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
      expect(instance.element.classList.contains(DEFAULT_CLASSNAMES.activeState)).to.equal(true);
    });

    it('sets expanded attribute', () => {
      expect(instance.element.getAttribute('aria-expanded')).to.equal('true');
    });

    it('sets isActive instance flag', () => {
      expect(instance.isActive).to.equal(true);
    });

    it('returns parent instance', () => {
      expect(actualResponse).to.eql(choicesInstance);
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
      expect(instance.element.classList.contains(DEFAULT_CLASSNAMES.activeState)).to.equal(false);
    });

    it('sets expanded attribute', () => {
      expect(instance.element.getAttribute('aria-expanded')).to.equal('false');
    });

    it('sets isActive instance flag', () => {
      expect(instance.isActive).to.equal(false);
    });

    it('returns parent instance', () => {
      expect(actualResponse).to.eql(choicesInstance);
    });
  });
});
