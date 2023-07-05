import { NextApiRequest, NextApiResponse } from 'next';

export default async function companyPeopleWorkforce(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { locale } = req.query;

  try {
    const [
      { default: companyPeopleWorkforce },
      { default: contractType },
      { default: common },
    ] = await Promise.all([
      import(`@public/locales/${locale}/company-people-workforce.json`),
      import(`@public/locales/${locale}/contract-type.json`),
      import(`@public/locales/${locale}/common.json`),
    ]);

    const boolean = {
      '0': common.no,
      '1': common.yes,
    };

    return res.status(200).json({
      header: companyPeopleWorkforce.dataGrid.header,
      metadata: {
        contractType,
        isPermitRequired: boolean,
      },
    });
  } catch (error) {
    return res.status(500).json({ error });
  }
}
