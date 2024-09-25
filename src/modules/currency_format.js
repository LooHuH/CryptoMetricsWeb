import {insertCharIn} from "./utils";

const CurrencyFormat = ({
                            value,
                            thousandSeparator = ',',
                            floatSeparator = '.',
                            currency = '$',
                            dividerChar = ''
                       }) => {
    try {
        const supportedDividerChars = ['T', 'B', 'M', ''];
        const dividersList = {
            'T': 1000000000000,
            'B': 1000000000,
            'M': 1000000,
            '': 1
        };
        let divider;
        for (const i in supportedDividerChars) {
            if (dividerChar === supportedDividerChars[i]) {
                let tempIndex = i;
                let char;
                let potentialDivider;
                while (tempIndex !== supportedDividerChars.length) {
                    char = supportedDividerChars[tempIndex];
                    potentialDivider = dividersList[char];
                    if (value > potentialDivider) {
                        break;
                    }
                    else {
                        tempIndex++;
                    }
                }
                divider = potentialDivider;
                dividerChar = char;
            }
        }
        value /= divider;
        const valueSplit = value.toString().split('.');
        let mainPart;
        let floatPart;
        if (valueSplit.length > 1) {
            mainPart = valueSplit[0];
            floatPart = valueSplit[1];
        }
        else {
            mainPart = value.toString();
        }
        const mainPartInt = Number.parseInt(mainPart);
        const mainPartLenght = mainPart.length;
        if (mainPartLenght > 1){
            for (let i = 0; i < mainPartLenght; i++) {
                const index = mainPartLenght - i;
                if (i % 3 === 0
                    && index !== mainPartLenght) {
                        mainPart = insertCharIn(mainPart, index, thousandSeparator);
                }
            }
        }
        if (floatPart) {
            if (mainPartInt < 1) {
                const floatPartLenght = floatPart.length;
                let counter = 0;
                for (let i = 0; i < floatPartLenght; i++) {
                    if (counter >= 5) {
                        floatPart = floatPart.slice(0, i);
                        break;
                    }
                    if (floatPart[i] != 0) {
                        counter++;
                    }
                    else {
                        if (counter > 1) {
                            floatPart = Math.round(Number(floatPart.slice(0, i + 3))).toString();
                            break;
                        }
                        if (counter >= 3) {
                            floatPart = floatPart.slice(0, i);
                            break;
                        }
                    }
                }
            }
            if (mainPartInt >= 1) {
                floatPart = floatPart.slice(0, 3);
            }
            if (mainPartInt >= 10) {
                floatPart = floatPart.slice(0, 2);
            }
        }
        let output = currency + mainPart;
        if (floatPart) {
            output += floatSeparator + floatPart;
        }
        if (dividerChar) {
            output += dividerChar;
        }
        return output;
    }
    catch (error) {
        console.log(error);
    }
};

export default CurrencyFormat;