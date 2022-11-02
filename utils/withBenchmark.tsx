import {ComponentType, useRef, useState} from 'react'
import {
    Benchmark,
    BenchmarkRef,
    BenchResultsType,
} from 'react-component-benchmark'

export default function withBenchmark(Component: ComponentType) {
    return function WrappedComponent() {
        const mountBenchmarkRef = useRef<BenchmarkRef>()
        const updateBenchmarkRef = useRef<BenchmarkRef | undefined>()
        const [mountResults, setMountResults] = useState<BenchResultsType>()
        const [updateResults, setUpdateResults] = useState<BenchResultsType>()

        return (
            <div>
                <div className="row horizontal-align">
                    <h3>Rendered test</h3>
                </div>

                <Component />

                <div className="row horizontal-align">
                    <h3>Benchmark</h3>
                </div>

                <div className="row horizontal-align">
                    <button
                        onClick={() => {
                            mountBenchmarkRef.current?.start()
                            updateBenchmarkRef.current?.start()
                        }}
                    >
                        Start
                    </button>
                </div>

                <div style={{display: 'none'}}>
                    <Benchmark
                        component={Component}
                        onComplete={setMountResults}
                        ref={mountBenchmarkRef as any}
                        samples={300}
                        timeout={10000}
                        type="mount"
                        includeLayout
                    />
                </div>

                <div style={{display: 'none'}}>
                    <Benchmark
                        component={Component}
                        onComplete={setUpdateResults}
                        ref={updateBenchmarkRef as any}
                        samples={300}
                        timeout={10000}
                        type="update"
                        includeLayout
                    />
                </div>

                {mountResults && (
                    <div className="horizontal-align">
                        <div>
                            <h4>Mounting results</h4>

                            <ul>
                                <li>{mountResults.runTime.toFixed(4)}ms</li>
                                <li>{mountResults.sampleCount} samples</li>
                                <li>
                                    Median {mountResults.median.toFixed(4)}ms
                                </li>
                            </ul>
                        </div>
                    </div>
                )}
                {updateResults && (
                    <div className="horizontal-align">
                        <div>
                            <h4>Update results</h4>

                            <ul>
                                <li>{updateResults.runTime.toFixed(4)}ms</li>
                                <li>{updateResults.sampleCount} samples</li>
                                <li>
                                    Median {updateResults.median.toFixed(4)}ms
                                </li>
                            </ul>
                        </div>
                    </div>
                )}
            </div>
        )
    }
}
