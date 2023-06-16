const APPEARANCE_KEY = 'appearance';

// 是一个用于操作文档根元素（即 <html> 元素）的 DOMTokenList 对象。它可以让你方便地添加、删除和切换类名。
const classList = document.documentElement.classList;

const setClassList = (isDark = false) => {
  if (isDark) {
    classList.add('dark');
  } else {
    classList.remove('dark');
  }
};

const updateAppearance = () => {
  const userPreference = localStorage.getItem(APPEARANCE_KEY);
  setClassList(userPreference === 'dark');
};

// 这里会执行是因为模块中的代码在加载和执行时会被立即执行，而不需要等到特定的函数调用时才执行。
// 这个if语句是为了防止在服务器端渲染时报错。
// 服务器端渲染时，window对象是不存在的，因此会报错。
// 服务器端渲染时，localStorage对象是不存在的，因此会报错。
if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
  updateAppearance();
  // 当本地存储更改时，将触发 storage 事件。
  window.addEventListener('storage', updateAppearance);
}

export function toggle() {
  // contains() 方法返回一个布尔值，表示某个元素是否包含给定的类名。
  if (classList.contains('dark')) {
    // 点击的时候如果存在，说明目前是暗黑模式，点击后切换为浅色模式
    setClassList(false);
    // 本地状态存储为浅色模式
    localStorage.setItem(APPEARANCE_KEY, 'light');
  } else {
    setClassList(true);
    // 本地状态存储为暗黑模式
    localStorage.setItem(APPEARANCE_KEY, 'dark');
  }
}
