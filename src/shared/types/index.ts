import { ComponentType } from 'react';
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

// 菜单项
export interface SidebarGrounp {
  text?: string;
  items: SidebarItem[];
}

export interface Sidebar {
  [path: string]: SidebarGrounp[];
}

export interface Footer {
  message?: string;
}

export interface ThemeConfig {
  nav?: NavItemWithLink[];
  sidebar?: Sidebar;
  footer?: Footer;
}

export interface UserConfig {
  title?: string;
  description?: string;
  themeConfig?: ThemeConfig;
  vite?: ViteConfiguration;
}

export interface SiteConfig {
  root: string;
  configPath: string;
  // 站点数据
  siteData: UserConfig;
}

export type PageType = 'home' | 'doc' | 'custom' | '404';

export interface Header {
  id: string;
  text: string;
  depth: number;
}

export interface FrontMatter {
  title?: string;
  description?: string;
  pageType?: PageType;
  sideber?: boolean;
  outline?: boolean;
}

export interface PageData {
  siteData: UserConfig;
  pagePath: string;
  frontmatter: FrontMatter;
  pageType: PageType;
  toc: Header[];
}

export interface PageModule {
  default: ComponentType;
  frontmatter: FrontMatter;
  [key: string]: unknown;
}
