import { ChangeDetectionStrategy, Component, ElementRef, computed, effect, signal, viewChild } from '@angular/core';
import { ApiService } from '../../../api.service';
import { Observable, Subject, switchMap } from 'rxjs';
import { NgClass, NgStyle } from '@angular/common';
import weatherJson from './assets/description.json'
import { WidgetBaseComponent } from '../../widget-base/widget-base.component';
import { Chart, registerables } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';

const URL = 'https://api.open-meteo.com/v1/forecast?current=temperature_2m,rain,relative_humidity_2m,precipitation,wind_speed_10m,is_day,snowfall,weather_code,cloud_cover,wind_speed_10m,wind_direction_10m&hourly=temperature_2m&daily=weather_code,temperature_2m_max,temperature_2m_min';

const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];


Chart.register(...registerables, ChartDataLabels);

@Component({
    selector: 'app-widget-weather',
    imports: [NgClass, NgStyle],
    templateUrl: './widget-weather.component.html',
    styleUrl: './widget-weather.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class WidgetWeatherComponent extends WidgetBaseComponent {

  chart: any;
  chartRef = viewChild<ElementRef<HTMLCanvasElement>>('chart');
  date = signal(new Date());
  temperature = signal(0);
  details = signal({ precipitation: 0, humidity: 0, windSpeed: 0 })
  isDay = signal(false);
  isLoading = signal(true);
  showClouds = false;
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
      Chart.defaults.color = "#000";
    }
  })

  loadingEffect = effect(() => {
    if (!this.isLoading()) {
      setTimeout(() => {
        this.buildChart();
      })
    }
  })

  canvasId = this.randomId(6);

  chartData: { temperatures: number[], time: string[] } = {
    temperatures: [],
    time: []
  }

  constructor(private api: ApiService) {
    Chart.register(ChartDataLabels);
    super();
  }

  ngOnInit() {
    this.fetchWeatherData();
    Chart.defaults.color = "#bbb";
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
        this.date.set(new Date(response.current.time));
        this.temperature.set(response.current.temperature_2m);
        this.isDay.update(() => !!response.current.is_day);
        this.details.set({
          precipitation: response.current.precipitation,
          humidity: response.current.relative_humidity_2m,
          windSpeed: response.current.wind_speed_10m
        })

        this.chartData.time = response.hourly.time.filter((t, i) => {
          let date = new Date(t);
          let now = new Date();
           if (date >= now && i % 3 == 0) {
            this.chartData.temperatures.push(response.hourly.temperature_2m[i]);
            return true
           }
          return false
        })
          .splice(0, 8).map(date => {
            const time = new Date(date);
            return `${('0' + time.getHours()).slice(-2)}:${('0' + time.getMinutes()).slice(-2)}`;
          });

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
        this.isLoading.set(false);
      }
    })
  }

  buildChart() {
    this.chart = new Chart(this.chartRef()?.nativeElement!, {
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
            min: Math.min(...this.chartData.temperatures),
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

  randomId(len: number) {
    return Math.random().toString(36).substring(2,len+2);
  }

  containerClasses() {
    let classes = this.isDay() ? 'night-sky' : 'day-sky';
    return classes;
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