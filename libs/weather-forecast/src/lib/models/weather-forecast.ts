export type WeatherForecast = {
  id: string;
  dateFormatted: string;
  temperatureC: number;
  temperatureF: number;
  summary: string;
};

export type WeatherForecastState = {
  weatherForecasts: WeatherForecast[];
  error: unknown;
  count: number;
  loading: boolean;
};
