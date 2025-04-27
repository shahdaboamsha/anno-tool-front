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

const capitalizeFirstLetter = (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
}

const capitailizeFirstLetterOfArray = (str) => {

    str = str.toLocaleString()
    const splittedStrAsArray = str.split(";")
    const newStr = splittedStrAsArray.map(label => label.charAt(0).toUpperCase() + label.toLowerCase().slice(1))
    return newStr.toLocaleString().split(",").join(", ")
}
export { formatDateToLong, formatUserName, capitalizeFirstLetter, capitailizeFirstLetterOfArray }