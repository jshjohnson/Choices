describe('Choices - select one', () => {
  beforeEach(() => {
    cy.visit('/select-one.html');
  });

  describe('configs', () => {
    describe('basic', () => {
      beforeEach(() => {
        cy.get('[data-test-hook=basic]')
          .find('.choices__input--cloned')
          .focus();
      });

      describe('selecting choice', () => {
        describe('focusing on text input', () => {
          const selectedChoiceText = 'Dropdown item 1';

          it('displays a dropdown of choices', () => {
            cy.get('[data-test-hook=basic]')
              .find('.choices__list--dropdown')
              .should('be.visible');

            cy.get('[data-test-hook=basic]')
              .find('.choices__list--dropdown .choices__list')
              .children()
              .should('have.length', 4)
              .each(($choice, index) => {
                expect($choice.text().trim()).to.equal(
                  `Dropdown item ${index + 1}`,
                );
              });
          });

          it('allows me select choices from a dropdown', () => {
            cy.get('[data-test-hook=basic]')
              .find('.choices__list--dropdown .choices__list')
              .children()
              .first()
              .click();

            cy.get('[data-test-hook=basic]')
              .find('.choices__list--single .choices__item')
              .last()
              .should($item => {
                expect($item).to.contain(selectedChoiceText);
              });
          });

          it('does not remove selected choice from dropdown list', () => {
            cy.get('[data-test-hook=basic]')
              .find('.choices__list--dropdown .choices__list')
              .children()
              .first()
              .click();

            cy.get('[data-test-hook=basic]')
              .find('.choices__list--dropdown .choices__list')
              .children()
              .first()
              .should($item => {
                expect($item).to.contain(selectedChoiceText);
              });
          });

          describe('pressing escape', () => {
            beforeEach(() => {
              cy.get('[data-test-hook=basic]')
                .find('.choices__input--cloned')
                .type('{esc}');
            });

            it('closes the dropdown', () => {
              cy.get('[data-test-hook=basic]')
                .find('.choices__list--dropdown')
                .should('not.be.visible');
            });
          });
        });
      });

      describe('searching choices', () => {
        describe('on input', () => {
          describe('searching by label', () => {
            it('displays choices filtered by inputted value', () => {
              cy.get('[data-test-hook=basic]')
                .find('.choices__input--cloned')
                .type('item 2');

              cy.get('[data-test-hook=basic]')
                .find('.choices__list--dropdown .choices__list')
                .children()
                .first()
                .should($choice => {
                  expect($choice.text().trim()).to.equal('Dropdown item 2');
                });
            });
          });

          describe('searching by value', () => {
            it('displays choices filtered by inputted value', () => {
              cy.get('[data-test-hook=basic]')
                .find('.choices__input--cloned')
                .type('find me');

              cy.get('[data-test-hook=basic]')
                .find('.choices__list--dropdown .choices__list')
                .children()
                .first()
                .should($choice => {
                  expect($choice.text().trim()).to.equal('Dropdown item 3');
                });
            });
          });

          describe('no results found', () => {
            it('displays "no results found" prompt', () => {
              cy.get('[data-test-hook=basic]')
                .find('.choices__input--cloned')
                .type('faergge');

              cy.get('[data-test-hook=basic]')
                .find('.choices__list--dropdown')
                .should('be.visible')
                .should($dropdown => {
                  const dropdownText = $dropdown.text().trim();
                  expect(dropdownText).to.equal('No results found');
                });
            });
          });
        });
      });
    });

    describe('remove button', () => {
      /*
        {
          removeItemButton: true,
        }
      */
      beforeEach(() => {
        cy.get('[data-test-hook=remove-button]')
          .find('.choices__input--cloned')
          .focus();

        cy.get('[data-test-hook=remove-button]')
          .find('.choices__list--dropdown .choices__list')
          .children()
          .last()
          .click();
      });

      describe('remove button', () => {
        describe('on click', () => {
          it('removes selected choice', () => {
            cy.get('[data-test-hook=remove-button]')
              .find('.choices__list--single .choices__item')
              .last()
              .find('.choices__button')
              .focus()
              .click();

            cy.get('[data-test-hook=remove-button]')
              .find('.choices__list--single')
              .children()
              .should('have.length', 0);
          });
        });
      });
    });

    describe('disabled choice', () => {
      describe('selecting a disabled choice', () => {
        let selectedChoiceText;

        beforeEach(() => {
          cy.get('[data-test-hook=disabled-choice]').click();

          cy.get('[data-test-hook=disabled-choice]')
            .find('.choices__list--dropdown .choices__item--disabled')
            .then($choice => {
              selectedChoiceText = $choice.text().trim();
            })
            .click();
        });

        it('does not change selected choice', () => {
          cy.get('[data-test-hook=prepend-append]')
            .find('.choices__list--single .choices__item')
            .last()
            .should($choice => {
              expect($choice.text()).to.not.contain(selectedChoiceText);
            });
        });

        it('closes the dropdown list', () => {
          cy.get('[data-test-hook=disabled-choice]')
            .find('.choices__list--dropdown')
            .should('not.be.visible');
        });
      });
    });

    describe('prepend/append', () => {
      /*
        {
          prependValue: 'before-',
          appendValue: '-after',
        };
      */

      let selectedChoiceText;

      beforeEach(() => {
        cy.get('[data-test-hook=prepend-append]')
          .find('.choices__input--cloned')
          .focus();

        cy.get('[data-test-hook=prepend-append]')
          .find('.choices__list--dropdown .choices__list')
          .children()
          .last()
          .then($choice => {
            selectedChoiceText = $choice.text().trim();
          })
          .click();
      });

      it('prepends and appends value to inputted value', () => {
        cy.get('[data-test-hook=prepend-append]')
          .find('.choices__list--single .choices__item')
          .last()
          .should($choice => {
            expect($choice.data('value')).to.equal(
              `before-${selectedChoiceText}-after`,
            );
          });
      });

      it('displays just the inputted value to the user', () => {
        cy.get('[data-test-hook=prepend-append]')
          .find('.choices__list--single .choices__item')
          .last()
          .should($choice => {
            expect($choice.text()).to.not.contain(
              `before-${selectedChoiceText}-after`,
            );
            expect($choice.text()).to.contain(selectedChoiceText);
          });
      });
    });

    describe('render choice limit', () => {
      /*
        {
          renderChoiceLimit: 1
        }
      */

      it('only displays given number of choices in the dropdown', () => {
        cy.get('[data-test-hook=render-choice-limit]')
          .find('.choices__list--dropdown .choices__list')
          .children()
          .should('have.length', 1);
      });
    });

    describe('search disabled', () => {
      /*
        {
          searchEnabled: false
        }
      */
      const selectedChoiceText = 'Dropdown item 3';

      beforeEach(() => {
        cy.get('[data-test-hook=search-disabled]')
          .find('.choices')
          .click();
      });

      it('does not display a search input', () => {
        cy.get('[data-test-hook=search-disabled]')
          .find('.choices__input--cloned')
          .should('not.exist');
      });

      it('allows me select choices from a dropdown', () => {
        cy.get('[data-test-hook=search-disabled]')
          .find('.choices__list--dropdown .choices__list')
          .children()
          .last()
          .click();

        cy.get('[data-test-hook=search-disabled]')
          .find('.choices__list--single .choices__item')
          .last()
          .should($item => {
            expect($item).to.contain(selectedChoiceText);
          });
      });
    });

    describe('search floor', () => {
      /*
        {
          searchFloor: 10,
        };
      */

      describe('on input', () => {
        beforeEach(() => {
          cy.get('[data-test-hook=search-floor]')
            .find('.choices__input--cloned')
            .focus();
        });

        describe('search floor not reached', () => {
          it('displays choices not filtered by inputted value', () => {
            const searchTerm = 'item 2';

            cy.get('[data-test-hook=search-floor]')
              .find('.choices__input--cloned')
              .type(searchTerm);

            cy.get('[data-test-hook=search-floor]')
              .find('.choices__list--dropdown .choices__list')
              .children()
              .first()
              .should($choice => {
                expect($choice.text().trim()).to.not.contain(searchTerm);
              });
          });
        });

        describe('search floor reached', () => {
          it('displays choices filtered by inputted value', () => {
            const searchTerm = 'Dropdown item 2';

            cy.get('[data-test-hook=search-floor]')
              .find('.choices__input--cloned')
              .type(searchTerm);

            cy.get('[data-test-hook=search-floor]')
              .find('.choices__list--dropdown .choices__list')
              .children()
              .first()
              .should($choice => {
                expect($choice.text().trim()).to.contain(searchTerm);
              });
          });
        });
      });
    });
  });
});
