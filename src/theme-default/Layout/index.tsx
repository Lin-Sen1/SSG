import siteData from 'island:site-data';
import 'uno.css';
import { usePageData } from '@runtime';

export function Layout() {
  const pageData = usePageData();
  const { pageType } = pageData;

  const getContent = () => {
    if (pageType === 'home') {
      return <div>home</div>;
    } else if (pageType === 'doc') {
      return <div>doc</div>;
    } else {
      return <div>404</div>;
    }
  };

  return (
    <div>
      <h1 p="2" m="6">
        {siteData.title}
      </h1>
      <h2>{siteData.description}</h2>
      <div>{getContent()}</div>
    </div>
  );
}
