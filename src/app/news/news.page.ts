import { ChangeDetectorRef, Component, ElementRef, OnDestroy, ViewChild, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ImageGalleryComponent, GalleryImage } from '../components/image-gallery/image-gallery.component';
import {
  IonContent,
  IonInfiniteScroll,
  IonInfiniteScrollContent,
  IonRefresher,
  IonRefresherContent,
} from '@ionic/angular';
import { Subscription } from 'rxjs';
import { NewsTag } from './news.models';

interface NewsArticle {
  id?: string;
  tag: NewsTag;
  date: string;
  dateLabel: string;
  title: string;
  summary: string;
  images?: GalleryImage[];
}

@Component({
  selector: 'app-news',
  templateUrl: './news.page.html',
  styleUrls: ['./news.page.scss'],
  imports: [IonContent, IonInfiniteScroll, IonInfiniteScrollContent, IonRefresher, IonRefresherContent, ImageGalleryComponent],
})
export class NewsPage implements OnDestroy {
  @ViewChild(IonContent) private content?: IonContent;
  @ViewChild(IonContent, { read: ElementRef }) private contentElement?: ElementRef<HTMLElement>;
  private readonly route = inject(ActivatedRoute);
  private readonly changeDetector = inject(ChangeDetectorRef);
  private fragmentSubscription?: Subscription;

  readonly articles = ([
    {
      id: 'news-1',
      tag: 'Khawtlang',
      date: '2026-10-10',
      dateLabel: '10 Oct 2026',
      title: 'Thawhhlawmte chuan thlasik atan inbuatsaihna an nei',
      summary: 'Chapter hotute chuan thil mamawh an khawn a, hmun hrang hranga tlawh tur hun an ruat mek.',
      images: [
        { src: '/assets/images/community-volunteers.jpg', alt: 'Khawtlang thawhhonaah thawhhlawm pakhat' },
        { src: '/assets/images/community-gathering.jpg', alt: 'Ei ruai pakhatah khawtlang thawhhlawmte an lo kal khawm' },
      ],
    },
    {
      id: 'news-3',
      tag: 'Khawtlang',
      date: '2026-10-06',
      dateLabel: '06 Oct 2026',
      title: 'Kan chapter-te inkungkaihna siamtu thawhhlawmte',
      summary: 'Khawtlang mite tanpuihna leh inkungkaihna tha siamtu thawhhlawmte chungchang.',
    },
    {
      id: 'news-4',
      tag: 'Thu Lawmawm',
      date: '2026-10-04',
      dateLabel: '04 Oct 2026',
      title: 'Ei ruai pakhatah thawnthu tam tak',
      summary: 'Member-te chu ei leh in, hla leh pianthar zelin an neih tawh thawnthu sawi turin an lo kal khawm.',
      images: [
        { src: '/assets/images/community-gathering.jpg', alt: 'Khawtlang inkhawm atana ei ruai buatsaih' },
        { src: '/assets/images/community-meal.jpg', alt: 'Ei ruai kilkhawmna tur pindan buatsaih' },
      ],
    },
    {
      tag: 'Khawtlang', date: '2026-10-07', dateLabel: '07 Oct 2026',
      title: 'Chapter thawhhlawm thar kan lawm a',
      summary: 'Thawhhlawm thar-te chu tlawhna leh khawtlang inkhawmnaah tanpui turin local team-te an zawm.',
    },
    {
      tag: 'Hriattirna', date: '2026-10-05', dateLabel: '05 Oct 2026',
      title: 'Mizo tawng inkhawm chu he thlaah a kir leh',
      summary: 'Kum upa leh naupang zawng zawngte tan a hawng a, vawi khat pawh tel ngai lote pawh kan lawm.',
    },
    {
      id: 'news-5', tag: 'Hriattirna', date: '2026-10-02', dateLabel: '02 Oct 2026',
      title: 'October thla chapter-te ruahmanna',
      summary: 'Member-te an inhmuh, thawhhlawmna leh tel ve theihna tur kawng thar chapter-te chuan an ruahman.',
    },
    {
      tag: 'Khawtlang', date: '2026-09-25', dateLabel: '25 Sep 2026',
      title: 'He thla thawhhlawmte hnen atangin kan zir ang',
      summary: 'Local thawhhlawmte chuan an chapter-te tihhmasawnna atana an thawhna an sawi.',
    },
    {
      tag: 'Thu Lawmawm', date: '2026-09-21', dateLabel: '21 Sep 2026',
      title: 'Chhungkaw hunah hla leh thawnthu',
      summary: 'Member-te chuan hla leh inbiakna hun atan chhungkaw tin an ko khawm.',
    },
    {
      id: 'news-7', tag: 'Khawtlang', date: '2026-09-28', dateLabel: '28 Sep 2026',
      title: 'September thla chhungkaw tlawhna an zo',
      summary: 'Chapter thawhhlawmte chuan chhungkaw hrang hrang an tlawh a, hmun lama tanpuina theih dan an hrilh.',
    },
    {
      tag: 'Khawtlang', date: '2026-09-08', dateLabel: '08 Sep 2026',
      title: 'Khawtlang ei ruai atan ei siam dan i rawn share ang',
      summary: 'Member-te chuan autumn gathering atan an chhungkaw ei duh berte an rawn thawn.',
    },
    {
      tag: 'Hriattirna', date: '2026-09-03', dateLabel: '03 Sep 2026',
      title: 'Chapter hrang hrang i chhungte hnenah i inhre rawh',
      summary: 'Series thar hian chapter tinah thawktu leh project nei mi-te a hrilhfiah.',
    },
    {
      id: 'news-8', tag: 'Thu Lawmawm', date: '2026-09-26', dateLabel: '26 Sep 2026',
      title: 'Autumn gathering hun hriattirna',
      summary: 'Member-te leh rualte chu thawnthu, hla leh ei ruai hun atan sawm an ni.',
    },
  ] satisfies NewsArticle[]).sort((first, second) => Date.parse(second.date) - Date.parse(first.date));

  visibleArticleCount = 6;

  get visibleArticles() {
    return this.articles.slice(0, this.visibleArticleCount);
  }

  ionViewDidEnter(): void {
    this.fragmentSubscription?.unsubscribe();
    this.fragmentSubscription = this.route.fragment.subscribe((fragment) => this.navigateToArticle(fragment));
    this.navigateToArticle(this.route.snapshot.fragment);
  }

  ngOnDestroy(): void {
    this.fragmentSubscription?.unsubscribe();
  }

  loadMoreArticles(event: Event): void {
    this.visibleArticleCount = Math.min(this.visibleArticleCount + 6, this.articles.length);
    this.completeScroll(event);
  }

  refreshArticles(event: Event): void {
    this.visibleArticleCount = 6;
    this.completeScroll(event);
  }

  private completeScroll(event: Event): void {
    void (event.target as EventTarget & { complete: () => Promise<void> }).complete();
  }

  private navigateToArticle(fragment: string | null): void {
    if (!fragment) return;

    const articleIndex = this.articles.findIndex((article) => article.id === fragment);
    if (articleIndex < 0) return;

    this.visibleArticleCount = Math.max(this.visibleArticleCount, articleIndex + 1);
    this.changeDetector.detectChanges();
    requestAnimationFrame(() => requestAnimationFrame(() => void this.scrollToArticle(fragment)));
  }

  private async scrollToArticle(id: string): Promise<void> {
    if (!this.content) return;

    const scrollElement = await this.content.getScrollElement();
    const article = this.contentElement?.nativeElement.querySelector<HTMLElement>(`#${id}`);
    if (!article) return;
    const top = article.getBoundingClientRect().top - scrollElement.getBoundingClientRect().top + scrollElement.scrollTop;
    await this.content.scrollToPoint(0, Math.max(0, top - 12), 350);
  }
}