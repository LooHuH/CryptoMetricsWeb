import React, {useState} from "react";
import {Link} from "react-router-dom";
import {CoinStatsAPI} from "./modules/api_manager";
import DownOnBoard from "./modules/downonboard";
import "./css/convert.css";
import "./css/animations.css";
import {IoIosArrowDown} from "react-icons/io";

const MenuItem = ({active, title, url}) => {
    return (
        <Link className={`swap-menu-item ${active ? "active" : ""}`} to={url}>
            {title}
            <div className={`swap-menu-item-underline ${active ? "active" : ""}`}></div>
        </Link>
    );
};

const Convert = () => {
    const [isFirstCoinSearchWindowOpen, setIsFirstCoinSearchWindowOpen] = useState(false);
    const [isSecondCoinSearchWindowOpen, setIsSecondCoinSearchWindowOpen] = useState(false);
    const [selectedFirstCoin, setSelectedFirstCoin] = useState(null);
    const [selectedSecondCoin, setSelectedSecondCoin] = useState(null);
    const [firstCoinAmount, setFirstCoinAmount] = useState(0);
    const [secondCoinAmount, setSecondCoinAmount] = useState(0);
    const [lastEnteredNumber, setLastEnteredNumber] = useState(0)

    const toggleFirstCoinSearchWindow = () => {
        setIsFirstCoinSearchWindowOpen(!isFirstCoinSearchWindowOpen);
    };

    const toggleSecondCoinSearchWindow = () => {
        setIsSecondCoinSearchWindowOpen(!isSecondCoinSearchWindowOpen);
    };

    const handleSelectFirstCoin = (coin) => {
        setSelectedFirstCoin(coin);
        toggleFirstCoinSearchWindow();
        setFirstCoinAmount(0);
        setSecondCoinAmount(0);
    };

    const handleSelectSecondCoin = (coin) => {
        setSelectedSecondCoin(coin);
        toggleSecondCoinSearchWindow();
        setFirstCoinAmount(0);
        setSecondCoinAmount(0);
    };

    const handleFirstCoinAmountChange = (e) => {
        const amount = parseFloat(e.target.value);
        setFirstCoinAmount(amount);

        if (selectedFirstCoin && selectedSecondCoin) {
            const exchangeRate = selectedFirstCoin.price / selectedSecondCoin.price;
            setSecondCoinAmount(amount * exchangeRate);
        }
    };

    const handleSecondCoinAmountChange = (e) => {
        const amount = parseFloat(e.target.value);
        setSecondCoinAmount(amount);

        if (selectedFirstCoin && selectedSecondCoin) {
            const exchangeRate = selectedSecondCoin.price / selectedFirstCoin.price;
            setFirstCoinAmount(amount * exchangeRate);
        }
    };

    return (
        <div className='parent-container'>
            <div className='switch-container'>
                <div className='menu-container'>
                    {/*<MenuItem*/}
                    {/*    title={`Swap`}*/}
                    {/*    url={``}*/}
                    {/*/>*/}
                    {/*<div style={{width: '50px'}}/>*/}
                    <MenuItem
                        title={`Convert`}
                        url={``}
                    />
                </div>
            </div>

            <SearchWindow
                showWindow={isFirstCoinSearchWindowOpen}
                onClose={toggleFirstCoinSearchWindow}
                onSelectCoin={handleSelectFirstCoin}
            />

            <SearchWindow
                showWindow={isSecondCoinSearchWindowOpen}
                onClose={toggleSecondCoinSearchWindow}
                onSelectCoin={handleSelectSecondCoin}
            />

            <div className='swap-main-container'>
                <div className='swap-second-container'>
                    <div className={`menu-item-swap ${selectedFirstCoin ? 'active' : ''}`}>
                        <div className='text-swap-f'>
                            First coin
                        </div>
                        <div className='button-container-1'>
                            <div className='swap-btn' onClick={toggleFirstCoinSearchWindow}>
                                {selectedFirstCoin ? (
                                    <>
                                        <img src={selectedFirstCoin.icon} alt={`${selectedFirstCoin.name} icon`}
                                             className='coin-icon-l'/>
                                        <div className='coin-symbol-l'>{selectedFirstCoin.symbol}</div>
                                    </>
                                ) : (
                                    'Select coin'
                                )}
                                <IoIosArrowDown style={{marginRight: '-10px', marginLeft: '10px'}}/>
                            </div>
                            <input
                                type="number"
                                value={firstCoinAmount}
                                onChange={handleFirstCoinAmountChange}
                                className='number'
                            />
                        </div>
                    </div>

                    <div className='separator'></div>

                    <div className='text-swap-s2'>
                        Second coin
                    </div>

                    <div className='button-container-2'>
                        <div className='swap-btn' onClick={toggleSecondCoinSearchWindow}>
                            {selectedSecondCoin ? (
                                <>
                                    <img src={selectedSecondCoin.icon} alt={`${selectedSecondCoin.name} icon`}
                                         className='coin-icon-l'/>
                                    <div className='coin-symbol-l'>{selectedSecondCoin.symbol}</div>
                                </>
                            ) : (
                                'Select coin'
                            )}
                            <IoIosArrowDown style={{marginRight: '-10px', marginLeft: '10px'}}/>
                        </div>
                        <input
                            type="number"
                            value={secondCoinAmount}
                            onChange={handleSecondCoinAmountChange}
                            className='number'
                        />
                    </div>
                </div>
            </div>

            <DownOnBoard/>
        </div>
    );
};

class SearchWindow extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            coins: [],
            filteredCoins: [],
            loading: true,
            error: null,
            searchSymbol: "",
        };
    }

    async componentDidMount() {
        try {
            const api = new CoinStatsAPI();
            const coinsData = await api.getCoins(1000, true);
            this.setState({
                coins: coinsData,
                filteredCoins: coinsData,
                loading: false,
            });
        } catch (error) {
            console.error(error);
            this.setState({error, loading: false});
        }
    }

    handleSearchInputChange = (event) => {
        const {coins} = this.state;
        const searchSymbol = event.target.value.toUpperCase();
        const filteredCoins = coins.filter((coin) =>
            coin.symbol.toUpperCase().includes(searchSymbol)
        );
        this.setState({filteredCoins, searchSymbol});
    };

    render() {
        const {showWindow, onClose, onSelectCoin} = this.props;
        const {filteredCoins, loading, error, searchSymbol} = this.state;

        if (showWindow) {
            return (
                <div className="popup-container">
                    <div className="popup-container-clickable-space" onClick={onClose}></div>
                    <div className="popup">
                        <div className="popup-title">Select Coin</div>

                        <input
                            type="text"
                            placeholder="Search by symbol..."
                            value={searchSymbol}
                            onChange={this.handleSearchInputChange}
                            className="swap-search"
                        />

                        {loading && <div>Loading...</div>}
                        {error && <div>Error loading coins</div>}
                        {!loading && !error && (
                            <div className="coin-list">
                                {filteredCoins.map((coin, index) => (
                                    <div
                                        key={index}
                                        onClick={() => onSelectCoin(coin)}
                                        className="coin-item"
                                    >
                                        <img
                                            src={coin.icon}
                                            alt={`${coin.name} icon`}
                                            className="coin-icon"
                                        />
                                        <div className="coin-name">{coin.name}</div>
                                        <div className="coin-symbol">{coin.symbol}</div>
                                        <div className="coin-rank">Rank: {coin.rank}</div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            );
        }
        return null;
    }
}

export default Convert;
