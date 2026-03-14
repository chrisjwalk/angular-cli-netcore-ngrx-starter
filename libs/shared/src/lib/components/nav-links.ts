export interface NavLink {
  routerLink: string;
  icon: string;
  hint: string;
  label: string;
}

export const NAV_LINKS: NavLink[] = [
  {
    routerLink: '/weather-forecast',
    icon: 'get_app',
    hint: 'Get Data Feature',
    label: 'Weather Forecasts',
  },
  {
    routerLink: '/feature',
    icon: 'hotel',
    hint: 'Lazy Loaded Feature',
    label: 'Counter',
  },
];
