import { Component, ElementRef, computed, effect, inject, viewChild } from "@angular/core";
import annotationPlugin from 'chartjs-plugin-annotation';
import { WidgetBaseComponent } from "../../widget-base/widget-base.component";
import { StockService } from "./stock.service";
import { toSignal } from "@angular/core/rxjs-interop";
import { tap } from "rxjs";
import { Chart, registerables } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';

Chart.register(...registerables, ChartDataLabels);
Chart.register(annotationPlugin);
@Component({
    selector: 'app-stock-widget',
    standalone: true,
    template: `
    <div #main class="container">
        <div class="top">
            <span class="wse">MSFT</span>
            <div class="info">
                <span>
                    {{last()}} <span class="currency">PLN</span>
                </span>
                <span class="rate" [style]="diff() > 0 ? 'color: green' : 'color: red'">
                    {{diff()}} ({{diffPercent()}}%) dzisiaj
                </span>
            </div>
        </div>
        <div class="chart">
            <canvas #chart></canvas>
        </div>
        <div class="details">
            <span>otwarcie: {{open()}}</span>
            <span>max: {{max()}}</span>
            <span>min: {{min()}}</span>
        </div>
    </div>
    `,
    styleUrl: 'stock-widget.component.scss',
})
export class StockWidget extends WidgetBaseComponent {

    stockService = inject(StockService);
    chartRef = viewChild<ElementRef<HTMLCanvasElement>>('chart')
    main = viewChild<ElementRef<HTMLDivElement>>('main')
    time = toSignal(this.stockService.getTime().pipe(tap(() => this.updateChart())), {
        initialValue: [
            `${new Date().getHours()}:${String(new Date().getMinutes()).padStart(2, '0')}`
        ]
    });
    chartData = toSignal(this.stockService.getPrice(), { initialValue: [125.5] });
    max = computed(() => Math.max(...this.chartData()!));
    min = computed(() => Math.min(...this.chartData()!));
    open = computed(() => this.chartData()!.at(0))
    last = computed(() => this.chartData()!.at(-1));
    diff = computed(() => parseFloat((this.last()! - this.open()!).toFixed(2)))
    diffPercent = computed(() => parseFloat(((this.diff() * 100) / this.open()!).toFixed(2)))
    chart: any;


    ngAfterViewInit() {
        if (!this.chart) {
            this.buildChart();
        }
    }

    updateChart() {
        this.chart.data.datasets[0].data = this.chartData();
        this.chart.data.labels = this.time();
        this.chart.options.plugins.annotation.annotations.line.yMin = this.last();
        this.chart.options.plugins.annotation.annotations.line.yMax = this.last();
        this.chart.options.plugins.annotation.annotations.line.label.content = `${this.last()}`;
        if (this.time()?.length! > 5) {
            this.chart.options.scales.y.max = this.max() + (0.5 * this.max());
            this.chart.options.scales.y.min = this.min() - (0.5 * this.max());
        }
        if (this.chart) {
            this.chart.update();
        }
    }

    buildChart() {
        this.chart = new Chart(this.chartRef()?.nativeElement!, {
            type: 'line',
            data: {
                labels: this.time(),
                datasets: [
                    {
                        data: this.chartData(),
                        fill: false,
                        pointRadius: 0
                    }
                ]
            },
            options: {
                maintainAspectRatio: false,
                responsive: true,
                scales: {
                    x: {
                        border: {
                            display: false,
                        },
                        grid: {
                            drawOnChartArea: false,
                            drawTicks: false,
                        },
                        ticks: {
                            maxTicksLimit: 10
                        }
                    },
                    y: {
                        min: this.min() - 10,
                        max: this.max() + 10,
                        display: true,
                        position: 'right',
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
                        display: false,
                    },
                    annotation: {
                        annotations: {
                            line: {
                                type: 'line',
                                yMin: this.last(), // Last element value
                                yMax: this.last(),
                                borderColor: 'red',
                                borderWidth: 2,
                                label: {
                                    display: true,
                                    content: `${this.last()}`,
                                    position: 'end',
                                    yAdjust: -20
                                }
                            }
                        }
                    }
                },
            },
        })
    }
}