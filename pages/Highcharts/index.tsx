import {useMemo} from 'react'
import HighchartsCore, {Options} from 'highcharts'
import HighchartsReact from 'highcharts-react-official'

import Card from 'components/Card'
import useLineData from 'utils/useLineData'
import usePieData from 'utils/usePieData'
import withBenchmark from 'utils/withBenchmark'
import {INTEGRATION_COLOR_MAPPING} from 'utils/colors'

const baseLineOptions: Options = {
    chart: {
        type: 'area',
    },
    title: {
        text: '',
    },
    credits: {
        enabled: false,
    },
    tooltip: {
        shared: true,
        enabled: true,
    },
    xAxis: {
        crosshair: {
            snap: true,
        },
        labels: {
            format: '{value:%e %b}',
        },
        tickLength: 0,
        tickPixelInterval: 30,
        type: 'datetime',
    },
    yAxis: {
        title: {
            text: '',
        },
        endOnTick: false,
        maxPadding: 0.05,
        labels: {
            x: -4,
        },
    },
}

const basePieOptions: Options = {
    chart: {
        type: 'pie',
    },
    title: {
        text: '',
    },
    credits: {
        enabled: false,
    },
    plotOptions: {
        pie: {
            events: {
                mouseOver: function (event: PointerEvent) {
                    console.warn(this.update)
                },
            },
            states: {hover: {halo: {size: 0}}},
        },
    },
    legend: {
        enabled: true,
        itemMarginTop: 20,
    },
}

function Highcharts() {
    const lineData = useLineData()
    const pieData = usePieData()

    const formattedLineData = useMemo(() => {
        return lineData
    }, [lineData])
    const formattedPieData = useMemo(() => {
        return pieData
    }, [pieData])

    const lineOptions = useMemo<Options>(() => {
        return {
            ...baseLineOptions,
            series: formattedLineData.data.data.lines.map((line) => ({
                fillColor: {
                    linearGradient: {
                        x1: 0,
                        x2: 0,
                        y1: 0,
                        y2: 1,
                    },
                    stops:
                        HighchartsCore && HighchartsCore.color
                            ? ([
                                  [
                                      0.5,
                                      HighchartsCore.color(
                                          INTEGRATION_COLOR_MAPPING[line.name]
                                      )
                                          .setOpacity(0.4)
                                          .get('rgba'),
                                  ],
                                  [
                                      0.95,
                                      HighchartsCore.color(
                                          INTEGRATION_COLOR_MAPPING[line.name]
                                      )
                                          .setOpacity(0)
                                          .get('rgba'),
                                  ],
                              ] as any)
                            : [],
                },
                findNearestPointBy: 'xy',
                color: INTEGRATION_COLOR_MAPPING[line.name],
                data: line.data.map((value, index) => ({
                    x: formattedLineData.data.data.axes.x[index],
                    y: value,
                })),
                name: line.name,
                type: 'area',
                marker: {
                    enabled: false,
                    states: {
                        hover: {
                            enabled: true,
                        },
                    },
                    symbol: 'circle',
                    zIndex: 100000,
                },
            })),
        }
    }, [formattedLineData])
    const pieOptions = useMemo<Options>(() => {
        return {
            ...basePieOptions,
            series: [
                {
                    data: formattedPieData.data.data.lines.map((value) => {
                        const integrationKey = (value[0].value as string)
                            .toLowerCase()
                            .split(' ')
                            .join('-')
                        return {
                            color: INTEGRATION_COLOR_MAPPING[integrationKey],
                            name: value[0].value,
                            y: value[1].value as number,
                        }
                    }),
                    type: 'pie',
                    innerSize: '70%',
                    dataLabels: {
                        enabled: false,
                    },
                    // size: 400,
                    showInLegend: true,
                },
            ],
        }
    }, [formattedPieData])

    return (
        <div>
            <Card>
                <HighchartsReact
                    containerProps={{style: {height: '100%', width: '100%'}}}
                    highcharts={HighchartsCore}
                    options={lineOptions}
                />
            </Card>

            <Card>
                <HighchartsReact
                    containerProps={{style: {height: '100%', width: '100%'}}}
                    highcharts={HighchartsCore}
                    options={pieOptions}
                />
            </Card>
        </div>
    )
}

export default withBenchmark(Highcharts)
