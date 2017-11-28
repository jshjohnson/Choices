import { expect } from 'chai';
import { DEFAULT_CLASSNAMES } from './constants';
import { TEMPLATES } from './templates';

describe('templates', () => {
  let getTemplate = (template, ...args) =>
    TEMPLATES[template].call(this, DEFAULT_CLASSNAMES, ...args);

  describe('itemSelectText', () => {
    let data;

    beforeEach(() => {
      data = {
        id: 1,
        value: 1,
        elementId: 1,
        groupId: 0,
        label: 'test',
      }
    });

    it('Allows showing itemSelectText', () => {
      let element = getTemplate('choice', data, 'Press to select');
      expect(element.classList.contains(DEFAULT_CLASSNAMES.selectableContent))
        .to.equal(true);
    });

    it('Allows hiding itemSelectText', () => {
      let element = getTemplate('choice', data, '');
      expect(element.classList.contains(DEFAULT_CLASSNAMES.selectableContent))
        .to.equal(false);
    });
  });
});
