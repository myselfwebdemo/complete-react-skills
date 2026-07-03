import type React from 'react';

import styles from './button.module.css';

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  children: React.ReactNode;
  variant?: 'primary' | 'disabled';
};

export const Button = ({
  children,
  variant = 'primary',
  className,
  ...props
}: Props): React.JSX.Element => {
  const classNames = [styles.button, className];
  if (variant === 'disabled') classNames.push(styles.disabled);
  if (props.disabled) classNames.push(styles.disabled);

  return (
    <button {...props} className={classNames.filter(Boolean).join(' ')}>
      {children}
    </button>
  );
};

export default Button;
