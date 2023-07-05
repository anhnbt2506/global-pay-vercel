import { NextApiRequest, NextApiResponse } from 'next';

export default async function peoAgreement(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { locale } = req.query;

  try {
    const [
      { default: common },
      { default: calendarUnit },
      { default: contractType },
      { default: employmentType },
      { default: countryConstant },
      { default: citizenshipStatus },
      { default: companyPeopleOnboardingCreate },
      { default: gender },
      { default: maritalStatus },
      { default: religion },
    ] = await Promise.all([
      import(`@public/locales/${locale}/common.json`),
      import(`@public/locales/${locale}/calendar-unit.json`),
      import(`@public/locales/${locale}/contract-type.json`),
      import(`@public/locales/${locale}/employment-type.json`),
      import(`@public/locales/${locale}/country-constant.json`),
      import(`@public/locales/${locale}/citizenship-status.json`),
      import(`@public/locales/${locale}/company-people-onboarding-create.json`),
      import(`@public/locales/${locale}/gender.json`),
      import(`@public/locales/${locale}/marital-status.json`),
      import(`@public/locales/${locale}/religion.json`),
    ]);

    const boolean = {
      '0': common.no,
      '1': common.yes,
    };

    const isEligibleForInsurance = {
      '0': companyPeopleOnboardingCreate.guidedMode.PEO.employmentContract
        .isEligibleForInsurance.notEligible,
      '1': companyPeopleOnboardingCreate.guidedMode.PEO.employmentContract
        .isEligibleForInsurance.eligible,
    };

    const isEntitledToOvertimeDifferential = {
      '0': companyPeopleOnboardingCreate.guidedMode.PEO.employmentContract
        .isEntitledToOvertimeDifferential.shallNotBe,
      '1': companyPeopleOnboardingCreate.guidedMode.PEO.employmentContract
        .isEntitledToOvertimeDifferential.shallBe,
    };

    const fieldManagerialType = countryConstant.ph.fieldManagerialType;

    return res.status(200).json({
      citizenshipStatus,

      contractType,
      employmentType,

      gender,
      maritalStatus,
      religion,

      isEligibleForAdditionalIncome: boolean,
      isEligibleForPaidExpenses: boolean,
      isEntitledToOvertime: boolean,

      probationPeriodUnit: calendarUnit,

      isEligibleForInsurance,
      isEntitledToOvertimeDifferential,
      fieldManagerialType,

      isEligibleForVariablePay: boolean,
      isEligibleForCommission: boolean,
      isEligibleForAnnualBonus: boolean,
    });
  } catch (error) {
    return res.status(500).json({ error });
  }
}
