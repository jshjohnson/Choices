export const clearAll = () => ({
  type: 'CLEAR_ALL',
});

/**
 * @param {any} state
 * @returns {{type: string, state: any}}
 */
export const resetTo = state => ({
  type: 'RESET_TO',
  state,
});
