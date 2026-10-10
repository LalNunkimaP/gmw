import { Component, ElementRef, HostListener, Input, inject } from '@angular/core';
import { IonIcon } from '@ionic/angular';
import { chevronBackOutline, chevronForwardOutline, downloadOutline } from 'ionicons/icons';

export interface GalleryImage {
  src: string;
  alt: string;
}

@Component({
  selector: 'app-image-gallery',
  templateUrl: './image-gallery.component.html',
  styleUrls: ['./image-gallery.component.scss'],
  imports: [IonIcon],
})
export class ImageGalleryComponent {
  @Input({ required: true }) images: GalleryImage[] = [];
  @Input() label = 'Post images';
  private readonly host = inject(ElementRef<HTMLElement>);

  readonly previousIcon = chevronBackOutline;
  readonly nextIcon = chevronForwardOutline;
  readonly downloadIcon = downloadOutline;
  activeIndex = 0;
  isDownloadActionVisible = false;
  private pressTimer?: ReturnType<typeof setTimeout>;

  get currentImage(): GalleryImage | undefined {
    return this.images[this.activeIndex];
  }

  showPrevious(): void {
    if (this.images.length < 2) return;
    this.activeIndex = (this.activeIndex - 1 + this.images.length) % this.images.length;
    this.isDownloadActionVisible = false;
  }

  showNext(): void {
    if (this.images.length < 2) return;
    this.activeIndex = (this.activeIndex + 1) % this.images.length;
    this.isDownloadActionVisible = false;
  }

  startLongPress(event: PointerEvent): void {
    if (event.pointerType === 'mouse' && event.button !== 0) return;
    this.cancelLongPress();
    this.pressTimer = setTimeout(() => {
      this.isDownloadActionVisible = true;
    }, 550);
  }

  cancelLongPress(): void {
    if (this.pressTimer) clearTimeout(this.pressTimer);
    this.pressTimer = undefined;
  }

  openContextMenu(event: MouseEvent): void {
    event.preventDefault();
    this.isDownloadActionVisible = true;
  }

  async downloadCurrentImage(): Promise<void> {
    const image = this.currentImage;
    if (!image) return;

    const filename = this.filenameFor(image.src);
    try {
      const response = await fetch(image.src);
      if (!response.ok) throw new Error(`Image download failed: ${response.status}`);

      const objectUrl = URL.createObjectURL(await response.blob());
      this.triggerDownload(objectUrl, filename);
      setTimeout(() => URL.revokeObjectURL(objectUrl), 1000);
    } catch {
      this.triggerDownload(image.src, filename);
    }

    this.isDownloadActionVisible = false;
  }

  @HostListener('document:click', ['$event'])
  closeActionOnOutsideClick(event: MouseEvent): void {
    if (!(event.target instanceof Node) || !this.isDownloadActionVisible) return;
    if (!this.elementRefContains(event.target)) this.isDownloadActionVisible = false;
  }

  @HostListener('document:keydown.escape')
  closeActionOnEscape(): void {
    this.isDownloadActionVisible = false;
  }

  private elementRefContains(target: Node): boolean {
    return this.hostElement.contains(target);
  }

  private filenameFor(src: string): string {
    try {
      return decodeURIComponent(new URL(src, document.baseURI).pathname.split('/').pop() || 'community-image.jpg');
    } catch {
      return 'community-image.jpg';
    }
  }

  private triggerDownload(src: string, filename: string): void {
    const link = document.createElement('a');
    link.href = src;
    link.download = filename;
    link.rel = 'noopener';
    link.click();
  }

  private get hostElement(): HTMLElement {
    return this.host.nativeElement;
  }
}