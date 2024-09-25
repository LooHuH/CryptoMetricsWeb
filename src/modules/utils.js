import arrowUp from "../images/arrow_up.png";
import arrowDown from "../images/arrow_down.png";

const dataLoaded = (data) => {
    for (const index in data) {
        if (data[index] === null) {
            return false;
        }
        try {
            if (data[index].length === 0) {
                return false;
            }
        }
        catch (error) {}
    }
    return true;
};

const positivePercentage = (percentage) => {
    return (percentage >= 0 ? percentage : (percentage - 2 * percentage));
};

const widgetColor = (percentage) => {
    return (percentage >= 0 ? 'green' : 'red');
};

const arrowDirection = (color) => {
    return (color === 'green' ? arrowUp : arrowDown);
};

const insertCharIn = (string, index, char) => {
    return string.slice(0, index) + char + string.slice(index);
};

const unixTimesptampToTime = (timestamp) => {
    const date = new Date(timestamp * 1000);
    const hours = date.getHours();
    const minutes = ('0' + date.getMinutes()).slice(-2);
    const seconds = ('0' + date.getSeconds()).slice(-2);
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();

    return `${hours}:${minutes}:${seconds} ${day}/${month}/${year}`;
};

export {dataLoaded, positivePercentage, widgetColor, arrowDirection, insertCharIn, unixTimesptampToTime};