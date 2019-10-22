import WrappedElement from './wrapped-element';

export default class WrappedInput extends WrappedElement {
  constructor({ element, classNames, delimiter }) {
    super({ element, classNames });
    this.delimiter = delimiter;
  }

  set value(items) {
    const itemValues = items.map(({ value }) => value);
    const joinedValues = itemValues.join(this.delimiter);

    this.element.setAttribute('value', joinedValues);
    this.element.value = joinedValues;
  }

  get value() {
    return this.element.value;
  }
}
