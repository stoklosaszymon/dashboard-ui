import { Component, ElementRef, computed, effect, signal, viewChild } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Chart } from 'chart.js';
import { concatMap, interval, of, scan, tap } from 'rxjs';

@Component({
  selector: 'app-exchange',
  standalone: true,
  imports: [],
  template: `
        <div style="height: 100%; width: 100%; position: relative;">
        <div>
          @for( int of intervals; track int.name) {
            <button (click)="setInterval(int.value)">{{int.name}}</button>
          }
        </div>
            <canvas #chart></canvas>
        </div>
  `,
  styles: []
})
export class ExchangeWidgetComponent {

  chartRef = viewChild<ElementRef<HTMLCanvasElement>>('chart');
  currencyData = this.generateCurrencyChangeData(new Date(), 30, 4, 0.05);
  chart!: Chart;

  intervals: Interval[] = [
    { name: '1D', value: 1 },
    { name: '5D', value: 5 },
    { name: '1M', value: 30 },
    { name: '1R', value: 365 },
    { name: '5D', value: 365 * 5 },
  ]

  ngOnInit() {
    this.buildChart();
  }

  generateCurrencyChangeData(
    startDate: Date,
    count: number,
    baseValue: number,
    fluctuation: number,
    mode: 1 | 24 = 24 // 1 for hourly, 24 for daily
  ): { date: string; value: number }[] {
    const data: { date: string; value: number }[] = [];

    for (let i = 0; i < count; i++) {
      const currentDate = new Date(startDate);

      if (mode === 1) {
        currentDate.setHours(startDate.getHours() + i); // Increment by 1 hour
        data.push({
          date: currentDate.toISOString().slice(0, 16).replace('T', ' '), // Format as "YYYY-MM-DD HH:mm"
          value: parseFloat((baseValue + (Math.random() * 2 - 1) * fluctuation).toFixed(2)),
        });
      } else {
        currentDate.setDate(startDate.getDate() + i); // Increment by 1 day
        data.push({
          date: currentDate.toISOString().split('T')[0], // Format as "YYYY-MM-DD"
          value: parseFloat((baseValue + (Math.random() * 2 - 1) * fluctuation).toFixed(2)),
        });
      }
    }

    return data;
  }

  setInterval(val: number) {
    this.currencyData = this.generateCurrencyChangeData(new Date(), val, 4, 0.1);
    this.chart.data.datasets[0].data = this.currencyData.map(e => e.value);
    this.chart.data.labels = this.currencyData.map(e => e.date);
    this.chart.update();
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
        labels: this.currencyData.map(e => e.date),
        datasets: [
          {
            data: this.currencyData.map(e => e.value),
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
              display: false,
            },
            grid: {
              drawOnChartArea: false,
            },
            ticks: {
              maxTicksLimit: 3
            }
          },
          y: {
            min: Math.min(...this.currencyData.map(e => e.value)) - 0.2,
            max: Math.max(...this.currencyData.map(e => e.value)) + 0.2,
            display: true,
            position: 'right',
            grid: {
              drawOnChartArea: false
            },
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

interface Interval {
  name: string
  value: number
}