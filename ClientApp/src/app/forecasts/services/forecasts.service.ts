import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class ForecastsService {

  constructor(
    @Inject(HttpClient) public http: HttpClient,
    @Inject('BASE_URL') private baseUrl: string) { }

  getWeather<T>(count: number) {
    return this.http.get<T[]>(this.baseUrl + 'api/SampleData/WeatherForecasts', {
        params: {
            'count': count.toString()
        }
    });
  }
}
