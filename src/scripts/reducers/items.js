export const defaultState = [];

export default function items(state = defaultState, action) {
  switch (action.type) {
    case 'ADD_ITEM': {
      // Add object to items array
      const newState = [
        ...state,
        {
          id: action.id,
          choiceId: action.choiceId,
          groupId: action.groupId,
          value: action.value,
          label: action.label,
          active: true,
          highlighted: false,
          customProperties: action.customProperties,
          placeholder: action.placeholder || false,
          keyCode: null,
        },
      ];

      return newState.map(obj => {
        const item = obj;
        item.highlighted = false;

        return item;
      });
    }

    case 'REMOVE_ITEM': {
      // Set item to inactive
      return state.map(obj => {
        const item = obj;
        if (item.id === action.id) {
          item.active = false;
        }

        return item;
      });
    }

    case 'HIGHLIGHT_ITEM': {
      return state.map(obj => {
        const item = obj;
        if (item.id === action.id) {
          item.highlighted = action.highlighted;
        }

        return item;
      });
    }

    default: {
      return state;
    }
  }
}
