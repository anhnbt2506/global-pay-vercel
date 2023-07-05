import { Redirect } from 'next';

export class RedirectionError extends Error {
  private destination: string;
  private permanent: boolean;

  constructor(destination: string, permanent = false) {
    super();
    this.destination = destination;
    this.permanent = permanent;
  }

  public redirect(): { redirect: Redirect } {
    return {
      redirect: {
        permanent: this.permanent,
        destination: this.destination,
      },
    };
  }
}
