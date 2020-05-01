import {
  AfterViewInit,
  Component,
  Input,
  OnInit,
  QueryList,
  TemplateRef,
  ViewChild,
  ViewChildren
} from '@angular/core';
import { GoogleMap, MapInfoWindow, MapMarker } from '@angular/google-maps';
import { Observable, Subject } from 'rxjs';
import { debounceTime, filter, map, switchMap } from 'rxjs/operators';
import { ApiService } from '../../services/api.service';
import { MapService } from '../../services/map.service';
import { getMarkerImage, getlevelSize } from '../../services/utils';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit, AfterViewInit {
  mapOptions: google.maps.MapOptions = {
    fullscreenControl: false,
    streetViewControl: false,
    mapTypeControl: false,
    gestureHandling: 'greedy'
  };
  viewPosition: google.maps.LatLng;
  userPosition: google.maps.LatLng;
  zoom = 16;
  openMapMarker: MapMarker;
  selectData;

  boundsChanged$ = new Subject<{
    center: google.maps.LatLng;
    bounds: google.maps.LatLngBounds;
  } | null>();

  markerOptions = { draggable: false };
  _markers;
  data = [];

  @ViewChild(GoogleMap) googleMap: GoogleMap;
  @ViewChild(MapInfoWindow) infoWindow: MapInfoWindow;
  @ViewChildren('mapmarker') mapMarkers: QueryList<MapMarker>;
  @ViewChild('centerControl') centerControl: TemplateRef<any>;

  @Input()
  set markers({ maskOption, data }: { maskOption: number; data: any[] }) {
    if (!!data) {
      this.data = data;
      this._markers = data.map(x => {
        const level = maskOption === 1 ? x.adultLevel : x.childLevel;
        const markerImage = getMarkerImage(level);
        const iconUrl = `/assets/images/${markerImage}`;
        return {
          id: x.id,
          position: {
            lng: x.longitude,
            lat: x.latitude
          },
          options: { ...this.markerOptions, icon: iconUrl }
        };
      });
    }
  }
  get markers() {
    return this._markers;
  }

  // 取得目前地圖可視範圍的四點座標
  currentBounds$ = this.boundsChanged$.pipe(
    filter(x => x != null),
    debounceTime(300),
    filter(({ bounds }) => !!bounds),
    map(({ center, bounds }) => {
      const ne = bounds.getNorthEast(); // LatLng of the north-east corner
      const sw = bounds.getSouthWest(); // LatLng of the south-west corder
      const nw = new google.maps.LatLng(ne.lat(), sw.lng());
      const se = new google.maps.LatLng(sw.lat(), ne.lng());
      return {
        center: center.toJSON(),
        bounds: {
          ne: ne.toJSON(),
          se: se.toJSON(),
          sw: sw.toJSON(),
          nw: nw.toJSON()
        }
      };
    })
  );

  getUserCurrentPosition$ = new Subject<void>();
  getCurrentPosition$ = new Observable(observer => {
    navigator.geolocation.getCurrentPosition(
      position => {
        observer.next({
          lat: position.coords.latitude,
          lng: position.coords.longitude
        });
        observer.complete();
      },
      () => {
        this.apiService.getIPLocation().subscribe({
          next: value => {
            observer.next(value);
            observer.complete();
          },
          error: err => observer.error(err)
        });
      }
    );
  });

  center$ = this.getUserCurrentPosition$.pipe(
    switchMap(() => this.getCurrentPosition$),
    map(({ lat, lng }) => new google.maps.LatLng(lat, lng))
  );

  boundsChanged() {
    this.boundsChanged$.next({
      center: this.googleMap.getCenter(),
      bounds: this.googleMap.getBounds()
    });
  }

  trackByFn(index, item) {
    return item.id;
  }

  openInfoWindow(marker: MapMarker, id) {
    this.openMapMarker = marker;
    this.selectData = this.data.find(x => x.id === id);
    this.infoWindow.open(this.openMapMarker);
  }

  watchInfoWindowPosition() {
    const pos = this.openMapMarker._marker.getPosition().toJSON();
    if (
      this.selectData.longitude !== pos.lng &&
      this.selectData.latitude !== pos.lat
    ) {
      this.infoWindow.close();
    }
  }

  createCenterControl() {
    this.googleMap.controls[google.maps.ControlPosition.RIGHT_BOTTOM].push(
      this.centerControl.createEmbeddedView('').rootNodes[0]
    );
  }
  getUserCurrentPosition() {
    this.getUserCurrentPosition$.next();
  }

  // 地圖完成後增加自訂按鈕
  ngAfterViewInit(): void {
    this.createCenterControl();
  }

  moveToMedial(data) {
    const currentMapMarker = this.mapMarkers
      .toArray()
      .find(
        mapMarker =>
          mapMarker._marker.getPosition().lat() === data.latitude &&
          mapMarker._marker.getPosition().lng() === data.longitude
      );
    this.openInfoWindow(currentMapMarker, data.id);
    this.viewPosition = currentMapMarker._marker.getPosition();
  }

  ngOnInit() {
    this.center$.subscribe({
      next: center => {
        this.userPosition = center;
        this.viewPosition = center;
      }
    });
    this.getUserCurrentPosition$.next();

    this.mapService.moveToMedical$.subscribe({
      next: data => this.moveToMedial(data)
    });

    this.currentBounds$.subscribe({
      next: value => {
        this.mapService.currentBounds$.next(value);
      }
    });
  }

  constructor(private apiService: ApiService, private mapService: MapService) {}
}
