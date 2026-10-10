import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ImageGalleryComponent } from './image-gallery.component';

describe('ImageGalleryComponent', () => {
  let fixture: ComponentFixture<ImageGalleryComponent>;
  let component: ImageGalleryComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({}).compileComponents();
    fixture = TestBed.createComponent(ImageGalleryComponent);
    component = fixture.componentInstance;
    component.images = [
      { src: '/assets/first.jpg', alt: 'First image' },
      { src: '/assets/second.jpg', alt: 'Second image' },
    ];
    fixture.detectChanges();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('shows the selected slide and downloads only that image', async () => {
    const fetchImage = vi.spyOn(globalThis, 'fetch').mockResolvedValue({
      ok: true,
      blob: async () => new Blob(['image']),
    } as Response);
    vi.spyOn(URL, 'createObjectURL').mockReturnValue('blob:current-image');
    vi.spyOn(URL, 'revokeObjectURL').mockImplementation(() => {});
    vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => {});

    fixture.nativeElement.querySelector('[aria-label="Next image"]').click();
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('.gallery-image').alt).toBe('Second image');
    expect(fixture.nativeElement.querySelector('.gallery-count').textContent.trim()).toBe('2 / 2');

    component.openContextMenu(new MouseEvent('contextmenu'));
    fixture.detectChanges();
    await component.downloadCurrentImage();

    expect(fetchImage).toHaveBeenCalledWith('/assets/second.jpg');
  });

  it('shows the download action after a touch long press', async () => {
    component.startLongPress({ pointerType: 'touch', button: 0 } as PointerEvent);
    await new Promise((resolve) => setTimeout(resolve, 600));
    expect(component.isDownloadActionVisible).toBe(true);
  });
});