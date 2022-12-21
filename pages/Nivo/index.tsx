import {ComponentProps, useMemo} from 'react'
import {AxisTickProps} from '@nivo/axes'
import {linearGradientDef} from '@nivo/core'
import {ResponsiveLine} from '@nivo/line'
import {ResponsivePie} from '@nivo/pie'

import Card from 'components/Card'
import useLineData from 'utils/useLineData'
import usePieData from 'utils/usePieData'
import withBenchmark from 'utils/withBenchmark'
import {INTEGRATION_COLOR_MAPPING} from 'utils/colors'

const commonLineProps: Partial<ComponentProps<typeof ResponsiveLine>> = {
    xScale: {
        type: 'point',
    },
    yScale: {
        type: 'linear',
        min: 'auto',
        max: 'auto',
        reverse: false,
    },
    margin: {bottom: 47, left: 40, right: 10, top: 10},
    axisBottom: {
        tickSize: 11,
        tickPadding: 0,
        tickRotation: 0,
        renderTick: ({value, x}: AxisTickProps<any>) => (
            <g transform={`translate(${x}, 0)`} style={{opacity: 1}}>
                <text
                    dominant-baseline="text-before-edge"
                    text-anchor="middle"
                    transform="translate(0,11) rotate(0)"
                    style={{
                        fontFamily: 'sans-serif',
                        fontSize: 11,
                        fill: 'rgb(51, 51, 51)',
                    }}
                >
                    {value}
                </text>
            </g>
        ),
    },
    axisLeft: {
        tickSize: 11,
        tickPadding: 0,
        tickRotation: 0,
        renderTick: ({value, y}: AxisTickProps<any>) => (
            <g transform={`translate(0,${y})`} style={{opacity: 1}}>
                <text
                    dominant-baseline="text-before-edge"
                    text-anchor="middle"
                    transform="translate(-11, -7) rotate(0)"
                    style={{
                        fontFamily: 'sans-serif',
                        fontSize: 11,
                        fill: 'rgb(51, 51, 51)',
                    }}
                >
                    {value}
                </text>
            </g>
        ),
    },
    enableGridX: false,
    enableArea: true,
    defs: [
        linearGradientDef('gradientA', [
            {offset: 5, color: 'inherit', opacity: 0.4},
            {offset: 95, color: 'inherit', opacity: 0},
        ]),
    ],
    fill: [{match: '*', id: 'gradientA'}],
    enableSlices: 'x',
    legends: [
        {
            anchor: 'bottom-right',
            direction: 'row',
            itemWidth: 90,
            itemHeight: 18,
            translateY: 48,
        },
    ],
}

const commonPieProps: Partial<ComponentProps<typeof ResponsivePie>> = {
    legends: [
        {
            anchor: 'bottom',
            direction: 'row',
            itemWidth: 90,
            itemHeight: 18,
            translateY: 32,
        },
    ],
    colors: {datum: 'data.color'},
    innerRadius: 0.55,
    activeOuterRadiusOffset: 8,
    margin: {bottom: 40, left: 40, right: 40, top: 40},
    enableArcLabels: false,
    enableArcLinkLabels: false,
}

function Nivo() {
    const lineData = useLineData()
    const pieData = usePieData()

    const formattedLineData = useMemo(() => {
        return lineData.data.data.lines.map((line) => {
            return {
                id: line.name,
                data: line.data.map((value, index) => {
                    return {
                        x: new Date(
                            lineData.data.data.axes.x[index]
                        ).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                        }),
                        y: value,
                    }
                }),
            }
        })
    }, [lineData])
    const tickValues = useMemo(() => {
        return formattedLineData.length === 0
            ? []
            : formattedLineData[0].data.reduce((acc, dataPoint, index) => {
                  if (index % 2 === 0) {
                      acc.push(dataPoint.x)
                  }
                  return acc
              }, [] as string[])
    }, [formattedLineData])
    const formattedPieData = useMemo(() => {
        return pieData.data.data.lines.map((line) => {
            const integrationKey = (line[0].value as string)
                .toLowerCase()
                .split(' ')
                .join('-')

            return {
                color: INTEGRATION_COLOR_MAPPING[integrationKey],
                id: line[0].value,
                value: line[1].value,
            }
        })
    }, [pieData])
    const percentageData = useMemo(() => {
        return pieData.data.data.lines.reduce((acc, line) => {
            acc[line[0].value] = line[2].value as number
            return acc
        }, {} as {[key: string]: number})
    }, [pieData])

    return (
        <div>
            <Card>
                <ResponsiveLine
                    {...commonLineProps}
                    data={formattedLineData}
                    axisBottom={{
                        ...commonLineProps.axisBottom,
                        tickValues,
                    }}
                />
            </Card>

            <Card>
                <ResponsivePie
                    {...commonPieProps}
                    data={formattedPieData}
                    tooltip={({datum: {id, value}}) => (
                        <div
                            style={{
                                padding: 12,
                                background: '#fff',
                            }}
                        >
                            <strong>{id}: </strong>
                            <span>{percentageData[id]}%</span>
                        </div>
                    )}
                />
            </Card>
        </div>
    )
}

export default withBenchmark(Nivo)
