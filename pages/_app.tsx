import classnames from 'classnames'
import type {AppProps} from 'next/app'
import Head from 'next/head'
import Link from 'next/link'
import {useRouter} from 'next/router'
import 'wingcss'

import 'styles/globals.css'

export default function App({Component, pageProps}: AppProps) {
    const {pathname} = useRouter()

    return (
        <>
            <Head>
                <title>Chart benchmark</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <div className="nav horizontal-align">
                <div className="nav-logo">Chart benchmark</div>

                <Link
                    className={classnames('nav-item', {
                        isActive: pathname === '/ChartJS',
                    })}
                    href="/ChartJS"
                >
                    ChartJS
                </Link>

                <Link
                    className={classnames('nav-item', {
                        isActive: pathname === '/Recharts',
                    })}
                    href="/Recharts"
                >
                    Recharts
                </Link>

                <Link
                    className={classnames('nav-item', {
                        isActive: pathname === '/Nivo',
                    })}
                    href="/Nivo"
                >
                    Nivo
                </Link>
            </div>

            <Component {...pageProps} />
        </>
    )
}
