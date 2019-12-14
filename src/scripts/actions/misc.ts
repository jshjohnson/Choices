import { Action } from 'redux';
import { State } from '../interfaces';

export const clearAll = (): Action => ({
  type: 'CLEAR_ALL',
});

export const resetTo = (state: State): Action & { state: State } => ({
  type: 'RESET_TO',
  state,
});

export const setIsLoading = (
  isLoading: boolean,
): Action & { isLoading: boolean } => ({
  type: 'SET_IS_LOADING',
  isLoading,
});
