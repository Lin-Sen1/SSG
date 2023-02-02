import { UserConfig as ViteConfiguration } from 'vite';

export type NavItemWithLink = {
  text: string;
  link: string;
};

// 菜单项下所有的子项
export type SidebarItem = {
  text: string;
  link: string;
};

export interface SidebarGrounp {
  text: string;
  items: SidebarItem[];
}

export interface Sidebar {
  [path: string]: SidebarGrounp[];
}

export interface Footer {
  message: string;
}

export interface ThemeConfig {
  nav: NavItemWithLink[];
  sidebar?: Sidebar;
  footer?: Footer;
}

export interface UserConfig {
  title: string;
  description: string;
  themeConfig: ThemeConfig;
  vite: ViteConfiguration;
}
