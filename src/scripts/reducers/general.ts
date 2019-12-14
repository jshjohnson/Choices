import { Action } from 'redux';

export const defaultState = {
  loading: false,
};

const general = (
  state = defaultState,
  action: Action & { isLoading: boolean },
): { loading: boolean } => {
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
