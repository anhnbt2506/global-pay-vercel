import Image from 'next/image';
import type { FC } from 'react';

interface CountryFlagProps {
  code: string;
}

export const CountryFlag: FC<CountryFlagProps> = ({ code }) => (
  <Image
    alt={code}
    width="20"
    height="10"
    loading="lazy"
    src={`https://flagcdn.com/w20/${code.toLowerCase()}.png`}
  />
);
