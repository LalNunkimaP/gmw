import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { NEWS_TAGS } from '../news/news.models';

import { HomePage } from './home.page';

describe('HomePage', () => {
  let component: HomePage;
  let fixture: ComponentFixture<HomePage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(HomePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('shows newest activity without a pinned welcome banner or upcoming events panel', () => {
    const text = fixture.nativeElement.textContent;

    expect(text).toContain('Zoramthara, Goa Mizo Welfare ah kan lo lawm a che.');
    expect(text).not.toContain('Welcome to the community');
    expect(text).not.toContain('LATEST FIRST');
    expect(text).not.toContain('Community activity');
    expect(text).not.toContain('All news');
    expect(fixture.nativeElement.querySelector('.events-section')).toBeNull();
    expect(text).not.toContain('Local chapters');
    expect(fixture.nativeElement.querySelectorAll('.metric-grid .metric').length).toBe(3);
    expect(text.indexOf('Zoramthara, Goa Mizo Welfare')).toBeLessThan(
      text.indexOf('Thawhhlawmte chuan thlasik atan inbuatsaihna an nei'),
    );
  });

  it('shows the automatic welcome without extra member details', () => {
    const rows = fixture.nativeElement.querySelectorAll('.activity-row') as NodeListOf<HTMLElement>;
    const welcome = Array.from(rows).find((row) => row.textContent?.includes('Zoramthara, Goa Mizo Welfare'));

    expect(welcome?.querySelector('h3')?.textContent?.trim()).toBe(
      'Zoramthara, Goa Mizo Welfare ah kan lo lawm a che.',
    );
    expect(welcome?.querySelector('p')).toBeNull();
  });

  it('uses the supported Mizo news tags and has no announcement posts', () => {
    const labels = Array.from(
      fixture.nativeElement.querySelectorAll('.activity-meta span'),
      (label: HTMLElement) => label.textContent?.trim(),
    );
    expect(NEWS_TAGS).toEqual(['Khawtlang', 'Hriattirna', 'Ngenna', 'Chhiatna', 'Thu Lawmawm']);
    expect(labels).toContain('Khawtlang');
    expect(fixture.nativeElement.textContent).not.toContain('THUCHHUAH');
    expect(fixture.nativeElement.textContent).not.toContain('October thla khawtlang chanchin bu');
    expect(fixture.nativeElement.textContent).not.toContain('Announcement');
  });
});
