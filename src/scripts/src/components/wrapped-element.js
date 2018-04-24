import { dispatchEvent } from '../lib/utils';

export default class WrappedElement {
  constructor(instance, element, classNames) {
    this.parentInstance = instance;
    this.element = element;
    this.classNames = classNames;
    this.isDisabled = false;
  }

  get value() {
    return this.element.value;
  }

  conceal() {
    // Hide passed input
    this.element.classList.add(
      this.classNames.input,
      this.classNames.hiddenState,
    );

    // Remove element from tab index
    this.element.tabIndex = '-1';

    // Backup original styles if any
    const origStyle = this.element.getAttribute('style');

    if (origStyle) {
      this.element.setAttribute('data-choice-orig-style', origStyle);
    }

    this.element.setAttribute('aria-hidden', 'true');
    this.element.setAttribute('data-choice', 'active');
  }

  reveal() {
    // Reinstate passed element
    this.element.classList.remove(
      this.classNames.input,
      this.classNames.hiddenState,
    );
    this.element.removeAttribute('tabindex');

    // Recover original styles if any
    const origStyle = this.element.getAttribute('data-choice-orig-style');

    if (origStyle) {
      this.element.removeAttribute('data-choice-orig-style');
      this.element.setAttribute('style', origStyle);
    } else {
      this.element.removeAttribute('style');
    }
    this.element.removeAttribute('aria-hidden');
    this.element.removeAttribute('data-choice');

    // Re-assign values - this is weird, I know
    this.element.value = this.element.value;
  }

  enable() {
    this.element.removeAttribute('disabled');
    this.element.disabled = false;
    this.isDisabled = false;
  }

  disable() {
    this.element.setAttribute('disabled', '');
    this.element.disabled = true;
    this.isDisabled = true;
  }

  triggerEvent(eventType, data) {
    dispatchEvent(this.element, eventType, data);
  }
}
