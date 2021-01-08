export const Target = {
  DESKTOP: 'DESKTOP',
  MOBILE: 'MOBILE',
};

const TargetBoth = [Target.DESKTOP, Target.MOBILE];

export const urlsToCheck = [
  {
    link: '',
    target: TargetBoth,
  },
  {
    link: '/catalog/odezhda',
    target: TargetBoth,
  },
  {
    link: '/catalog/platya',
    target: TargetBoth,
  },
  {
    link: '/catalog/novinki',
    target: TargetBoth,
  },
  {
    link: '/purchase',
    target: TargetBoth,
  },
  {
    link: '/favorites',
    target: [Target.DESKTOP],
  },
  {
    link: '/outlet-catalog',
    target: TargetBoth,
  },
  {
    link: '/catalog/verhnyaya-odezhda',
    target: TargetBoth,
  },
  {
    link: '/catalog/naryadnaya-odezhda-new1579179126',
    target: TargetBoth,
  },
  {
    link: '/product/bluza-22024',
    target: TargetBoth,
  },
  {
    link: '/product/boks-37634',
    target: TargetBoth,
  },
  {
    link: '/product/plate-37638',
    target: TargetBoth,
  },
];
