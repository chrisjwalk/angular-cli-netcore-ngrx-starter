export type WeatherForecast = {
  id: string;
  dateFormatted: string;
  temperatureC: number;
  temperatureF: number;
  summary: string;
};

export type WeatherForecastFilter = {
  maxTemperatureC: number;
  minTemperatureC: number;
};
