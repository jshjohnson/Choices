export default class Dropdown {
  constructor({ element, type, classNames }) {
    Object.assign(this, { element, type, classNames });

    this.isActive = false;
  }

  /**
   * Determine how far the top of our element is from
   * the top of the window
   * @return {Number} Vertical position
   */
  distanceFromTopWindow() {
    this.dimensions = this.element.getBoundingClientRect();
    this.position = Math.ceil(
      this.dimensions.top + window.pageYOffset + this.element.offsetHeight,
    );

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

    return this;
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

    return this;
  }
}
