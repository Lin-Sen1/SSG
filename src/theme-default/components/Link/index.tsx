import styles from './index.module.scss';

export interface LinkProps {
  href?: string;
  children?: React.ReactNode;
  className?: string;
}

const EXTERNAL_URL_RE = /^https?/;

export function Link(props: LinkProps) {
  const { href = '/', children, className = '' } = props;
  // isExternal用于判断是否是外部链接
  const isExternal = EXTERNAL_URL_RE.test(href);
  // target用于指定在何处打开链接
  const target = isExternal ? '_blank' : '';
  // rel用于指定链接与页面之间的关系
  // noopener用于防止外部页面通过window.opener访问当前页面
  // noreferrer用于防止外部页面通过Referrer HTTP头访问当前页面
  const rel = isExternal ? 'noopener noreferrer' : undefined;

  return (
    <a
      href={href}
      target={target}
      rel={rel}
      className={`${styles.link} ${className}`}
    >
      {children}
    </a>
  );
}
