export const clearAll = () => ({
  type: 'CLEAR_ALL',
});

/**
 * @param {object} state
 */
export const resetTo = state => ({
  type: 'RESET_TO',
  state,
});
