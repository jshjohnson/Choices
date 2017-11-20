export default class Dropdown {
  constructor(instance, element, classNames) {
    this.parentInstance = instance;
    this.element = element;
    this.classNames = classNames;
    this.dimensions = null;
    this.position = null;
    this.isActive = false;
  }

  getElement() {
    return this.element;
  }

  /**
   * Determine how far the top of our element is from
   * the top of the window
   * @return {Number} Vertical position
   */
  getVerticalPos() {
    this.dimensions = this.element.getBoundingClientRect();
    this.position = Math.ceil(this.dimensions.top + window.pageYOffset + this.element.offsetHeight);
    return this.position;
  }

  /**
   * Find element that matches passed selector
   * @return {HTMLElement}
   */
  getChild(selector) {
    return this.element.querySelector(selector);
  }

  /**
   * Show dropdown to user by adding active state class
   * @return {Object} Class instance
   * @public
   */
  show() {
    this.element.classList.add(this.classNames.activeState);
    this.element.setAttribute('aria-expanded', 'true');
    this.isActive = true;
    return this.parentInstance;
  }

  /**
   * Hide dropdown from user
   * @return {Object} Class instance
   * @public
   */
  hide() {
    this.element.classList.remove(this.classNames.activeState);
    this.element.setAttribute('aria-expanded', 'false');
    this.isActive = false;
    return this.parentInstance;
  }
}
