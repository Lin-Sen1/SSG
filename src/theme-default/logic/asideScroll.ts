let links: HTMLAnchorElement[] = [];
// 导航栏高度
const NAV_HEIGHT = 56;

export function bindingAsideScroll() {
  const aside = document.getElementById('aside-container');
  const marker = document.getElementById('aside-marker');
  // 如果没有侧边栏，直接返回。不执行后续逻辑
  if (!aside) {
    return;
  }
  // 需要提前取出 headers
  // headers = ['#框架定位', '#上手体验', '#优劣势分析', '#源码实现', '#小结'];
  const headers = Array.from(aside?.getElementsByTagName('a') || []).map(
    (item) => {
      // item.hash是获取锚点，decodeURIComponent是解码
      return decodeURIComponent(item.hash);
    }
  );

  const activate = (links: HTMLAnchorElement[], index: number) => {
    if (links[index]) {
      // 这里拿到的是锚点，比如 #框架定位
      const id = links[index].getAttribute('href');
      // 这里判断是否有对应的锚点
      const tocIndex = headers.findIndex((item) => item === id);
      // 这里就是在侧边栏中找到对应的锚点
      const currentLink = aside?.querySelector(`a[href="#${id.slice(1)}"]`);
      if (currentLink) {
        // 设置高亮样式
        // 这里33是因为侧边栏的高度是 56px，而锚点的高度是 20px，所以这里需要减去 33px
        // 28 是因为每个锚点的高度是 28px
        // 1 是因为这里设置的是高亮，所以透明度是 1
        // 侧边栏的高亮样式是通过伪类实现的，所以这里只需要设置伪类的样式即可
        marker.style.top = `${33 + tocIndex * 28}px`;
        marker.style.opacity = '1';
      }
    }
  };

  const setActiveLink = () => {
    // document.querySelectorAll('.island-doc .header-anchor') 是用来获取所有的锚点
    // filter用来过滤掉第一个锚点，因为第一个锚点是标题，不需要高亮
    links = Array.from(
      document.querySelectorAll<HTMLAnchorElement>('.island-doc .header-anchor')
    ).filter((item) => item.parentElement?.tagName !== 'H1');
    // isBottom 是用来判断是否滑动到底部
    const isBottom =
      document.documentElement.scrollTop + window.innerHeight >=
      document.documentElement.scrollHeight;
    // 1. 如果已经滑动到底部，我们将最后一个 link 高亮即可
    if (isBottom) {
      activate(links, links.length - 1);
      return;
    }

    // 2. 遍历 links，寻找对应锚点
    for (let i = 0; i < links.length; i++) {
      // currentAnchor 是当前锚点，nextAnchor 是下一个锚点
      const currentAnchor = links[i];
      const nextAnchor = links[i + 1];
      // scrollTop 是滚动条滚动的距离
      const scrollTop = Math.ceil(window.scrollY);
      // currentAnchorTop 是当前锚点距离顶部的距离，用来判断是否滑动到当前锚点
      const currentAnchorTop =
        currentAnchor.parentElement.offsetTop - NAV_HEIGHT;
      // 高亮最后一个锚点
      if (!nextAnchor) {
        activate(links, i);
        break;
      }
      // 高亮第一个锚点的情况
      if ((i === 0 && scrollTop < currentAnchorTop) || scrollTop == 0) {
        activate(links, 0);
        break;
      }
      // 如果当前 scrollTop 在 i 和 i + 1 个锚点之间，那么高亮第 i 个锚点
      const nextAnchorTop = nextAnchor.parentElement.offsetTop - NAV_HEIGHT;
      if (scrollTop >= currentAnchorTop && scrollTop < nextAnchorTop) {
        activate(links, i);
        break;
      }
    }
  };

  window.addEventListener('scroll', setActiveLink);

  // 返回事件解绑逻辑，供 TOC 组件调用，避免内存泄露
  return () => {
    window.removeEventListener('scroll', setActiveLink);
  };
}
