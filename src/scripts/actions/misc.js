/**
 * @returns {{ type: string }}
 */
export const clearAll = () => ({
  type: 'CLEAR_ALL',
});

/**
 * @param {any} state
 * @returns {{ type: string, state: object }}
 */
export const resetTo = state => ({
  type: 'RESET_TO',
  state,
});

/**
 * @param {boolean} isLoading
 * @returns {{ type: string, isLoading: boolean }}
 */
export const setIsLoading = isLoading => ({
  type: 'SET_IS_LOADING',
  isLoading,
});
