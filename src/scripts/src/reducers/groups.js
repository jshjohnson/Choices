export const defaultState = [];

export default function groups(state = defaultState, action) {
  switch (action.type) {
    case 'ADD_GROUP': {
      return [...state, {
        id: action.id,
        value: action.value,
        active: action.active,
        disabled: action.disabled,
      }];
    }

    case 'CLEAR_CHOICES': {
      return [];
    }

    default: {
      return state;
    }
  }
}
