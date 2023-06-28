import React from 'react';
import { Link } from '../Link';
import styles from './index.module.scss';

export interface ButtonProps {
  text: string;
  href?: string;
  // external用于判断是否是外部链接
  external?: boolean;
  className?: string;
  type?: string;
  size?: 'medium' | 'big';
  // theme用于指定按钮的主题，这里的brand指的是品牌色，alt指的是辅助色
  theme?: 'brand' | 'alt';
}

export function Button(props: ButtonProps) {
  const {
    theme = 'brand',
    size = 'big',
    href = '/',
    external = false,
    className = ''
  } = props;

  let type: string | typeof Link | null = null;

  if (props.type === 'button') {
    type = 'button';
  } else if (props.type === 'a') {
    type = external ? 'a' : Link;
  }
  return React.createElement(
    type ?? 'a',
    {
      className: `${styles.button} ${styles[theme]} ${styles[size]} ${className}`,
      href
    },
    props.text
  );
}
