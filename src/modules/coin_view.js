import React, {useState} from 'react';
import {Line} from 'react-chartjs-2';
import {
    Chart as ChartJS,
    LineElement,
    CategoryScale,
    LinearScale,
    PointElement
} from 'chart.js';
import {CoinStatsAPI} from "./api_manager";
import {arrowDirection, positivePercentage, unixTimesptampToTime, widgetColor} from './utils';
import '../css/coin_view.css';
import '../css/animations.css';
import {MdClose} from 'react-icons/md';
import CurrencyFormat from "./currency_format";

const CoinView = ({coinInfo, onClose, showWindow}) => {
    const api = new CoinStatsAPI();
    const [chartsPeriod, setChartsPeriod] = useState('1w');
    const [charts, setCharts] = useState(null);
    const percentage1h = positivePercentage(coinInfo['priceChange1h']);
    const percentage1hColor = widgetColor(coinInfo['priceChange1h']);
    const percentage1hArrow = arrowDirection(percentage1hColor);
    const percentage1d = positivePercentage(coinInfo['priceChange1d']);
    const percentage1dColor = widgetColor(coinInfo['priceChange1d']);
    const percentage1dArrow = arrowDirection(percentage1dColor);
    const percentage1w = positivePercentage(coinInfo['priceChange1w']);
    const percentage1wColor = widgetColor(coinInfo['priceChange1w']);
    const percentage1wArrow = arrowDirection(percentage1wColor);

    const updateCharts = () => {
        api.getCoinCharts(coinInfo['id'], chartsPeriod).then(response => setCharts(response));
    }

    const changePeriod = (period) => {
        setChartsPeriod(period);
        updateCharts();
    }

    if (showWindow) {
        let lastKeyPressTime = 0;
        const delay = 500;
        const handleKeyDown = (event) => {
            const currentTime = new Date().getTime();
            if (event.key === 'Escape' && currentTime - lastKeyPressTime > delay) {
                onClose();
                lastKeyPressTime = currentTime;
            }
        };
        document.addEventListener('keydown', handleKeyDown);

        updateCharts();

        return (
            <div className={`coin-view-container`}>
                <div className={`coin-view-window`}>
                    <div className={`coin-view-top-bar`}>
                        <div className={`coin-view-top-bar-filler`}></div>
                        <div
                            className={`coin-view-top-bar-close-button`}
                            onClick={onClose}
                        >
                            <MdClose className={`coin-view-top-bar-close-button-icon`}/>
                        </div>
                    </div>
                    <div className={`coin-view-all-info-container`}>
                        <div className={`coin-view-base-info-container`}>
                            <div className={`coin-view-base-info-rank`}>
                                #{coinInfo['rank']}
                            </div>

                            <div className={`coin-view-base-info-icon-name-symbol-container`}>
                                <img
                                    className={`coin-view-base-info-icon`}
                                    src={coinInfo['icon']}
                                    alt={`coin-icon`}
                                />
                                <div className={`coin-view-base-info-icon-name-container`}>
                                    <div className={`coin-view-base-info-name`}>
                                        {coinInfo['name']}
                                    </div>
                                    <div className={`coin-view-base-info-symbol`}>
                                        ▸ {coinInfo['symbol']}
                                    </div>
                                </div>
                            </div>

                            <div className={`coin-view-base-info-price`}>
                                <CurrencyFormat value={coinInfo['price']}/>
                            </div>
                            <div className={`coin-view-base-info-price-btc`}>
                                <CurrencyFormat
                                    value={coinInfo['priceBtc']}
                                    currency={'BTC '}
                                />
                            </div>

                            <div className={`coin-view-base-info-percentage-container`}>
                                <div className={`coin-view-base-info-percentage-block`}>
                                    <div className={`coin-view-base-info-percentage-text`}>
                                        1h %
                                    </div>
                                </div>
                                <div className={`coin-view-base-info-percentage-block`}>
                                    1d %
                                </div>
                                <div className={`coin-view-base-info-percentage-block`}>
                                    1w %
                                </div>
                            </div>

                            <div className={`coin-view-base-info-percentage-container`}>
                                <div className={`coin-view-base-info-percentage-block ${percentage1hColor}`}>
                                    <img
                                        className={`coin-view-base-info-percentage-arrow`}
                                        src={percentage1hArrow}
                                        alt={`arrow`}
                                    />
                                    <div className={`coin-view-base-info-percentage-text ${percentage1hColor}`}>
                                        {`${percentage1h}%`}
                                    </div>
                                </div>

                                <div className={`coin-view-base-info-percentage-block ${percentage1dColor}`}>
                                    <img
                                        className={`coin-view-base-info-percentage-arrow`}
                                        src={percentage1dArrow}
                                        alt={`arrow`}
                                    />
                                    <div className={`coin-view-base-info-percentage-text ${percentage1dColor}`}>
                                        {`${percentage1d}%`}
                                    </div>
                                </div>

                                <div className={`coin-view-base-info-percentage-block ${percentage1wColor}`}>
                                    <img
                                        className={`coin-view-base-info-percentage-arrow`}
                                        src={percentage1wArrow}
                                        alt={`arrow`}
                                    />
                                    <div className={`coin-view-base-info-percentage-text ${percentage1wColor}`}>
                                        {`${percentage1w}%`}
                                    </div>
                                </div>
                            </div>


                            <div className={`coin-view-base-info-MV-container alt`}>
                                <div className={`coin-view-base-info-MV-value alt`}>
                                    Market Cap
                                </div>
                                <div className={`coin-view-base-info-MV-value alt`}>
                                    Volume 24h
                                </div>
                            </div>
                            <div className={`coin-view-base-info-MV-container`}>
                                <div className={`coin-view-base-info-MV-value`}>
                                    <CurrencyFormat
                                        value={coinInfo['marketCap']}
                                        dividerChar={`B`}
                                    />
                                </div>
                                <div className={`coin-view-base-info-MV-value`}>
                                    <CurrencyFormat
                                        value={coinInfo['volume']}
                                        dividerChar={`M`}
                                    />
                                </div>
                            </div>

                            <div className={`coin-view-base-info-supply-text`}>
                                Supply
                            </div>
                            <div className={`coin-view-base-info-supply-subtext`}>
                                {coinInfo['availableSupply']} / {coinInfo['totalSupply']}
                            </div>
                        </div>
                        <div className={`coin-view-graph-info-container`}>
                            <div className={`coin-view-graph-period-container`}>
                                24h 1w 1m 3m 1y all
                            </div>
                            <div className={`coin-view-graph-info`}>
                                <PriceChart rawData={charts}/>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
};

const PriceChart = ({rawData}) => {
    const chartTimePoints = [];
    const chartPricePoints = [];

    for (const i in rawData) {
        const chartPoint = rawData[i];
        chartTimePoints.push(unixTimesptampToTime(chartPoint[0]));
        chartPricePoints.push(chartPoint[1]);
    }

    const firstChartPricePoint = chartPricePoints[0]
    const lastChartPricePoint = chartPricePoints[chartPricePoints.length - 1]
    const color = (firstChartPricePoint <= lastChartPricePoint) ? 'green' : 'red';

    const data = {
        labels: chartTimePoints,
        datasets: [{
            data: chartPricePoints,
            backgroundColor: '#121212',
            borderColor: color,
            fill: false,
            tension: 0,
            borderWidth: 3,
            pointRadius: 0,
            pointHoverRadius: 5,
        }]
    };

    const options = {
        maintainAspectRatio: false,
        aspectRatio: 2,
        hover: {
            mode: 'index',
            intersect: false
        },
        scales: {
            x: {display: false},
            y: {display: false}
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

export default CoinView;