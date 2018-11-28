import WrappedElement from './wrapped-element';
import templates from './../templates';

export default class WrappedSelect extends WrappedElement {
  constructor({ element, classNames }) {
    super({ element, classNames });
  }

  get placeholderOption() {
    return this.element.querySelector('option[value=""]');
  }

  get optionGroups() {
    return Array.from(this.element.getElementsByTagName('OPTGROUP'));
  }

  get options() {
    return Array.from(this.element.options);
  }

  set options(options) {
    const fragment = document.createDocumentFragment();
    const addOptionToFragment = data => {
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
