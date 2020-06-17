import { Component } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  constructor(private router: Router) {
    /* eslint-disable @typescript-eslint/no-explicit-any */
    router.events.subscribe((event: unknown) => {
      if (event instanceof NavigationEnd) {
        (window as any).ga('set', 'page', event.urlAfterRedirects);
        (window as any).ga('send', 'pageview');
      }
    });
    /* eslint-enable @typescript-eslint/no-explicit-any */
  }

  ngOnInit(): void {}
}
