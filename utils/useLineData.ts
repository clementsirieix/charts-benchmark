export default function useLineData(count = 31) {
    const initialTime = 1663624800.0 - 86400000 * Math.floor(10 * Math.random())
    const x = Array.from({length: count}).map((u, i) => {
        return initialTime + 86400000 * i
    })
    const data = Array.from({length: 7}).map(() =>
        Array.from({length: count}).map(() => Math.floor(100 * Math.random()))
    )

    return {
        data: {
            label: 'Tickets created per channel per day',
            legend: {axes: {x: 'Creation date', y: 'Number of tickets'}},
            data: {
                axes: {
                    x: x,
                    y: [],
                },
                lines: [
                    {
                        name: 'aircall',
                        data: data[0],
                    },
                    {
                        name: 'chat',
                        data: data[1],
                    },
                    {
                        name: 'email',
                        data: data[2],
                    },
                    {
                        name: 'help-center',
                        data: data[3],
                    },
                    {
                        name: 'phone',
                        data: data[4],
                    },
                    {
                        name: 'sms',
                        data: data[5],
                    },
                    {
                        name: 'yotpo-review',
                        data: data[6],
                    },
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
