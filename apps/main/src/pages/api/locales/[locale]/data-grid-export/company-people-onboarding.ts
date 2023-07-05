import { NextApiRequest, NextApiResponse } from 'next';

export default async function companyPeopleOnboarding(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { locale } = req.query;

  try {
    const [
      { default: companyPeopleOnboarding },
      { default: employmentType },
      { default: status },
    ] = await Promise.all([
      import(`@public/locales/${locale}/company-people-onboarding.json`),
      import(`@public/locales/${locale}/employment-type.json`),
      import(`@public/locales/${locale}/hire-status.json`),
    ]);

    return res.status(200).json({
      header: companyPeopleOnboarding.dataGrid.header,
      metadata: {
        employmentType,
        status,
      },
    });
  } catch (error) {
    return res.status(500).json({ error });
  }
}
