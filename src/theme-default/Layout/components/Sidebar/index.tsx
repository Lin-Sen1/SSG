import { SidebarGroup, SidebarItem } from 'shared/types';
import styles from './index.module.scss';
import { Link } from '../Link/index';
interface SidebarProps {
  sidebarData: SidebarGroup[];
  pathname: string;
}

export function Sidebar(props: SidebarProps) {
  const { sidebarData, pathname } = props;

  const renderGroupItem = (item: SidebarItem) => {
    const active = item.link === pathname;
    return (
      <div ml="5">
        <div
          p="1"
          block="~"
          text="sm"
          font-medium="~"
          className={`${active ? 'text-brand' : 'text-text-2'}`}
        >
          <Link href={item.link}>{item.text}</Link>
        </div>
      </div>
    );
  };

  const renderGroup = (item: SidebarGroup) => {
    return (
      // section标签用于表示文档中的一个节，通常会有一个标题
      <section key={item.text} block="~" not-first="divider-top mt-4">
        <div flex="~" justify="between" items="center">
          <h2 m="t-3 b-2" text="1rem text-1" font="bold">
            {item.text}
          </h2>
        </div>
        <div mb="1">
          {item.items?.map((item) => (
            <div key={item.link}>{renderGroupItem(item)}</div>
          ))}
        </div>
      </section>
    );
  };

  return (
    // aside标签是一个侧边栏，通常包含导航、侧边栏、广告、文档等内容
    // nav标签是一个导航，通常包含一组链接，允许用户通过点击链接导航到其他页面或当前页面的其他部分
    <aside className={styles.sidebar}>
      <nav>{sidebarData.map(renderGroup)}</nav>
    </aside>
  );
}
