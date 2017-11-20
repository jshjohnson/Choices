import { getWidthOfInput } from '../lib/utils';

export default class Input {
  constructor(instance, element, classNames) {
    this.parentInstance = instance;
    this.element = element;
    this.classNames = classNames;
    this.isFocussed = this.element === document.activeElement;
    this.isDisabled = false;

    // Bind event listeners
    this.onPaste = this.onPaste.bind(this);
    this.onInput = this.onInput.bind(this);
    this.onFocus = this.onFocus.bind(this);
    this.onBlur = this.onBlur.bind(this);
  }

  getElement() {
    return this.element;
  }

  addEventListeners() {
    this.element.addEventListener('input', this.onInput);
    this.element.addEventListener('paste', this.onPaste);
    this.element.addEventListener('focus', this.onFocus);
    this.element.addEventListener('blur', this.onBlur);
  }

  removeEventListeners() {
    this.element.removeEventListener('input', this.onInput);
    this.element.removeEventListener('paste', this.onPaste);
    this.element.removeEventListener('focus', this.onFocus);
    this.element.removeEventListener('blur', this.onBlur);
  }

  /**
   * Input event
   * @return
   * @private
   */
  onInput() {
    if (!this.parentInstance.isSelectOneElement) {
      this.setWidth();
    }
  }

  /**
   * Paste event
   * @param  {Object} e Event
   * @return
   * @private
   */
  onPaste(e) {
    // Disable pasting into the input if option has been set
    if (e.target === this.element && !this.parentInstance.config.paste) {
      e.preventDefault();
    }
  }

  /**
   * Set focussed state
   */
  onFocus() {
    this.isFocussed = true;
  }

  /**
   * Remove focussed state
   */
  onBlur() {
    this.isFocussed = false;
  }

  activate(focusInput) {
    // Optionally focus the input if we have a search input
    if (focusInput && this.parentInstance.canSearch && document.activeElement !== this.element) {
      this.element.focus();
    }
  }

  deactivate(blurInput) {
    this.removeActiveDescendant();
    // Optionally blur the input if we have a search input
    if (blurInput && this.parentInstance.canSearch && document.activeElement === this.element) {
      this.element.blur();
    }
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

    return this.parentInstance;
  }

  /**
   * Set the correct input width based on placeholder
   * value or input value
   * @return
   */
  setWidth(enforceWidth) {
    if (this.parentInstance.placeholder) {
      // If there is a placeholder, we only want to set the width of the input when it is a greater
      // length than 75% of the placeholder. This stops the input jumping around.
      if (
        (this.element.value &&
        this.element.value.length >= (this.parentInstance.placeholder.length / 1.25)) ||
        enforceWidth
      ) {
        this.element.style.width = this.getWidth();
      }
    } else {
      // If there is no placeholder, resize input to contents
      this.element.style.width = this.getWidth();
    }
  }

  getWidth() {
    return getWidthOfInput(this.element);
  }

  setPlaceholder(placeholder) {
    this.element.placeholder = placeholder;
  }

  setValue(value) {
    this.element.value = value;
  }

  getValue() {
    return this.element.value;
  }

  setActiveDescendant(activeDescendantID) {
    this.element.setAttribute('aria-activedescendant', activeDescendantID);
  }

  removeActiveDescendant() {
    this.element.removeAttribute('aria-activedescendant');
  }
}
