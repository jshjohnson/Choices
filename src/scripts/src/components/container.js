export default class Container {
  constructor(instance, element, classNames) {
    this.parentInstance = instance;
    this.element = element;
    this.classNames = classNames;
    this.config = instance.config;
    this.isOpen = false;
    this.isFlipped = false;
    this.isFocussed = false;
    this.isDisabled = false;
    this.isLoading = false;
    this.onFocus = this.onFocus.bind(this);
    this.onBlur = this.onBlur.bind(this);
  }

  getElement() {
    return this.element;
  }

  /**
   * Add event listeners
  */
  addEventListeners() {
    this.element.addEventListener('focus', this.onFocus);
    this.element.addEventListener('blur', this.onBlur);
  }

  /**
   * Remove event listeners
  */

  /** */
  removeEventListeners() {
    this.element.removeEventListener('focus', this.onFocus);
    this.element.removeEventListener('blur', this.onBlur);
  }

  /**
   * Set focussed state
   */
  onFocus() {
    this.isFocussed = true;
  }

  /**
   * Remove blurred state
   */
  onBlur() {
    this.isFocussed = false;
  }

  /**
   * Determine whether container should be flipped
   * based on passed dropdown position
   * @param {Number} dropdownPos
   * @returns
   */
  shouldFlip(dropdownPos) {
    if (dropdownPos === undefined) {
      return false;
    }

    const body = document.body;
    const html = document.documentElement;
    const winHeight = Math.max(
      body.scrollHeight,
      body.offsetHeight,
      html.clientHeight,
      html.scrollHeight,
      html.offsetHeight,
    );

    // If flip is enabled and the dropdown bottom position is
    // greater than the window height flip the dropdown.
    let shouldFlip = false;
    if (this.config.position === 'auto') {
      shouldFlip = dropdownPos >= winHeight;
    } else if (this.config.position === 'top') {
      shouldFlip = true;
    }

    return shouldFlip;
  }

  /**
   * Set active descendant attribute
   * @param {Number} activeDescendant ID of active descendant
   */
  setActiveDescendant(activeDescendantID) {
    this.element.setAttribute('aria-activedescendant', activeDescendantID);
  }

  /**
   * Remove active descendant attribute
   */
  removeActiveDescendant() {
    this.element.removeAttribute('aria-activedescendant');
  }

  open(dropdownPos) {
    this.element.classList.add(this.classNames.openState);
    this.element.setAttribute('aria-expanded', 'true');
    this.isOpen = true;

    if (this.shouldFlip(dropdownPos)) {
      this.element.classList.add(this.classNames.flippedState);
      this.isFlipped = true;
    }
  }

  close() {
    this.element.classList.remove(this.classNames.openState);
    this.element.setAttribute('aria-expanded', 'false');
    this.removeActiveDescendant();
    this.isOpen = false;

    // A dropdown flips if it does not have space within the page
    if (this.isFlipped) {
      this.element.classList.remove(this.classNames.flippedState);
      this.isFlipped = false;
    }
  }

  focus() {
    if (!this.isFocussed) {
      this.element.focus();
    }
  }

  addFocusState() {
    this.element.classList.add(this.classNames.focusState);
  }

  removeFocusState() {
    this.element.classList.remove(this.classNames.focusState);
  }

  /**
   * Remove disabled state
   */
  enable() {
    this.element.classList.remove(this.config.classNames.disabledState);
    this.element.removeAttribute('aria-disabled');
    if (this.parentInstance.isSelectOneElement) {
      this.element.setAttribute('tabindex', '0');
    }
    this.isDisabled = false;
  }

  /**
   * Set disabled state
   */
  disable() {
    this.element.classList.add(this.config.classNames.disabledState);
    this.element.setAttribute('aria-disabled', 'true');
    if (this.parentInstance.isSelectOneElement) {
      this.element.setAttribute('tabindex', '-1');
    }
    this.isDisabled = true;
  }

  revert(originalElement) {
    // Move passed element back to original position
    this.element.parentNode.insertBefore(
      originalElement,
      this.element,
    );
    // Remove container
    this.element.parentNode.removeChild(this.element);
  }

  /**
   * Add loading state to element
   */
  addLoadingState() {
    this.element.classList.add(this.classNames.loadingState);
    this.element.setAttribute('aria-busy', 'true');
    this.isLoading = true;
  }

  /**
   * Remove loading state from element
   */
  removeLoadingState() {
    this.element.classList.remove(this.classNames.loadingState);
    this.element.removeAttribute('aria-busy');
    this.isLoading = false;
  }
}
