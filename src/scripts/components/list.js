import { SCROLLING_SPEED } from '../constants';

/**
 * @typedef {import('../../../types/index').Choices.Choice} Choice
 */
export default class List {
  /**
   * @param {{ element: HTMLElement }} args
   */
  constructor({ element }) {
    this.element = element;
    this.scrollPos = this.element.scrollTop;
    this.height = this.element.offsetHeight;
  }

  clear() {
    this.element.innerHTML = '';
  }

  /**
   * @param {Element} node
   */
  append(node) {
    this.element.appendChild(node);
  }

  /**
   * @param {string} selector
   * @returns {Element}
   */
  getChild(selector) {
    return this.element.querySelector(selector);
  }

  /**
   * @returns {boolean}
   */
  hasChildren() {
    return this.element.hasChildNodes();
  }

  scrollToTop() {
    this.element.scrollTop = 0;
  }

  /**
   * @param {HTMLElement} element
   * @param {1 | -1} direction
   */
  scrollToChoice(element, direction) {
    if (!element) {
      return;
    }

    const dropdownHeight = this.element.offsetHeight;
    const elementHeight = element.offsetHeight;
    // Distance from bottom of element to top of parent
    const elementPos = element.offsetTop + elementHeight;
    // Scroll position of dropdown
    const containerScrollPos = this.element.scrollTop + dropdownHeight;
    // Difference between the element and scroll position
    const destination =
      direction > 0
        ? this.element.scrollTop + elementPos - containerScrollPos
        : element.offsetTop;

    requestAnimationFrame(() => {
      this._animateScroll(destination, direction);
    });
  }

  /**
   * @param {number} scrollPos
   * @param {number} strength
   * @param {number} destination
   */
  _scrollDown(scrollPos, strength, destination) {
    const easing = (destination - scrollPos) / strength;
    const distance = easing > 1 ? easing : 1;

    this.element.scrollTop = scrollPos + distance;
  }

  /**
   * @param {number} scrollPos
   * @param {number} strength
   * @param {number} destination
   */
  _scrollUp(scrollPos, strength, destination) {
    const easing = (scrollPos - destination) / strength;
    const distance = easing > 1 ? easing : 1;

    this.element.scrollTop = scrollPos - distance;
  }

  /**
   * @param {*} destination
   * @param {*} direction
   */
  _animateScroll(destination, direction) {
    const strength = SCROLLING_SPEED;
    const choiceListScrollTop = this.element.scrollTop;
    let continueAnimation = false;

    if (direction > 0) {
      this._scrollDown(choiceListScrollTop, strength, destination);

      if (choiceListScrollTop < destination) {
        continueAnimation = true;
      }
    } else {
      this._scrollUp(choiceListScrollTop, strength, destination);

      if (choiceListScrollTop > destination) {
        continueAnimation = true;
      }
    }

    if (continueAnimation) {
      requestAnimationFrame(() => {
        this._animateScroll(destination, direction);
      });
    }
  }
}
