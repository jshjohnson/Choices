export default class List {
  constructor(instance, element, classNames) {
    this.parentInstance = instance;
    this.element = element;
    this.classNames = classNames;
    this.scrollPos = this.element.scrollTop;
    this.height = this.element.offsetHeight;
    this.hasChildren = !!this.element.children;
  }

  getElement() {
    return this.element;
  }

  /**
   * Clear List contents
   */
  clear() {
    this.element.innerHTML = '';
  }

  /**
   * Scroll to passed position on Y axis
   */
  scrollTo(scrollPos = 0) {
    this.element.scrollTop = scrollPos;
  }
  /**
   * Append node to element
   */
  append(node) {
    this.element.appendChild(node);
  }

  /**
   * Find element that matches passed selector
   * @return {HTMLElement}
  */
  getChild(selector) {
    return this.element.querySelector(selector);
  }
}
