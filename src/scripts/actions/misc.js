/**
 * @typedef {import('redux').Action} Action
 */

/**
 * @returns {Action}
 */
export const clearAll = () => ({
  type: 'CLEAR_ALL',
});

/**
 * @param {any} state
 * @returns {Action & { state: object }}
 */
export const resetTo = state => ({
  type: 'RESET_TO',
  state,
});

/**
 * @param {boolean} isLoading
 * @returns {Action & { isLoading: boolean }}
 */
export const setIsLoading = isLoading => ({
  type: 'SET_IS_LOADING',
  isLoading,
});
