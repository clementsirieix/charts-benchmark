import {useMemo} from 'react'
import {
    Area,
    AreaChart,
    CartesianGrid,
    Cell,
    Legend,
    Pie,
    PieChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from 'recharts'

import Card from 'components/Card'
import useLineData from 'utils/useLineData'
import usePieData from 'utils/usePieData'
import withBenchmark from 'utils/withBenchmark'
import {INTEGRATION_COLOR_MAPPING} from 'utils/colors'

const tickStyle = {
    color: '#6C6E79',
    fontSize: '12px',
}

function Recharts() {
    const lineData = useLineData()
    const pieData = usePieData()

    const formattedLineData = useMemo(() => {
        const indexedData: Record<string, unknown>[] =
            lineData.data.data.axes.x.map((x) => ({
                x: new Date(x).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                }),
            }))

        return {
            data: indexedData.map((dataPoint, index) => {
                lineData.data.data.lines.map((line) => {
                    dataPoint[line.name] = line.data[index]
                })
                return dataPoint
            }),
            keys: lineData.data.data.lines.map((line) => line.name),
        }
    }, [lineData])
    const formattedPieData = useMemo(() => {
        return pieData.data.data.lines.map((line) => {
            const integrationKey = (line[0].value as string)
                .toLowerCase()
                .split(' ')
                .join('-')

            return {
                color: INTEGRATION_COLOR_MAPPING[integrationKey],
                name: line[0].value,
                value: line[1].value,
                percentage: line[2].value,
            }
        })
    }, [pieData])

    return (
        <div>
            <Card>
                <ResponsiveContainer height="100%" width="100%">
                    <AreaChart
                        data={formattedLineData.data}
                        margin={{right: 16}}
                    >
                        <defs>
                            {formattedLineData.keys.map((key) => (
                                <linearGradient
                                    key={key}
                                    id={`gradient-${key}`}
                                    x1="0"
                                    y1="0"
                                    x2="0"
                                    y2="1"
                                >
                                    <stop
                                        offset="5%"
                                        stopColor={
                                            INTEGRATION_COLOR_MAPPING[key]
                                        }
                                        stopOpacity="0.4"
                                    ></stop>

                                    <stop
                                        offset="95%"
                                        stopColor={
                                            INTEGRATION_COLOR_MAPPING[key]
                                        }
                                        stopOpacity="0"
                                    ></stop>
                                </linearGradient>
                            ))}
                        </defs>

                        <XAxis
                            axisLine={{stroke: '#C4C7CF'}}
                            dataKey="x"
                            interval="preserveStartEnd"
                            tickLine={false}
                            tick={tickStyle}
                            tickMargin={16}
                            padding={{left: 10, right: 10}}
                            minTickGap={5}
                        />

                        <YAxis
                            axisLine={false}
                            tick={tickStyle}
                            tickLine={false}
                            tickMargin={16}
                        />

                        <CartesianGrid
                            horizontal={true}
                            stroke="#E0E1E9"
                            vertical={false}
                        />

                        <Tooltip
                            wrapperStyle={{outline: 'none'}}
                            cursor={{stroke: '#d1d5db', strokeWidth: 1}}
                            position={{y: 0}}
                        />

                        <Legend align="right" />

                        {formattedLineData.keys.map((key) => (
                            <Area
                                key={key}
                                dot={false}
                                type="linear"
                                dataKey={key}
                                stroke={INTEGRATION_COLOR_MAPPING[key]}
                                fillOpacity={1}
                                fill={`url(#gradient-${key})`}
                                strokeWidth={3}
                            />
                        ))}
                    </AreaChart>
                </ResponsiveContainer>
            </Card>

            <Card>
                <ResponsiveContainer height="100%" width="100%">
                    <PieChart>
                        <Pie
                            data={formattedPieData}
                            dataKey="value"
                            cx="50%"
                            cy="50%"
                            innerRadius="55%"
                            outerRadius="80%"
                            startAngle={90}
                            endAngle={-270}
                        >
                            {formattedPieData.map((item) => (
                                <Cell
                                    key={`cell-${item.name}`}
                                    fill={item.color}
                                />
                            ))}
                        </Pie>

                        <Tooltip
                            formatter={(value, name, props) =>
                                `${props.payload.percentage}%`
                            }
                            wrapperStyle={{outline: 'none'}}
                            cursor={{stroke: '#d1d5db', strokeWidth: 1}}
                        />

                        <Legend />
                    </PieChart>
                </ResponsiveContainer>
            </Card>
        </div>
    )
}

export default withBenchmark(Recharts)
