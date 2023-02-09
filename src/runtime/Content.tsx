import { useRoutes } from 'react-router-dom';

import { routes } from 'island:routes';

console.log('routes = ', routes);

export const Content = () => {
  const rootElement = useRoutes(routes);
  return rootElement;
};
