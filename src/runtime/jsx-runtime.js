import * as jsxRuntime from 'react/jsx-runtime';

// 重写 jsx-runtime
// jsxRuntime.jsx 是不能直接修改的，所以需要将其赋值给一个变量

// 拿到 React 原始的 jsxRuntime 方法，包括 jsx 和 jsxs
// 注: 对于一些静态节点，React 会使用 jsxs 来进行创建，优化渲染性能
export const data = {
  // 记录 Islands 组件的数据
  islandProps: [],
  // 记录 Island 组件的路径信息
  islandToPathMap: {}
};

const originJsx = jsxRuntime.jsx;
const originJsxs = jsxRuntime.jsxs;
const internalJsx = (jsx, type, props, ...args) => {
  if (props && props.__island) {
    // 如果 props 中有 __island 属性，说明是 Island 组件
    // 将其记录到 data 中
    data.islandProps.push(props || {});
    const id = type.name;
    // 记录 Island 组件的路径信息
    data.islandToPathMap[id] = props.__island;
    // 将 __island 属性删除，防止传递给 Island 组件
    delete props.__island;
    return jsx('div', {
      __island: `${id}:${data.islandProps.length - 1}`,
      children: jsx(type, props, ...args)
    });
  }
  return jsx(type, props, ...args);
};

export const jsx = (...args) => internalJsx(originJsx, ...args);

export const jsxs = (...args) => internalJsx(originJsxs, ...args);

export const Fragment = jsxRuntime.Fragment;

export const clearIslandData = () => {
  data.islandProps = [];
  data.islandToPathMap = {};
};
