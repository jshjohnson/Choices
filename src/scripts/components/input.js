import { sanitise } from '../lib/utils';

export default class Input {
  /**
   *
   * @typedef {import('../../../types/index').Choices.passedElement} passedElement
   * @typedef {import('../../../types/index').Choices.ClassNames} ClassNames
   * @param {{element: HTMLInputElement, type: passedElement['type'], classNames: ClassNames, preventPaste: boolean }} p
   */
  constructor({ element, type, classNames, preventPaste }) {
    this.element = element;
    this.type = type;
    this.classNames = classNames;
    this.preventPaste = preventPaste;

    this.isFocussed = this.element === document.activeElement;
    this.isDisabled = element.disabled;
  }

  set placeholder(placeholder) {
    this.element.placeholder = placeholder;
  }

  get value() {
    return sanitise(this.element.value);
  }

  set value(value) {
    this.element.value = value;
  }

  addEventListeners() {
    this.element.addEventListener('paste', this._onPaste, true);

    this.element.addEventListener('input', this._onInput, {
      passive: true,
    });
    this.element.addEventListener('focus', this._onFocus, {
      passive: true,
    });
    this.element.addEventListener('blur', this._onBlur, {
      passive: true,
    });
  }

  removeEventListeners() {
    this.element.removeEventListener('paste', this._onPaste, true);

    this.element.removeEventListener('input', this._onInput, false);
    this.element.removeEventListener('focus', this._onFocus, false);
    this.element.removeEventListener('blur', this._onBlur, false);
  }

  enable() {
    this.element.removeAttribute('disabled');
    this.isDisabled = false;
  }

  disable() {
    this.element.setAttribute('disabled', '');
    this.isDisabled = true;
  }

  focus() {
    if (!this.isFocussed) {
      this.element.focus();
    }
  }

  blur() {
    if (this.isFocussed) {
      this.element.blur();
    }
  }

  /**
   * Set value of input to blank
   * @return {Object} Class instance
   * @public
   */
  clear(setWidth = true) {
    if (this.element.value) {
      this.element.value = '';
    }

    if (setWidth) {
      this.setWidth();
    }

    return this;
  }

  setActiveDescendant(activeDescendantID) {
    this.element.setAttribute('aria-activedescendant', activeDescendantID);
  }

  /**
   * Set the correct input width based on placeholder
   * value or input value
   */
  setWidth() {
    // Resize input to contents or placeholder
    const { style, value, placeholder } = this.element;
    style.minWidth = `${placeholder.length + 1}ch`;
    style.width = `${value.length + 1}ch`;
  }

  removeActiveDescendant() {
    this.element.removeAttribute('aria-activedescendant');
  }

  // Class properties
  _onInput = () => {
    if (this.type !== 'select-one') {
      this.setWidth();
    }
  };

  _onPaste = event => this.preventPaste && event.preventDefault();

  _onFocus = () => {
    this.isFocussed = true;
  };

  _onBlur = () => {
    this.isFocussed = false;
  };
}
