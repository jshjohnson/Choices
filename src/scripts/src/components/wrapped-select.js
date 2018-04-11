import WrappedElement from './wrapped-element';
import templates from './../templates';
import { arrayFrom } from '../lib/utils';

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
    super.disable();
  }

  getPlaceholderOption() {
    return this.element.querySelector('option[placeholder]');
  }

  getOptions() {
    return arrayFrom(this.element.options);
  }

  getOptionGroups() {
    return arrayFrom(this.element.getElementsByTagName('OPTGROUP'));
  }

  setOptions(options) {
    const fragment = document.createDocumentFragment();
    const addOptionToFragment = (data) => {
      // Create a standard select option
      const template = templates.option(data);
      // Append it to fragment
      fragment.appendChild(template);
    };

    // Add each list item to list
    options.forEach(optionData => addOptionToFragment(optionData));

    this.appendDocFragment(fragment);
  }

  appendDocFragment(fragment) {
    this.element.innerHTML = '';
    this.element.appendChild(fragment);
  }
}
