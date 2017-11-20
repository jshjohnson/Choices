import { expect } from 'chai';
import WrappedElement from './wrapped-element';
import { DEFAULT_CLASSNAMES, DEFAULT_CONFIG } from '../constants';

describe('components/wrappedElement', () => {
  let instance;
  let choicesInstance;
  let choicesElement;

  beforeEach(() => {
    choicesInstance = {
      config: {
        ...DEFAULT_CONFIG,
      },
    };

    choicesElement = document.createElement('select');
    instance = new WrappedElement(choicesInstance, choicesElement, DEFAULT_CLASSNAMES);
  });

  describe('conceal', () => {
    let originalStyling;

    beforeEach(() => {
      originalStyling = 'color:red';
      instance.element.setAttribute('style', originalStyling);
    });

    it('hides element', () => {
      instance.conceal();
      expect(instance.element.tabIndex).to.equal(-1);
      expect(instance.element.classList.contains(instance.classNames.input)).to.equal(true);
      expect(instance.element.classList.contains(instance.classNames.hiddenState)).to.equal(true);
      expect(instance.element.getAttribute('style')).to.equal('display:none;');
      expect(instance.element.getAttribute('aria-hidden')).to.equal('true');
      expect(instance.element.getAttribute('data-choice')).to.equal('active');
      expect(instance.element.getAttribute('data-choice-orig-style')).to.equal(originalStyling);
    });
  });

  describe('reveal', () => {
    let originalStyling;

    beforeEach(() => {
      originalStyling = 'color:red';
      instance.element.setAttribute('data-choice-orig-style', originalStyling);
    });

    it('shows element', () => {
      instance.reveal();
      expect(instance.element.tabIndex).to.equal(0);
      expect(instance.element.classList.contains(instance.classNames.input)).to.equal(false);
      expect(instance.element.classList.contains(instance.classNames.hiddenState)).to.equal(false);
      expect(instance.element.getAttribute('style')).to.equal(originalStyling);
      expect(instance.element.getAttribute('aria-hidden')).to.equal(null);
      expect(instance.element.getAttribute('data-choice')).to.equal(null);
      expect(instance.element.getAttribute('data-choice-orig-style')).to.equal(null);
    });
  });
});
