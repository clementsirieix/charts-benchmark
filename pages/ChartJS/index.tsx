import {
    Chart,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    ArcElement,
    Filler,
    Legend,
    Tooltip,
} from 'chart.js'
import {ComponentProps, useMemo, useState} from 'react'
import {Doughnut, Line} from 'react-chartjs-2'

import Card from 'components/Card'
import {INTEGRATION_COLOR_MAPPING} from 'utils/colors'
import useLineData from 'utils/useLineData'
import usePieData from 'utils/usePieData'
import withBenchmark from 'utils/withBenchmark'
import {ChartJSOrUndefined} from 'react-chartjs-2/dist/types'

Chart.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    ArcElement,
    Filler,
    Legend,
    Tooltip
)

const lineChartOptions: ComponentProps<typeof Line>['options'] = {
    maintainAspectRatio: false,
    responsive: true,
    interaction: {
        mode: 'index' as const,
        intersect: false,
    },
    elements: {
        point: {
            radius: 0,
        },
    },
    scales: {
        x: {
            grid: {
                display: false,
            },
        },
        y: {
            grid: {
                color: '#E0E1E9',
                drawBorder: false,
                drawTicks: false,
            },
            ticks: {
                padding: 16,
            },
        },
    },
}

const doughnutChartOptions: ComponentProps<typeof Doughnut>['options'] = {
    maintainAspectRatio: false,
    responsive: true,
}

function ChartJS() {
    const [lineChart, setLineChart] = useState<ChartJSOrUndefined<
        'line',
        number[],
        string
    > | null>()
    const lineData = useLineData()
    const pieData = usePieData()

    const formattedLineData = useMemo(() => {
        if (!lineChart) {
            return {
                datasets: [],
            }
        }

        return {
            labels: lineData.data.data.axes.x.map((label) =>
                new Date(label).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                })
            ),
            datasets: lineData.data.data.lines.map((line) => {
                const decimalColor = parseInt(
                    INTEGRATION_COLOR_MAPPING[line.name]?.slice(1),
                    16
                )
                const {bottom, left, top} = lineChart?.chartArea || {
                    bottom: 0,
                    left: 0,
                    right: 0,
                    top: 0,
                }
                const gradient = lineChart?.ctx.createLinearGradient(
                    left,
                    top,
                    left,
                    bottom
                )
                gradient?.addColorStop(
                    0.05,
                    `rgba(${(decimalColor >> 16) & 255}, ${
                        (decimalColor >> 8) & 255
                    }, ${decimalColor & 255}, 0.4)`
                )
                gradient?.addColorStop(
                    0.95,
                    `rgba(${(decimalColor >> 16) & 255}, ${
                        (decimalColor >> 8) & 255
                    }, ${decimalColor & 255}, 0)`
                )

                return {
                    backgroundColor: gradient,
                    borderColor: INTEGRATION_COLOR_MAPPING[line.name],
                    fill: 'stack',
                    label: line.name,
                    data: line.data,
                }
            }),
        }
    }, [lineData, lineChart])
    const formattedPieData = useMemo(() => {
        return {
            labels: pieData.data.data.lines.map((line) => line[0].value),
            datasets: [
                {
                    data: pieData.data.data.lines.map((line) => line[1].value),
                    backgroundColor: pieData.data.data.lines.map(
                        (line) =>
                            INTEGRATION_COLOR_MAPPING[
                                (line[0].value as string)
                                    .toLowerCase()
                                    .split(' ')
                                    .join('-')
                            ]
                    ),
                    borderColor: 'white',
                },
            ],
        }
    }, [pieData])

    return (
        <div>
            <Card>
                <Line
                    data={formattedLineData}
                    options={lineChartOptions}
                    ref={setLineChart}
                />
            </Card>

            <Card>
                <Doughnut
                    data={formattedPieData}
                    options={doughnutChartOptions}
                />
            </Card>
        </div>
    )
}

export default withBenchmark(ChartJS)
