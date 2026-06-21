import type React from 'react';

import styles from './input.module.css';

type Props = React.InputHTMLAttributes<HTMLInputElement> & {
  suffix?: React.ReactNode;
  wrapperClassName?: string;
};

export const Input = ({
  suffix,
  wrapperClassName,
  className,
  ...props
}: Props): React.JSX.Element => {
  return (
    <div className={[styles.wrapper, wrapperClassName].filter(Boolean).join(' ')}>
      <input
        className={[styles.input, className].filter(Boolean).join(' ')}
        {...props}
      />
      {suffix ? <div className={styles.suffix}>{suffix}</div> : null}
    </div>
  );
};

export default Input;
