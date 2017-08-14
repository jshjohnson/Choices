const choices = (state = [], action) => {
  switch (action.type) {
    case 'ADD_CHOICE': {
      /*
          A disabled choice appears in the choice dropdown but cannot be selected
          A selected choice has been added to the passed input's value (added as an item)
          An active choice appears within the choice dropdown
       */
      return [...state, {
        id: action.id,
        elementId: action.elementId,
        groupId: action.groupId,
        value: action.value,
        label: (action.label || action.value),
        disabled: (action.disabled || false),
        selected: false,
        active: true,
        score: 9999,
        customProperties: action.customProperties,
        placeholder: (action.placeholder || false),
        keyCode: null
      }];
    }

    case 'ADD_ITEM': {
      let newState = state;

      // If all choices need to be activated
      if (action.activateOptions) {
        newState = state.map((choice) => {
          choice.active = action.active;
          return choice;
        });
      }
      // When an item is added and it has an associated choice,
      // we want to disable it so it can't be chosen again
      if (action.choiceId > -1) {
        newState = state.map((choice) => {
          if (choice.id === parseInt(action.choiceId, 10)) {
            choice.selected = true;
          }
          return choice;
        });
      }

      return newState;
    }

    case 'REMOVE_ITEM': {
      // When an item is removed and it has an associated choice,
      // we want to re-enable it so it can be chosen again
      if (action.choiceId > -1) {
        return state.map((choice) => {
          if (choice.id === parseInt(action.choiceId, 10)) {
            choice.selected = false;
          }
          return choice;
        });
      }

      return state;
    }

    case 'FILTER_CHOICES': {
      const filteredResults = action.results;
      const filteredState = state.map((choice) => {
        // Set active state based on whether choice is
        // within filtered results

        choice.active = filteredResults.some((result) => {
          if (result.item.id === choice.id) {
            choice.score = result.score;
            return true;
          }
          return false;
        });

        return choice;
      });

      return filteredState;
    }

    case 'ACTIVATE_CHOICES': {
      return state.map((choice) => {
        choice.active = action.active;
        return choice;
      });
    }

    case 'CLEAR_CHOICES': {
      return state.choices = [];
    }

    default: {
      return state;
    }
  }
};

export default choices;
