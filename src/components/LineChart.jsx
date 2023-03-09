import React, { PureComponent, memo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import SelectOpt from './SelectOpt';

class LinePlot extends PureComponent {

    constructor(props) {
        super(props)

        const { data, stats, numericalFeatures } = props

        this.handleChangeX = this.handleChangeX.bind(this);
        this.handleChangeY = this.handleChangeY.bind(this);

        this.state = {
            x: numericalFeatures[0],
            y: numericalFeatures[1],
            minX: Math.floor(stats[numericalFeatures[0]].min),
            maxX: stats[numericalFeatures[0]].max,
            minY: Math.floor(stats[numericalFeatures[1]].min),
            maxY: stats[numericalFeatures[1]].max
        };
    }

    componentDidUpdate(prevProps) {
        if (prevProps.numericalFeatures !== this.props.numericalFeatures) {
            const { stats, numericalFeatures } = this.props;

            this.setState({
                x: numericalFeatures[0],
                y: numericalFeatures[1],
                minX: Math.floor(stats[numericalFeatures[0]].min),
                maxX: Math.round(stats[numericalFeatures[0]].max),
                minY: Math.floor(stats[numericalFeatures[1]].min),
                maxY: Math.round(stats[numericalFeatures[1]].max),
            });
        }
    }

    handleChangeX = (e) => {
        console.log('x changed')

        this.setState({
            x: e.target.value,
            minX: Math.floor(this.props.stats[e.target.value].min),
            maxX: Math.ceil(this.props.stats[e.target.value].max),
        })
    }

    handleChangeY = (e) => {
        console.log('y changed')
        this.setState({
            y: e.target.value,
            minY: Math.floor(this.props.stats[e.target.value].min),
            maxY: Math.ceil(this.props.stats[e.target.value].max),
        })
    }

    render() {
        const { minX, maxX, minY, maxY } = this.state

        return (
            <div className='rounded-[1.5em] flex-col pt-4 pb-4 w-[100%] mt-2 animate-fade-in-up'>
                <div className="aspect-w-1 aspect-h-1">
                    <ResponsiveContainer width="100%" aspect={1.5}>
                        <LineChart
                            margin={{
                                top: 20,
                                right: 20,
                                bottom: 20,
                                left: 20,
                            }}
                        >
                            <CartesianGrid />
                            <XAxis domain={[minX, maxX]} type="number" dataKey={this.state.x} name={this.state.x} label={{ value: this.state.x, position: 'bottom' }} />
                            <YAxis domain={[minY, maxY]} type="number" dataKey={this.state.y} name={this.state.y} label={{ value: this.state.y, angle: -90, position: 'insideLeft' }} />
                            <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                            <Line type="monotone" data={this.props.data} dataKey={this.state.y} stroke="#8884d8" activeDot={{ r: 8 }} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>

                <div className='flex justify-center mt-3 gap-3'>
                    <SelectOpt
                        features={this.props.numericalFeatures}
                        onChangeFeature={this.handleChangeX}
                        initialValue={this.state.x}
                        label='X : '
                    />
                    <SelectOpt
                        features={this.props.numericalFeatures}
                        onChangeFeature={this.handleChangeY}
                        initialValue={this.state.y}
                        label='Y : '
                    />
                </div>
            </div>
        );
    }
}
export default LinePlot;
