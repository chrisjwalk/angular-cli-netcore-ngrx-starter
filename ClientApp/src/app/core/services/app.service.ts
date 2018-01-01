import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable()
export class AppService {

  constructor( @Inject(PLATFORM_ID) private platformId) { }

  getMdSidenavContent(): Element {
    let mdSidenavContent: Element = null;
    if (isPlatformBrowser(this.platformId)) {
      const appSidenavContainer: HTMLElement = document.getElementById('appSidenavContainer');
      if (appSidenavContainer) {
        const sideNavContent = appSidenavContainer.getElementsByClassName('mat-drawer-content');
        if (sideNavContent.length) {
          mdSidenavContent = sideNavContent[0];
        }
      }
    }

    return mdSidenavContent;
  }

  scrollToTop(animate: boolean = false) {
    if (isPlatformBrowser(this.platformId)) {
      window.scrollTo(0, 0);
      const mdSidenavContent = this.getMdSidenavContent();
      if (mdSidenavContent) {
        if (animate) {
          // t: current time, b: begInnIng value, c: change In value, d: duration
          const easeOutExpo = (x, t, b, c, d) => {
            return (t === d) ? b + c : c * (-Math.pow(2, -10 * t / d) + 1) + b;
          };
          const start = Date.now();
          const duration = 1000;
          const ease = (x) => {
            const t = (Date.now() - start) / 10;
            const b = mdSidenavContent.scrollTop;
            const c = -b;
            const d = duration;
            return Math.floor(easeOutExpo(x, t, b, c, d));
          };
          const loop = () => {
            if (mdSidenavContent.scrollTop > 0) {
              mdSidenavContent.scrollTop = ease(mdSidenavContent.scrollTop); setTimeout(() => {
                loop();
              }, 0);
            }
          };
          loop();
        } else {
          mdSidenavContent.scrollTop = 0;
        }
      }
    }
  }
}
