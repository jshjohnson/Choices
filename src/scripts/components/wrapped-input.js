import WrappedElement from './wrapped-element';

/**
 * @typedef {import('../../../types/index').Choices.ClassNames} ClassNames
 * @typedef {import('../../../types/index').Choices.Item} Item
 */

export default class WrappedInput extends WrappedElement {
  /**
   * @param {{
   *  element: HTMLInputElement,
   *  classNames: ClassNames,
   *  delimiter: string
   * }} args
   */
  constructor({ element, classNames, delimiter }) {
    super({ element, classNames });
    this.delimiter = delimiter;
  }

  /**
   * @returns {string}
   */
  get value() {
    return this.element.value;
  }

  /**
   * @param {Item[]} items
   */
  set value(items) {
    const itemValues = items.map(({ value }) => value);
    const joinedValues = itemValues.join(this.delimiter);

    this.element.setAttribute('value', joinedValues);
    this.element.value = joinedValues;
  }
}
