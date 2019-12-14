import { createStore } from 'redux';
import rootReducer from '../reducers/index';
import { Choice, Group, Item } from '../interfaces';

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
  subscribe(onChange): void {
    this._store.subscribe(onChange);
  }

  /**
   * Dispatch event to store (wrapped Redux method)
   * @param  {{ type: string, [x: string]: any }} action Action to trigger
   * @return
   */
  dispatch(action): void {
    this._store.dispatch(action);
  }

  /**
   * Get store object (wrapping Redux method)
   * @returns {object} State
   */
  get state(): any {
    return this._store.getState();
  }

  /**
   * Get items from store
   * @returns {Item[]} Item objects
   */
  get items(): Item[] {
    return this.state.items;
  }

  /**
   * Get active items from store
   * @returns {Item[]} Item objects
   */
  get activeItems(): Item[] {
    return this.items.filter(item => item.active === true);
  }

  /**
   * Get highlighted items from store
   * @returns {Item[]} Item objects
   */
  get highlightedActiveItems(): Item[] {
    return this.items.filter(item => item.active && item.highlighted);
  }

  /**
   * Get choices from store
   * @returns {Choice[]} Option objects
   */
  get choices(): Choice[] {
    return this.state.choices;
  }

  /**
   * Get active choices from store
   * @returns {Choice[]} Option objects
   */
  get activeChoices(): Choice[] {
    return this.choices.filter(choice => choice.active === true);
  }

  /**
   * Get selectable choices from store
   * @returns {Choice[]} Option objects
   */
  get selectableChoices(): Choice[] {
    return this.choices.filter(choice => choice.disabled !== true);
  }

  /**
   * Get choices that can be searched (excluding placeholders)
   * @returns {Choice[]} Option objects
   */
  get searchableChoices(): Choice[] {
    return this.selectableChoices.filter(choice => choice.placeholder !== true);
  }

  /**
   * Get placeholder choice from store
   * @returns {Choice | undefined} Found placeholder
   */
  get placeholderChoice(): Choice | undefined {
    return [...this.choices]
      .reverse()
      .find(choice => choice.placeholder === true);
  }

  /**
   * Get groups from store
   * @returns {Group[]} Group objects
   */
  get groups(): Group[] {
    return this.state.groups;
  }

  /**
   * Get active groups from store
   * @returns {Group[]} Group objects
   */
  get activeGroups(): Group[] {
    const { groups, choices } = this;

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
   * @returns {boolean} Loading State
   */
  isLoading(): boolean {
    return this.state.general.loading;
  }

  /**
   * Get single choice by it's ID
   * @param {string} id
   * @returns {Choice | undefined} Found choice
   */
  getChoiceById(id): Choice | undefined {
    return this.activeChoices.find(choice => choice.id === parseInt(id, 10));
  }

  /**
   * Get group by group id
   * @param  {number} id Group ID
   * @returns {Group | undefined} Group data
   */
  getGroupById(id): Group | undefined {
    return this.groups.find(group => group.id === id);
  }
}
