import { NextApiRequest, NextApiResponse } from 'next';

export default async function staffAuditClientServiceAgreements(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { locale } = req.query;

  try {
    const [
      { default: staffAuditClientServiceAgreements },
      { default: status },
    ] = await Promise.all([
      import(
        `@public/locales/${locale}/staff-audit-client-service-agreements.json`
      ),
      import(`@public/locales/${locale}/service-agreements-status`),
    ]);

    return res.status(200).json({
      header: staffAuditClientServiceAgreements.dataGrid.header,
      metadata: {
        status,
      },
    });
  } catch (error) {
    return res.status(500).json({ error });
  }
}
