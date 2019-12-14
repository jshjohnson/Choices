import WrappedElement from './wrapped-element';
import { ClassNames } from '../interfaces';

export default class WrappedInput extends WrappedElement {
  element: HTMLInputElement;
  delimiter: string;

  constructor({ element, classNames, delimiter }) {
    super({ element, classNames });
    this.delimiter = delimiter;
  }

  get value(): string {
    return this.element.value;
  }

  set value(items: Item[]): void {
    const itemValues = items.map(({ value }) => value);
    const joinedValues = itemValues.join(this.delimiter);

    this.element.setAttribute('value', joinedValues);
    this.element.value = joinedValues;
  }
}
