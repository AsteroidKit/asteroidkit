export const isAndroid = (): boolean =>
  typeof navigator !== 'undefined' && /android/i.test(navigator.userAgent);

export const isSmallIOS = (): boolean =>
  typeof navigator !== 'undefined' && /iPhone|iPod/.test(navigator.userAgent);

export const isLargeIOS = (): boolean =>
  typeof navigator !== 'undefined' && /iPad/.test(navigator.userAgent);

export const isIOS = (): boolean => isSmallIOS() || isLargeIOS();

export const isMobile = (): boolean => isAndroid() || isSmallIOS();
