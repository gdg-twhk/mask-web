import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-announcement',
  templateUrl: './announcement.component.html',
  styleUrls: ['./announcement.component.scss'],
})
export class AnnouncementComponent {
  showNoMore = new FormControl();

  constructor(private dialogRef: MatDialogRef<AnnouncementComponent>) {}

  ok() {
    localStorage.setItem('showNoMore', this.showNoMore.value ? '1' : '0');
    this.dialogRef.close();
  }
}
