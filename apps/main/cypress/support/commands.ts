// <reference path="./component.d.ts" />

import hkdf from '@panva/hkdf';
import 'cypress-file-upload';
import { EncryptJWT, JWTPayload } from 'jose';
import { SignOutParams } from 'next-auth/react';

import { COMPANY_OWNER } from '@fixtures/users';

// Function logic derived from https://github.com/nextauthjs/next-auth/blob/5c1826a8d1f8d8c2d26959d12375704b0a693bfc/packages/next-auth/src/jwt/index.ts#L113-L121
async function getDerivedEncryptionKey(secret: string) {
  return await hkdf(
    'sha256',
    secret,
    '',
    'NextAuth.js Generated Encryption Key',
    32
  );
}

// Function logic derived from https://github.com/nextauthjs/next-auth/blob/5c1826a8d1f8d8c2d26959d12375704b0a693bfc/packages/next-auth/src/jwt/index.ts#L16-L25
export async function encode(
  token: JWTPayload,
  secret: string
): Promise<string> {
  const maxAge = 30 * 24 * 60 * 60; // 30 days
  const encryptionSecret = await getDerivedEncryptionKey(secret);

  return await new EncryptJWT(token)
    .setProtectedHeader({ alg: 'dir', enc: 'A256GCM' })
    .setIssuedAt()
    .setExpirationTime(Math.round(Date.now() / 1000 + maxAge))
    .setJti('test')
    .encrypt(encryptionSecret);
}

Cypress.Commands.add('login', (user: JWTPayload) => {
  // Generate and set a valid cookie from the fixture that next-auth can decrypt
  cy.intercept('/api/auth/session', { user }).as('session');

  cy.wrap(null)
    .then(() => encode({ user }, 'secret'))
    .then((encryptedToken) => {
      cy.intercept(
        {
          method: 'POST',
          url: '/api/auth/callback/credentials',
        },
        { fixture: 'auth/credentials.json' }
      ).as('credentials');

      cy.intercept('/api/auth/csrf', { fixture: 'auth/csrf.json' }).as('csrf');

      cy.intercept('/api/auth/providers', {
        fixture: 'auth/providers.json',
      }).as('providers');

      cy.setCookie('next-auth.session-token', encryptedToken);
      cy.setCookie('accessToken', encryptedToken);
      cy.setCookie('authorization', encryptedToken);
    });
});

Cypress.Commands.add('logout', (options?: SignOutParams<true>) => {
  cy.clearCookies();
  cy.visit(options.callbackUrl);
});

Cypress.Commands.add(
  'typeTextEditor',
  (selector: string, value: string, skipTypeValue?: boolean) => {
    cy.get(`#${selector}_ifr`).then(($iframe) => {
      const iframe = $iframe.contents();
      const myInput = iframe.find('#tinymce');
      if (!skipTypeValue) {
        cy.wrap(myInput)
          .should('be.visible')
          .type(value)
          .should('contain.text', value);
      } else {
        cy.wrap(myInput).should('be.visible').should('contain.text', value);
      }
    });
  }
);

Cypress.Commands.add(
  'getSelectFieldClickOption',
  (dataTestId: string, option: string | number) => {
    cy.get(`[data-testid="${dataTestId}"]`).click();
    cy.get(`[data-testid="${dataTestId}-optionId-${option}"]`).click();
  }
);

Cypress.Commands.add(
  'typeAutocompleteClickOptionIndex',
  (dataTestId: string, text: string, option: number) => {
    cy.get(`[data-testid="${dataTestId}"]`).click().type(text);
    cy.get(`.MuiAutocomplete-popper li[data-option-index=${option}]`).click({
      force: true,
    });
  }
);

Cypress.Commands.add(
  'signInCompanyAndMockPeopleOnboardingCollection',
  (isSignedServiceAgreement: boolean) => {
    cy.mocksSetCollection('base-people-onboarding');
    if (isSignedServiceAgreement) {
      cy.mocksUseRouteVariant(
        'people/v1/service-agreement/pom/get-by-hire-type:200-success-pom-signed'
      );
      cy.mocksUseRouteVariant(
        'people/v1/service-agreement/peo/get-by-hire-type:200-success-peo-signed'
      );
    }
    cy.login(COMPANY_OWNER);
  }
);

Cypress.Commands.add('mocksRestoreBaseCollection', () => {
  cy.mocksSetCollection('base');
});

Cypress.Commands.add('clickOutside', () => {
  cy.get('body').click(0, 0);
});

Cypress.Commands.add('selectMuiTab', (tabIndex: number) => {
  cy.get(`.MuiTabs-flexContainer > :nth-child(${tabIndex})`)
    .scrollIntoView()
    .click();
});

Cypress.Commands.add(
  'clickElementByCoordinate',
  { prevSubject: true },
  (subject) => {
    cy.wrap(subject).then(($el) => {
      const coordinate = $el[0].getBoundingClientRect();
      const x = coordinate.left + (coordinate.right - coordinate.left) / 2;
      const y = coordinate.top + (coordinate.bottom - coordinate.top) / 2;
      cy.root().click(x, y);
    });
  }
);

Cypress.Commands.add('chooseDatePicker', (selector: string, value: string) => {
  cy.get('body').then(($body) => {
    const mobilePickerSelector = `${selector} input[readonly]`;
    cy.get(mobilePickerSelector).then(($view) => {
      if ($view.is(':visible')) {
        cy.get(mobilePickerSelector).click();
        const paperSelector = '[data-testid="datePickerPaper"]';
        cy.get(paperSelector).should('exist');
        cy.contains(`${paperSelector} [role="gridcell"]button`, value).click();
        cy.contains(`${paperSelector} button`, 'OK').click();
      } else {
        cy.get(selector).find('input').clear().type(value);
      }
    });
  });
});

Cypress.Commands.add(
  'chooseDatePickerDataGrid',
  (cell: string, selector: string, submitButton: string, value: string) => {
    cy.get(`[data-testid="${cell}"]`).scrollIntoView().dblclick();
    const paperSelector = `[data-testid="${selector}"]`;
    cy.get(paperSelector).should('exist');
    cy.contains(`${paperSelector} [role="gridcell"]button`, value).click();
    cy.get(`[data-testid="${submitButton}"]`).click();
  }
);

Cypress.Commands.add('chooseTimePicker', (selector: string, value: string) => {
  const mobilePickerSelector = `${selector} input[readonly]`;
  cy.get(mobilePickerSelector).scrollIntoView().click();
  const paperSelector = `[data-testid="timePickerPaper"]`;
  cy.get(paperSelector).should('exist');
  const [hour, minute] = value.split(':');

  // clickElementByCoordinate is used because cypres .click() not working on the hour & minute span
  cy.contains(
    `${paperSelector} [role="option"]span`,
    hour === '00' ? hour : Number(hour).toString() // trim leading '0' if hour is not '00'
  ).clickElementByCoordinate();
  cy.contains(
    `${paperSelector} [role="option"]span`,
    minute
  ).clickElementByCoordinate();
  cy.contains(`${paperSelector} button`, 'OK').click();
});

/**
 * clickElementByCoordinate is used because cypres .click() not working on the hour & minute span
 */
Cypress.Commands.add(
  'chooseTimePickerDataGrid',
  (cell: string, selector: string, submitButton: string, value: string) => {
    cy.get(`[data-testid="${cell}"]`).scrollIntoView().dblclick();
    const paperSelector = `[data-testid="${selector}"]`;
    cy.get(paperSelector).should('exist');
    const [hour, minute] = value.split(':');

    cy.contains(
      `${paperSelector} [role="option"]span`,
      hour === '00' ? hour : Number(hour).toString() // trim leading '0' if hour is not '00'
    ).clickElementByCoordinate();
    cy.contains(
      `${paperSelector} [role="option"]span`,
      minute
    ).clickElementByCoordinate();
    cy.get(`[data-testid="${submitButton}"]`).click();
  }
);

Cypress.Commands.add('useMocksApiClientFintech', () => {
  cy.mocksConfigAdminApiClient({ port: 3111 });
});
