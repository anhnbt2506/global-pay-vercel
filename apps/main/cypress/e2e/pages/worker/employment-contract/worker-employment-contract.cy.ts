import { WORKER } from '@fixtures/users';
import { testEachViewport } from 'support/utils';

describe('worker/employment-contract', () => {
  const mockApisWorkerEmploymentContract = (haveAddendumFile?: boolean) => {
    cy.mocksUseRouteVariant(
      'people/v1/worker-user/get-employment-companies:200-success'
    );
    haveAddendumFile
      ? cy.mocksUseRouteVariant(
          'people/v1/worker-employment/get-by-employment-id:200-worker-status-empty-addendum-files'
        )
      : cy.mocksUseRouteVariant(
          'people/v1/worker-employment/get-by-employment-id:200-worker-status-success'
        );
    cy.mocksUseRouteVariant('people/v1/agreement/get:200-success');
    cy.mocksUseRouteVariant('people/v1/worker-user/get-home:200-success');
    cy.mocksUseRouteVariant(
      'people/v1/worker-user/get-employment-companies:200-success'
    );
  };
  after(() => {
    cy.mocksRestoreBaseCollection();
  });

  describe('when accessing /worker/employment-contract then come back to home page', () => {
    testEachViewport('', () => {
      before(() => {
        mockApisWorkerEmploymentContract();
        cy.mocksUseRouteVariant(
          'people/v1/worker-employment/sign-agreement:200-success'
        );
        cy.login(WORKER);
        cy.visit('/worker/home');
      });

      after(() => {
        cy.mocksRestoreRouteVariants();
      });

      it('should redirect to home page when click reviewLater button', () => {
        cy.get(
          '[data-testid="workerHome-appLayout-topNavigation-workerCustom-iconButton"]'
        )
          .last()
          .click();
        cy.get(
          '[data-testid="workerHome-appLayout-topNavigation-workerCustom-/worker/employment-contract"]'
        )
          .last()
          .click();

        cy.get(
          '[data-testid="workerEmploymentContract-button-reviewLater"]'
        ).click();

        cy.url().should('include', '/worker/home');
      });
    });
  });

  describe('when accessing /worker/employment-contract successfully', () => {
    testEachViewport('', () => {
      before(() => {
        mockApisWorkerEmploymentContract();
        cy.mocksUseRouteVariant(
          'people/v1/worker-employment/sign-agreement:200-success'
        );
        cy.mocksUseRouteVariant('people/v1/file-management/get:200-success');
        cy.mocksUseRouteVariant('s3Api-download:200-success');
        cy.login(WORKER);
        cy.visit('/worker/home');
      });

      after(() => {
        cy.mocksRestoreRouteVariants();
      });

      it('should redirect to worker home page', () => {
        cy.url().should('include', '/worker/home');
      });

      it('should redirect to /worker/employment-contract page', () => {
        cy.get(
          '[data-testid="workerHome-appLayout-topNavigation-workerCustom-iconButton"]'
        )
          .last()
          .click();
        cy.get(
          '[data-testid="workerHome-appLayout-topNavigation-workerCustom-/worker/employment-contract"]'
        )
          .last()
          .click();
      });

      it('should contains correct page meta data', () => {
        cy.get(
          '[data-testid="workerEmploymentContract-form-legalDocument"]'
        ).should('be.visible');
        cy.get('[data-testid="workerEmploymentContract-form-checkBox"]').should(
          'be.visible'
        );
      });

      it('should sign contract successfully then redirect to in-review page', () => {
        cy.get(
          '[data-testid="workerEmploymentContract-form-referenceDocuments-114-sd-1-uebungssatz01-m2zvwu01.pdf-button"]'
        ).click();
        cy.get(
          '[data-testid="workerEmploymentContract-form-checkBox"]'
        ).click();
        cy.get(
          '[data-testid="workerEmploymentContract-button-submit"]'
        ).click();

        cy.get(
          '[data-testid="workerEmploymentContract-inReview-title"]'
        ).should('be.visible');
        cy.get(
          '[data-testid="workerEmploymentContract-inReview-description"]'
        ).should('be.visible');
        cy.get(
          '[data-testid="workerEmploymentContract-inReview-downloadContract-button"]'
        ).should('be.visible');
        cy.get(
          '[data-testid="workerEmploymentContract-inReview-home-button"]'
        ).should('be.visible');
      });

      it('should contain worker/employment-contract in url', () => {
        cy.get(
          '[data-testid="workerEmploymentContract-inReview-home-button"]'
        ).click();

        cy.url().should('include', 'worker/employment-contract');
      });
    });
  });

  describe('when accessing /worker/employment-contract but have no addendum files', () => {
    testEachViewport('', () => {
      before(() => {
        mockApisWorkerEmploymentContract(true);
        cy.mocksUseRouteVariant(
          'people/v1/worker-employment/sign-agreement:200-success'
        );
        cy.login(WORKER);
        cy.visit('/worker/home');
      });

      after(() => {
        cy.mocksRestoreRouteVariants();
      });

      it('should redirect to worker home page', () => {
        cy.url().should('include', '/worker/home');
      });

      it('should redirect to /worker/employment-contract page', () => {
        cy.get(
          '[data-testid="workerHome-appLayout-topNavigation-workerCustom-iconButton"]'
        )
          .last()
          .click();
        cy.get(
          '[data-testid="workerHome-appLayout-topNavigation-workerCustom-/worker/employment-contract"]'
        )
          .last()
          .click();
      });

      it('should contains correct page meta data', () => {
        cy.get(
          '[data-testid="workerEmploymentContract-form-legalDocument"]'
        ).should('be.visible');
        cy.get('[data-testid="workerEmploymentContract-form-checkBox"]').should(
          'be.visible'
        );
      });

      it('should sign contract successfully then redirect to in-review page', () => {
        cy.get(
          '[data-testid="workerEmploymentContract-form-checkBox"]'
        ).click();
        cy.get(
          '[data-testid="workerEmploymentContract-button-submit"]'
        ).click();

        cy.get(
          '[data-testid="workerEmploymentContract-inReview-title"]'
        ).should('be.visible');
        cy.get(
          '[data-testid="workerEmploymentContract-inReview-description"]'
        ).should('be.visible');
        cy.get(
          '[data-testid="workerEmploymentContract-inReview-downloadContract-button"]'
        ).should('be.visible');
        cy.get(
          '[data-testid="workerEmploymentContract-inReview-home-button"]'
        ).should('be.visible');
      });

      it('should contain worker/employment-contract in url', () => {
        cy.get(
          '[data-testid="workerEmploymentContract-inReview-home-button"]'
        ).click();

        cy.url().should('include', 'worker/employment-contract');
      });
    });
  });

  describe('when accessing /worker/employment-contract successfully and failed 500 error at sign agreement contract', () => {
    before(() => {
      mockApisWorkerEmploymentContract();
      cy.mocksUseRouteVariant(
        'people/v1/worker-employment/sign-agreement:500-internal-server-error'
      );
      cy.login(WORKER);
      cy.visit('/worker/home');
    });
    after(() => {
      cy.mocksRestoreRouteVariants();
    });

    it('should show error message - 500 error', () => {
      cy.get(
        '[data-testid="workerHome-appLayout-topNavigation-workerCustom-iconButton"]'
      )
        .last()
        .click();
      cy.get(
        '[data-testid="workerHome-appLayout-topNavigation-workerCustom-/worker/employment-contract"]'
      )
        .last()
        .click();

      cy.get('[data-testid="workerEmploymentContract-form-checkBox"]').click();
      cy.get('[data-testid="workerEmploymentContract-button-submit"]').click();

      cy.get('[data-testid="workerEmploymentContract-toast"]').should(
        'be.visible'
      );
      cy.get(
        '[data-testid="workerEmploymentContract-toast-errorAlert"]'
      ).should('be.visible');
    });
  });

  describe('when accessing /worker/employment-contract successfully and failed 403 error at sign agreement contract', () => {
    before(() => {
      mockApisWorkerEmploymentContract();
      cy.mocksUseRouteVariant(
        'people/v1/worker-employment/sign-agreement:403-forbidden-error'
      );
      cy.login(WORKER);
      cy.visit('/worker/home');
    });
    after(() => {
      cy.mocksRestoreRouteVariants();
    });

    it('should show error message - 403 error', () => {
      cy.get(
        '[data-testid="workerHome-appLayout-topNavigation-workerCustom-iconButton"]'
      )
        .last()
        .click();
      cy.get(
        '[data-testid="workerHome-appLayout-topNavigation-workerCustom-/worker/employment-contract"]'
      )
        .last()
        .click();

      cy.get('[data-testid="workerEmploymentContract-form-checkBox"]').click();
      cy.get('[data-testid="workerEmploymentContract-button-submit"]').click();

      cy.get('[data-testid="workerEmploymentContract-toast"]').should(
        'be.visible'
      );
      cy.get(
        '[data-testid="workerEmploymentContract-toast-errorAlert"]'
      ).should('be.visible');
    });
  });

  describe('when accessing /worker/employment-contract successfully and failed 400 unknown error at sign agreement contract', () => {
    before(() => {
      mockApisWorkerEmploymentContract();
      cy.mocksUseRouteVariant(
        'people/v1/worker-employment/sign-agreement:400-unknown-error'
      );
      cy.login(WORKER);
      cy.visit('/worker/home');
    });
    after(() => {
      cy.mocksRestoreRouteVariants();
    });

    it('should show error message - 400 error', () => {
      cy.get(
        '[data-testid="workerHome-appLayout-topNavigation-workerCustom-iconButton"]'
      )
        .last()
        .click();
      cy.get(
        '[data-testid="workerHome-appLayout-topNavigation-workerCustom-/worker/employment-contract"]'
      )
        .last()
        .click();

      cy.get('[data-testid="workerEmploymentContract-form-checkBox"]').click();
      cy.get('[data-testid="workerEmploymentContract-button-submit"]').click();

      cy.get('[data-testid="workerEmploymentContract-toast"]').should(
        'be.visible'
      );
      cy.get(
        '[data-testid="workerEmploymentContract-toast-errorAlert"]'
      ).should('be.visible');
    });
    it('should close  toast', () => {
      cy.get(
        '[data-testid="workerEmploymentContract-toast-errorAlert"]'
      ).clickOutside();
    });
  });
});
