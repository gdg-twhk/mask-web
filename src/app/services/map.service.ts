import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { BehaviorSubject, Subject } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { CurrentBouds } from './models/load-store-request.model';

export interface MapBounds {
  center: google.maps.LatLng;
  bounds: google.maps.LatLngBounds;
}

@Injectable({
  providedIn: 'root'
})
export class MapService {
  moveToMedical$ = new Subject();
  currentBounds$ = new BehaviorSubject<CurrentBouds | null>(null);
  uid;
  moveToMedical(data) {
    this.moveToMedical$.next(data);
  }
  constructor(public auth: AngularFireAuth) {
    this.auth.user
      .pipe(
        filter(user => user != null),
        map(user => user.uid)
      )
      .subscribe({
        next: uid => (this.uid = uid)
      });
  }
}
