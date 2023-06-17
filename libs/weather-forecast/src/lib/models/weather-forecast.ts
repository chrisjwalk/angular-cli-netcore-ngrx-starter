export interface WeatherForecast {
  id: string;
  dateFormatted: string;
  temperatureC: number;
  temperatureF: number;
  summary: string;
}

export interface WeatherForecastState {
  weatherForecasts: WeatherForecast[];
  error: any;
  count: number;
  loading: boolean;
}
