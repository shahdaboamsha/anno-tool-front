function formatDateToLong(dateString) {
    const date = new Date(dateString);
    const options = { day: 'numeric', month: 'long', year: 'numeric' };
    return new Intl.DateTimeFormat('en-GB', options).format(date);
}
const formatUserName = (str) => {
    const capitalizeFirstLetter = (word) => {
        return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
    }
    const splittedStr = str.split(" ")
    return splittedStr.map(word => capitalizeFirstLetter(word)).join(" ")
}

export { formatDateToLong, formatUserName }