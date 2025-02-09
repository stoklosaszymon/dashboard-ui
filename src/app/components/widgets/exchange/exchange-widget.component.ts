import { Component, ElementRef, computed, signal, viewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { Chart } from 'chart.js';

@Component({
  selector: 'app-exchange',
  standalone: true,
  imports: [MatButtonModule, MatInputModule],
  template: `
        <div class="container">
          <div class="left">
            <div style="padding-bottom: 10px">
              <span style="font-size: 24px">1 Euro = </span>
              <br>
              <span class="currentRate">{{currentRate()}} PLN</span>
            </div>
            <div class="inp">
              <label for="c-first">Euro</label>
              <input id="c-first" [value]="from()" (change)="setFrom($event)"/>
            </div>
            <div class="inp">
              <label for="c-second">PLN</label>
              <input id="c-second" [value]="to()" (change)="calculateRateReverse($event)"/>
            </div>
          </div>
          <div class="right">
            <div>
              @for( int of intervals; track int.name) {
                <button (click)="setInterval(int.value)" mat-raised-button>{{int.name}}</button>
              }
            </div>
            <div class="chart">
              <canvas #exchangechart></canvas>
            </div>
          </div>
        </div>
  `,
  styleUrls: ['exchange-widget.component.scss']
})
export class ExchangeWidgetComponent {

  chartRef = viewChild<ElementRef<HTMLCanvasElement>>('exchangechart');
  currencyData = signal<{date: string, value: number}[]>(this.generateCurrencyData('1m'));
  chart!: Chart;
  currentRate = computed( () => this.currencyData().at(-1)?.value);
  from = signal(1.0);
  to = computed( () => (this.from() * this.currentRate()!).toFixed(2))
  intervals: Intervals[] = [
    { name: '1D', value: '1d' },
    { name: '5D', value: '5d' },
    { name: '1M', value: '1m' },
    { name: '1R', value: '1y' },
    { name: '5R', value: '5y' },
  ]

  ngAfterViewInit() {
    this.buildChart();
  }

  formatDate(date: Date, interval: Interval): string {
    const options: Intl.DateTimeFormatOptions =
      interval === '1d' ? { hour: '2-digit', minute: '2-digit' } :
        interval === '5d' ? { day: '2-digit', hour: '2-digit', minute: '2-digit' } :
          interval === '1m' || interval === '1y' ? { month: 'short', day: '2-digit' } :
            { year: 'numeric', month: 'short', day: '2-digit' }; // 5y
    return new Intl.DateTimeFormat('en-US', options).format(date);
  }

  generateCurrencyData(interval: Interval) {
    const now = new Date();
    const data = [];
    let startDate = new Date(now);
    let stepMinutes = 5;
    let numSteps = 0;

    switch (interval) {
      case '1d':
        numSteps = (24 * 60) / 5;
        break;
      case '5d':
        numSteps = (5 * 24 * 60) / 20;
        stepMinutes = 20;
        break;
      case '1m':
        numSteps = 30;
        stepMinutes = 24 * 60;
        break;
      case '1y':
        numSteps = 365;
        stepMinutes = 24 * 60;
        break;
      case '5y':
        numSteps = 5 * 52;
        stepMinutes = 7 * 24 * 60;
        break;
    }

    let currentValue = 4;

    for (let i = 0; i < numSteps; i++) {
      const newDate = new Date(startDate);
      newDate.setMinutes(startDate.getMinutes() - stepMinutes * i);

      currentValue += (Math.random() * 0.2 - 0.1);
      currentValue = currentValue > 1 ? currentValue : 1.0;
      data.push({ date: this.formatDate(newDate, interval), value: parseFloat(currentValue.toFixed(2)) });
    }

    return data.reverse();
  }

  setInterval(val: Interval) {
    if (!this.chart) {
      return;
    }
    this.currencyData.set(this.generateCurrencyData(val));
    this.chart.data.datasets[0].data = this.currencyData().map(e => e.value);
    this.chart.data.labels = this.currencyData().map(e => e.date);
    this.chart!.options!.scales!['y']!.min = Math.min(...this.currencyData().map(e => e.value)) - 4.0;
    this.chart!.options!.scales!['y']!.max = Math.max(...this.currencyData().map(e => e.value)) + 4.0;
    this.chart.update();
  }

  setFrom(event: Event) {
    this.from.set( parseFloat((event.target as HTMLInputElement).value));
  }

  calculateRateReverse(event: Event) {
    this.from.set( parseFloat((parseFloat((event.target as HTMLInputElement).value) / this.currentRate()!).toFixed(2)) );
  }

  buildChart() {
    const verticalHoverLine = {
      id: 'verticalHoverLine',
      beforeDatasetDraw(chart: any, args: any, plugins: any) {
        const { ctx, chartArea: { top, bottom, height } } = chart;
        ctx.save();

        chart.getDatasetMeta(0).data.forEach((dataPoint: any, index: any) => {
          if (dataPoint.active == true) {
            ctx.beginPath();
            ctx.strokeStyle = 'gray';
            ctx.moveTo(dataPoint.x, top);
            ctx.lineTo(dataPoint.x, bottom);
            ctx.stroke();
          }
        })
      }
    }
    this.chart = new Chart(this.chartRef()?.nativeElement!, {
      type: 'line',
      data: {
        labels: this.currencyData().map(e => e.date),
        datasets: [
          {
            data: this.currencyData().map(e => e.value),
            fill: false,
            pointRadius: 2
          }
        ]
      },
      options: {
        interaction: {
          mode: 'index',
          intersect: false
        },
        maintainAspectRatio: false,
        responsive: true,
        scales: {
          x: {
            border: {
              display: true,
            },
            grid: {
              drawOnChartArea: false,
            },
            ticks: {
              maxTicksLimit: 2,
              display: true
            },
            display: true
          },
          y: {
            min: Math.min(...this.currencyData().map(e => e.value)) - 0.2,
            max: Math.max(...this.currencyData().map(e => e.value)) + 0.2,
            display: true,
            grid: {
              drawOnChartArea: true
            },
            ticks: {
              maxTicksLimit: 4
            }
          }
        },
        plugins: {
          tooltip: {
            enabled: true
          },
          legend: {
            display: false,
          },
          datalabels: {
            display: false,
          },

        },
      },
      plugins: [verticalHoverLine]
    })
  }
}

interface Intervals {
  name: string
  value: Interval
}

type Interval = '1d' | '5d' | '1m' | '1y' | '5y';