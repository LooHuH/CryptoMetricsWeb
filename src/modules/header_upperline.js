import React from 'react';
import {CoinStatsAPI, getGasPrices} from './api_manager';
import CurrencyFormat from './currency_format';
import {dataLoaded, positivePercentage, widgetColor, arrowDirection} from './utils';
import '../css/header_uppperline.css';
import '../css/animations.css';
import { FaGasPump } from 'react-icons/fa';

class UpperLine extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            marketsData: null,
            meta: null,
            ethGas: null,
            baseFeePerGas: null
        };
    };

    async componentDidMount() {
        try {
            const api = new CoinStatsAPI();
            const [
                marketsData,
                { meta },
                ethGas
            ] = await Promise.all([
                api.getMarkets(),
                api.getCoins(1),
                getGasPrices()]);
            const baseFeePerGas = ethGas['blockPrices'][0]['baseFeePerGas'];
            this.setState({
                marketsData: marketsData,
                meta: meta,
                ethGas : ethGas,
                baseFeePerGas: baseFeePerGas
            });
        }
        catch (error) {
            console.error(error);
        }
    };

    render() {
        const { meta, marketsData, baseFeePerGas } = this.state;
        const data = [meta, marketsData, baseFeePerGas];

        return (
            <div>
                <div className={`info-bar ${dataLoaded(data) ? '' : 'hidden'}`}>
                    <div className='labels-info-header'>
                        Currencies
                    </div>
                    <div className={`item-info`}>
                        {meta && meta['itemCount']}
                    </div>
                    <div className='labels-info-header'>
                        Market Cap
                    </div>
                    <div className={`item-info`}>
                        {marketsData &&
                            <CurrencyFormat
                                value={marketsData['marketCap']}
                                dividerChar={`T`}
                            />}
                    </div>
                    <MVDTileSmall
                        data={marketsData}
                        changePercentage={`marketCapChange`}
                    />
                    <div className='labels-info-header'>
                        BTC Dominance
                    </div>
                    <div className={`item-info`}>
                        {marketsData && `${marketsData['btcDominance']} %`}
                    </div>
                    <MVDTileSmall
                        data={marketsData}
                        changePercentage={`btcDominanceChange`}
                    />
                    <FaGasPump className={`gas-icon`}/>
                    <div className='labels-info-header'>
                        ETH Gas
                    </div>
                    <div className={`item-info`}>
                        {baseFeePerGas && `${baseFeePerGas.toString().slice(0, 3)} Gwei`}
                    </div>
                </div>
            </div>
        );
    }
}

const MVDTileSmall = ({ data, changePercentage }) => {
    const percentage = data && data[changePercentage];
    const color =  widgetColor(percentage);
    const arrow =  arrowDirection(color);

    return (
        dataLoaded([percentage]) ?
            <div className={`MD-percentage-block`}>
                <img
                    className={`MD-percentage-arrow-header`}
                    src={arrow}
                    alt={`arrow`}
                />
                <div className={`MD-percentage-text-header ${color}`}>
                    {`${positivePercentage(percentage)}%`}
                </div>
            </div>
            :
            null
    );
}

export default UpperLine;