import { Layout } from '../theme-default';
import { matchRoutes } from 'react-router-dom';
import { routes } from 'island:routes';
import { Route } from 'node/plugin-routes';
import { PageData } from 'shared/types';
import siteData from 'island:site-data';
export async function initPageData(routePath: string): Promise<PageData> {
  const matched = matchRoutes(routes, routePath);

  if (matched) {
    const route = matched[0].route as Route;
    const moduleInfo = await route.preload();
    return {
      pageType: 'doc',
      siteData,
      frontmatter: moduleInfo.frontmatter,
      pagePath: routePath
    };
  }
  return {
    pageType: '404',
    siteData,
    frontmatter: {},
    pagePath: routePath
  };
}

export function App() {
  return <Layout />;
}
