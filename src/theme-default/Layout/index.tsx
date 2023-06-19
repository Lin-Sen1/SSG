import 'uno.css';
import '../style/vars.css';
import '../style/base.css';
import { usePageData } from '@runtime';
import { Nav } from './components/Nav';
import { HomeLayout } from './HomeLayout';

export function Layout() {
  const pageData = usePageData();
  const { pageType } = pageData;
  console.log(pageData);
  const getContent = () => {
    if (pageType === 'home') {
      return <HomeLayout />;
    } else if (pageType === 'doc') {
      return <div>doc</div>;
    } else {
      return <div>404</div>;
    }
  };

  return (
    <div>
      <Nav />
      <div>{getContent()}</div>
    </div>
  );
}
