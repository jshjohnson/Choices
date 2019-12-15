import { SetIsLoadingAction } from '../actions/misc';
import { State } from '../interfaces';

export const defaultState = {
  loading: false,
};

type ActionTypes = SetIsLoadingAction;

const general = (
  state = defaultState,
  action: ActionTypes,
): State['general'] => {
  switch (action.type) {
    case 'SET_IS_LOADING': {
      return {
        loading: action.isLoading,
      };
    }

    default: {
      return state;
    }
  }
};

export default general;
