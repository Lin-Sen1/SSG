import { useState, useEffect } from 'react';
import { Header } from '../../shared/types/index';

export function useHeaders(initHeaders: Header[]) {
  const [headers, setHeaders] = useState(initHeaders);

  useEffect(() => {
    if (import.meta.env.DEV) {
      import.meta.hot.on(
        'mdx-changed',
        ({ fillpath }: { fillpath: string }) => {
          // @vite-ignore是因为vite不支持动态import
          // ?import是因为vite不支持import.meta.glob,不加的话会发生什么？
          // todo: 这里不懂 ，先照着用吧
          import(/* @vite-ignore */ `${fillpath}?import&t=${Date.now()}`).then(
            (module) => {
              setHeaders(module.toc);
            }
          );
        }
      );
    }
  });
  return headers;
}
