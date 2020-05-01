import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { AngularFireModule } from '@angular/fire';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { ReactiveFormsModule } from '@angular/forms';
import { GoogleMapsModule } from '@angular/google-maps';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';

import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { environment } from '../environments/environment';
import { AppComponent } from './app.component';
import { StoreCardComponent } from './components/store-card/store-card.component';
import { MapComponent } from './components/map/map.component';
import { MapStoreCardComponent } from './components/map-store-card/map-store-card.component';
import { ServicePeriodsCardComponent } from './components/service-periods-card/service-periods-card.component';
import { AnnouncementComponent } from './components/announcement/announcement.component';

const MaterialModules = [
  MatDialogModule,
  MatButtonModule,
  MatFormFieldModule,
  MatInputModule,
  MatSelectModule,
  MatCheckboxModule,
];

@NgModule({
  declarations: [
    AppComponent,
    StoreCardComponent,
    MapComponent,
    MapStoreCardComponent,
    ServicePeriodsCardComponent,
    AnnouncementComponent,
  ],
  imports: [
    BrowserModule,
    GoogleMapsModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    HttpClientModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireAuthModule,
    ...MaterialModules,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
