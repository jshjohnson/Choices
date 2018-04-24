import { expect } from 'chai';
import { stub } from 'sinon';
import Input from './input';
import { DEFAULT_CLASSNAMES, DEFAULT_CONFIG } from '../constants';

describe('components/input', () => {
  let instance;
  let choicesInstance;
  let choicesElement;

  beforeEach(() => {
    choicesInstance = {
      config: {
        ...DEFAULT_CONFIG,
      },
    };
    choicesElement = document.createElement('input');
    instance = new Input(choicesInstance, choicesElement, DEFAULT_CLASSNAMES);
  });

  afterEach(() => {
    document.body.innerHTML = '';
    instance = null;
  });

  describe('constructor', () => {
    it('assigns choices instance to class', () => {
      expect(instance.parentInstance).to.eql(choicesInstance);
    });

    it('assigns choices element to class', () => {
      expect(instance.element).to.eql(choicesElement);
    });

    it('assigns classnames to class', () => {
      expect(instance.classNames).to.eql(DEFAULT_CLASSNAMES);
    });
  });

  describe('addEventListeners', () => {
    let addEventListenerStub;

    beforeEach(() => {
      addEventListenerStub = stub(instance.element, 'addEventListener');
    });

    afterEach(() => {
      addEventListenerStub.restore();
    });

    it('adds event listeners', () => {
      instance.addEventListeners();
      expect(addEventListenerStub.callCount).to.equal(4);
      expect(addEventListenerStub.getCall(0).args[0]).to.equal('input');
      expect(addEventListenerStub.getCall(1).args[0]).to.equal('paste');
      expect(addEventListenerStub.getCall(2).args[0]).to.equal('focus');
      expect(addEventListenerStub.getCall(3).args[0]).to.equal('blur');
    });
  });

  describe('removeEventListeners', () => {
    let removeEventListenerStub;

    beforeEach(() => {
      removeEventListenerStub = stub(instance.element, 'removeEventListener');
    });

    afterEach(() => {
      removeEventListenerStub.restore();
    });

    it('removes event listeners', () => {
      instance.removeEventListeners();
      expect(removeEventListenerStub.callCount).to.equal(4);
      expect(removeEventListenerStub.getCall(0).args[0]).to.equal('input');
      expect(removeEventListenerStub.getCall(1).args[0]).to.equal('paste');
      expect(removeEventListenerStub.getCall(2).args[0]).to.equal('focus');
      expect(removeEventListenerStub.getCall(3).args[0]).to.equal('blur');
    });
  });

  describe('onInput', () => {
    let setWidthStub;

    beforeEach(() => {
      setWidthStub = stub(instance, 'setWidth');
    });

    afterEach(() => {
      setWidthStub.restore();
    });


    describe('when element is select one', () => {
      it('does not set input width', () => {
        instance.parentInstance.isSelectOneElement = true;
        instance.onInput();
        expect(setWidthStub.callCount).to.equal(0);
      });
    });

    describe('when element is not a select one', () => {
      it('sets input width', () => {
        instance.parentInstance.isSelectOneElement = false;
        instance.onInput();
        expect(setWidthStub.callCount).to.equal(1);
      });
    });
  });

  describe('onPaste', () => {
    let eventMock;

    beforeEach(() => {
      eventMock = {
        preventDefault: stub(),
        target: instance.element,
      };
    });

    describe('when pasting is disabled and target is the element', () => {
      it('prevents default pasting behaviour', () => {
        instance.parentInstance.config.paste = false;
        instance.onPaste(eventMock);
        expect(eventMock.preventDefault.callCount).to.equal(1);
      });
    });

    describe('when pasting is enabled', () => {
      it('does not prevent default pasting behaviour', () => {
        instance.parentInstance.config.paste = true;
        instance.onPaste(eventMock);
        expect(eventMock.preventDefault.callCount).to.equal(0);
      });
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

  describe('enable', () => {
    beforeEach(() => {
      instance.element.setAttribute('disabled', '');
      instance.isDisabled = true;
      instance.enable();
    });

    it('removes disabled attribute', () => {
      expect(instance.element.getAttribute('disabled')).to.equal(null);
    });

    it('sets isDisabled flag to false', () => {
      expect(instance.isDisabled).to.equal(false);
    });
  });

  describe('disable', () => {
    beforeEach(() => {
      instance.element.removeAttribute('disabled', '');
      instance.isDisabled = false;
      instance.disable();
    });

    it('removes disabled attribute', () => {
      expect(instance.element.getAttribute('disabled')).to.equal('');
    });

    it('sets isDisabled flag to false', () => {
      expect(instance.isDisabled).to.equal(true);
    });
  });

  describe('focus', () => {
    let focusStub;

    beforeEach(() => {
      focusStub = stub(instance.element, 'focus');
    });

    afterEach(() => {
      focusStub.restore();
    });

    describe('when element is not focussed', () => {
      it('focuses element if isFocussed flag is set to false', () => {
        instance.isFocussed = true;
        instance.focus();
        expect(focusStub.callCount).to.equal(0);
      });
    });

    describe('when element is focussed', () => {
      it('focuses element if isFocussed flag is set to false', () => {
        instance.isFocussed = false;
        instance.focus();
        expect(focusStub.callCount).to.equal(1);
      });
    });
  });


  describe('blur', () => {
    let blurStub;

    beforeEach(() => {
      blurStub = stub(instance.element, 'blur');
    });

    afterEach(() => {
      blurStub.restore();
    });

    describe('when element is not focussed', () => {
      it('doesn\'t blur element', () => {
        instance.isFocussed = false;
        instance.blur();
        expect(blurStub.callCount).to.equal(0);
      });
    });

    describe('when element is focussed', () => {
      it('blurs element', () => {
        instance.isFocussed = true;
        instance.blur();
        expect(blurStub.callCount).to.equal(1);
      });
    });
  });

  describe('clear', () => {
    let setWidthStub;

    beforeEach(() => {
      setWidthStub = stub(instance, 'setWidth');
    });

    afterEach(() => {
      setWidthStub.restore();
    });

    it('removes the element\'s value if it has one', () => {
      instance.element.value = 'test';
      expect(instance.element.value).to.equal('test');
      instance.clear();
      expect(instance.element.value).to.equal('');
    });

    it('sets the element\'s width if flag passed', () => {
      expect(setWidthStub.callCount).to.equal(0);
      instance.clear(true);
      expect(setWidthStub.callCount).to.equal(1);
    });

    it('returns parent instance', () => {
      const actualResponse = instance.clear();
      const expectedResponse = choicesInstance;
      expect(actualResponse).to.eql(expectedResponse);
    });
  });

  describe('setWidth', () => {
    let calcWidthStub;
    const inputWidth = '200px';

    beforeEach(() => {
      calcWidthStub = stub(instance, 'calcWidth').returns(inputWidth);
    });

    afterEach(() => {
      calcWidthStub.restore();
    });

    describe('with a placeholder', () => {
      describe('when value length is greater or equal to 75% of the placeholder length', () => {
        it('sets the width of the element based on input value', () => {
          instance.parentInstance.placeholder = 'This is a test';
          instance.element.value = 'This is a test';
          expect(instance.element.style.width).to.not.equal(inputWidth);
          instance.setWidth();
          expect(calcWidthStub.callCount).to.equal(1);
          expect(instance.element.style.width).to.equal(inputWidth);
        });
      });

      describe('when width is enforced', () => {
        it('sets the width of the element based on input value', () => {
          instance.parentInstance.placeholder = 'This is a test';
          instance.element.value = '';
          expect(instance.element.style.width).to.not.equal(inputWidth);
          instance.setWidth(true);
          expect(calcWidthStub.callCount).to.equal(1);
          expect(instance.element.style.width).to.equal(inputWidth);
        });
      });

      describe('when value length is less than 75% of the placeholder length', () => {
        it('does not set the width of the element', () => {
          instance.parentInstance.placeholder = 'This is a test';
          instance.element.value = 'Test';
          instance.setWidth();
          expect(calcWidthStub.callCount).to.equal(0);
        });
      });
    });

    describe('without a placeholder', () => {
      it('sets the width of the element based on input value', () => {
        instance.placeholder = null;
        expect(instance.element.style.width).to.not.equal(inputWidth);
        instance.setWidth();
        expect(calcWidthStub.callCount).to.equal(1);
        expect(instance.element.style.width).to.equal(inputWidth);
      });
    });
  });

  describe('placeholder setter', () => {
    it('sets value of element to passed placeholder', () => {
      const placeholder = 'test';
      expect(instance.element.placeholder).to.equal('');
      instance.placeholder = placeholder;
      expect(instance.element.placeholder).to.equal(placeholder);
    });
  });

  describe('value setter', () => {
    it('sets value of element to passed value', () => {
      const value = 'test';
      expect(instance.element.value).to.equal('');
      instance.value = value;
      expect(instance.element.value).to.equal(value);
    });
  });

  describe('value getter', () => {
    it('sets value of element to passed value', () => {
      const value = 'test';
      instance.element.value = value;
      const actualResponse = instance.value;
      expect(actualResponse).to.equal(value);
    });
  });

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
});
