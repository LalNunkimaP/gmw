import { Component } from '@angular/core';
import {
  IonContent,
  IonInfiniteScroll,
  IonInfiniteScrollContent,
  IonRefresher,
  IonRefresherContent,
} from '@ionic/angular';

@Component({
  selector: 'app-members',
  templateUrl: './members.page.html',
  styleUrls: ['./members.page.scss'],
  imports: [IonContent, IonInfiniteScroll, IonInfiniteScrollContent, IonRefresher, IonRefresherContent],
})
export class MembersPage {
  searchTerm = '';

  readonly members = [
    { initials: 'LL', name: 'Lalhmingliani L.', chapter: 'Panaji', joined: '2026', joinedAt: '2026-10-10' },
    { initials: 'RM', name: 'Rochungnunga M.', chapter: 'Margao', joined: '2026', joinedAt: '2026-10-09' },
    { initials: 'ZC', name: 'Zothanpari C.', chapter: 'Vasco da Gama', joined: '2026', joinedAt: '2026-10-08' },
    { initials: 'ML', name: 'Malsawmtluangi L.', chapter: 'Mapusa', joined: '2026', joinedAt: '2026-10-05' },
    { initials: 'VT', name: 'Vanlalruata T.', chapter: 'Ponda', joined: '2026', joinedAt: '2026-10-03' },
    { initials: 'HC', name: 'Hmingthanzuali C.', chapter: 'Margao', joined: '2026', joinedAt: '2026-10-01' },
    { initials: 'ZL', name: 'Zoramthara L.', chapter: 'Panaji', joined: '2026', joinedAt: '2026-09-28' },
    { initials: 'PC', name: 'Pawihchhungi C.', chapter: 'Mapusa', joined: '2026', joinedAt: '2026-09-25' },
    { initials: 'LT', name: 'Lalruatkima T.', chapter: 'Vasco da Gama', joined: '2026', joinedAt: '2026-09-22' },
    { initials: 'ZP', name: 'Zonunsangi P.', chapter: 'Margao', joined: '2026', joinedAt: '2026-09-19' },
    { initials: 'RC', name: 'Rinawma C.', chapter: 'Ponda', joined: '2026', joinedAt: '2026-09-16' },
    { initials: 'MT', name: 'Malsawmtluanga T.', chapter: 'Panaji', joined: '2026', joinedAt: '2026-09-13' },
    { initials: 'VL', name: 'Vanlalhriatpuia L.', chapter: 'Mapusa', joined: '2026', joinedAt: '2026-09-10' },
    { initials: 'HC', name: 'Hmingthansanga C.', chapter: 'Margao', joined: '2026', joinedAt: '2026-09-07' },
    { initials: 'TL', name: 'Thangzami L.', chapter: 'Ponda', joined: '2026', joinedAt: '2026-09-04' },
    { initials: 'ZC', name: 'Zothanpuii C.', chapter: 'Vasco da Gama', joined: '2026', joinedAt: '2026-09-01' },
    { initials: 'SL', name: 'Sangliana L.', chapter: 'Panaji', joined: '2025', joinedAt: '2025-12-18' },
    { initials: 'KC', name: 'Khawlhringi C.', chapter: 'Margao', joined: '2025', joinedAt: '2025-11-12' },
  ].sort((first, second) => Date.parse(second.joinedAt) - Date.parse(first.joinedAt));

  visibleMemberCount = 8;

  get filteredMembers() {
    const query = this.searchTerm.trim().toLowerCase();
    if (!query) return this.members;

    return this.members.filter((member) =>
      `${member.name} ${member.chapter}`.toLowerCase().includes(query),
    );
  }

  get visibleMembers() {
    return this.filteredMembers.slice(0, this.visibleMemberCount);
  }

  updateSearch(event: Event): void {
    this.searchTerm = (event.target as HTMLInputElement).value;
    this.visibleMemberCount = 8;
  }

  loadMoreMembers(event: Event): void {
    this.visibleMemberCount = Math.min(this.visibleMemberCount + 8, this.filteredMembers.length);
    this.completeScroll(event);
  }

  refreshMembers(event: Event): void {
    this.visibleMemberCount = 8;
    this.completeScroll(event);
  }

  private completeScroll(event: Event): void {
    void (event.target as EventTarget & { complete: () => Promise<void> }).complete();
  }
}