import { expect } from 'chai';
import sinon from 'sinon';
import Container from './container';
import { DEFAULT_CLASSNAMES, DEFAULT_CONFIG } from '../constants';

describe('components/container', () => {
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
    instance = new Container(choicesInstance, choicesElement, DEFAULT_CLASSNAMES);
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

  describe('addEventListeners', () => {
    let addEventListenerStub;

    beforeEach(() => {
      addEventListenerStub = sinon.stub(instance.element, 'addEventListener');
    });

    afterEach(() => {
      addEventListenerStub.restore();
    });

    it('adds event listeners', () => {
      instance.addEventListeners();
      expect(addEventListenerStub.callCount).to.equal(2);
      expect(addEventListenerStub.getCall(0).args[0]).to.equal('focus');
      expect(addEventListenerStub.getCall(1).args[0]).to.equal('blur');
    });
  });

  describe('removeEventListeners', () => {
    let removeEventListenerStub;

    beforeEach(() => {
      removeEventListenerStub = sinon.stub(instance.element, 'removeEventListener');
    });

    afterEach(() => {
      removeEventListenerStub.restore();
    });

    it('removes event listeners', () => {
      instance.removeEventListeners();
      expect(removeEventListenerStub.callCount).to.equal(2);
      expect(removeEventListenerStub.getCall(0).args[0]).to.equal('focus');
      expect(removeEventListenerStub.getCall(1).args[0]).to.equal('blur');
    });
  });

  describe('onFocus', () => {
    it('sets isFocussed flag to true', () => {
      expect(instance.isFocussed).to.equal(false);
      instance.onFocus();
      expect(instance.isFocussed).to.equal(true);
    });
  });

  describe('onBlur', () => {
    it('sets isFocussed flag to false', () => {
      instance.isFocussed = true;
      instance.onBlur();
      expect(instance.isFocussed).to.equal(false);
    });
  });

  // describe('shouldFlip', () => { });

  describe('setActiveDescendant', () => {
    it('sets element\'s aria-activedescendant attribute with passed descendant ID', () => {
      const activeDescendantID = '1234';
      expect(instance.element.getAttribute('aria-activedescendant')).to.equal(null);
      instance.setActiveDescendant(activeDescendantID);
      expect(instance.element.getAttribute('aria-activedescendant')).to.equal(activeDescendantID);
    });
  });

  describe('removeActiveDescendant', () => {
    it('remove elememnt\'s aria-activedescendant attribute', () => {
      const activeDescendantID = '1234';
      instance.element.setAttribute('aria-activedescendant', activeDescendantID);
      expect(instance.element.getAttribute('aria-activedescendant')).to.equal(activeDescendantID);
      instance.removeActiveDescendant();
      expect(instance.element.getAttribute('aria-activedescendant')).to.equal(null);
    });
  });

  // describe('open', () => { });
  // describe('close', () => { });

  describe('focus', () => {
    let focusStub;

    beforeEach(() => {
      focusStub = sinon.stub(instance.element, 'focus');
    });

    afterEach(() => {
      focusStub.restore();
    });

    it('focuses element if isFocussed flag is set to false', () => {
      instance.isFocussed = false;
      instance.focus();
      expect(focusStub.callCount).to.equal(1);
    });
  });

  // describe('addFocusState', () => { });
  // describe('removeFocusState', () => { });
  // describe('enable', () => {});
  // describe('disable', () => {});

  describe('addLoadingState', () => {
    beforeEach(() => {
      instance.removeLoadingState();
    });

    it('adds loading state class', () => {
      expect(instance.element.classList.contains(DEFAULT_CLASSNAMES.loadingState)).to.equal(false);
      instance.addLoadingState();
      expect(instance.element.classList.contains(DEFAULT_CLASSNAMES.loadingState)).to.equal(true);
    });

    it('sets aria-busy attribute to true', () => {
      expect(instance.element.getAttribute('aria-busy')).to.equal(null);
      instance.addLoadingState();
      expect(instance.element.getAttribute('aria-busy')).to.equal('true');
    });

    it('sets isLoading flag to false', () => {
      expect(instance.isLoading).to.equal(false);
      instance.addLoadingState();
      expect(instance.isLoading).to.equal(true);
    });
  });

  describe('removeLoadingState', () => {
    beforeEach(() => {
      instance.addLoadingState();
    });

    it('removes loading state class', () => {
      expect(instance.element.classList.contains(DEFAULT_CLASSNAMES.loadingState)).to.equal(true);
      instance.removeLoadingState();
      expect(instance.element.classList.contains(DEFAULT_CLASSNAMES.loadingState)).to.equal(false);
    });

    it('removes aria-busy attribute', () => {
      expect(instance.element.getAttribute('aria-busy')).to.equal('true');
      instance.removeLoadingState();
      expect(instance.element.getAttribute('aria-busy')).to.equal(null);
    });

    it('sets isLoading flag to true', () => {
      expect(instance.isLoading).to.equal(true);
      instance.removeLoadingState();
      expect(instance.isLoading).to.equal(false);
    });
  });
});
