declare module 'react-world-flags' {
  import { ComponentProps } from 'react';

  interface FlagProps extends ComponentProps<'img'> {
    code: string;
    height?: string | number;
    width?: string | number;
  }

  export default function Flag(props: FlagProps): JSX.Element;
}