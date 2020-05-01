import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, tap } from 'rxjs/operators';
import { LoadStoreRequest } from './models/load-store-request.model';
import { Store, PharmaciesResponse } from './models/stores-response.model';
import { FeedbackOption, Feedback } from './models/api.model';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiBase = '';
  constructor(private http: HttpClient) { }

  loadPharmacies(data: LoadStoreRequest) {
    return this.http
      .post<PharmaciesResponse>(
        'https://mask-9999.appspot.com/api/pharmacies',
        data
      )
      .pipe(
        map(r => r.data.items),
        map(r =>
          r.map(x => {
            x.updated = x.updated ? new Date(x.updated) : null;
            return x;
          })
        )
      );
  }

  getIPLocation() {
    return this.http
      .get('https://ipapi.co/json/')
      .pipe(map((data: any) => ({ lat: data.latitude, lng: data.longitude })));
  }

  getFeedbackOptions() {
    return this.http.get<FeedbackOption[]>(
      `${this.apiBase}/api/feedback/options`
    );
  }

  geStoreFeedback(storeId) {
    return this.http.get(`${this.apiBase}/api/feedback/stores/${storeId}`);
  }

  getUserFeedback(userId) {
    return this.http.get(`${this.apiBase}/api/feedback/users/${userId}`);
  }

  updateFeedback(data: Feedback) {
    return this.http.post(`${this.apiBase}/api/feedback`, data);
  }
}
