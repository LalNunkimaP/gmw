import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import {
  IonContent,
  IonInfiniteScroll,
  IonInfiniteScrollContent,
  IonRefresher,
  IonRefresherContent,
} from '@ionic/angular';
import { NewsTag } from '../news/news.models';

type DashboardActivity =
  | { id: string; kind: 'member'; date: string; dateLabel: string; name: string; chapter: string }
  | {
      id: string;
      kind: 'news';
      date: string;
      dateLabel: string;
      tag: NewsTag;
      title: string;
      summary: string;
      imageSrc?: string;
      imageAlt?: string;
    };

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  imports: [RouterLink, IonContent, IonInfiniteScroll, IonInfiniteScrollContent, IonRefresher, IonRefresherContent],
})
export class HomePage {
  readonly metrics = [
    { label: 'Community members', value: '1,284', note: 'Across Goa and Mizoram' },
    { label: 'Upcoming events', value: '03', note: 'Over the next 30 days' },
    { label: 'News updates', value: '08', note: 'Published this month' },
  ];

  readonly activity = ([
    {
      id: 'welcome-1',
      kind: 'member',
      date: '2026-10-10T10:15:00Z',
      dateLabel: '10 Oct 2026',
      name: 'Zoramthara',
      chapter: 'Panaji',
    },
    {
      id: 'news-1',
      kind: 'news',
      date: '2026-10-10T08:30:00Z',
      dateLabel: '10 Oct 2026',
      tag: 'Khawtlang',
      title: 'Thawhhlawmte chuan thlasik atan inbuatsaihna an nei',
      summary: 'Chapter hotute chuan thil mamawh an khawn a, hmun hrang hranga tlawh tur hun an ruat mek.',
      imageSrc: '/assets/images/community-volunteers.jpg',
      imageAlt: 'Khawtlang thawhhonaah thawhhlawm pakhat',
    },
    {
      id: 'welcome-2',
      kind: 'member',
      date: '2026-10-09T16:00:00Z',
      dateLabel: '09 Oct 2026',
      name: 'Lalmuanpuii',
      chapter: 'Margao',
    },
    {
      id: 'welcome-3',
      kind: 'member',
      date: '2026-10-07T15:30:00Z',
      dateLabel: '07 Oct 2026',
      name: 'Lalhmingliana',
      chapter: 'Vasco da Gama',
    },
    {
      id: 'news-3',
      kind: 'news',
      date: '2026-10-06T09:00:00Z',
      dateLabel: '06 Oct 2026',
      tag: 'Khawtlang',
      title: 'Kan chapter-te inkungkaihna siamtu thawhhlawmte',
      summary: 'Khawtlang mite tanpuihna leh inkungkaihna tha siamtu thawhhlawmte chungchang.',
    },
    {
      id: 'welcome-4',
      kind: 'member',
      date: '2026-10-05T13:30:00Z',
      dateLabel: '05 Oct 2026',
      name: 'Hmingchhungi',
      chapter: 'Mapusa',
    },
    {
      id: 'news-4',
      kind: 'news',
      date: '2026-10-04T10:30:00Z',
      dateLabel: '04 Oct 2026',
      tag: 'Thu Lawmawm',
      title: 'Ei ruai pakhatah thawnthu tam tak',
      summary: 'Member-te chu ei leh in, hla leh pianthar zelin an neih tawh thawnthu sawi turin an lo kal khawm.',
      imageSrc: '/assets/images/community-gathering.jpg',
      imageAlt: 'Khawtlang inkhawm atana ei ruai buatsaih',
    },
    {
      id: 'welcome-5',
      kind: 'member',
      date: '2026-10-03T12:00:00Z',
      dateLabel: '03 Oct 2026',
      name: 'Ruatfela',
      chapter: 'Ponda',
    },
    {
      id: 'news-5',
      kind: 'news',
      date: '2026-10-02T09:30:00Z',
      dateLabel: '02 Oct 2026',
      tag: 'Hriattirna',
      title: 'October thla chapter-te ruahmanna',
      summary: 'Member-te an inhmuh, thawhhlawmna leh tel ve theihna tur kawng thar chapter-te chuan an ruahman.',
    },
    {
      id: 'welcome-6',
      kind: 'member',
      date: '2026-10-01T14:00:00Z',
      dateLabel: '01 Oct 2026',
      name: 'Lalrinpuii',
      chapter: 'Panaji',
    },
    {
      id: 'welcome-7',
      kind: 'member',
      date: '2026-09-29T16:00:00Z',
      dateLabel: '29 Sep 2026',
      name: 'Vanlalruata',
      chapter: 'Margao',
    },
    {
      id: 'news-7',
      kind: 'news',
      date: '2026-09-28T10:00:00Z',
      dateLabel: '28 Sep 2026',
      tag: 'Khawtlang',
      title: 'September thla chhungkaw tlawhna an zo',
      summary: 'Chapter thawhhlawmte chuan chhungkaw hrang hrang an tlawh a, hmun lama tanpuina theih dan an hrilh.',
    },
    {
      id: 'welcome-8',
      kind: 'member',
      date: '2026-09-27T11:00:00Z',
      dateLabel: '27 Sep 2026',
      name: 'Zothanpari',
      chapter: 'Vasco da Gama',
    },
    {
      id: 'news-8',
      kind: 'news',
      date: '2026-09-26T09:30:00Z',
      dateLabel: '26 Sep 2026',
      tag: 'Thu Lawmawm',
      title: 'Autumn gathering hun hriattirna',
      summary: 'Member-te leh rualte chu thawnthu, hla leh ei ruai theihna zanriah kawngah sawm an ni.',
    },
  ] satisfies DashboardActivity[]).sort((first, second) => Date.parse(second.date) - Date.parse(first.date));

  visibleActivityCount = 6;

  get visibleActivity() {
    return this.activity.slice(0, this.visibleActivityCount);
  }

  loadMoreActivity(event: Event): void {
    this.visibleActivityCount = Math.min(this.visibleActivityCount + 6, this.activity.length);
    this.completeScroll(event);
  }

  refreshActivity(event: Event): void {
    this.visibleActivityCount = 6;
    this.completeScroll(event);
  }

  private completeScroll(event: Event): void {
    void (event.target as EventTarget & { complete: () => Promise<void> }).complete();
  }
}
