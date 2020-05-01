import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Store } from '../../services/models/stores-response.model';

@Component({
  selector: 'app-period-card',
  templateUrl: './period-card.component.html',
  styleUrls: ['./period-card.component.scss']
})
export class PeriodCardComponent implements OnInit {
  periodTable = {};
  data: Store;
  displayStoreName: boolean;
  constructor(
    public dialogRef: MatDialogRef<PeriodCardComponent>,
    @Inject(MAT_DIALOG_DATA)
    public passData: { showStoreName: boolean; data: Store }
  ) {
    this.displayStoreName = passData.showStoreName;
    this.data = passData.data;
    this.periodTable = this.generatePeriodTable();
  }

  generatePeriodTable() {
    const periodSection = ['上午', '下午', '晚上'];
    let currectStage = 0;

    const source = this.data.servicePeriods.split('');
    const periodTable = { 上午: [], 下午: [], 晚上: [] };
    // tslint:disable-next-line: prefer-for-of
    for (let i = 0; i < source.length; ++i) {
      if (periodTable[periodSection[currectStage]]?.length === 7) {
        currectStage += 1;
      }
      const sect = periodTable[periodSection[currectStage]];
      const p = source[i] === 'N' ? 'O' : '';
      sect.push(p);
    }
    return periodTable;
  }

  compareFn() {
    return 0;
  }

  ngOnInit(): void {}
}
