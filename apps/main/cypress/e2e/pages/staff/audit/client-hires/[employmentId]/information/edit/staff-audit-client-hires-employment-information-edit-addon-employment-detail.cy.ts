import { mockDataEditEmploymentId, submitEditModal } from '../config';

describe('staff/audit/client-hires/[employmentId] ', () => {
  describe('when access Information tab', () => {
    describe('when edit Add-on employment details for VN country', () => {
      before(() => {
        cy.clearCookies();

        mockDataEditEmploymentId('vn');
      });

      after(() => {
        cy.mocksRestoreRouteVariants();
      });

      it('should display correct fields for VN country', () => {
        cy.get(
          '[data-testid="staffAudit-clientHires-employmentId-informationForm.addOnEmploymentDetails.VN.fields.workerProbationStartDate"]'
        )
          .scrollIntoView()
          .should('be.visible');
        cy.get(
          '[data-testid="staffAudit-clientHires-employmentId-informationForm.addOnEmploymentDetails.VN.fields.workerProbationEndDate"]'
        ).should('be.visible');
        cy.get(
          '[data-testid="staffAudit-clientHires-employmentId-informationForm.addOnEmploymentDetails.VN.fields.workerSocialInsuranceBookNo"]'
        ).should('be.visible');
        cy.get(
          '[data-testid="staffAudit-clientHires-employmentId-informationForm.addOnEmploymentDetails.VN.fields.workerLocalHospitalForStatutoryMedicalInsurance"]'
        ).should('be.visible');
      });

      it('should display correct fields to edit VN country', () => {
        cy.get(
          `[data-testid="staffAudit-clientHires-employmentId-informationForm.addOnEmploymentDetails-button-edit"]`
        )
          .scrollIntoView()
          .click();

        cy.get(
          '[data-testid="staffAuditClientHires-employmentId-editInformation.addOnEmploymentDetails.vn.fields.probationStartDate"]'
        ).should('be.visible');
        cy.get(
          '[data-testid="staffAuditClientHires-employmentId-editInformation.addOnEmploymentDetails.vn.fields.probationEndDate"]'
        ).should('be.visible');
        cy.get(
          '[data-testid="staffAuditClientHires-employmentId-editInformation.addOnEmploymentDetails.vn.fields.socialInsuranceBookNo"]'
        ).should('be.visible');
        cy.get(
          '[data-testid="staffAuditClientHires-employmentId-editInformation.addOnEmploymentDetails.vn.fields.localHospitalForStatutoryMedicalInsurance"]'
        ).should('be.visible');
      });

      it('should not submit when havent fill required fields', () => {
        submitEditModal();

        cy.get(
          '[data-testid="staffAuditClientHires-employmentId-editInformation.addOnEmploymentDetails.vn.fields.socialInsuranceBookNo-error"]'
        ).should('be.visible');
        cy.get(
          '[data-testid="staffAuditClientHires-employmentId-editInformation.addOnEmploymentDetails.vn.fields.localHospitalForStatutoryMedicalInsurance-error"]'
        ).should('be.visible');
      });

      it('should display error message when API return 403 forbidden error', () => {
        cy.mocksUseRouteVariant('people/v1/worker-employment/patch:403-error');

        cy.get(
          '[data-testid="staffAuditClientHires-employmentId-editInformation.addOnEmploymentDetails.vn.fields.probationStartDate"]'
        ).should('be.visible');
        cy.get(
          '[data-testid="staffAuditClientHires-employmentId-editInformation.addOnEmploymentDetails.vn.fields.probationEndDate"]'
        ).should('be.visible');
        cy.get(
          '[data-testid="staffAuditClientHires-employmentId-editInformation.addOnEmploymentDetails.vn.fields.socialInsuranceBookNo"]'
        )
          .should('be.visible')
          .clear()
          .type('12334');
        cy.get(
          '[data-testid="staffAuditClientHires-employmentId-editInformation.addOnEmploymentDetails.vn.fields.localHospitalForStatutoryMedicalInsurance"]'
        )
          .should('be.visible')
          .clear()
          .type('hospital');
        submitEditModal();

        cy.get(
          '[data-testid="staffAudit-clientHires-employmentId-information-toast-errorAlert"]'
        ).should('be.visible');

        cy.clickOutside();
      });

      it('should display error message when API return 400 unknown error', () => {
        cy.mocksUseRouteVariant('people/v1/worker-employment/patch:400-error');

        submitEditModal();

        cy.get(
          '[data-testid="staffAudit-clientHires-employmentId-information-toast-errorAlert"]'
        ).should('be.visible');

        cy.clickOutside();
      });

      it('should display success message when API return 200 success', () => {
        cy.mocksUseRouteVariant(
          'people/v1/worker-employment/patch:200-success'
        );

        submitEditModal();

        cy.get(
          '[data-testid="staffAudit-clientHires-employmentId-information-toast-successAlert"]'
        ).should('be.visible');

        cy.clickOutside();
      });
    });

    describe('when edit Add-on employment details for HK country', () => {
      before(() => {
        cy.clearCookies();

        mockDataEditEmploymentId('hk');
      });

      after(() => {
        cy.mocksRestoreRouteVariants();
      });

      it('should display correct fields for HK country', () => {
        cy.get(
          '[data-testid="staffAudit-clientHires-employmentId-informationForm.addOnEmploymentDetails.HK.fields.workerProbationPeriod"]'
        )
          .scrollIntoView()
          .should('be.visible');
        cy.get(
          '[data-testid="staffAudit-clientHires-employmentId-informationForm.addOnEmploymentDetails.HK.fields.workerMpfId"]'
        ).should('be.visible');
      });

      it('should display correct fields to edit HK country', () => {
        cy.get(
          `[data-testid="staffAudit-clientHires-employmentId-informationForm.addOnEmploymentDetails-button-edit"]`
        )
          .scrollIntoView()
          .click();

        cy.get(
          '[data-testid="staffAuditClientHires-employmentId-editInformation.addOnEmploymentDetails.hk.fields.probationPeriod"]'
        ).should('be.visible');

        cy.get(
          '[data-testid="staffAuditClientHires-employmentId-editInformation.addOnEmploymentDetails.hk.fields.mpfId"]'
        ).should('be.visible');
      });

      it('should not submit when havent fill required fields', () => {
        submitEditModal();

        cy.get(
          '[data-testid="staffAuditClientHires-employmentId-editInformation.addOnEmploymentDetails.hk.fields.mpfId-error"]'
        ).should('be.visible');
      });

      it('should display success message when API return 200 success', () => {
        cy.mocksUseRouteVariant(
          'people/v1/worker-employment/patch:200-success'
        );

        cy.get(
          '[data-testid="staffAuditClientHires-employmentId-editInformation.addOnEmploymentDetails.hk.fields.probationPeriod"]'
        )
          .should('be.visible')
          .clear()
          .type('12');

        cy.get(
          '[data-testid="staffAuditClientHires-employmentId-editInformation.addOnEmploymentDetails.hk.fields.mpfId"]'
        )
          .should('be.visible')
          .clear()
          .type('213HXS');
        submitEditModal();

        cy.get(
          '[data-testid="staffAudit-clientHires-employmentId-information-toast-successAlert"]'
        ).should('be.visible');
      });
    });

    describe('when edit Add-on employment details for ID country', () => {
      before(() => {
        cy.clearCookies();

        mockDataEditEmploymentId('id');
      });

      it('should display correct fields for ID country', () => {
        cy.get(
          '[data-testid="staffAudit-clientHires-employmentId-informationForm.addOnEmploymentDetails.ID.fields.workerProbationPeriod"]'
        )
          .scrollIntoView()
          .should('be.visible');
        cy.get(
          '[data-testid="staffAudit-clientHires-employmentId-informationForm.addOnEmploymentDetails.ID.fields.workerReligiousFestivityAllowance"]'
        ).should('be.visible');
      });

      it('should display correct fields to edit ID country', () => {
        cy.get(
          `[data-testid="staffAudit-clientHires-employmentId-informationForm.addOnEmploymentDetails-button-edit"]`
        )
          .scrollIntoView()
          .click();

        cy.get(
          '[data-testid="staffAuditClientHires-employmentId-editInformation.addOnEmploymentDetails.id.fields.probationPeriod"]'
        ).should('be.visible');

        cy.get(
          '[data-testid="staffAuditClientHires-employmentId-editInformation.addOnEmploymentDetails.id.fields.religiousFestivityAllowance"]'
        ).should('be.visible');
      });

      it('should display success message when API return 200 success', () => {
        cy.mocksUseRouteVariant(
          'people/v1/worker-employment/patch:200-success'
        );

        cy.get(
          '[data-testid="staffAuditClientHires-employmentId-editInformation.addOnEmploymentDetails.id.fields.probationPeriod"]'
        )
          .should('be.visible')
          .clear()
          .type('12');
        cy.get(
          '[data-testid="staffAuditClientHires-employmentId-editInformation.addOnEmploymentDetails.id.fields.religiousFestivityAllowance"]'
        )
          .should('be.visible')
          .clear()
          .type('12');

        submitEditModal();

        cy.get(
          '[data-testid="staffAudit-clientHires-employmentId-information-toast-successAlert"]'
        ).should('be.visible');
      });
    });

    describe('when edit Add-on employment details for MY country', () => {
      before(() => {
        cy.clearCookies();

        mockDataEditEmploymentId('my');
      });

      after(() => {
        cy.mocksRestoreRouteVariants();
      });

      it('should display correct fields for MY country', () => {
        cy.get(
          '[data-testid="staffAudit-clientHires-employmentId-informationForm.addOnEmploymentDetails.MY.fields.workerProbationPeriod"]'
        )
          .scrollIntoView()
          .should('be.visible');
        cy.get(
          '[data-testid="staffAudit-clientHires-employmentId-informationForm.addOnEmploymentDetails.MY.fields.workerEpfId"]'
        ).should('be.visible');
      });

      it('should display correct fields to edit MY country', () => {
        cy.get(
          `[data-testid="staffAudit-clientHires-employmentId-informationForm.addOnEmploymentDetails-button-edit"]`
        )
          .scrollIntoView()
          .click();

        cy.get(
          '[data-testid="staffAuditClientHires-employmentId-editInformation.addOnEmploymentDetails.my.fields.probationPeriod"]'
        ).should('be.visible');

        cy.get(
          '[data-testid="staffAuditClientHires-employmentId-editInformation.addOnEmploymentDetails.my.fields.epfId"]'
        ).should('be.visible');
      });

      it('should display success message when API return 200 success', () => {
        cy.mocksUseRouteVariant(
          'people/v1/worker-employment/patch:200-success'
        );

        cy.get(
          '[data-testid="staffAuditClientHires-employmentId-editInformation.addOnEmploymentDetails.my.fields.probationPeriod"]'
        )
          .should('be.visible')
          .clear()
          .type('12');
        cy.get(
          '[data-testid="staffAuditClientHires-employmentId-editInformation.addOnEmploymentDetails.my.fields.epfId"]'
        )
          .should('be.visible')
          .clear()
          .type('12');

        submitEditModal();

        cy.get(
          '[data-testid="staffAudit-clientHires-employmentId-information-toast-successAlert"]'
        ).should('be.visible');
      });
    });

    describe('when edit Add-on employment details for PH country', () => {
      before(() => {
        cy.clearCookies();

        mockDataEditEmploymentId('ph');
      });

      after(() => {
        cy.mocksRestoreRouteVariants();
      });

      it('should display correct fields for PH country', () => {
        cy.get(
          '[data-testid="staffAudit-clientHires-employmentId-informationForm.addOnEmploymentDetails.PH.fields.workerProbationPeriod"]'
        )
          .scrollIntoView()
          .should('be.visible');
        cy.get(
          '[data-testid="staffAudit-clientHires-employmentId-informationForm.addOnEmploymentDetails.PH.fields.workerFieldManagerialType"]'
        ).should('be.visible');
        cy.get(
          '[data-testid="staffAudit-clientHires-employmentId-informationForm.addOnEmploymentDetails.PH.fields.workerMonthlyAllowance"]'
        ).should('be.visible');
        cy.get(
          '[data-testid="staffAudit-clientHires-employmentId-informationForm.addOnEmploymentDetails.PH.fields.workerSssId"]'
        ).should('be.visible');
        cy.get(
          '[data-testid="staffAudit-clientHires-employmentId-informationForm.addOnEmploymentDetails.PH.fields.workerTinId"]'
        ).should('be.visible');
        cy.get(
          '[data-testid="staffAudit-clientHires-employmentId-informationForm.addOnEmploymentDetails.PH.fields.workerEntitledToOvertimeNightDayDifferential"]'
        ).should('be.visible');
        cy.get(
          '[data-testid="staffAudit-clientHires-employmentId-informationForm.addOnEmploymentDetails.PH.fields.workerPhilhealthId"]'
        ).should('be.visible');
        cy.get(
          '[data-testid="staffAudit-clientHires-employmentId-informationForm.addOnEmploymentDetails.PH.fields.workerMidHdmfId"]'
        ).should('be.visible');
      });

      it('should display correct fields to edit PH country', () => {
        cy.get(
          `[data-testid="staffAudit-clientHires-employmentId-informationForm.addOnEmploymentDetails-button-edit"]`
        )
          .scrollIntoView()
          .click();

        cy.get(
          '[data-testid="staffAuditClientHires-employmentId-editInformation.addOnEmploymentDetails.ph.fields.probationPeriod"]'
        )
          .scrollIntoView()
          .should('be.visible');
        cy.get(
          '[data-testid="staffAuditClientHires-employmentId-editInformation.addOnEmploymentDetails.ph.fields.fieldManagerialType"]'
        ).should('be.visible');
        cy.get(
          '[data-testid="staffAuditClientHires-employmentId-editInformation.addOnEmploymentDetails.ph.fields.monthlyAllowance"]'
        ).should('be.visible');
        cy.get(
          '[data-testid="staffAuditClientHires-employmentId-editInformation.addOnEmploymentDetails.ph.fields.sssId"]'
        ).should('be.visible');
        cy.get(
          '[data-testid="staffAuditClientHires-employmentId-editInformation.addOnEmploymentDetails.ph.fields.tinId"]'
        ).should('be.visible');
        cy.get(
          '[data-testid="staffAuditClientHires-employmentId-editInformation.addOnEmploymentDetails.ph.fields.isEntitledToOvertimeDifferential"]'
        ).should('be.visible');
        cy.get(
          '[data-testid="staffAuditClientHires-employmentId-editInformation.addOnEmploymentDetails.ph.fields.healthId"]'
        )
          .scrollIntoView()
          .should('be.visible');
        cy.get(
          '[data-testid="staffAuditClientHires-employmentId-editInformation.addOnEmploymentDetails.ph.fields.hdmfId"]'
        ).should('be.visible');
      });

      it('should display success message when API return 200 success', () => {
        cy.mocksUseRouteVariant(
          'people/v1/worker-employment/patch:200-success'
        );

        cy.get(
          '[data-testid="staffAuditClientHires-employmentId-editInformation.addOnEmploymentDetails.ph.fields.probationPeriod"]'
        )
          .scrollIntoView()
          .should('be.visible')
          .clear()
          .type('180');
        cy.getSelectFieldClickOption(
          'staffAuditClientHires-employmentId-editInformation.addOnEmploymentDetails.ph.fields.fieldManagerialType',
          'FIELD_MANAGERIAL'
        );
        cy.get(
          '[data-testid="staffAuditClientHires-employmentId-editInformation.addOnEmploymentDetails.ph.fields.monthlyAllowance"]'
        )
          .should('be.visible')
          .clear()
          .type('45');
        cy.get(
          '[data-testid="staffAuditClientHires-employmentId-editInformation.addOnEmploymentDetails.ph.fields.sssId"]'
        )
          .should('be.visible')
          .clear()
          .type('432');
        cy.get(
          '[data-testid="staffAuditClientHires-employmentId-editInformation.addOnEmploymentDetails.ph.fields.tinId"]'
        )
          .scrollIntoView()
          .should('be.visible')
          .clear()
          .type('abc');
        cy.getSelectFieldClickOption(
          'staffAuditClientHires-employmentId-editInformation.addOnEmploymentDetails.ph.fields.isEntitledToOvertimeDifferential',
          '1'
        );
        cy.get(
          '[data-testid="staffAuditClientHires-employmentId-editInformation.addOnEmploymentDetails.ph.fields.healthId"]'
        )
          .should('be.visible')
          .clear()
          .type('32');
        cy.get(
          '[data-testid="staffAuditClientHires-employmentId-editInformation.addOnEmploymentDetails.ph.fields.hdmfId"]'
        )
          .should('be.visible')
          .clear()
          .type('2143');
        submitEditModal();

        cy.get(
          '[data-testid="staffAudit-clientHires-employmentId-information-toast-successAlert"]'
        ).should('be.visible');
      });
    });

    describe('when edit Add-on employment details for SG country', () => {
      before(() => {
        cy.clearCookies();

        mockDataEditEmploymentId('sg');
      });

      after(() => {
        cy.mocksRestoreRouteVariants();
      });

      it('should display correct fields for SG country', () => {
        cy.get(
          '[data-testid="staffAudit-clientHires-employmentId-informationForm.addOnEmploymentDetails.SG.fields.workerProbationPeriod"]'
        )
          .scrollIntoView()
          .should('be.visible');
      });

      it('should display correct fields to edit SG country', () => {
        cy.get(
          `[data-testid="staffAudit-clientHires-employmentId-informationForm.addOnEmploymentDetails-button-edit"]`
        )
          .scrollIntoView()
          .click();

        cy.get(
          '[data-testid="staffAuditClientHires-employmentId-editInformation.addOnEmploymentDetails.sg.fields.probationPeriod"]'
        ).should('be.visible');
      });

      it('should display success message when API return 200 success', () => {
        cy.mocksUseRouteVariant(
          'people/v1/worker-employment/patch:200-success'
        );

        cy.get(
          '[data-testid="staffAuditClientHires-employmentId-editInformation.addOnEmploymentDetails.sg.fields.probationPeriod"]'
        )
          .should('be.visible')
          .clear()
          .type('12');

        submitEditModal();

        cy.get(
          '[data-testid="staffAudit-clientHires-employmentId-information-toast-successAlert"]'
        ).should('be.visible');
      });
    });

    describe('when edit Add-on employment details for Th country', () => {
      before(() => {
        cy.clearCookies();

        mockDataEditEmploymentId('th');
      });

      after(() => {
        cy.mocksRestoreRouteVariants();
      });

      it('should display correct fields for Th country', () => {
        cy.get(
          '[data-testid="staffAudit-clientHires-employmentId-informationForm.addOnEmploymentDetails.TH.fields.workerProbationPeriod"]'
        )
          .scrollIntoView()
          .should('be.visible');
      });

      it('should display correct fields to edit Th country', () => {
        cy.get(
          `[data-testid="staffAudit-clientHires-employmentId-informationForm.addOnEmploymentDetails-button-edit"]`
        )
          .scrollIntoView()
          .click();

        cy.get(
          '[data-testid="staffAuditClientHires-employmentId-editInformation.addOnEmploymentDetails.th.fields.probationPeriod"]'
        ).should('be.visible');
      });

      it('should display success message when API return 200 success', () => {
        cy.mocksUseRouteVariant(
          'people/v1/worker-employment/patch:200-success'
        );
        cy.mocksUseRouteVariant('people/v1/worker-employment/patch:404-error');

        cy.get(
          '[data-testid="staffAuditClientHires-employmentId-editInformation.addOnEmploymentDetails.th.fields.probationPeriod"]'
        )
          .should('be.visible')
          .clear()
          .type('12');

        submitEditModal();
        cy.get(
          '[data-testid="staffAudit-clientHires-employmentId-information-toast-successAlert"]'
        ).should('be.visible');

        cy.clickOutside();
      });
    });
  });
});
