import { NextApiRequest, NextApiResponse } from 'next';

export default async function staffAuditClientHires(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { locale } = req.query;

  try {
    const [
      { default: common },
      { default: staffAuditClientHires },
      { default: citizenshipStatus },
      { default: status },
    ] = await Promise.all([
      import(`@public/locales/${locale}/common.json`),
      import(`@public/locales/${locale}/staff-audit-client-hires.json`),
      import(`@public/locales/${locale}/citizenship-status.json`),
      import(`@public/locales/${locale}/hire-status.json`),
    ]);

    const boolean = {
      '0': common.no,
      '1': common.yes,
    };

    return res.status(200).json({
      header: staffAuditClientHires.dataGrid.header,
      metadata: {
        citizenshipStatus,
        isPermitRequired: boolean,
        status,
      },
    });
  } catch (error) {
    return res.status(500).json({ error });
  }
}
