export const addItem = (
  value,
  label,
  id,
  choiceId,
  groupId,
  customProperties,
  placeholder,
  keyCode,
) => ({
  type: 'ADD_ITEM',
  value,
  label,
  id,
  choiceId,
  groupId,
  customProperties,
  placeholder,
  keyCode,
});

export const removeItem = (id, choiceId) => ({
  type: 'REMOVE_ITEM',
  id,
  choiceId,
});

export const highlightItem = (id, highlighted) => ({
  type: 'HIGHLIGHT_ITEM',
  id,
  highlighted,
});

export const addChoice = (
  value,
  label,
  id,
  groupId,
  disabled,
  elementId,
  customProperties,
  placeholder,
  keyCode,
) => ({
  type: 'ADD_CHOICE',
  value,
  label,
  id,
  groupId,
  disabled,
  elementId,
  customProperties,
  placeholder,
  keyCode,
});

export const filterChoices = results => ({
  type: 'FILTER_CHOICES',
  results,
});

export const activateChoices = (active = true) => ({
  type: 'ACTIVATE_CHOICES',
  active,
});

export const clearChoices = () => ({
  type: 'CLEAR_CHOICES',
});

export const addGroup = (value, id, active, disabled) => ({
  type: 'ADD_GROUP',
  value,
  id,
  active,
  disabled,
});

export const clearAll = () => ({
  type: 'CLEAR_ALL',
});
