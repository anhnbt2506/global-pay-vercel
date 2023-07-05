import { Environment } from '@ayp/utils';
import { NextApiRequest, NextApiResponse } from 'next';

export default function health(req: NextApiRequest, res: NextApiResponse) {
  return res.status(200).json({
    container: 'OK',
    version: Environment.getVersion() ?? 'UNKNOWN',
  });
}
