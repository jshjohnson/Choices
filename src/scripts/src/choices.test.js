import { expect } from 'chai';
import { spy, stub } from 'sinon';

import Choices from './choices';
import { EVENTS, ACTION_TYPES } from './constants';

describe('choices', () => {
  let instance;
  let output;
  let passedElement;

  describe('public methods', () => {
    const returnsInstance = () => {
      it('returns this', () => {
        expect(output).to.eql(instance);
      });
    };

    afterEach(() => {
      output = null;
    });

    describe('init', () => {
      const callbackOnInitSpy = spy();

      beforeEach(() => {
        passedElement = document.createElement('input');
        passedElement.type = 'text';
        passedElement.className = 'js-choices';
        document.body.appendChild(passedElement);

        instance = new Choices(passedElement, {
          callbackOnInit: callbackOnInitSpy,
        });
      });

      describe('when already initialised', () => {
        beforeEach(() => {
          instance.initialised = true;
          instance.init();
        });

        it('doesn\'t set initialise flag', () => {
          expect(instance.initialised).to.not.equal(false);
        });
      });

      describe('not already initialised', () => {
        let createTemplatesSpy;
        let createInputSpy;
        let storeSubscribeSpy;
        let renderSpy;
        let addEventListenersSpy;

        beforeEach(() => {
          createTemplatesSpy = spy(instance, '_createTemplates');
          createInputSpy = spy(instance, '_createStructure');
          storeSubscribeSpy = spy(instance.store, 'subscribe');
          renderSpy = spy(instance, 'render');
          addEventListenersSpy = spy(instance, '_addEventListeners');

          instance.initialised = false;
          instance.init();
        });

        afterEach(() => {
          createTemplatesSpy.restore();
          createInputSpy.restore();
          storeSubscribeSpy.restore();
          renderSpy.restore();
          addEventListenersSpy.restore();
        });

        it('sets initialise flag', () => {
          expect(instance.initialised).to.equal(true);
        });

        it('creates templates', () => {
          expect(createTemplatesSpy.called).to.equal(true);
        });

        it('creates input', () => {
          expect(createInputSpy.called).to.equal(true);
        });

        it('subscribes to store with render method', () => {
          expect(storeSubscribeSpy.called).to.equal(true);
          expect(storeSubscribeSpy.lastCall.args[0]).to.equal(instance.render);
        });

        it('fires initial render', () => {
          expect(renderSpy.called).to.equal(true);
        });

        it('adds event listeners', () => {
          expect(addEventListenersSpy.called).to.equal(true);
        });

        it('fires callback', () => {
          expect(callbackOnInitSpy.called).to.equal(true);
        });
      });
    });

    describe('destroy', () => {
      beforeEach(() => {
        passedElement = document.createElement('input');
        passedElement.type = 'text';
        passedElement.className = 'js-choices';
        document.body.appendChild(passedElement);

        instance = new Choices(passedElement);
      });

      describe('not already initialised', () => {
        beforeEach(() => {
          instance.initialised = false;
          instance.destroy();
        });

        it('doesn\'t set initialise flag', () => {
          expect(instance.initialised).to.not.equal(true);
        });
      });

      describe('when already initialised', () => {
        let removeEventListenersSpy;
        let passedElementRevealSpy;
        let containerOuterRevertSpy;
        let clearStoreSpy;

        beforeEach(() => {
          removeEventListenersSpy = spy(instance, '_removeEventListeners');
          passedElementRevealSpy = spy(instance.passedElement, 'reveal');
          containerOuterRevertSpy = spy(instance.containerOuter, 'revert');
          clearStoreSpy = spy(instance, 'clearStore');

          instance.initialised = true;
          instance.destroy();
        });

        afterEach(() => {
          removeEventListenersSpy.restore();
          passedElementRevealSpy.restore();
          containerOuterRevertSpy.restore();
          clearStoreSpy.restore();
        });

        it('removes event listeners', () => {
          expect(removeEventListenersSpy.called).to.equal(true);
        });

        it('reveals passed element', () => {
          expect(passedElementRevealSpy.called).to.equal(true);
        });

        it('reverts outer container', () => {
          expect(containerOuterRevertSpy.called).to.equal(true);
          expect(containerOuterRevertSpy.lastCall.args[0]).to.equal(instance.passedElement.element);
        });

        it('clears store', () => {
          expect(clearStoreSpy.called).to.equal(true);
        });

        it('nullifys templates config', () => {
          expect(instance.config.templates).to.equal(null);
        });

        it('resets initialise flag', () => {
          expect(instance.initialised).to.equal(false);
        });
      });
    });

    describe('enable', () => {
      let passedElementEnableSpy;
      let addEventListenersSpy;
      let containerOuterEnableSpy;
      let inputEnableSpy;

      beforeEach(() => {
        addEventListenersSpy = spy(instance, '_addEventListeners');
        passedElementEnableSpy = spy(instance.passedElement, 'enable');
        containerOuterEnableSpy = spy(instance.containerOuter, 'enable');
        inputEnableSpy = spy(instance.input, 'enable');
      });

      afterEach(() => {
        addEventListenersSpy.restore();
        passedElementEnableSpy.restore();
        containerOuterEnableSpy.restore();
        inputEnableSpy.restore();
      });

      describe('not already initialised', () => {
        beforeEach(() => {
          instance.initialised = false;
          output = instance.enable();
        });

        returnsInstance(output);

        it('returns early', () => {
          expect(passedElementEnableSpy.called).to.equal(false);
          expect(addEventListenersSpy.called).to.equal(false);
          expect(inputEnableSpy.called).to.equal(false);
          expect(containerOuterEnableSpy.called).to.equal(false);
        });
      });

      describe('when already initialised', () => {
        describe('containerOuter enabled', () => {
          beforeEach(() => {
            instance.initialised = true;
            output = instance.enable();
          });

          returnsInstance(output);

          it('enables passedElement', () => {
            expect(passedElementEnableSpy.called).to.equal(true);
          });
        });

        describe('containerOuter disabled', () => {
          beforeEach(() => {
            instance.initialised = true;
            instance.containerOuter.isDisabled = true;
            instance.enable();
          });

          it('adds event listeners', () => {
            expect(addEventListenersSpy.called).to.equal(true);
          });

          it('enables input', () => {
            expect(inputEnableSpy.called).to.equal(true);
          });

          it('enables containerOuter', () => {
            expect(containerOuterEnableSpy.called).to.equal(true);
          });
        });
      });
    });

    describe('disable', () => {
      let removeEventListenersSpy;
      let passedElementDisableSpy;
      let containerOuterDisableSpy;
      let inputDisableSpy;

      beforeEach(() => {
        removeEventListenersSpy = spy(instance, '_removeEventListeners');
        passedElementDisableSpy = spy(instance.passedElement, 'disable');
        containerOuterDisableSpy = spy(instance.containerOuter, 'disable');
        inputDisableSpy = spy(instance.input, 'disable');
      });


      afterEach(() => {
        removeEventListenersSpy.restore();
        passedElementDisableSpy.restore();
        containerOuterDisableSpy.restore();
        inputDisableSpy.restore();
      });

      describe('not already initialised', () => {
        beforeEach(() => {
          instance.initialised = false;
          output = instance.disable();
        });

        returnsInstance(output);

        it('returns early', () => {
          expect(removeEventListenersSpy.called).to.equal(false);
          expect(passedElementDisableSpy.called).to.equal(false);
          expect(containerOuterDisableSpy.called).to.equal(false);
          expect(inputDisableSpy.called).to.equal(false);
        });
      });

      describe('when already initialised', () => {
        describe('containerOuter disabled', () => {
          beforeEach(() => {
            instance.initialised = true;
            instance.containerOuter.isDisabled = true;
            output = instance.disable();
          });

          returnsInstance(output);

          it('disables passedElement', () => {
            expect(passedElementDisableSpy.called).to.equal(true);
          });
        });

        describe('containerOuter enabled', () => {
          beforeEach(() => {
            instance.initialised = true;
            instance.containerOuter.isDisabled = false;
            instance.disable();
          });

          it('removes event listeners', () => {
            expect(removeEventListenersSpy.called).to.equal(true);
          });

          it('disables input', () => {
            expect(inputDisableSpy.called).to.equal(true);
          });

          it('enables containerOuter', () => {
            expect(containerOuterDisableSpy.called).to.equal(true);
          });
        });
      });
    });

    describe('showDropdown', () => {
      let containerOuterOpenSpy;
      let dropdownShowSpy;
      let inputActivateSpy;
      let passedElementTriggerEventStub;

      beforeEach(() => {
        containerOuterOpenSpy = spy(instance.containerOuter, 'open');
        dropdownShowSpy = spy(instance.dropdown, 'show');
        inputActivateSpy = spy(instance.input, 'activate');
        passedElementTriggerEventStub = stub();

        instance.passedElement.triggerEvent = passedElementTriggerEventStub;
      });

      afterEach(() => {
        containerOuterOpenSpy.restore();
        dropdownShowSpy.restore();
        inputActivateSpy.restore();
        instance.passedElement.triggerEvent.reset();
      });

      describe('dropdown active', () => {
        let output;

        beforeEach(() => {
          instance.dropdown.isActive = true;
          output = instance.showDropdown();
        });

        it('returns this', () => {
          expect(output).to.eql(instance);
        });

        it('returns early', () => {
          expect(containerOuterOpenSpy.called).to.equal(false);
          expect(dropdownShowSpy.called).to.equal(false);
          expect(inputActivateSpy.called).to.equal(false);
          expect(passedElementTriggerEventStub.called).to.equal(false);
        });
      });

      describe('dropdown inactive', () => {
        beforeEach(() => {
          instance.dropdown.isActive = false;
          output = instance.showDropdown();
        });

        it('returns this', () => {
          expect(output).to.eql(instance);
        });

        it('opens containerOuter', () => {
          expect(containerOuterOpenSpy.called).to.equal(true);
        });

        it('shows dropdown with blurInput flag', () => {
          expect(dropdownShowSpy.called).to.equal(true);
        });

        it('activates input', () => {
          expect(inputActivateSpy.called).to.equal(true);
        });

        it('triggers event on passedElement', () => {
          expect(passedElementTriggerEventStub.called).to.equal(true);
          expect(passedElementTriggerEventStub.lastCall.args[0]).to.eql(EVENTS.showDropdown);
          expect(passedElementTriggerEventStub.lastCall.args[1]).to.eql({});
        });
      });
    });

    describe('hideDropdown', () => {
      let containerOuterCloseSpy;
      let dropdownHideSpy;
      let inputDeactivateSpy;
      let passedElementTriggerEventStub;

      beforeEach(() => {
        containerOuterCloseSpy = spy(instance.containerOuter, 'close');
        dropdownHideSpy = spy(instance.dropdown, 'hide');
        inputDeactivateSpy = spy(instance.input, 'deactivate');
        passedElementTriggerEventStub = stub();

        instance.passedElement.triggerEvent = passedElementTriggerEventStub;
      });

      afterEach(() => {
        containerOuterCloseSpy.restore();
        dropdownHideSpy.restore();
        inputDeactivateSpy.restore();
        instance.passedElement.triggerEvent.reset();
      });

      describe('dropdown inactive', () => {
        beforeEach(() => {
          instance.dropdown.isActive = false;
          output = instance.hideDropdown();
        });

        returnsInstance(output);

        it('returns early', () => {
          expect(containerOuterCloseSpy.called).to.equal(false);
          expect(dropdownHideSpy.called).to.equal(false);
          expect(inputDeactivateSpy.called).to.equal(false);
          expect(passedElementTriggerEventStub.called).to.equal(false);
        });
      });

      describe('dropdown active', () => {
        beforeEach(() => {
          instance.dropdown.isActive = true;
          output = instance.hideDropdown();
        });

        it('returns this', () => {
          expect(output).to.eql(instance);
        });

        it('closes containerOuter', () => {
          expect(containerOuterCloseSpy.called).to.equal(true);
        });

        it('hides dropdown with blurInput flag', () => {
          expect(dropdownHideSpy.called).to.equal(true);
        });

        it('deactivates input', () => {
          expect(inputDeactivateSpy.called).to.equal(true);
        });

        it('triggers event on passedElement', () => {
          expect(passedElementTriggerEventStub.called).to.equal(true);
          expect(passedElementTriggerEventStub.lastCall.args[0]).to.eql(EVENTS.hideDropdown);
          expect(passedElementTriggerEventStub.lastCall.args[1]).to.eql({});
        });
      });
    });

    describe('toggleDropdown', () => {
      let hideDropdownSpy;
      let showDropdownSpy;

      beforeEach(() => {
        hideDropdownSpy = spy(instance, 'hideDropdown');
        showDropdownSpy = spy(instance, 'showDropdown');
      });

      afterEach(() => {
        hideDropdownSpy.restore();
        showDropdownSpy.restore();
      });

      describe('dropdown active', () => {
        beforeEach(() => {
          instance.dropdown.isActive = true;
          output = instance.toggleDropdown();
        });

        it('hides dropdown', () => {
          expect(hideDropdownSpy.called).to.equal(true);
        });

        returnsInstance(output);
      });

      describe('dropdown inactive', () => {
        beforeEach(() => {
          instance.dropdown.isActive = false;
          output = instance.toggleDropdown();
        });

        it('shows dropdown', () => {
          expect(showDropdownSpy.called).to.equal(true);
        });

        returnsInstance(output);
      });
    });

    describe('highlightItem', () => {
      let passedElementTriggerEventStub;
      let storeDispatchSpy;
      let storeGetGroupByIdStub;
      const groupIdValue = 'Test';

      beforeEach(() => {
        passedElementTriggerEventStub = stub();
        storeGetGroupByIdStub = stub().returns({
          value: groupIdValue,
        });
        storeDispatchSpy = spy(instance.store, 'dispatch');

        instance.store.getGroupById = storeGetGroupByIdStub;
        instance.passedElement.triggerEvent = passedElementTriggerEventStub;
      });

      afterEach(() => {
        storeDispatchSpy.restore();
        instance.store.getGroupById.reset();
        instance.passedElement.triggerEvent.reset();
      });

      describe('no item passed', () => {
        beforeEach(() => {
          output = instance.highlightItem();
        });

        returnsInstance(output);

        it('returns early', () => {
          expect(passedElementTriggerEventStub.called).to.equal(false);
          expect(storeDispatchSpy.called).to.equal(false);
          expect(storeGetGroupByIdStub.called).to.equal(false);
        });
      });

      describe('item passed', () => {
        const item = {
          id: 1234,
          value: 'Test',
          label: 'Test',
        };

        describe('passing truthy second paremeter', () => {
          beforeEach(() => {
            output = instance.highlightItem(item, true);
          });

          returnsInstance(output);

          it('dispatches highlightItem action with correct arguments', () => {
            expect(storeDispatchSpy.called).to.equal(true);
            expect(storeDispatchSpy.lastCall.args[0]).to.eql({
              type: ACTION_TYPES.HIGHLIGHT_ITEM,
              id: item.id,
              highlighted: true,
            });
          });

          describe('item with negative groupId', () => {
            beforeEach(() => {
              item.groupId = -1;
              output = instance.highlightItem(item);
            });

            it('triggers event with null groupValue', () => {
              expect(passedElementTriggerEventStub.called).to.equal(true);
              expect(passedElementTriggerEventStub.lastCall.args[0]).to.equal(EVENTS.highlightItem);
              expect(passedElementTriggerEventStub.lastCall.args[1]).to.eql({
                id: item.id,
                value: item.value,
                label: item.label,
                groupValue: null,
              });
            });
          });

          describe('item without groupId', () => {
            beforeEach(() => {
              item.groupId = 1;
              output = instance.highlightItem(item);
            });

            it('triggers event with groupValue', () => {
              expect(passedElementTriggerEventStub.called).to.equal(true);
              expect(passedElementTriggerEventStub.lastCall.args[0]).to.equal(EVENTS.highlightItem);
              expect(passedElementTriggerEventStub.lastCall.args[1]).to.eql({
                id: item.id,
                value: item.value,
                label: item.label,
                groupValue: groupIdValue,
              });
            });
          });
        });

        describe('passing falsey second paremeter', () => {
          beforeEach(() => {
            output = instance.highlightItem(item, false);
          });

          it('doesn\'t trigger event', () => {
            expect(passedElementTriggerEventStub.called).to.equal(false);
          });

          returnsInstance(output);
        });
      });
    });

    describe('unhighlightItem', () => {
      let passedElementTriggerEventStub;
      let storeDispatchSpy;
      let storeGetGroupByIdStub;
      const groupIdValue = 'Test';

      beforeEach(() => {
        passedElementTriggerEventStub = stub();
        storeGetGroupByIdStub = stub().returns({
          value: groupIdValue,
        });
        storeDispatchSpy = spy(instance.store, 'dispatch');

        instance.store.getGroupById = storeGetGroupByIdStub;
        instance.passedElement.triggerEvent = passedElementTriggerEventStub;
      });

      afterEach(() => {
        storeDispatchSpy.restore();
        instance.store.getGroupById.reset();
        instance.passedElement.triggerEvent.reset();
      });

      describe('no item passed', () => {
        beforeEach(() => {
          output = instance.unhighlightItem();
        });

        returnsInstance(output);

        it('returns early', () => {
          expect(passedElementTriggerEventStub.called).to.equal(false);
          expect(storeDispatchSpy.called).to.equal(false);
          expect(storeGetGroupByIdStub.called).to.equal(false);
        });
      });

      describe('item passed', () => {
        const item = {
          id: 1234,
          value: 'Test',
          label: 'Test',
        };

        describe('passing truthy second paremeter', () => {
          beforeEach(() => {
            output = instance.unhighlightItem(item, true);
          });

          returnsInstance(output);

          it('dispatches highlightItem action with correct arguments', () => {
            expect(storeDispatchSpy.called).to.equal(true);
            expect(storeDispatchSpy.lastCall.args[0]).to.eql({
              type: ACTION_TYPES.HIGHLIGHT_ITEM,
              id: item.id,
              highlighted: false,
            });
          });

          describe('item with negative groupId', () => {
            beforeEach(() => {
              item.groupId = -1;
              output = instance.unhighlightItem(item);
            });

            it('triggers event with null groupValue', () => {
              expect(passedElementTriggerEventStub.called).to.equal(true);
              expect(passedElementTriggerEventStub.lastCall.args[0]).to.equal(EVENTS.highlightItem);
              expect(passedElementTriggerEventStub.lastCall.args[1]).to.eql({
                id: item.id,
                value: item.value,
                label: item.label,
                groupValue: null,
              });
            });
          });

          describe('item without groupId', () => {
            beforeEach(() => {
              item.groupId = 1;
              output = instance.highlightItem(item);
            });

            it('triggers event with groupValue', () => {
              expect(passedElementTriggerEventStub.called).to.equal(true);
              expect(passedElementTriggerEventStub.lastCall.args[0]).to.equal(EVENTS.highlightItem);
              expect(passedElementTriggerEventStub.lastCall.args[1]).to.eql({
                id: item.id,
                value: item.value,
                label: item.label,
                groupValue: groupIdValue,
              });
            });
          });
        });

        describe('passing falsey second paremeter', () => {
          beforeEach(() => {
            output = instance.highlightItem(item, false);
          });

          it('doesn\'t trigger event', () => {
            expect(passedElementTriggerEventStub.called).to.equal(false);
          });

          returnsInstance(output);
        });
      });
    });

    describe('highlightAll', () => {
      let storeGetItemsStub;
      let highlightItemSpy;

      const items = [
        {
          id: 1,
          value: 'Test 1',
        },
        {
          id: 2,
          value: 'Test 2',
        },
      ];

      beforeEach(() => {
        storeGetItemsStub = stub().returns(items);
        highlightItemSpy = spy(instance, 'highlightItem');

        instance.store.getItems = storeGetItemsStub;

        output = instance.highlightAll();
      });

      afterEach(() => {
        highlightItemSpy.restore();
        instance.store.getItems.reset();
      });

      returnsInstance(output);

      it('highlights each item in store', () => {
        expect(highlightItemSpy.callCount).to.equal(items.length);
        expect(highlightItemSpy.firstCall.args[0]).to.equal(items[0]);
        expect(highlightItemSpy.lastCall.args[0]).to.equal(items[1]);
      });
    });

    describe('unhighlightAll', () => {
      let storeGetItemsStub;
      let unhighlightItemSpy;

      const items = [
        {
          id: 1,
          value: 'Test 1',
        },
        {
          id: 2,
          value: 'Test 2',
        },
      ];

      beforeEach(() => {
        storeGetItemsStub = stub().returns(items);
        unhighlightItemSpy = spy(instance, 'unhighlightItem');

        instance.store.getItems = storeGetItemsStub;

        output = instance.unhighlightAll();
      });

      afterEach(() => {
        unhighlightItemSpy.restore();
        instance.store.getItems.reset();
      });

      returnsInstance(output);

      it('unhighlights each item in store', () => {
        expect(unhighlightItemSpy.callCount).to.equal(items.length);
        expect(unhighlightItemSpy.firstCall.args[0]).to.equal(items[0]);
        expect(unhighlightItemSpy.lastCall.args[0]).to.equal(items[1]);
      });
    });

    describe('clearStore', () => {
      let storeDispatchStub;

      beforeEach(() => {
        storeDispatchStub = stub();
        instance.store.dispatch = storeDispatchStub;

        output = instance.clearStore();
      });

      afterEach(() => {
        instance.store.dispatch.reset();
      });

      returnsInstance(output);

      it('dispatches clearAll action', () => {
        expect(storeDispatchStub.lastCall.args[0]).to.eql({
          type: ACTION_TYPES.CLEAR_ALL,
        });
      });
    });

    describe('clearInput', () => {
      let inputClearSpy;
      let storeDispatchStub;

      beforeEach(() => {
        inputClearSpy = spy(instance.input, 'clear');
        storeDispatchStub = stub();
        instance.store.dispatch = storeDispatchStub;
      });

      afterEach(() => {
        inputClearSpy.restore();
        instance.store.dispatch.reset();
      });

      it('returnsInstance(output)', () => {
        output = instance.clearInput();
        expect(output).to.eql(instance);
      });

      describe('text element', () => {
        beforeEach(() => {
          instance.isSelectOneElement = false;
          instance.isTextElement = false;

          output = instance.clearInput();
        });

        it('clears input with correct arguments', () => {
          expect(inputClearSpy.called).to.equal(true);
          expect(inputClearSpy.lastCall.args[0]).to.equal(true);
        });
      });

      describe('select element with search enabled', () => {
        beforeEach(() => {
          instance.isSelectOneElement = true;
          instance.isTextElement = false;
          instance.config.searchEnabled = true;

          output = instance.clearInput();
        });

        it('clears input with correct arguments', () => {
          expect(inputClearSpy.called).to.equal(true);
          expect(inputClearSpy.lastCall.args[0]).to.equal(false);
        });

        it('resets search flag', () => {
          expect(instance.isSearching).to.equal(false);
        });

        it('dispatches activateChoices action', () => {
          expect(storeDispatchStub.called).to.equal(true);
          expect(storeDispatchStub.lastCall.args[0]).to.eql({
            type: ACTION_TYPES.ACTIVATE_CHOICES,
            active: true,
          });
        });
      });
    });

    describe('ajax', () => {
      const callbackoutput = 'worked';

      let handleLoadingStateStub;
      let ajaxCallbackStub;

      const returnsEarly = () => {
        it('returns early', () => {
          expect(handleLoadingStateStub.called).to.equal(false);
          expect(ajaxCallbackStub.called).to.equal(false);
        });
      };

      beforeEach(() => {
        handleLoadingStateStub = stub();
        ajaxCallbackStub = stub().returns(callbackoutput);

        instance._ajaxCallback = ajaxCallbackStub;
        instance._handleLoadingState = handleLoadingStateStub;
      });

      afterEach(() => {
        instance._ajaxCallback.reset();
        instance._handleLoadingState.reset();
      });

      describe('not initialised', () => {
        beforeEach(() => {
          instance.initialised = false;
          output = instance.ajax(() => {});
        });

        returnsInstance(output);
        returnsEarly();
      });

      describe('text element', () => {
        beforeEach(() => {
          instance.isSelectElement = false;
          output = instance.ajax(() => {});
        });

        returnsInstance(output);
        returnsEarly();
      });

      describe('passing invalid function', () => {
        beforeEach(() => {
          output = instance.ajax(null);
        });

        returnsInstance(output);
        returnsEarly();
      });

      describe('select element', () => {
        let callback;

        beforeEach(() => {
          instance.initialised = true;
          instance.isSelectElement = true;
          ajaxCallbackStub = stub();
          callback = stub();
          output = instance.ajax(callback);
        });

        returnsInstance(output);

        it('sets loading state', () => {
          requestAnimationFrame(() => {
            expect(handleLoadingStateStub.called).to.equal(true);
          });
        });

        it('calls passed function with ajax callback', () => {
          expect(callback.called).to.equal(true);
          expect(callback.lastCall.args[0]).to.eql(callbackoutput);
        });
      });
    });

    describe('setValue', () => {
      let setChoiceOrItemStub;
      const values = [
        'Value 1',
        {
          value: 'Value 2',
        },
      ];

      beforeEach(() => {
        setChoiceOrItemStub = stub();
        instance._setChoiceOrItem = setChoiceOrItemStub;
      });

      afterEach(() => {
        instance._setChoiceOrItem.reset();
      });

      describe('not already initialised', () => {
        beforeEach(() => {
          instance.initialised = false;
          output = instance.setValue(values);
        });

        returnsInstance(output);

        it('returns early', () => {
          expect(setChoiceOrItemStub.called).to.equal(false);
        });
      });

      describe('when already initialised', () => {
        beforeEach(() => {
          instance.initialised = true;
          output = instance.setValue(values);
        });

        returnsInstance(output);

        it('sets each value', () => {
          expect(setChoiceOrItemStub.callCount).to.equal(2);
          expect(setChoiceOrItemStub.firstCall.args[0]).to.equal(values[0]);
          expect(setChoiceOrItemStub.secondCall.args[0]).to.equal(values[1]);
        });
      });
    });

    describe('setChoiceByValue', () => {
      let findAndSelectChoiceByValueStub;

      beforeEach(() => {
        findAndSelectChoiceByValueStub = stub();
        instance._findAndSelectChoiceByValue = findAndSelectChoiceByValueStub;
      });

      afterEach(() => {
        instance._findAndSelectChoiceByValue.reset();
      });

      describe('not already initialised', () => {
        beforeEach(() => {
          instance.initialised = false;
          output = instance.setChoiceByValue([]);
        });

        returnsInstance(output);

        it('returns early', () => {
          expect(findAndSelectChoiceByValueStub.called).to.equal(false);
        });
      });

      describe('when already initialised', () => {
        describe('passing a string value', () => {
          const value = 'Test value';

          beforeEach(() => {
            instance.initialised = true;
            output = instance.setChoiceByValue(value);
          });

          returnsInstance(output);

          it('sets each choice with same value', () => {
            expect(findAndSelectChoiceByValueStub.called).to.equal(true);
            expect(findAndSelectChoiceByValueStub.firstCall.args[0]).to.equal(value);
          });
        });

        describe('passing an array of values', () => {
          const values = [
            'Value 1',
            'Value 2',
          ];

          beforeEach(() => {
            instance.initialised = true;
            output = instance.setChoiceByValue(values);
          });

          returnsInstance(output);

          it('sets each choice with same value', () => {
            expect(findAndSelectChoiceByValueStub.callCount).to.equal(2);
            expect(findAndSelectChoiceByValueStub.firstCall.args[0]).to.equal(values[0]);
            expect(findAndSelectChoiceByValueStub.secondCall.args[0]).to.equal(values[1]);
          });
        });
      });
    });

    describe('getValue', () => {
      let getItemsFilteredByActiveStub;
      const items = [
        {
          id: '1',
          value: 'Test value 1',
        },
        {
          id: '2',
          value: 'Test value 2',
        },
      ];

      beforeEach(() => {
        getItemsFilteredByActiveStub = stub().returns(items);
        instance.store.getItemsFilteredByActive = getItemsFilteredByActiveStub;
      });

      afterEach(() => {
        instance.store.getItemsFilteredByActive.reset();
      });

      describe('passing true valueOnly flag', () => {
        describe('select one input', () => {
          beforeEach(() => {
            instance.isSelectOneElement = true;
            output = instance.getValue(true);
          });

          it('returns a single action value', () => {
            expect(output).to.equal(items[0].value);
          });
        });

        describe('non select one input', () => {
          beforeEach(() => {
            instance.isSelectOneElement = false;
            output = instance.getValue(true);
          });

          it('returns all active item values', () => {
            expect(output).to.eql(items.map((item => item.value)));
          });
        });
      });

      describe('passing false valueOnly flag', () => {
        describe('select one input', () => {
          beforeEach(() => {
            instance.isSelectOneElement = true;
            output = instance.getValue(false);
          });

          it('returns a single active item', () => {
            expect(output).to.equal(items[0]);
          });
        });

        describe('non select one input', () => {
          beforeEach(() => {
            instance.isSelectOneElement = false;
            output = instance.getValue(false);
          });

          it('returns all active items', () => {
            expect(output).to.eql(items);
          });
        });
      });
    });

    describe('removeActiveItemsByValue', () => {
      describe('passing invalid value', () => {
        beforeEach(() => {
          output = instance.removeActiveItemsByValue(null);
        });

        returnsInstance(output);
      });

      describe('passing valid value', () => {
        let getItemsFilteredByActiveStub;
        let removeItemStub;
        const value = 'Removed';
        const items = [
          {
            id: '1',
            value: 'Not removed',
          },
          {
            id: '2',
            value: 'Removed',
          },
          {
            id: '3',
            value: 'Removed',
          },
        ];

        beforeEach(() => {
          removeItemStub = stub();
          getItemsFilteredByActiveStub = stub().returns(items);
          instance.store.getItemsFilteredByActive = getItemsFilteredByActiveStub;
          instance._removeItem = removeItemStub;

          output = instance.removeActiveItemsByValue(value);
        });

        afterEach(() => {
          instance.store.getItemsFilteredByActive.reset();
          instance._removeItem.reset();
        });

        it('removes each active item in store with matching value', () => {
          expect(removeItemStub.callCount).to.equal(2);
          expect(removeItemStub.firstCall.args[0]).to.equal(items[1]);
          expect(removeItemStub.secondCall.args[0]).to.equal(items[2]);
        });
      });
    });

    describe('removeActiveItems', () => {
      let getItemsFilteredByActiveStub;
      let removeItemStub;
      const items = [
        {
          id: '1',
          value: 'Not removed',
        },
        {
          id: '2',
          value: 'Removed',
        },
        {
          id: '3',
          value: 'Removed',
        },
      ];

      beforeEach(() => {
        removeItemStub = stub();
        getItemsFilteredByActiveStub = stub().returns(items);
        instance.store.getItemsFilteredByActive = getItemsFilteredByActiveStub;
        instance._removeItem = removeItemStub;
      });

      afterEach(() => {
        instance.store.getItemsFilteredByActive.reset();
        instance._removeItem.reset();
      });

      describe('not passing id to exclude', () => {
        beforeEach(() => {
          output = instance.removeActiveItems();
        });

        it('removes all active items in store', () => {
          expect(removeItemStub.callCount).to.equal(items.length);
          expect(removeItemStub.firstCall.args[0]).to.equal(items[0]);
          expect(removeItemStub.secondCall.args[0]).to.equal(items[1]);
          expect(removeItemStub.thirdCall.args[0]).to.equal(items[2]);
        });
      });

      describe('passing id to exclude', () => {
        const idToExclude = '2';

        beforeEach(() => {
          output = instance.removeActiveItems(idToExclude);
        });

        it('removes all active items in store with id that does match excludedId', () => {
          expect(removeItemStub.callCount).to.equal(2);
          expect(removeItemStub.firstCall.args[0]).to.equal(items[0]);
          expect(removeItemStub.secondCall.args[0]).to.equal(items[2]);
        });
      });
    });

    describe('removeHighlightedItems', () => {
      let getItemsFilteredByHighlightedStub;
      let removeItemStub;
      let triggerChangeStub;

      const items = [
        {
          id: 1,
          value: 'Test 1',
        },
        {
          id: 2,
          value: 'Test 2',
        },
      ];


      beforeEach(() => {
        getItemsFilteredByHighlightedStub = stub().returns(items);
        removeItemStub = stub();
        triggerChangeStub = stub();

        instance.store.getItemsFilteredByHighlighted = getItemsFilteredByHighlightedStub;
        instance._removeItem = removeItemStub;
        instance._triggerChange = triggerChangeStub;
      });

      afterEach(() => {
        instance.store.getItemsFilteredByHighlighted.reset();
        instance._removeItem.reset();
        instance._triggerChange.reset();
      });

      describe('runEvent parameter being passed', () => {
        beforeEach(() => {
          output = instance.removeHighlightedItems();
        });

        returnsInstance(output);

        it('removes each highlighted item in store', () => {
          expect(removeItemStub.callCount).to.equal(2);
        });
      });

      describe('runEvent parameter not being passed', () => {
        beforeEach(() => {
          output = instance.removeHighlightedItems(true);
        });

        returnsInstance(output);

        it('triggers event with item value', () => {
          expect(triggerChangeStub.callCount).to.equal(2);
          expect(triggerChangeStub.firstCall.args[0]).to.equal(items[0].value);
          expect(triggerChangeStub.secondCall.args[0]).to.equal(items[1].value);
        });
      });
    });

    describe('setChoices', () => {
      let clearChoicesStub;
      let addGroupStub;
      let addChoiceStub;
      let containerOuterRemoveLoadingStateStub;
      const value = 'value';
      const label = 'label';
      const choices = [
        {
          id: '1',
          value: '1',
          label: 'Test 1',
        },
        {
          id: '2',
          value: '2',
          label: 'Test 2',
        },
      ];
      const groups = [
        {
          ...choices[0],
          choices,
        },
        ...choices[1],
      ];

      beforeEach(() => {
        clearChoicesStub = stub();
        addGroupStub = stub();
        addChoiceStub = stub();
        containerOuterRemoveLoadingStateStub = stub();

        instance._clearChoices = clearChoicesStub;
        instance._addGroup = addGroupStub;
        instance._addChoice = addChoiceStub;
        instance.containerOuter.removeLoadingState = containerOuterRemoveLoadingStateStub;
      });

      afterEach(() => {
        instance._clearChoices.reset();
        instance._addGroup.reset();
        instance._addChoice.reset();
        instance.containerOuter.removeLoadingState.reset();
      });

      const returnsEarly = () => {
        it('returns early', () => {
          expect(addGroupStub.called).to.equal(false);
          expect(addChoiceStub.called).to.equal(false);
          expect(clearChoicesStub.called).to.equal(false);
        });
      };

      describe('when element is not select element', () => {
        beforeEach(() => {
          instance.isSelectElement = false;
          instance.setChoices(choices, value, label, false);
        });

        returnsEarly();
      });

      describe('passing invalid arguments', () => {
        describe('passing an empty array', () => {
          beforeEach(() => {
            instance.isSelectElement = true;
            instance.setChoices([], value, label, false);
          });

          returnsEarly();
        });

        describe('passing no value', () => {
          beforeEach(() => {
            instance.isSelectElement = true;
            instance.setChoices(choices, undefined, 'label', false);
          });

          returnsEarly();
        });
      });

      describe('passing valid arguments', () => {
        beforeEach(() => {
          instance.isSelectElement = true;
        });

        it('removes loading state', () => {
          instance.setChoices(choices, value, label, false);
          expect(containerOuterRemoveLoadingStateStub.called).to.equal(true);
        });

        describe('passing choices with children choices', () => {
          it('adds groups', () => {
            instance.setChoices(groups, value, label, false);
            expect(addGroupStub.callCount).to.equal(1);
            expect(addGroupStub.firstCall.args[0]).to.equal(groups[0]);
            expect(addGroupStub.firstCall.args[1]).to.equal(groups[0].id);
            expect(addGroupStub.firstCall.args[2]).to.equal(value);
            expect(addGroupStub.firstCall.args[3]).to.equal(label);
          });
        });

        describe('passing choices without children choices', () => {
          it('adds passed choices', () => {
            instance.setChoices(choices, value, label, false);
            expect(addChoiceStub.callCount).to.equal(2);
            addChoiceStub.getCalls().forEach((call, index) => {
              expect(call.args[0]).to.equal(choices[index][value]);
              expect(call.args[1]).to.equal(choices[index][label]);
              expect(call.args[2]).to.equal(choices[index].selected);
              expect(call.args[3]).to.equal(choices[index].disabled);
              expect(call.args[4]).to.equal(undefined);
              expect(call.args[5]).to.equal(choices[index].customProperties);
              expect(call.args[6]).to.equal(choices[index].placeholder);
            });
          });
        });

        describe('passing truthy replaceChoices flag', () => {
          it('choices are cleared', () => {
            instance.setChoices(choices, value, label, true);
            expect(clearChoicesStub.called).to.equal(true);
          });
        });

        describe('passing falsey replaceChoices flag', () => {
          it('choices are not cleared', () => {
            instance.setChoices(choices, value, label, false);
            expect(clearChoicesStub.called).to.equal(false);
          });
        });
      });
    });

    describe('renderGroups', () => {
      beforeEach(() => {});
      it('returns a fragment of groups', () => {});
    });

    describe('renderChoices', () => {
      beforeEach(() => {});
      it('returns a fragment of choices', () => {});
    });

    describe('renderItems', () => {
      beforeEach(() => {});
      it('returns a fragment of items', () => {});
    });

    describe('render', () => {
      beforeEach(() => {});

      describe('no change to state', () => {
        it('returns early', () => {});
      });

      describe('change to state', () => {
        it('updates previous state to current state', () => {});

        describe('select element', () => {
          it('clears choice list', () => {});

          describe('when resetScrollPosition config option is set to true', () => {
            it('scrolls to top of choice list', () => {});
          });
        });

        describe('text element', () => {
          describe('active items in store', () => {
            it('clears item list', () => {});
            it('renders active items inside item list', () => {});
          });
        });
      });
    });
  });

  describe.skip('private methods', () => {
    describe('_triggerChange', () => {});
    describe('_handleButtonAction', () => {});
    describe('_handleItemAction', () => {});
    describe('_handleChoiceAction', () => {});
    describe('_handleBackspace', () => {});
    describe('_handleLoadingState', () => {});
    describe('_canAddItem', () => {});
    describe('_ajaxCallback', () => {});
    describe('_searchChoices', () => {});
    describe('_handleSearch', () => {});
    describe('_addEventListeners', () => {});
    describe('_removeEventListeners', () => {});
    describe('_onKeyDown', () => {});
    describe('_onTouchMove', () => {});
    describe('_onTouchEnd', () => {});
    describe('_onMouseDown', () => {});
    describe('_onMouseOver', () => {});
    describe('_onClick', () => {});
    describe('_onFocus', () => {});
    describe('_onBlur', () => {});
    describe('_scrollToChoice', () => {});
    describe('_highlightChoice', () => {});
    describe('_addItem', () => {});
    describe('_removeItem', () => {});
    describe('_addChoice', () => {});
    describe('_clearChoices', () => {});
    describe('_addGroup', () => {});
    describe('_getTemplate', () => {});
    describe('_createTemplates', () => {});
    describe('_createStructure', () => {});
  });
});
