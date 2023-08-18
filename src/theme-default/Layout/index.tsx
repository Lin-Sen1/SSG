import 'uno.css';
import '../style/vars.css';
import '../style/base.css';
import '../style/doc.css';
import { usePageData } from '@runtime';
import { Nav } from '../components/Nav';
import { HomeLayout } from './HomeLayout';
import { DocLayout } from './DocLayout';
import { Helmet } from 'react-helmet-async';
import { NotFoundLayout } from './NotFoundLayout';

export function Layout() {
  const pageData = usePageData();
  const { pageType, title } = pageData;
  const getContent = () => {
    if (pageType === 'home') {
      return <HomeLayout />;
    } else if (pageType === 'doc') {
      return <DocLayout />;
    } else {
      return <NotFoundLayout />;
    }
  };

  return (
    // section标签是HTML5中的新标签，它的作用是对网页中的内容进行分块，使网页结构更加清晰。
    <div>
      <Helmet>
        <title>{title}</title>
      </Helmet>
      <Nav />
      <section style={{ paddingTop: 'var(--island-nav-height)' }}>
        {getContent()}
      </section>
    </div>
  );
}
