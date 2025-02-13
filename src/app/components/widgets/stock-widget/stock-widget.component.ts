import { AfterViewInit, Component, ElementRef, computed, effect, signal, viewChild } from "@angular/core";
import { Chart } from "chart.js";
import annotationPlugin from 'chartjs-plugin-annotation';

Chart.register(annotationPlugin);
@Component({
    selector: 'app-stock-widget',
    standalone: true,
    template: `
    <div class="container">
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
    <div>
    `,
    styleUrl: 'stock-widget.component.scss'
})
export class StockWidget implements AfterViewInit {

    chartRef = viewChild<ElementRef<HTMLCanvasElement>>('chart')
    time = [
        `${new Date().getHours() - 1}:${String(new Date().getMinutes() - 1).padStart(2, '0')}`,
        `${new Date().getHours()}:${String(new Date().getMinutes()).padStart(2, '0')}`
    ];
    chartData = signal([125.5, 120.0]);
    chartEff = effect(() => {
        this.chart.data.datasets[0].data = this.chartData();
        this.chart.options.plugins.annotation.annotations.line.yMin = this.last();
        this.chart.options.plugins.annotation.annotations.line.yMax = this.last();
        this.chart.options.plugins.annotation.annotations.line.label.content = `${this.last()}`;
        if (this.time.length > 5) {
            this.chart.options.scales.y.max = this.max() + (0.5 * this.max());
            this.chart.options.scales.y.min = this.min() - (0.5 * this.max());
        }
        this.chart.update();
    })
    max = computed(() => Math.max(...this.chartData()));
    min = computed(() => Math.min(...this.chartData()));
    last = computed(() => this.chartData().at(-1));
    randomValue = computed(() => {
        const value = this.last()! + ((Math.random() * 20) - 10);
        return value < 0 ? 0 : parseFloat(value.toFixed(2));
    })
    open = computed(() => this.chartData()[0])
    diff = computed(() => parseFloat((this.last()! - this.open()).toFixed(2)))
    diffPercent = computed(() => (((this.diff() * 100) / this.open()).toFixed(2)))
    chart: any;

    ngOnInit() {
        //this.buildChart();
        setInterval(() => {
            this.time.push(`${String(new Date().getHours()).padStart(2, '0')}:${String(new Date().getMinutes()).padStart(2, '0')}`);
            this.chartData.update((val) => [...val, this.randomValue()]);
        }, 1000)
    }

    ngAfterViewInit(): void {
        this.buildChart();
    }

    buildChart() {
        this.chart = new Chart(this.chartRef()?.nativeElement!, {
            type: 'line',
            data: {
                labels: this.time,
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
                        min: Math.min(...this.chartData()) - 10,
                        max: Math.max(...this.chartData()) + 10,
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