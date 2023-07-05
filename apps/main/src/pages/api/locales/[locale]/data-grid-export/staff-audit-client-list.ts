import { NextApiRequest, NextApiResponse } from 'next';

export default async function staffAuditClientList(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { locale } = req.query;

  try {
    const [
      { default: staffAuditClientList },
      { default: category },
      { default: industry },
      { default: entityLinkStatus },
      { default: status },
    ] = await Promise.all([
      import(`@public/locales/${locale}/staff-audit-client-list.json`),
      import(`@public/locales/${locale}/company-category.json`),
      import(`@public/locales/${locale}/company-industry.json`),
      import(`@public/locales/${locale}/entity-link-status.json`),
      import(`@public/locales/${locale}/company-status.json`),
    ]);

    return res.status(200).json({
      header: staffAuditClientList.dataGrid.header,
      metadata: {
        category,
        industry,
        entityLinkStatus,
        status,
      },
    });
  } catch (error) {
    return res.status(500).json({ error });
  }
}
