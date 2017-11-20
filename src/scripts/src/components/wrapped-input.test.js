import { expect } from 'chai';
import WrappedInput from './wrapped-input';
import { DEFAULT_CLASSNAMES, DEFAULT_CONFIG } from '../constants';

describe('components/wrappedInput', () => {
  let instance;
  let choicesInstance;
  let choicesElement;

  beforeEach(() => {
    choicesInstance = {
      config: {
        ...DEFAULT_CONFIG,
      },
    };
    choicesElement = document.createElement('input');
    instance = new WrappedInput(choicesInstance, choicesElement, DEFAULT_CLASSNAMES);
  });
});
