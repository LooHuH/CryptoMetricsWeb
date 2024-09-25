class CoinStatsAPI {
    base_url = 'https://openapiv1.coinstats.app/';
    tokens = [
    ];
    activeTokenIndex = 0;

    updateRequestCounter = () => {
        this.activeTokenIndex++;
        if (this.activeTokenIndex === this.tokens.length) {
            this.activeTokenIndex = 0;
        }
    }

    generatedOptions = () => {
        return ({
            method: 'GET',
            headers: {
                accept: 'application/json',
                'X-API-KEY': this.tokens[this.activeTokenIndex]
            }
        });
    }

    buildRequest = (args, params) => {
        let url = this.base_url + args.join('/');
        if (params) {
            url += '?' + new URLSearchParams(params).toString();
        }
        return url;
    };

    getJsonResponse = async (args, params = null, fromResult = false) => {
        try {
            const response = await fetch(
                this.buildRequest(args, params),
                this.generatedOptions()
            ).then(response => response.json());
            this.updateRequestCounter();
            if (response.hasOwnProperty('statusCode')) {
                if (response.statusCode === 400 || response.statusCode === 401) {
                    return null;
                }
            }
            if (fromResult && response.hasOwnProperty('result')) {
                return response.result;
            }
            else {
                return response;
            }
        }
        catch (error) {
            console.error('Error fetching data:', error);
            return null;
        }
    };

    getCoinInfo = async (coinId) => {
        return await this.getJsonResponse(['coins', coinId]);
    };

    getCoins = async (limit, fromResult = false) => {
        return await this.getJsonResponse(['coins'], { limit: limit }, fromResult);
    };

    getCoinCharts = async (coinId, period) => {
        return await this.getJsonResponse(['coins', coinId, 'charts'], { period: period });
    };

    getMarkets = async () => {
        return await this.getJsonResponse(['markets']);
    }
}

async function getGasPrices () { 
    const request_url = 'https://api.blocknative.com/gasprices/blockprices';
    try {
        return await fetch(request_url).then(response => response.json());
    }
    catch(error) {
        console.error(error);
    }
}

export {CoinStatsAPI, getGasPrices};