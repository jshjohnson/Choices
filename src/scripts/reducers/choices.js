export const defaultState = [];

export default function choices(state = defaultState, action) {
  switch (action.type) {
    case 'ADD_CHOICE': {
      /*
          A disabled choice appears in the choice dropdown but cannot be selected
          A selected choice has been added to the passed input's value (added as an item)
          An active choice appears within the choice dropdown
       */
      return [
        ...state,
        {
          id: action.id,
          elementId: action.elementId,
          groupId: action.groupId,
          value: action.value,
          label: action.label || action.value,
          disabled: action.disabled || false,
          selected: false,
          active: true,
          score: 9999,
          customProperties: action.customProperties,
          placeholder: action.placeholder || false,
          keyCode: null,
        },
      ];
    }

    case 'ADD_ITEM': {
      // If all choices need to be activated
      if (action.activateOptions) {
        return state.map(obj => {
          const choice = obj;
          choice.active = action.active;

          return choice;
        });
      }

      // When an item is added and it has an associated choice,
      // we want to disable it so it can't be chosen again
      if (action.choiceId > -1) {
        return state.map(obj => {
          const choice = obj;
          if (choice.id === parseInt(action.choiceId, 10)) {
            choice.selected = true;
          }

          return choice;
        });
      }

      return state;
    }

    case 'REMOVE_ITEM': {
      // When an item is removed and it has an associated choice,
      // we want to re-enable it so it can be chosen again
      if (action.choiceId > -1) {
        return state.map(obj => {
          const choice = obj;
          if (choice.id === parseInt(action.choiceId, 10)) {
            choice.selected = false;
          }

          return choice;
        });
      }

      return state;
    }

    case 'FILTER_CHOICES': {
      return state.map(obj => {
        const choice = obj;
        // Set active state based on whether choice is
        // within filtered results
        choice.active = action.results.some(({ item, score }) => {
          if (item.id === choice.id) {
            choice.score = score;

            return true;
          }

          return false;
        });

        return choice;
      });
    }

    case 'ACTIVATE_CHOICES': {
      return state.map(obj => {
        const choice = obj;
        choice.active = action.active;

        return choice;
      });
    }

    case 'CLEAR_CHOICES': {
      return defaultState;
    }

    default: {
      return state;
    }
  }
}
