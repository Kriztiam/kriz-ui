export interface NavLink {
  linkText: string;
  href: string;
}

export interface NestedLinks {
  linkText: string;
  nestedLinks: NavLink[];
}

export interface IconLink extends NavLink {
  icon?: React.ReactNode;
}
