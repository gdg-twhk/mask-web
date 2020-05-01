import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { BehaviorSubject, combineLatest, Observable, timer } from 'rxjs';
import {
  debounceTime,
  delayWhen,
  distinctUntilChanged,
  map,
  retryWhen,
  startWith,
  switchMap,
  tap,
  filter,
} from 'rxjs/operators';
import { ApiService } from './services/api.service';
import { MapService } from './services/map.service';
import { Store } from './services/models/stores-response.model';
import { determineLevel, filterDataRule, maskSortRule } from './services/utils';
import { AnnouncementComponent } from './components/announcement/announcement.component';

const enum StorageLevel {
  all = 'all',
  safe = 'safe',
  warning = 'warning',
  low = 'low',
  soldout = 'soldout',
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  @ViewChild('dm') dm: TemplateRef<any>;

  readonly storageLevel = [
    StorageLevel.all,
    StorageLevel.safe,
    StorageLevel.warning,
    StorageLevel.low,
    StorageLevel.soldout,
  ];

  readonly pageOptions = [
    { display: '最近 10 間', value: 10 },
    { display: '最近 30 間', value: 30 },
    { display: '最近 50 間', value: 50 },
  ];

  readonly masktypes = [
    { display: '成人口罩', value: 1 },
    { display: '兒童口罩', value: 2 },
  ];

  readonly storageLevelList = [
    { display: '顯示全部', class: 'all' },
    { display: '50% 以上', class: 'safe' },
    { display: '20% ~ 50%', class: 'warning' },
    { display: '20% 以下', class: 'low' },
    { display: '無庫存', class: 'soldout' },
  ];
  searchFilter = new FormControl('');
  displayOption = new FormControl(10);
  maskOption = new FormControl(1);
  searchResults$: Observable<{ maskOption: number; data: any[] }>;
  curretStorageFilterLevel$ = new BehaviorSubject('all');
  get curretStorageFilterLevel() {
    return this.curretStorageFilterLevel$.value;
  }

  displayOptionDisplay$ = this.displayOption.valueChanges.pipe(
    startWith(10),
    map((display) => this.pageOptions.find((x) => x.value === display)?.display)
  );

  maskTypesDisplay$ = this.maskOption.valueChanges.pipe(
    startWith(1),
    map((mask) => this.masktypes.find((x) => x.value === mask)?.display)
  );

  expandDM = false;
  showSearchList = false;
  lastUpdateTime: string | Date;

  markers = { maskOption: this.maskOption.value, data: [] };

  moveToMedical(data: Store) {
    this.mapService.moveToMedical(data);
    this.showSearchList = false;
  }

  toggleSearchList(show: boolean) {
    this.showSearchList = show;
  }

  moveToNextMaskType() {
    const idx = this.masktypes.findIndex(
      (x) => x.value === this.maskOption.value
    );
    this.maskOption.setValue(
      this.masktypes[(idx + 1) % this.masktypes.length].value
    );
  }

  moveToNextdisplayOption() {
    const idx = this.pageOptions.findIndex(
      (x) => x.value === this.displayOption.value
    );
    this.displayOption.setValue(
      this.pageOptions[(idx + 1) % this.pageOptions.length].value
    );
  }

  openDialog() {
    this.dialog.open(this.dm, {});
  }

  filterList(level) {
    this.curretStorageFilterLevel$.next(this.storageLevel[level]);
  }

  toggleExpandDM() {
    this.expandDM = !this.expandDM;
  }

  loadAnnouncement() {
    if (Boolean(parseInt(localStorage.getItem('showNoMore'), 10)) === false) {
      this.dialog.open(AnnouncementComponent, {
        width: '60vw',
        disableClose: true,
      });
    }
  }
  ngOnInit() {
    this.auth.signInAnonymously();
    this.loadAnnouncement();
    this.loadData();
  }

  loadData() {
    const source$ = combineLatest([
      this.mapService.currentBounds$.pipe(filter((value) => value != null)),
      this.displayOption.valueChanges.pipe(startWith(this.displayOption.value)),
    ]).pipe(
      map(([{ center, bounds }, max]) => ({ center, bounds, max })),
      switchMap((data) =>
        this.apiService.loadPharmacies(data).pipe(
          retryWhen((errors) => errors.pipe(delayWhen((val) => timer(500)))),
          tap((data) => (this.lastUpdateTime = data[0]?.updated))
        )
      )
    );

    this.searchResults$ = combineLatest([
      source$,
      this.searchFilter.valueChanges.pipe(
        startWith(''),
        debounceTime(300),
        distinctUntilChanged()
      ),
      this.maskOption.valueChanges.pipe(startWith(this.maskOption.value)),
      this.curretStorageFilterLevel$,
    ]).pipe(
      map(
        ([data, filterWord, maskOption, storageLevel]: [
          Store[],
          string,
          number,
          string
        ]) => {
          // 排序
          return {
            maskOption,
            data: (data ?? [])
              .map((x) => {
                x.adultLevel = determineLevel(x.maskAdult, 'adult');
                x.childLevel = determineLevel(x.maskChild, 'child');
                return x;
              })
              .filter((x) => {
                const level =
                  this.maskOption.value === 1 ? x.adultLevel : x.childLevel;
                return storageLevel === StorageLevel.all
                  ? true
                  : level === storageLevel;
              })
              .filter(filterDataRule(filterWord))
              .sort(maskSortRule(maskOption)),
          };
        }
      ),
      tap((value) => (this.markers = value))
    );
  }

  constructor(
    private dialog: MatDialog,
    private apiService: ApiService,
    private mapService: MapService,
    public auth: AngularFireAuth
  ) {}
}
