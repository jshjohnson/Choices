describe('Choices - text element', () => {
  beforeEach(() => {
    cy.visit('/text.html');
  });

  describe('scenarios', () => {
    const textInput = 'testing';

    describe('basic', () => {
      describe('adding items', () => {
        it('allows me to input items', () => {
          cy.get('[data-test-hook=basic]')
            .find('.choices__input--cloned')
            .type(textInput)
            .type('{enter}');

          cy.get('[data-test-hook=basic]')
            .find('.choices__list--multiple .choices__item')
            .last()
            .should($el => {
              expect($el).to.contain(textInput);
            });
        });

        it('updates the value of the original input', () => {
          cy.get('[data-test-hook=basic]')
            .find('.choices__input--cloned')
            .type(textInput)
            .type('{enter}');

          cy.get('[data-test-hook=basic]')
            .find('.choices__input.is-hidden')
            .should('have.value', textInput);
        });

        describe('inputting data', () => {
          it('shows a dropdown prompt', () => {
            cy.get('[data-test-hook=basic]')
              .find('.choices__input--cloned')
              .type(textInput);

            cy.get('[data-test-hook=basic]')
              .find('.choices__list--dropdown')
              .should('be.visible')
              .should($dropdown => {
                const dropdownText = $dropdown.text().trim();
                expect(dropdownText).to.equal(
                  `Press Enter to add "${textInput}"`,
                );
              });
          });
        });
      });
    });

    describe('editing items', () => {
      beforeEach(() => {
        cy.get('[data-test-hook=edit-items]')
          .find('.choices__input--cloned')
          .type(textInput)
          .type('{enter}');
      });

      describe('on back space', () => {
        it('allows me to change my entry', () => {
          cy.get('[data-test-hook=edit-items]')
            .find('.choices__input--cloned')
            .type('{backspace}')
            .type('-edited')
            .type('{enter}');

          cy.get('[data-test-hook=edit-items]')
            .find('.choices__list--multiple .choices__item')
            .last()
            .should($choice => {
              expect($choice.data('value')).to.equal(`${textInput}-edited`);
            });
        });
      });
    });

    describe('remove button', () => {
      beforeEach(() => {
        cy.get('[data-test-hook=remove-button]')
          .find('.choices__input--cloned')
          .type(`${textInput}`)
          .type('{enter}');
      });

      describe('on click', () => {
        it('removes respective choice', () => {
          cy.get('[data-test-hook=remove-button]')
            .find('.choices__list--multiple')
            .children()
            .should($items => {
              expect($items.length).to.equal(1);
            });

          cy.get('[data-test-hook=remove-button]')
            .find('.choices__list--multiple .choices__item')
            .last()
            .find('.choices__button')
            .focus()
            .click();

          cy.get('[data-test-hook=remove-button]')
            .find('.choices__list--multiple .choices__item')
            .should($items => {
              expect($items.length).to.equal(0);
            });
        });

        it('updates the value of the original input', () => {
          cy.get('[data-test-hook=remove-button]')
            .find('.choices__list--multiple .choices__item')
            .last()
            .find('.choices__button')
            .focus()
            .click();

          cy.get('[data-test-hook=remove-button]')
            .find('.choices__input.is-hidden')
            .then($input => {
              expect($input.val()).to.not.contain(textInput);
            });
        });
      });
    });

    describe('unique values only', () => {
      describe('unique values', () => {
        beforeEach(() => {
          cy.get('[data-test-hook=unique-values]')
            .find('.choices__input--cloned')
            .type(`${textInput}`)
            .type('{enter}')
            .type(`${textInput}`)
            .type('{enter}');
        });

        it('only allows me to input unique values', () => {
          cy.get('[data-test-hook=unique-values]')
            .find('.choices__list--multiple')
            .first()
            .children()
            .should($items => {
              expect($items.length).to.equal(1);
            });
        });

        describe('inputting a non-unique value', () => {
          it('displays dropdown prompt', () => {
            cy.get('[data-test-hook=unique-values]')
              .find('.choices__list--dropdown')
              .should('be.visible')
              .should($dropdown => {
                const dropdownText = $dropdown.text().trim();
                expect(dropdownText).to.equal(
                  'Only unique values can be added',
                );
              });
          });
        });
      });
    });

    describe('input limit', () => {
      beforeEach(() => {
        for (let index = 0; index < 6; index++) {
          cy.get('[data-test-hook=input-limit]')
            .find('.choices__input--cloned')
            .type(`${textInput} + ${index}`)
            .type('{enter}');
        }
      });

      it('does not let me input more than 5 choices', () => {
        cy.get('[data-test-hook=input-limit]')
          .find('.choices__list--multiple')
          .first()
          .children()
          .should($items => {
            expect($items.length).to.equal(5);
          });
      });

      it('hides dropdown prompt once limit has been reached', () => {
        cy.get('[data-test-hook=input-limit]')
          .find('.choices__list--dropdown')
          .should('not.be.visible');
      });
    });

    describe('regex filter', () => {
      describe('a valid that satisfies regex', () => {
        const input = 'joe@bloggs.com';

        it('allows me to add choice', () => {
          cy.get('[data-test-hook=regex-filter]')
            .find('.choices__input--cloned')
            .type(input)
            .type('{enter}');

          cy.get('[data-test-hook=regex-filter]')
            .find('.choices__list--multiple .choices__item')
            .last()
            .should($choice => {
              expect($choice.text().trim()).to.equal(input);
            });
        });
      });

      describe('inputting a value that does not satisfy the regex', () => {
        it('displays dropdown prompt', () => {
          cy.get('[data-test-hook=regex-filter]')
            .find('.choices__input--cloned')
            .type(`this is not an email address`)
            .type('{enter}');

          cy.get('[data-test-hook=regex-filter]')
            .find('.choices__list--dropdown')
            .should('not.be.visible');
        });
      });
    });

    describe('prepend/append', () => {
      beforeEach(() => {
        cy.get('[data-test-hook=prepend-append]')
          .find('.choices__input--cloned')
          .type(textInput)
          .type('{enter}');
      });

      it('prepends and appends value to inputted value', () => {
        cy.get('[data-test-hook=prepend-append]')
          .find('.choices__list--multiple .choices__item')
          .last()
          .should($choice => {
            expect($choice.data('value')).to.equal(`before-${textInput}-after`);
          });
      });

      it('displays just the inputted value to the user', () => {
        cy.get('[data-test-hook=prepend-append]')
          .find('.choices__list--multiple .choices__item')
          .last()
          .should($choice => {
            expect($choice.text()).to.not.contain(`before-${textInput}-after`);
            expect($choice.text()).to.contain(textInput);
          });
      });
    });

    describe('disabled', () => {
      it('does not allow me to input data', () => {
        cy.get('[data-test-hook=disabled]')
          .find('.choices__input--cloned')
          .should('be.disabled');
      });
    });

    describe('pre-populated choices', () => {
      it('pre-populates choices', () => {
        cy.get('[data-test-hook=prepopulated]')
          .find('.choices__list--multiple .choices__item')
          .should($choices => {
            expect($choices.length).to.equal(2);
          });

        cy.get('[data-test-hook=prepopulated]')
          .find('.choices__list--multiple .choices__item')
          .first()
          .should($choice => {
            expect($choice.text().trim()).to.equal('Josh Johnson');
          });

        cy.get('[data-test-hook=prepopulated]')
          .find('.choices__list--multiple .choices__item')
          .last()
          .should($choice => {
            expect($choice.text().trim()).to.equal('Joe Bloggs');
          });
      });
    });

    describe('placeholder', () => {
      /*
        {
          placeholder: true,
          placeholderValue: 'I am a placeholder',
        }
      */
      describe('when no value has been inputted', () => {
        it('displays a placeholder', () => {
          cy.get('[data-test-hook=placeholder]')
            .find('.choices__input--cloned')
            .should('have.attr', 'placeholder', 'I am a placeholder');
        });
      });
    });
  });
});
