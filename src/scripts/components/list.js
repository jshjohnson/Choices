import { SCROLLING_SPEED } from '../constants';

export default class List {
  constructor({ element }) {
    this.element = element;
    this.scrollPos = this.element.scrollTop;
    this.height = this.element.offsetHeight;
  }

  clear() {
    this.element.innerHTML = '';
  }

  append(node) {
    this.element.appendChild(node);
  }

  getChild(selector) {
    return this.element.querySelector(selector);
  }

  hasChildren() {
    return this.element.hasChildNodes();
  }

  scrollToTop() {
    this.element.scrollTop = 0;
  }

  scrollToChoice(choice, direction) {
    if (!choice) {
      return;
    }

    const dropdownHeight = this.element.offsetHeight;
    const choiceHeight = choice.offsetHeight;
    // Distance from bottom of element to top of parent
    const choicePos = choice.offsetTop + choiceHeight;
    // Scroll position of dropdown
    const containerScrollPos = this.element.scrollTop + dropdownHeight;
    // Difference between the choice and scroll position
    const destination =
      direction > 0
        ? this.element.scrollTop + choicePos - containerScrollPos
        : choice.offsetTop;

    requestAnimationFrame(time => {
      this._animateScroll(time, destination, direction);
    });
  }

  _scrollDown(scrollPos, strength, destination) {
    const easing = (destination - scrollPos) / strength;
    const distance = easing > 1 ? easing : 1;

    this.element.scrollTop = scrollPos + distance;
  }

  _scrollUp(scrollPos, strength, destination) {
    const easing = (scrollPos - destination) / strength;
    const distance = easing > 1 ? easing : 1;

    this.element.scrollTop = scrollPos - distance;
  }

  _animateScroll(time, destination, direction) {
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
        this._animateScroll(time, destination, direction);
      });
    }
  }
}
