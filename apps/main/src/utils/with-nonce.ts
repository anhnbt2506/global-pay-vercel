import type { GetServerSideProps, PreviewData } from 'next';
import { getNonce } from '@ayp/utils';
import type { ParsedUrlQuery } from 'querystring';

export const withNonce =
  <
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    P extends { [key: string]: any } = { [key: string]: any },
    Q extends ParsedUrlQuery = ParsedUrlQuery,
    D extends PreviewData = PreviewData
  >(
    getServerSideProps: GetServerSideProps<P, Q, D>
  ): GetServerSideProps<P & { nonce: string }, Q, D> =>
  async (ctx) => {
    const gsspResult = await getServerSideProps(ctx);

    if ('props' in gsspResult) {
      const nonce = getNonce(ctx);
      const props = await gsspResult.props;

      return { props: { ...props, nonce } };
    }

    return gsspResult;
  };
