export const defaultState = {
  loading: false,
};

const general = (state = defaultState, action) => {
  switch (action.type) {
    case 'LOADING': {
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
