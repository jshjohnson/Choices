import WrappedElement from './wrapped-element';

export default class WrappedSelect extends WrappedElement {
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

  setOptions(options) {
    this.element.innerHTML = '';
    this.element.appendChild(options);
  }

  getOptions() {
    return Array.from(this.element.options);
  }

  getOptionGroups() {
    return Array.from(this.element.getElementsByTagName('OPTGROUP'));
  }
}
