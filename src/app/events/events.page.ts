import { ChangeDetectorRef, Component, ElementRef, OnDestroy, ViewChild, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {
  IonContent,
  IonInfiniteScroll,
  IonInfiniteScrollContent,
  IonRefresher,
  IonRefresherContent,
} from '@ionic/angular';
import { Subscription } from 'rxjs';
import { GalleryImage, ImageGalleryComponent } from '../components/image-gallery/image-gallery.component';

interface CommunityEvent {
  id?: string;
  sortDate: string;
  day: string;
  month: string;
  weekday: string;
  title: string;
  time: string;
  location: string;
  type: string;
  images?: GalleryImage[];
}

@Component({
  selector: 'app-events',
  templateUrl: './events.page.html',
  styleUrls: ['./events.page.scss'],
  imports: [IonContent, IonInfiniteScroll, IonInfiniteScrollContent, IonRefresher, IonRefresherContent, ImageGalleryComponent],
})
export class EventsPage implements OnDestroy {
  @ViewChild(IonContent) private content?: IonContent;
  @ViewChild(IonContent, { read: ElementRef }) private contentElement?: ElementRef<HTMLElement>;
  private readonly route = inject(ActivatedRoute);
  private readonly changeDetector = inject(ChangeDetectorRef);
  private fragmentSubscription?: Subscription;

  readonly events: CommunityEvent[] = [
    {
      id: 'event-1',
      sortDate: '2026-10-18',
      day: '18',
      month: 'OCT',
      weekday: 'Pathianni',
      title: 'Community breakfast',
      time: '9:00 AM – 11:30 AM',
      location: 'Khawtlang In, Panaji',
      type: 'Inkhawm',
      images: [
        { src: '/assets/images/community-meal.jpg', alt: 'Ei ruai kilkhawmna tur pindan buatsaih' },
        { src: '/assets/images/community-gathering.jpg', alt: 'Khawtlang inkhawm atana ei ruai buatsaih' },
      ],
    },
    {
      id: 'event-2',
      sortDate: '2026-10-25',
      day: '25',
      month: 'OCT',
      weekday: 'Pathianni',
      title: 'Youth and culture afternoon',
      time: '2:00 PM – 5:00 PM',
      location: 'Margao Arts Centre',
      type: 'Hnam nunna',
      images: [
        { src: '/assets/images/community-gathering.jpg', alt: 'Khawtlang inkhawm atana ei ruai buatsaih' },
        { src: '/assets/images/community-volunteers.jpg', alt: 'Khawtlang thawhhonaah thawhhlawm pakhat' },
      ],
    },
    {
      id: 'event-3',
      sortDate: '2026-11-02',
      day: '02',
      month: 'NOV',
      weekday: 'Thawhtanni',
      title: 'Chapter coordinators meeting',
      time: '6:30 PM – 7:30 PM',
      location: 'Online meeting',
      type: 'Inkhawm',
    },
    {
      sortDate: '2026-11-14',
      day: '14',
      month: 'NOV',
      weekday: 'Inrinni',
      title: 'Family sports day',
      time: '8:00 AM – 1:00 PM',
      location: 'Campal Sports Ground, Panaji',
      type: 'Khawtlang',
    },
    {
      sortDate: '2026-11-21', day: '21', month: 'NOV', weekday: 'Inrinni',
      title: 'Neighborhood volunteer morning', time: '9:00 AM – 12:00 PM',
      location: 'Khawtlang In, Panaji', type: 'Thawhhlawmna',
    },
    {
      sortDate: '2026-11-28', day: '28', month: 'NOV', weekday: 'Inrinni',
      title: 'Stories from home', time: '4:00 PM – 6:00 PM',
      location: 'Margao Arts Centre', type: 'Hnam nunna',
    },
    {
      sortDate: '2026-12-06', day: '06', month: 'DEC', weekday: 'Pathianni',
      title: 'Family community lunch', time: '12:00 PM – 3:00 PM',
      location: 'Khawtlang In, Mapusa', type: 'Inkhawm',
      images: [
        { src: '/assets/images/community-gathering.jpg', alt: 'Khawtlang inkhawm atana ei ruai buatsaih' },
        { src: '/assets/images/community-meal.jpg', alt: 'Ei ruai kilkhawmna tur pindan buatsaih' },
      ],
    },
    {
      sortDate: '2026-12-12', day: '12', month: 'DEC', weekday: 'Inrinni',
      title: 'Winter essentials collection', time: '10:00 AM – 1:00 PM',
      location: 'Vasco da Gama Chapter', type: 'Thawhhlawmna',
    },
    {
      sortDate: '2026-12-20', day: '20', month: 'DEC', weekday: 'Pathianni',
      title: 'Year-end community celebration', time: '5:00 PM – 8:00 PM',
      location: 'Campal Sports Ground, Panaji', type: 'Khawtlang',
    },
    {
      sortDate: '2027-01-09', day: '09', month: 'JAN', weekday: 'Inrinni',
      title: 'New year chapter brunch', time: '10:00 AM – 12:00 PM',
      location: 'Khawtlang In, Ponda', type: 'Inkhawm',
    },
    {
      sortDate: '2027-01-16', day: '16', month: 'JAN', weekday: 'Inrinni',
      title: 'Friendly five-a-side football', time: '8:00 AM – 11:00 AM',
      location: 'Campal Sports Ground, Panaji', type: 'Khawtlang',
    },
    {
      sortDate: '2027-01-24', day: '24', month: 'JAN', weekday: 'Pathianni',
      title: 'Youth mentoring circle', time: '3:00 PM – 5:00 PM',
      location: 'Margao Arts Centre', type: 'Rangthar',
    },
    {
      sortDate: '2027-01-31', day: '31', month: 'JAN', weekday: 'Pathianni',
      title: 'Chapter plans for the year ahead', time: '11:00 AM – 1:00 PM',
      location: 'Online inkhawm', type: 'Inkhawm',
    },
  ].sort((first, second) => Date.parse(first.sortDate) - Date.parse(second.sortDate));

  visibleEventCount = 6;

  get visibleEvents() {
    return this.events.slice(0, this.visibleEventCount);
  }

  ionViewDidEnter(): void {
    this.fragmentSubscription?.unsubscribe();
    this.fragmentSubscription = this.route.fragment.subscribe((fragment) => this.navigateToEvent(fragment));
    this.navigateToEvent(this.route.snapshot.fragment);
  }

  ngOnDestroy(): void {
    this.fragmentSubscription?.unsubscribe();
  }

  loadMoreEvents(event: Event): void {
    this.visibleEventCount = Math.min(this.visibleEventCount + 6, this.events.length);
    this.completeScroll(event);
  }

  refreshEvents(event: Event): void {
    this.visibleEventCount = 6;
    this.completeScroll(event);
  }

  private completeScroll(event: Event): void {
    void (event.target as EventTarget & { complete: () => Promise<void> }).complete();
  }

  private navigateToEvent(fragment: string | null): void {
    if (!fragment) return;

    const eventIndex = this.events.findIndex((event) => event.id === fragment);
    if (eventIndex < 0) return;

    this.visibleEventCount = Math.max(this.visibleEventCount, eventIndex + 1);
    this.changeDetector.detectChanges();
    requestAnimationFrame(() => requestAnimationFrame(() => void this.scrollToEvent(fragment)));
  }

  private async scrollToEvent(id: string): Promise<void> {
    if (!this.content) return;

    const scrollElement = await this.content.getScrollElement();
    const event = this.contentElement?.nativeElement.querySelector<HTMLElement>(`#${id}`);
    if (!event) return;
    const top = event.getBoundingClientRect().top - scrollElement.getBoundingClientRect().top + scrollElement.scrollTop;
    await this.content.scrollToPoint(0, Math.max(0, top - 12), 350);
  }
}