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
    // https://jsperf.com/select-options-addition-performance/1
    this.element.innerHTML = '';
    // Add each list item to select
    options.forEach(optionData => this.element.add(this.template(optionData)));
  }
}
