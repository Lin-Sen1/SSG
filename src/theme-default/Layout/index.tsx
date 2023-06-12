import { Content } from '@runtime';
import siteData from 'island:site-data';
import 'uno.css';

export function Layout() {
  return (
    <div>
      <h1 p="2" m="6">
        {siteData.title}
      </h1>
      <h2>{siteData.description}</h2>
      <Content />
    </div>
  );
}
