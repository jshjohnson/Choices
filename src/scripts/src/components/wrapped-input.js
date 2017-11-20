import WrappedElement from './wrapped-element';

export default class WrappedInput extends WrappedElement {
  constructor(instance, element, classNames) {
    super(instance, element, classNames);
    this.parentInstance = instance;
    this.element = element;
    this.classNames = classNames;
  }

  getElement() {
    super.getElement();
  }

  conceal() {
    super.conceal();
  }

  reveal() {
    super.reveal();
  }

  enable() {
    super.enable();
  }

  disable() {
    super.enable();
  }

  setValue(value) {
    this.element.setAttribute('value', value);
    this.element.value = value;
  }
}
