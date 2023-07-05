// <reference types="cypress" />
import { JWTPayload } from 'jose';
import { SignOutParams } from 'next-auth/react';

declare global {
  namespace Cypress {
    interface Chainable {
      login(user: JWTPayload): Chainable<Element>;
      logout(options?: SignOutParams<true>): Chainable<Element>;
      typeTextEditor(
        selector: string,
        value: string,
        shouldContainText?: boolean
      ): Chainable<Element>;
      getSelectFieldClickOption(
        dataTestId: string,
        option: string | number
      ): Chainable<Element>;
      typeAutocompleteClickOptionIndex(
        dataTestId: string,
        text: string,
        option: number
      ): Chainable<Element>;
      signInCompanyAndMockPeopleOnboardingCollection(
        isSignedServiceAgreement: boolean
      ): Chainable<Element>;
      mocksRestoreBaseCollection(): Chainable<Element>;
      clickOutside(): Chainable<Element>;
      selectMuiTab(tabIndex: number): Chainable<Element>;
      clickElementByCoordinate(): Chainable<Element>;
      chooseDatePicker(selector: string, value: string): Chainable<Element>;
      chooseDatePickerDataGrid(
        cell: string,
        selector: string,
        submitButton: string,
        value: string
      ): Chainable<Element>;
      chooseTimePicker(selector: string, value: string): Chainable<Element>;
      chooseTimePickerDataGrid(
        cell: string,
        selector: string,
        submitButton: string,
        value: string
      ): Chainable<Element>;
      useMocksApiClientFintech(): Chainable<Element>;
    }
  }
}
