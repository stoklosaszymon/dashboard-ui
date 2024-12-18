import { Component, computed, signal } from '@angular/core';
import { ApiService } from '../../../api.service';
import { Observable, Subject, switchMap } from 'rxjs';
import { NgClass, NgStyle } from '@angular/common';

const URL = 'https://api.open-meteo.com/v1/forecast?current=temperature_2m,is_day,snowfall,weather_code,cloud_cover,wind_speed_10m,wind_direction_10m&hourly=temperature_2m';
const WEATHER_CODES: WeatherCodes = {
  0: 'Clear Sky',
  1: 'MainlyClear',
  2: 'PartlyCloudy',
  3: 'Overcast'
}
@Component({
  selector: 'app-widget-weather',
  standalone: true,
  imports: [NgClass, NgStyle],
  templateUrl: './widget-weather.component.html',
  styleUrl: './widget-weather.component.scss'
})
export class WidgetWeatherComponent {

  date = signal(new Date());
  temperature = signal(0);
  isDay = false;
  showClouds = true;
  computedTime = computed(() => {
    const hours = this.date().getHours();
    const minutes = ('0' + this.date().getMinutes()).slice(-2);
    return `${hours}:${minutes}`;
  });
  dayOfWeek = computed(() => {
    const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    return daysOfWeek[this.date().getDay()]; 
  })

  data = new Subject<any>();

  constructor(private api: ApiService) { }

  ngOnInit() {
    this.fetchWeatherData();
  }

  getLocation() {
    return new Observable<GeolocationCoordinates>((observer) => {
      window.navigator.geolocation.getCurrentPosition(
        (position) => {
          observer.next(position.coords);
          observer.complete();
        },
        (err) => observer.error(err)
      );
    });
  }

  fetchWeatherData() {
    this.getLocation().pipe(
      switchMap((geolocation) => {
        let newUrl = URL;
        newUrl += `&latitude=${geolocation.latitude}&longitude=${geolocation.longitude}`
        return this.api.get<WeatherResponse>(newUrl)
      })
    ).subscribe({
      next: (response) => {
        console.log('resp', response);
        this.date.set(new Date(response.current.time));
        this.temperature.set(response.current.temperature_2m);
        this.isDay = !!response.current.is_day
      }
    })
  }
}

interface WeatherResponse {
  current: {
    temperature_2m: number,
    weather_code: number,
    time: Date
    is_day: boolean
  }
}

interface WeatherCodes {
  [id: number]: string
}