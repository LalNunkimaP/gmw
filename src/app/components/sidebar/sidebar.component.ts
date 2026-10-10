import { Component, ElementRef, HostListener, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavigationEnd, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { IonIcon } from '@ionic/angular';
import { logOutOutline } from 'ionicons/icons';
import { filter } from 'rxjs';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
  host: {
    '[style.width.px]': 'isCollapsed ? 72 : 250',
    '[class.collapsed]': 'isCollapsed',
  },
  imports: [CommonModule, RouterLink, RouterLinkActive, IonIcon],
})
export class SidebarComponent  implements OnInit {
  isCollapsed = true;
  readonly logoutIcon = logOutOutline;
  private readonly elementRef = inject(ElementRef<HTMLElement>);
  private readonly router = inject(Router);
  private readonly auth = inject(AuthService);

  ngOnInit(): void {
    this.router.events
      .pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd))
      .subscribe(() => this.collapseSidebar());
  }

   toggleSidebar(): void {
    this.isCollapsed = !this.isCollapsed;
  }

  collapseSidebar(): void {
    this.isCollapsed = true;
  }

  async logout(): Promise<void> {
    await this.auth.logout();
    await this.router.navigateByUrl('/login');
  }

  @HostListener('document:click', ['$event'])
  collapseOnOutsideClick(event: MouseEvent): void {
    if (!this.isCollapsed && !this.elementRef.nativeElement.contains(event.target as Node)) {
      this.isCollapsed = true;
    }
  }

}
