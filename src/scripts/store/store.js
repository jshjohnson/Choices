import { createStore } from 'redux';
import rootReducer from './../reducers/index';

export default class Store {
  constructor() {
    this._store = createStore(
      rootReducer,
      window.__REDUX_DEVTOOLS_EXTENSION__ &&
        window.__REDUX_DEVTOOLS_EXTENSION__(),
    );
  }

  /**
   * Subscribe store to function call (wrapped Redux method)
   * @param  {Function} onChange Function to trigger when state changes
   * @return
   */
  subscribe(onChange) {
    this._store.subscribe(onChange);
  }

  /**
   * Dispatch event to store (wrapped Redux method)
   * @param  {Function} action Action function to trigger
   * @return
   */
  dispatch(action) {
    this._store.dispatch(action);
  }

  /**
   * Get store object (wrapping Redux method)
   * @return {Object} State
   */
  get state() {
    return this._store.getState();
  }

  /**
   * Get items from store
   * @return {Array} Item objects
   */
  get items() {
    return this.state.items;
  }

  /**
   * Get active items from store
   * @return {Array} Item objects
   */
  get activeItems() {
    return this.items.filter(item => item.active === true);
  }

  /**
   * Get highlighted items from store
   * @return {Array} Item objects
   */
  get highlightedActiveItems() {
    return this.items.filter(item => item.active && item.highlighted);
  }

  /**
   * Get choices from store
   * @return {Array} Option objects
   */
  get choices() {
    return this.state.choices;
  }

  /**
   * Get active choices from store
   * @return {Array} Option objects
   */
  get activeChoices() {
    const choices = this.choices;
    const values = choices.filter(choice => choice.active === true);

    return values;
  }

  /**
   * Get selectable choices from store
   * @return {Array} Option objects
   */
  get selectableChoices() {
    return this.choices.filter(choice => choice.disabled !== true);
  }

  /**
   * Get choices that can be searched (excluding placeholders)
   * @return {Array} Option objects
   */
  get searchableChoices() {
    return this.selectableChoices.filter(choice => choice.placeholder !== true);
  }

  /**
   * Get placeholder choice from store
   * @return {Object} Found placeholder
   */
  get placeholderChoice() {
    return [...this.choices]
      .reverse()
      .find(choice => choice.placeholder === true);
  }

  /**
   * Get groups from store
   * @return {Array} Group objects
   */
  get groups() {
    return this.state.groups;
  }

  /**
   * Get active groups from store
   * @return {Array} Group objects
   */
  get activeGroups() {
    const groups = this.groups;
    const choices = this.choices;

    return groups.filter(group => {
      const isActive = group.active === true && group.disabled === false;
      const hasActiveOptions = choices.some(
        choice => choice.active === true && choice.disabled === false,
      );
      return isActive && hasActiveOptions;
    }, []);
  }

  /**
   * Get loading state from store
   * @return {Boolean} Loading State
   */
  isLoading() {
    return this.state.general.loading;
  }

  /**
   * Get single choice by it's ID
   * @return {Object} Found choice
   */
  getChoiceById(id) {
    if (id) {
      const choices = this.activeChoices;
      const foundChoice = choices.find(
        choice => choice.id === parseInt(id, 10),
      );
      return foundChoice;
    }
    return false;
  }

  /**
   * Get group by group id
   * @param  {Number} id Group ID
   * @return {Object}    Group data
   */
  getGroupById(id) {
    return this.groups.find(group => group.id === parseInt(id, 10));
  }
}
