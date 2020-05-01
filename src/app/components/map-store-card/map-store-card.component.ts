import { Component, OnInit } from '@angular/core';
import { StoreCardComponent } from '../store-card/store-card.component';
import { Store } from 'src/app/services/models/stores-response.model';

@Component({
  selector: 'app-map-store-card',
  templateUrl: '../store-card/store-card.component.html',
  styleUrls: [
    '../store-card/store-card.component.scss',
    './map-store-card.component.scss'
  ]
})
export class MapStoreCardComponent extends StoreCardComponent {
}
