import React, {useState} from 'react';
import {Line} from 'react-chartjs-2';
import {
    Chart as ChartJS,
    LineElement,
    CategoryScale,
    LinearScale,
    PointElement
} from 'chart.js';
import DownOnBoard from './modules/downonboard';
import CoinView from './modules/coin_view';
import {CoinStatsAPI} from './modules/api_manager';
import CurrencyFormat from './modules/currency_format';
import {dataLoaded, positivePercentage, widgetColor, arrowDirection} from './modules/utils';
import './css/home.css';
import './css/loading.css';


class Home extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            marketsData: null,
            coinsData: null,
            coinsCharts: {}
        };
    }

    async componentDidMount() {
        try {
            const api = new CoinStatsAPI();
            const [
                marketsData,
                coinsData
            ] = await Promise.all([
                api.getMarkets(),
                api.getCoins(1000, true)]
            );
            const coinsCharts = {};
            const requests = [];

            for (const i in coinsData.slice(0, 100)) {
                const coinId = coinsData[i]['id'];
                requests.push(api.getCoinCharts(coinId, '1w'));
            }
            const resultsOnPage = await Promise.all(requests);
            for (const i in resultsOnPage) {
                const coinId = coinsData[i]['id'];
                coinsCharts[coinId] = resultsOnPage[i];
            }
            this.setState({
                marketsData: marketsData,
                coinsData: coinsData,
                coinsCharts: coinsCharts
            });

            // for (const i in coinsData.slice(100)) {
            //     const coinId = coinsData[i]['id'];
            //     requests.push(api.getCoinCharts(coinId, '1w'));
            // }
            // const resultsOther = await Promise.all(requests);
            // for (const i in resultsOther) {
            //     const coinId = coinsData[i]['id'];
            //     coinsCharts[coinId] = resultsOther[i];
            // }
            // this.setState({
            //     coinsCharts: coinsCharts
            // });
        }
        catch (error) {
            console.error(error);
        }
    }

    render() {
        const marketsData = this.state.marketsData;
        const coinsData = this.state.coinsData;
        const coinsCharts = this.state.coinsCharts;
        const data = [marketsData, coinsData, coinsCharts];

        return (
            <div>
                {dataLoaded(data) ? (
                    <div>
                        <div className={`main-preblock`}>
                            <div className={`main-container`}>
                                <div className={`main-left-side`}>
                                    <h1 className={`main-text`}>
                                        Daily Crypto Market Update
                                    </h1>
                                    <h2 className={`main-subtext`}>
                                        Today's Crypto Prices by Market Cap.
                                    </h2>
                                </div>

                                <div className={`main-right-side`}>
                                    <MVTile
                                        data={marketsData}
                                        label={`Market Cap`}
                                        value={`marketCap`}
                                        changePercentage={`marketCapChange`}
                                    />
                                    <MVTile
                                        data={marketsData}
                                        label={`Volume 24h`}
                                        value={`volume`}
                                        changePercentage={`volumeChange`}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className={`coins-container`}>
                            <div className={`coins-block`}>
                                <div className={`coins-list-tile alt`}>
                                    <div className={`coins-list-coin-rank alt`}>
                                        #
                                    </div>

                                    <div className={`coins-list-coin-base-info-container`}>
                                        <div className={`coins-list-coin-name alt`}>
                                            Name
                                        </div>
                                    </div>

                                    <div className={`coins-list-coin-percentage-container`}>
                                        <div className={`coins-list-coin-percentage-block alt`}>
                                            1h %
                                        </div>
                                        <div className={`coins-list-coin-percentage-block alt`}>
                                            1d %
                                        </div>
                                        <div className={`coins-list-coin-percentage-block alt`}>
                                            1w %
                                        </div>
                                    </div>

                                    <div className={`coins-list-coin-PMV-container`}>
                                        <div className={`coins-list-coin-PMV-value`}>
                                            Price
                                        </div>
                                        <div className={`coins-list-coin-PMV-value`}>
                                            Market Cap
                                        </div>
                                        <div className={`coins-list-coin-PMV-value`}>
                                            Volume 24h
                                        </div>
                                    </div>

                                    <div className={`coins-list-coin-charts-container`}>
                                        <div className={`coins-list-coin-charts`}>
                                            Price Charts (7d)
                                        </div>
                                    </div>
                                </div>
                                <div className={`coins-list-separator`}></div>

                                <CoinsTiles
                                    data={{
                                        coins: coinsData.slice(0, 100),
                                        coinsCharts: coinsCharts
                                    }}
                                />
                            </div>
                        </div>
                        <DownOnBoard/>
                    </div>)
                    :
                    <div className={`loading-bg`}>
                        <div className={`loading-anim`}></div>
                    </div>
                }
            </div>
        );
    }
}

const MVTile = ({data, label, value, changePercentage, percentType}) => {
    const percentage = data[changePercentage];
    const color = widgetColor(percentage);
    const arrow = arrowDirection(color);

    return (
        <div
            className={`MV-block ${color}`}
        >
            <div className={`MV-label-percentage`}>
                <div className={`MV-label`}>
                    {label}
                </div>

                <div
                    className={`MV-percentage-background ${color}`}
                >
                    <img
                        className={`MV-percentage-arrow`}
                        src={arrow}
                        alt={`arrow`}
                    ></img>
                    <div
                        className={`MV-percentage-text ${color}`}
                    >
                        {`${positivePercentage(percentage)}%`}
                    </div>
                </div>
            </div>
            <div className='MV-value'>
                {percentType ?
                    `${data[value]}%`
                    :
                    <CurrencyFormat value={data[value]} />}
            </div>
        </div>
    );
};

const CoinsTiles = ({data}) => {
    let tiles = [];
    for (const i in data.coins) {
        const coinInfo = data.coins[i];
        const coinCharts = data.coinsCharts[coinInfo['id']];
        tiles.push(
            <CoinTile
                data={{
                    coinInfo: coinInfo,
                    coinCharts: coinCharts
                }}
                key={coinInfo['id']}
            />
        );
    }
    return tiles;
};

const CoinTile = ({data}, key) => {
    const coinInfo = data.coinInfo;
    const coinCharts = data.coinCharts;
    const percentage1h = positivePercentage(coinInfo['priceChange1h']);
    const percentage1hColor = widgetColor(coinInfo['priceChange1h']);
    const percentage1hArrow = arrowDirection(percentage1hColor);
    const percentage1d = positivePercentage(coinInfo['priceChange1d']);
    const percentage1dColor = widgetColor(coinInfo['priceChange1d']);
    const percentage1dArrow = arrowDirection(percentage1dColor);
    const percentage1w = positivePercentage(coinInfo['priceChange1w']);
    const percentage1wColor = widgetColor(coinInfo['priceChange1w']);
    const percentage1wArrow = arrowDirection(percentage1wColor);

    const [coinViewWindowOpened, setCoinViewWindowOpened] = useState(false);

    const showCoinViewWindow = () => {
        setCoinViewWindowOpened(true);
    }

    const hideCoinViewWindow = () => {
        setCoinViewWindowOpened(false);
    }

    return (
        <div>
            <CoinView
                coinInfo={coinInfo}
                onClose={hideCoinViewWindow}
                showWindow={coinViewWindowOpened}
            />
            <div
                className={`coins-list-tile`}
                onClick={showCoinViewWindow}
                key={key}
            >
                <div className={`coins-list-coin-rank`}>
                    {coinInfo['rank']}
                </div>

                <div className={`coins-list-coin-base-info-container`}>
                    <img
                        className={`coins-list-coin-icon`}
                        src={coinInfo['icon']}
                        alt={`coin-icon`}
                    />
                    <div className={`coins-list-coin-name`}>
                        {coinInfo['name']}
                    </div>
                    <div className={`coins-list-coin-symbol`}>
                        ▸ {coinInfo['symbol']}
                    </div>
                </div>

                <div className={`coins-list-coin-percentage-container`}>
                    <div className={`coins-list-coin-percentage-block ${percentage1hColor}`}>
                        <img
                            className={`coins-list-info-percentage-arrow`}
                            src={percentage1hArrow}
                            alt={`arrow`}
                        />
                        <div className={`coins-list-coin-percentage-text ${percentage1hColor}`}>
                            {`${percentage1h}%`}
                        </div>
                    </div>

                    <div className={`coins-list-coin-percentage-block ${percentage1dColor}`}>
                        <img
                            className={`coins-list-info-percentage-arrow`}
                            src={percentage1dArrow}
                            alt={`arrow`}
                        />
                        <div className={`coins-list-coin-percentage-text ${percentage1dColor}`}>
                            {`${percentage1d}%`}
                        </div>
                    </div>

                    <div className={`coins-list-coin-percentage-block ${percentage1wColor}`}>
                        <img
                            className={`coins-list-info-percentage-arrow`}
                            src={percentage1wArrow}
                            alt={`arrow`}
                        />
                        <div className={`coins-list-coin-percentage-text ${percentage1wColor}`}>
                            {`${percentage1w}%`}
                        </div>
                    </div>
                </div>

                <div className={`coins-list-coin-PMV-container`}>
                    <div className={`coins-list-coin-PMV-value`}>
                        <CurrencyFormat value={coinInfo['price']}/>
                    </div>
                    <div className={`coins-list-coin-PMV-value`}>
                        <CurrencyFormat
                            value={coinInfo['marketCap']}
                            dividerChar={`B`}
                        />
                    </div>
                    <div className={`coins-list-coin-PMV-value`}>
                        <CurrencyFormat
                            value={coinInfo['volume']}
                            dividerChar={`M`}
                        />
                    </div>
                </div>

                <div className={`coins-list-coin-charts-container`}>
                    <div className={`coins-list-coin-charts`}>
                        <MiniPriceChart
                            rawData={coinCharts}
                            color={percentage1wColor}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

const MiniPriceChart = ({rawData, color}) => {
    const chartTimePoints = [];
    const chartPricePoints = [];

    for (const i in rawData) {
        const chartPoint = rawData[i];
        chartTimePoints.push(chartPoint[0]);
        chartPricePoints.push(chartPoint[1]);
    }

    const data = {
        labels: chartTimePoints,
        datasets: [{
            data: chartPricePoints,
            backgroundColor: '#121212',
            borderColor: color,
            fill: false,
            tension: 0,
            borderWidth: 1,
            pointRadius: 0
        }]
    };

    const options = {
        maintainAspectRatio: false,
        aspectRatio: 2,
        elements: {
            point: {
                radius: 0,
                hoverRadius: 0
            }
        },
        scales: {
            x: {
                display: false,
                min: chartTimePoints[0],
                max: chartTimePoints[-1]
            },
            y: {
                display: false,
                min: Math.min(...chartPricePoints),
                max: Math.max(...chartPricePoints)
            }
        },
        plugins: {
            legend: false
        }
    };

    ChartJS.register(
        LineElement,
        CategoryScale,
        LinearScale,
        PointElement
    );

    return (
        <Line
            data={data}
            options={options}
        />
    );
};

export default Home;