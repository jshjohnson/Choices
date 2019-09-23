import { expect } from 'chai';
import templates from './templates';
import { getType, strToEl } from './lib/utils';

const stripElement = element =>
  element.outerHTML.replace(/(^|>)\s+|\s+(?=<|$)/g, '$1');

describe('templates', () => {
  describe('containerOuter', () => {
    const classes = {
      containerOuter: 'test',
    };
    const direction = 'rtl';

    describe('select element', () => {
      describe('search enabled', () => {
        it('returns expected html', () => {
          const isSelectElement = true;
          const isSelectOneElement = false;
          const searchEnabled = true;
          const passedElementType = 'select-multiple';

          const expectedOutput = strToEl(`
            <div
              class="${classes.containerOuter}"
              data-type="${passedElementType}"
              role="combobox"
              aria-autocomplete="list"
              aria-haspopup="true"
              aria-expanded="false"
              dir="${direction}"
              >
            </div>
          `);
          const actualOutput = templates.containerOuter(
            classes,
            direction,
            isSelectElement,
            isSelectOneElement,
            searchEnabled,
            passedElementType,
          );

          expect(getType(actualOutput)).to.equal('HTMLDivElement');
          expect(stripElement(actualOutput)).to.equal(
            stripElement(expectedOutput),
          );
        });
      });

      describe('search disabled', () => {
        it('returns expected html', () => {
          const isSelectElement = true;
          const isSelectOneElement = false;
          const searchEnabled = false;
          const passedElementType = 'select-multiple';

          const expectedOutput = strToEl(`
            <div
              class="${classes.containerOuter}"
              data-type="${passedElementType}"
              role="listbox"
              aria-haspopup="true"
              aria-expanded="false"
              dir="${direction}"
              >
            </div>
          `);
          const actualOutput = templates.containerOuter(
            classes,
            direction,
            isSelectElement,
            isSelectOneElement,
            searchEnabled,
            passedElementType,
          );

          expect(getType(actualOutput)).to.equal('HTMLDivElement');
          expect(stripElement(actualOutput)).to.equal(
            stripElement(expectedOutput),
          );
        });
      });

      describe('select one element', () => {
        it('returns expected html', () => {
          const isSelectElement = true;
          const isSelectOneElement = true;
          const searchEnabled = false;
          const passedElementType = 'select-one';

          const expectedOutput = strToEl(`
            <div
              class="${classes.containerOuter}"
              data-type="${passedElementType}"
              role="listbox"
              tabindex="0"
              aria-haspopup="true"
              aria-expanded="false"
              dir="${direction}"
              >
            </div>
          `);
          const actualOutput = templates.containerOuter(
            classes,
            direction,
            isSelectElement,
            isSelectOneElement,
            searchEnabled,
            passedElementType,
          );

          expect(getType(actualOutput)).to.equal('HTMLDivElement');
          expect(stripElement(actualOutput)).to.equal(
            stripElement(expectedOutput),
          );
        });
      });
    });

    describe('non select element', () => {
      it('returns expected html', () => {
        const isSelectElement = false;
        const isSelectOneElement = false;
        const searchEnabled = false;
        const passedElementType = 'text';

        const expectedOutput = strToEl(`
          <div
            class="${classes.containerOuter}"
            data-type="${passedElementType}"
            aria-haspopup="true"
            aria-expanded="false"
            dir="${direction}"
            >
          </div>
        `);
        const actualOutput = templates.containerOuter(
          classes,
          direction,
          isSelectElement,
          isSelectOneElement,
          searchEnabled,
          passedElementType,
        );

        expect(getType(actualOutput)).to.equal('HTMLDivElement');
        expect(stripElement(actualOutput)).to.equal(
          stripElement(expectedOutput),
        );
      });
    });
  });

  describe('containerInner', () => {
    it('returns expected html', () => {
      const classes = {
        containerInner: 'test',
      };
      const expectedOutput = strToEl(
        `<div class="${classes.containerInner}"></div>`,
      );
      const actualOutput = templates.containerInner(classes);

      expect(getType(actualOutput)).to.equal('HTMLDivElement');
      expect(stripElement(actualOutput)).to.equal(stripElement(expectedOutput));
    });
  });

  describe('itemList', () => {
    const classes = {
      list: 'test 1',
      listSingle: 'test 2',
      listItems: 'test 3',
    };

    describe('select one element', () => {
      it('returns expected html', () => {
        const expectedOutput = strToEl(
          `<div class="${classes.list} ${classes.listSingle}"></div>`,
        );
        const actualOutput = templates.itemList(classes, true);

        expect(getType(actualOutput)).to.equal('HTMLDivElement');
        expect(stripElement(actualOutput)).to.equal(
          stripElement(expectedOutput),
        );
      });
    });

    describe('non select one element', () => {
      it('returns expected html', () => {
        const expectedOutput = strToEl(
          `<div class="${classes.list} ${classes.listItems}"></div>`,
        );
        const actualOutput = templates.itemList(classes, false);

        expect(getType(actualOutput)).to.equal('HTMLDivElement');
        expect(stripElement(actualOutput)).to.equal(
          stripElement(expectedOutput),
        );
      });
    });
  });

  describe('placeholder', () => {
    it('returns expected html', () => {
      const classes = {
        placeholder: 'test',
      };
      const value = 'test';
      const expectedOutput = strToEl(`
        <div class="${classes.placeholder}">${value}</div>`);
      const actualOutput = templates.placeholder(classes, value);

      expect(getType(actualOutput)).to.equal('HTMLDivElement');
      expect(stripElement(actualOutput)).to.equal(stripElement(expectedOutput));
    });
  });

  // describe('item', () => {

  // });

  describe('choiceList', () => {
    const classes = {
      list: 'test',
    };

    describe('select one element', () => {
      it('returns expected html', () => {
        const expectedOutput = strToEl(`
          <div
            class="${classes.list}"
            dir="ltr"
            role="listbox"
            >
          </div>
        `);
        const actualOutput = templates.choiceList(classes, true);

        expect(getType(actualOutput)).to.equal('HTMLDivElement');
        expect(stripElement(actualOutput)).to.equal(
          stripElement(expectedOutput),
        );
      });
    });

    describe('non select one element', () => {
      it('returns expected html', () => {
        const expectedOutput = strToEl(`
          <div
            class="${classes.list}"
            dir="ltr"
            role="listbox"
            aria-multiselectable="true"
            >
          </div>
        `);
        const actualOutput = templates.choiceList(classes, false);

        expect(getType(actualOutput)).to.equal('HTMLDivElement');
        expect(stripElement(actualOutput)).to.equal(
          stripElement(expectedOutput),
        );
      });
    });
  });

  describe('choiceGroup', () => {
    const classes = {
      group: 'test 1',
      groupHeading: 'test 2',
      itemDisabled: 'test 3',
    };

    let data;

    beforeEach(() => {
      data = {
        id: 1,
        value: 'test',
        disabled: false,
      };
    });

    describe('enabled state', () => {
      it('returns expected html', () => {
        const expectedOutput = strToEl(`
          <div
          class="${classes.group}"
            data-group
            data-id="${data.id}"
            data-value="${data.value}"
            role="group"
            >
            <div class="${classes.groupHeading}">${data.value}</div>
          </div>
        `);
        const actualOutput = templates.choiceGroup(classes, data);

        expect(getType(actualOutput)).to.equal('HTMLDivElement');
        expect(stripElement(actualOutput)).to.equal(
          stripElement(expectedOutput),
        );
      });
    });

    describe('disabled state', () => {
      beforeEach(() => {
        data = {
          ...data,
          disabled: true,
        };
      });

      it('returns expected html', () => {
        const expectedOutput = strToEl(`
          <div
            class="${classes.group} ${classes.itemDisabled}"
            data-group
            data-id="${data.id}"
            data-value="${data.value}"
            role="group"
            aria-disabled="true"
            >
            <div class="${classes.groupHeading}">${data.value}</div>
          </div>
        `);
        const actualOutput = templates.choiceGroup(classes, data);

        expect(getType(actualOutput)).to.equal('HTMLDivElement');
        expect(stripElement(actualOutput)).to.equal(
          stripElement(expectedOutput),
        );
      });
    });
  });

  describe('choice', () => {
    const classes = {
      item: 'test 1',
      itemChoice: 'test 2',
      itemDisabled: 'test 3',
      itemSelectable: 'test 4',
      placeholder: 'test 5',
    };

    const itemSelectText = 'test 6';

    let data;

    beforeEach(() => {
      data = {
        id: 1,
        groupId: -1,
        disabled: false,
        elementId: 'test',
        label: 'test',
        value: 'test',
      };
    });

    describe('enabled state', () => {
      it('returns expected html', () => {
        const expectedOutput = strToEl(`
          <div
            class="${classes.item} ${classes.itemChoice} ${
          classes.itemSelectable
        }"
            data-select-text="${itemSelectText}"
            data-choice
            data-id="${data.id}"
            data-value="${data.value}"
            data-choice-selectable
            id="${data.elementId}"
            role="option"
            >
            ${data.label}
          </div>
        `);
        const actualOutput = templates.choice(classes, data, itemSelectText);

        expect(getType(actualOutput)).to.equal('HTMLDivElement');
        expect(stripElement(actualOutput)).to.equal(
          stripElement(expectedOutput),
        );
      });
    });

    describe('disabled state', () => {
      beforeEach(() => {
        data = {
          ...data,
          disabled: true,
        };
      });

      it('returns expected html', () => {
        const expectedOutput = strToEl(`
          <div
            class="${classes.item} ${classes.itemChoice} ${
          classes.itemDisabled
        }"
            data-select-text="${itemSelectText}"
            data-choice
            data-id="${data.id}"
            data-value="${data.value}"
            data-choice-disabled
            aria-disabled="true"
            id="${data.elementId}"
            role="option"
            >
            ${data.label}
          </div>
        `);
        const actualOutput = templates.choice(classes, data, itemSelectText);

        expect(getType(actualOutput)).to.equal('HTMLDivElement');
        expect(stripElement(actualOutput)).to.equal(
          stripElement(expectedOutput),
        );
      });
    });

    describe('placeholder', () => {
      beforeEach(() => {
        data = {
          ...data,
          placeholder: true,
        };
      });

      it('returns expected html', () => {
        const expectedOutput = strToEl(`
          <div
            class="${classes.item} ${classes.itemChoice} ${
          classes.itemSelectable
        } ${classes.placeholder}"
            data-select-text="${itemSelectText}"
            data-choice
            data-id="${data.id}"
            data-value="${data.value}"
            data-choice-selectable
            id="${data.elementId}"
            role="option"
            >
            ${data.label}
          </div>
        `);
        const actualOutput = templates.choice(classes, data, itemSelectText);

        expect(getType(actualOutput)).to.equal('HTMLDivElement');
        expect(stripElement(actualOutput)).to.equal(
          stripElement(expectedOutput),
        );
      });
    });

    describe('child of group', () => {
      beforeEach(() => {
        data = {
          ...data,
          groupId: 1,
        };
      });

      it('returns expected html', () => {
        const expectedOutput = strToEl(`
          <div
            class="${classes.item} ${classes.itemChoice} ${
          classes.itemSelectable
        }"
            data-select-text="${itemSelectText}"
            data-choice
            data-id="${data.id}"
            data-value="${data.value}"
            data-choice-selectable
            id="${data.elementId}"
            role="treeitem"
            >
            ${data.label}
          </div>
        `);
        const actualOutput = templates.choice(classes, data, itemSelectText);

        expect(getType(actualOutput)).to.equal('HTMLDivElement');
        expect(stripElement(actualOutput)).to.equal(
          stripElement(expectedOutput),
        );
      });
    });
  });

  describe('input', () => {
    const classes = {
      input: 'test 1',
      inputCloned: 'test 2',
    };

    it('returns expected html', () => {
      const expectedOutput = strToEl(`
        <input
          type="text"
          class="${classes.input} ${classes.inputCloned}"
          autocomplete="off"
          autocapitalize="off"
          spellcheck="false"
          role="textbox"
          aria-autocomplete="list"
          aria-label="test placeholder"
        >
      `);
      const actualOutput = templates.input(classes, 'test placeholder');

      expect(getType(actualOutput)).to.equal('HTMLInputElement');
      expect(stripElement(actualOutput)).to.equal(stripElement(expectedOutput));
    });
  });

  describe('dropdown', () => {
    const classes = {
      list: 'test 1',
      listDropdown: 'test 2',
    };
    it('returns expected html', () => {
      const value = 'test';
      const expectedOutput = strToEl(
        `<div class="${classes.list} ${
          classes.listDropdown
        }" aria-expanded="false"></div>`,
      );
      const actualOutput = templates.dropdown(classes, value);

      expect(getType(actualOutput)).to.equal('HTMLDivElement');
      expect(stripElement(actualOutput)).to.equal(stripElement(expectedOutput));
    });
  });

  describe('notice', () => {
    const classes = {
      item: 'test 1',
      itemChoice: 'test 2',
      noResults: 'test 3',
      noChoices: 'test 4',
    };

    const label = 'test';

    it('returns expected html', () => {
      const expectedOutput = strToEl(`
        <div class="${classes.item} ${classes.itemChoice}">
          ${label}
        </div>
      `);
      const actualOutput = templates.notice(classes, label);

      expect(getType(actualOutput)).to.equal('HTMLDivElement');
      expect(stripElement(actualOutput)).to.equal(stripElement(expectedOutput));
    });

    describe('passing a notice type', () => {
      describe('no results', () => {
        it('adds no results classname', () => {
          const expectedOutput = strToEl(`
            <div class="${classes.item} ${classes.itemChoice} ${
            classes.noResults
          }">
              ${label}
            </div>
          `);
          const actualOutput = templates.notice(classes, label, 'no-results');

          expect(stripElement(actualOutput)).to.equal(
            stripElement(expectedOutput),
          );
        });
      });

      describe('no choices', () => {
        it('adds no choices classname', () => {
          const expectedOutput = strToEl(`
            <div class="${classes.item} ${classes.itemChoice} ${
            classes.noChoices
          }">
              ${label}
            </div>
          `);
          const actualOutput = templates.notice(classes, label, 'no-choices');

          expect(stripElement(actualOutput)).to.equal(
            stripElement(expectedOutput),
          );
        });
      });
    });
  });

  describe('option', () => {
    let data;

    beforeEach(() => {
      data = {
        disabled: false,
        selected: false,
        value: 'test value',
        label: 'test label',
      };
    });

    it('returns expected html', () => {
      const expectedOutput = strToEl(
        `<option value="${data.value}" ${data.selected ? 'selected' : ''} ${
          data.disabled ? 'disabled' : ''
        }>${data.label}</option>`,
      );
      const actualOutput = templates.option(data);

      expect(getType(actualOutput)).to.equal('HTMLOptionElement');
      expect(stripElement(actualOutput)).to.equal(stripElement(expectedOutput));
    });

    describe('when selected', () => {
      beforeEach(() => {
        data = {
          ...data,
          active: true,
        };
      });

      it('sets selected attr to true', () => {
        const output = templates.option(data);
        expect(output.selected).to.equal(true);
      });
    });

    describe('when disabled', () => {
      beforeEach(() => {
        data = {
          ...data,
          disabled: true,
        };
      });

      it('sets disabled attr to true', () => {
        const output = templates.option(data);
        expect(output.disabled).to.equal(true);
      });
    });
  });
});
