import { Layout } from '../theme-default';
import { matchRoutes } from 'react-router-dom';
import { routes } from 'island:routes';
import { Route } from 'node/plugin-routes';

export async function initPageData(routePath: string) {
  const matched = matchRoutes(routes, routePath);

  if (matched) {
    const route = matched[0].route as Route;
    const moduleInfo = await route.preload();
    console.log(moduleInfo);
  }
}

export function App() {
  return <Layout />;
}
