import { Component, Input, Output, EventEmitter, ViewChild, TemplateRef, HostListener } from '@angular/core';
import { Store } from '../../services/models/stores-response.model';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-store-card',
  templateUrl: './store-card.component.html',
  styleUrls: ['./store-card.component.scss']
})
export class StoreCardComponent{
  windowInnerWidth: number = window.innerWidth;
  servicePeriodsCardShow = false;

  @ViewChild('spcard') spcard: TemplateRef<any>;

  @Input() data: Store;
  @Input() showStoreName: boolean = false;
  @Output() moveToMedical: EventEmitter<Store> = new EventEmitter();

  moveMap(data: Store) {
    this.moveToMedical.emit(data);
  }

  // 動態計算寬度(選用)
  @HostListener('window:resize', ['$event'])
  onResize(): void {
    this.windowInnerWidth = window.innerWidth;
    if (this.windowInnerWidth > 768) {
      this.dialog.closeAll();
    } else {
      this.servicePeriodsCardShow = false;
    }
  }

  isExpirationNotExpired(date: string | Date) {
    return new Date(date).valueOf() > 0;
  }

  servicePeriodsCardToggle() {
    // 桌面板的話就做Expand
    if (this.windowInnerWidth > 768) {
      this.servicePeriodsCardShow = !this.servicePeriodsCardShow;
    // 手機板的話就做Modal
    } else {
      this.dialog.open(this.spcard);
    }
  }

  constructor(
    private dialog: MatDialog,
  ) { }
}
