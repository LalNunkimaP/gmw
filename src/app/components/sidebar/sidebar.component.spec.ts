import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { SidebarComponent } from './sidebar.component';

describe('SidebarComponent', () => {
  let component: SidebarComponent;
  let fixture: ComponentFixture<SidebarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(SidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('shows only the hamburger while collapsed and toggles the navigation', () => {
    const toggleButton = fixture.nativeElement.querySelector('.toggle-btn');
    const navigation = fixture.nativeElement.querySelector('.sidebar-nav');

    expect(fixture.nativeElement.style.width).toBe('72px');
    expect(navigation.hidden).toBe(true);
    expect(toggleButton.textContent.trim()).toBe('☰');

    toggleButton.click();
    fixture.detectChanges();

    expect(fixture.nativeElement.style.width).toBe('250px');
    expect(navigation.hidden).toBe(false);
    expect(fixture.nativeElement.querySelector('.brand').hidden).toBe(false);

    document.documentElement.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    fixture.detectChanges();

    expect(fixture.nativeElement.style.width).toBe('72px');
    expect(navigation.hidden).toBe(true);
  });

  it('collapses when a sidebar link is clicked', () => {
    component.isCollapsed = false;
    fixture.detectChanges();

    fixture.nativeElement.querySelector('.sidebar-nav a').click();
    fixture.detectChanges();

    expect(component.isCollapsed).toBe(true);
    expect(fixture.nativeElement.querySelector('.sidebar-nav').hidden).toBe(true);
  });
});
