describe('api/locales/[locale]/peo-agreement', () => {
  describe('when accessing the /api/locales/en/peo-agreement', () => {
    it('should return correct response for peo agreement translation for English', () => {
      cy.request('/api/locales/en/peo-agreement').as('api');
      cy.get<{ status: number; body: Record<string, unknown> }>('@api').then(
        (response) => {
          expect(response.status).to.eq(200);
          expect(response.body.citizenshipStatus).exist;
          expect(response.body.contractType).exist;
          expect(response.body.employmentType).exist;
          expect(response.body.fieldManagerialType).exist;
          expect(response.body.gender).exist;
          expect(response.body.isEligibleForAdditionalIncome).exist;
          expect(response.body.isEligibleForAnnualBonus).exist;
          expect(response.body.isEligibleForCommission).exist;
          expect(response.body.isEligibleForInsurance).exist;
          expect(response.body.isEligibleForPaidExpenses).exist;
          expect(response.body.isEligibleForVariablePay).exist;
          expect(response.body.isEntitledToOvertime).exist;
          expect(response.body.isEntitledToOvertimeDifferential).exist;
          expect(response.body.maritalStatus).exist;
          expect(response.body.probationPeriodUnit).exist;
          expect(response.body.religion).exist;
        }
      );
    });
  });
});
