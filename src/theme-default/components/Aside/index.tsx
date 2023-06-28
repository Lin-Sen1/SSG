import { Header } from 'shared/types';
import { useEffect, useRef } from 'react';
import { bindingAsideScroll, scrollToTarget } from '../../logic/asideScroll';
import { useHeaders } from '../../logic/useHeaders';

interface AsideProps {
  headers: Header[];
}

export function Aside(props: AsideProps) {
  const { headers: rawHeaders = [] } = props;
  const headers = useHeaders(rawHeaders);
  console.log(headers);
  // 是否展示大纲栏
  const hasOutline = headers.length > 0;
  // 当前标题会进行高亮处理，我们会在这个标题前面加一个 marker 元素
  const markerRef = useRef<HTMLDivElement>(null);

  const renderHeader = (header: Header) => {
    return (
      <li key={header.id}>
        <a
          href={`#${header.id}`}
          className="block leading-7 text-text-2 hover:text-text-1"
          transition="color duration-300"
          onClick={(e) => {
            e.preventDefault();
            const target = document.getElementById(header.id);
            // 因为点击跳转至对应锚点的时候，顶部导航栏会遮住我们的锚点，导致看不到标题。
            // scrollToTarget() 就是用来给这个标题添加一个偏移量，让标题能够在顶部导航栏下面
            target && scrollToTarget(target, false);
          }}
          // 这里的padding-left是为了让标题有缩进效果
          style={{
            paddingLeft: (header.depth - 2) * 12
          }}
        >
          {header.text}
        </a>
      </li>
    );
  };

  // 组件内逻辑
  useEffect(() => {
    // !这里不直接使用bindingAsideScroll()，是因为如果这样做的话，每次组件更新都会重新绑定事件并且在组件卸载的时候重新解绑
    // !这样做会导致事件绑定的次数越来越多，最终导致页面卡顿
    const unbinding = bindingAsideScroll();
    return () => {
      unbinding();
    };
  }, []);

  return (
    <div
      flex="~ col 1"
      style={{
        width: 'var(--island-aside-width)'
      }}
    >
      <div>
        {hasOutline && (
          <div
            id="aside-container"
            className="relative divider-left pl-4 text-13px font-medium"
          >
            <div
              ref={markerRef}
              id="aside-marker"
              className="absolute top-33px opacity-0 w-1px h-18px bg-brand"
              style={{
                left: '-1px',
                transition:
                  'top 0.5s cubic-bezier(0, 1, 0.5, 1), background-color 0.5s, opacity 0.25s'
              }}
            ></div>
            <div leading-7="~" text="13px" font="semibold">
              On this page
            </div>
            <nav>
              <ul relative="~">{headers.map(renderHeader)}</ul>
            </nav>
          </div>
        )}
      </div>
    </div>
  );
}
