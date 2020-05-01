import { Component, Input } from '@angular/core';
import { Store } from 'src/app/services/models/stores-response.model';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-service-periods-card',
  templateUrl: './service-periods-card.component.html',
  styleUrls: ['./service-periods-card.component.scss']
})
export class ServicePeriodsCardComponent {
  @Input() data: Store;
  @Input() desktop = false;

  servicePeriods(index: number) {
    return this.data.servicePeriods[index] === 'N' ? 'O' : '';
  }

  serviceNote(note: string) {
    return note.replace('\\n', '<br/>');
  }

  closeDialog() {
    this.dialog.closeAll();
  }
  constructor(private dialog: MatDialog) { }
}
