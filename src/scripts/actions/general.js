/**
 * @param {boolean} isLoading
 * @returns {{type: string, isLoading: boolean}}
 */
export const setIsLoading = isLoading => ({
  type: 'SET_IS_LOADING',
  isLoading,
});
