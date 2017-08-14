export const addItem = (value, label, id, choiceId, groupId, customProperties, placeholder, keyCode) => {
  return {
    type: 'ADD_ITEM',
    value,
    label,
    id,
    choiceId,
    groupId,
    customProperties,
    placeholder,
    keyCode,
  };
};

export const removeItem = (id, choiceId) => {
  return {
    type: 'REMOVE_ITEM',
    id,
    choiceId,
  };
};

export const highlightItem = (id, highlighted) => {
  return {
    type: 'HIGHLIGHT_ITEM',
    id,
    highlighted,
  };
};

export const addChoice = (value, label, id, groupId, disabled, elementId, customProperties, placeholder, keyCode) => {
  return {
    type: 'ADD_CHOICE',
    value,
    label,
    id,
    groupId,
    disabled,
    elementId,
    customProperties,
    placeholder,
    keyCode
  };
};

export const filterChoices = (results) => {
  return {
    type: 'FILTER_CHOICES',
    results,
  };
};

export const activateChoices = (active = true) => {
  return {
    type: 'ACTIVATE_CHOICES',
    active,
  };
};

export const clearChoices = () => {
  return {
    type: 'CLEAR_CHOICES',
  };
};

export const addGroup = (value, id, active, disabled) => {
  return {
    type: 'ADD_GROUP',
    value,
    id,
    active,
    disabled,
  };
};

export const clearAll = () => {
  return {
    type: 'CLEAR_ALL',
  };
};
