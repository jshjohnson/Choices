import { dispatchEvent } from '../lib/utils';

/**
 * @typedef {import('../../../types/index').Choices.passedElement} passedElement
 * @typedef {import('../../../types/index').Choices.ClassNames} ClassNames
 */

export default class WrappedElement {
  /**
   * @param {{
   *  element: HTMLInputElement | HTMLSelectElement,
   *  classNames: ClassNames,
   * }} args
   */
  constructor({ element, classNames }) {
    this.element = element;
    this.classNames = classNames;

    if (
      !(element instanceof HTMLInputElement) &&
      !(element instanceof HTMLSelectElement)
    ) {
      throw new TypeError('Invalid element passed');
    }

    this.isDisabled = false;
  }

  get isActive() {
    return this.element.dataset.choice === 'active';
  }

  get dir() {
    return this.element.dir;
  }

  get value() {
    return this.element.value;
  }

  set value(value) {
    // you must define setter here otherwise it will be readonly property
    this.element.value = value;
  }

  conceal() {
    // Hide passed input
    this.element.classList.add(this.classNames.input);
    this.element.hidden = true;

    // Remove element from tab index
    this.element.tabIndex = -1;

    // Backup original styles if any
    const origStyle = this.element.getAttribute('style');

    if (origStyle) {
      this.element.setAttribute('data-choice-orig-style', origStyle);
    }

    this.element.setAttribute('data-choice', 'active');
  }

  reveal() {
    // Reinstate passed element
    this.element.classList.remove(this.classNames.input);
    this.element.hidden = false;
    this.element.removeAttribute('tabindex');

    // Recover original styles if any
    const origStyle = this.element.getAttribute('data-choice-orig-style');

    if (origStyle) {
      this.element.removeAttribute('data-choice-orig-style');
      this.element.setAttribute('style', origStyle);
    } else {
      this.element.removeAttribute('style');
    }
    this.element.removeAttribute('data-choice');

    // Re-assign values - this is weird, I know
    // @todo Figure out why we need to do this
    this.element.value = this.element.value; // eslint-disable-line no-self-assign
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
