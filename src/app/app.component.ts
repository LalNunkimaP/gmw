import { Component, OnInit, inject, signal } from '@angular/core';
import {
  IonApp,
  IonHeader,
  IonRouterOutlet,
  IonTitle,
  IonToolbar,
} from '@ionic/angular';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { AuthService } from './auth/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  imports: [IonApp, IonHeader, IonToolbar, IonTitle, IonRouterOutlet, SidebarComponent],
})
export class AppComponent implements OnInit {
  readonly pageHeader = signal({ eyebrow: '', title: '' });
  readonly isLoginRoute = signal(false);
  private readonly router = inject(Router);
  private readonly auth = inject(AuthService);

  ngOnInit(): void {
    void this.auth.initialize();
    this.updatePageHeader();
    this.router.events
      .pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd))
      .subscribe(() => this.updatePageHeader());
  }

  private updatePageHeader(): void {
    this.isLoginRoute.set(this.router.url.startsWith('/login'));
    let activeRoute = this.router.routerState.snapshot.root;
    while (activeRoute.firstChild) {
      activeRoute = activeRoute.firstChild;
    }

    this.pageHeader.set({
      eyebrow: activeRoute.data['eyebrow'] ?? '',
      title: activeRoute.data['pageTitle'] ?? '',
    });
  }
}
