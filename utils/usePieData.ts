export default function usePieData() {
    const total = Math.floor(Math.random() * 1000)
    let currentSum = 0
    const data = Array.from({length: 7}).map(() => {
        const nextValue = Math.floor(Math.random() * (total - currentSum))
        currentSum += nextValue
        return nextValue
    })

    return {
        data: {
            label: 'Tickets created per channel',
            data: {
                axes: {
                    x: [
                        {name: 'Channel', type: 'string'},
                        {name: 'Total', type: 'number'},
                        {name: 'Percentage', type: 'percent'},
                    ],
                },
                lines: [
                    [
                        {type: 'string', value: 'Aircall'},
                        {type: 'number', value: data[0]},
                        {
                            type: 'percent',
                            value: Math.floor((data[0] / total) * 100),
                        },
                    ],
                    [
                        {type: 'string', value: 'Chat'},
                        {type: 'number', value: data[1]},
                        {
                            type: 'percent',
                            value: Math.floor((data[1] / total) * 100),
                        },
                    ],
                    [
                        {type: 'string', value: 'Email'},
                        {type: 'number', value: data[2]},
                        {
                            type: 'percent',
                            value: Math.floor((data[2] / total) * 100),
                        },
                    ],
                    [
                        {type: 'string', value: 'Help Center'},
                        {type: 'number', value: data[3]},
                        {
                            type: 'percent',
                            value: Math.floor((data[3] / total) * 100),
                        },
                    ],
                    [
                        {type: 'string', value: 'Phone'},
                        {type: 'number', value: data[4]},
                        {
                            type: 'percent',
                            value: Math.floor((data[4] / total) * 100),
                        },
                    ],
                    [
                        {type: 'string', value: 'Sms'},
                        {type: 'number', value: data[5]},
                        {
                            type: 'percent',
                            value: Math.floor((data[5] / total) * 100),
                        },
                    ],
                    [
                        {type: 'string', value: 'Yotpo Review'},
                        {type: 'number', value: data[6]},
                        {
                            type: 'percent',
                            value: Math.floor((data[6] / total) * 100),
                        },
                    ],
                ],
            },
        },
        meta: {
            end_datetime: '2022-10-19T23:59:59+02:00',
            previous_end_datetime: '2022-09-19T23:59:59+02:00',
            previous_start_datetime: '2022-08-21T00:00:00+02:00',
            start_datetime: '2022-09-20T00:00:00+02:00',
        },
    }
}
