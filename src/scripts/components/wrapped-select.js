import WrappedElement from './wrapped-element';

export default class WrappedSelect extends WrappedElement {
  constructor({ element, classNames, template }) {
    super({ element, classNames });
    this.template = template;
  }

  get placeholderOption() {
    return (
      this.element.querySelector('option[value=""]') ||
      // Backward compatibility layer for the non-standard placeholder attribute supported in older versions.
      this.element.querySelector('option[placeholder]')
    );
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
      const option = this.template(data);
      // Append it to fragment
      fragment.appendChild(option);
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
