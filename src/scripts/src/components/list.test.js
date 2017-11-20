import { expect } from 'chai';
import List from './list';
import { DEFAULT_CLASSNAMES, DEFAULT_CONFIG } from '../constants';

describe('components/list', () => {
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
    instance = new List(choicesInstance, choicesElement, DEFAULT_CLASSNAMES);
  });

  it('assigns choices instance to class', () => {
    expect(instance.parentInstance).to.eql(choicesInstance);
  });

  it('assigns choices element to class', () => {
    expect(instance.element).to.eql(choicesElement);
  });

  it('assigns classnames to class', () => {
    expect(instance.classNames).to.eql(DEFAULT_CLASSNAMES);
  });

  describe('clear', () => {
    it('clears element\'s inner HTML', () => {
      const innerHTML = 'test';
      instance.element.innerHTML = innerHTML;
      expect(instance.element.innerHTML).to.equal(innerHTML);
      instance.clear();
      expect(instance.element.innerHTML).to.equal('');
    });
  });

  describe('scrollTo', () => {
    it('scrolls element to passed position', () => {
      const scrollPosition = 20;
      expect(instance.element.scrollTop).to.equal(0);
      instance.scrollTo(scrollPosition);
      expect(instance.element.scrollTop).to.equal(scrollPosition);
    });
  });

  describe('append', () => {
    it('appends passed node to element', () => {
      const elementToAppend = document.createElement('span');
      const childClass = 'test-element';
      elementToAppend.classList.add(childClass);
      expect(instance.element.querySelector(`.${childClass}`)).to.equal(null);
      instance.append(elementToAppend);
      expect(instance.element.querySelector(`.${childClass}`)).to.equal(elementToAppend);
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
});
