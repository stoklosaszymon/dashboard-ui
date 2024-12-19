import { Component, ElementRef, computed, effect, signal, viewChild } from '@angular/core';
import { ApiService } from '../../../api.service';
import { Observable, Subject, switchMap } from 'rxjs';
import { NgClass, NgStyle } from '@angular/common';
import Chart from 'chart.js/auto';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import weatherJson from './assets/description.json'

const URL = 'https://api.open-meteo.com/v1/forecast?current=temperature_2m,relative_humidity_2m,precipitation,wind_speed_10m,is_day,snowfall,weather_code,cloud_cover,wind_speed_10m,wind_direction_10m&hourly=temperature_2m&daily=weather_code,temperature_2m_max,temperature_2m_min';

const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

@Component({
  selector: 'app-widget-weather',
  standalone: true,
  imports: [NgClass, NgStyle],
  templateUrl: './widget-weather.component.html',
  styleUrl: './widget-weather.component.scss'
})
export class WidgetWeatherComponent {

  chart: any = [];
  date = signal(new Date());
  temperature = signal(0);
  details = signal({ precipitation: 0, humidity: 0, windSpeed: 0 })
  isDay = signal(true);
  showClouds = true;
  computedTime = computed(() => {
    const hours = this.date().getHours();
    const minutes = ('0' + this.date().getMinutes()).slice(-2);
    return `${hours}:${minutes}`;
  });
  dayOfWeek = computed(() => {
    return daysOfWeek[this.date().getDay()];
  })
  dailyTempretures: { min: number, max: number, day: string, img: string }[] = [];

  dayEffect = effect(() => {
    if (this.isDay()) {
      Chart.defaults.color = "#fff";
    }
  })

  chartData: { temperatures: number[], time: string[] } = {
    temperatures: [],
    time: []
  }

  data = new Subject<any>();

  constructor(private api: ApiService) {
    Chart.register(ChartDataLabels);
    Chart.defaults.color = "#000";
  }

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
        this.isDay.set(!!response.current.is_day);
        this.details.set({
          precipitation: response.current.precipitation,
          humidity: response.current.relative_humidity_2m,
          windSpeed: response.current.wind_speed_10m
        })

        this.chartData.temperatures = response.hourly.temperature_2m.filter((_, index) => index % 3 == 0).splice(0, 24);
        this.chartData.time = response.hourly.time.splice(0, 24).filter((_, index) => index % 3 == 0).map(date => {
          const time = new Date(date);
          return `${('0' + time.getHours()).slice(-2)}:${('0' + time.getMinutes()).slice(-2)}`;
        });
        this.buildChart();

        response.daily.temperature_2m_max
        response.daily.temperature_2m_min
        this.dailyTempretures = response.daily.time.map((t, i) => {
          const weatherCode = response.daily.weather_code[i];
          const weatherObj = JSON.parse(JSON.stringify(weatherJson));
          return {
            day: daysOfWeek[new Date(t).getDay()],
            min: Math.round(response.daily.temperature_2m_min[i]),
            max: Math.round(response.daily.temperature_2m_max[i]),
            img: weatherObj[weatherCode].day.image
          }
        });

      }
    })
  }

  buildChart() {
    this.chart = new Chart('canvas', {
      type: 'line',
      data: {
        labels: this.chartData.time,
        datasets: [
          {
            label: 'temperature',
            data: this.chartData.temperatures,
            fill: true,
          }
        ]
      },
      options: {
        maintainAspectRatio: false,
        responsive: true,
        layout: {
          padding: {
            top: 20
          }
        },
        scales: {
          x: {
            border: {
              display: false,
            },
            grid: {
              drawOnChartArea: false,
              drawTicks: false,
            }
          },
          y: {
            min: 0,
            display: false,
            grid: {
              drawOnChartArea: false
            },
          }
        },
        plugins: {
          tooltip: {
            enabled: false
          },
          legend: {
            display: false,
          },
          datalabels: {
            anchor: 'end',
            align: 'top',
            font: {
              weight: 'bold'
            }
          }
        },
      },
    }
    );
  }
}

interface WeatherResponse {
  current: {
    temperature_2m: number
    weather_code: number
    time: Date
    is_day: number
    precipitation: number
    relative_humidity_2m: number
    wind_speed_10m: number
  }

  hourly: {
    temperature_2m: number[]
    time: string[]
  }

  daily: {
    temperature_2m_max: number[]
    temperature_2m_min: number[]
    weather_code: number[]
    time: string[]
  }
}

interface WeatherCodes {
  [id: number]: string
}