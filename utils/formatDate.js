import NepaliDate from 'nepali-date-converter'

const formatDate = (dateInAd) => {
    const dateInBS = new NepaliDate(dateInAd)
    const nepaliMonthNames = [
        'Baishakh',
        'Jestha',
        'Ashadh',
        'Shrawan',
        'Bhadra',
        'Ashoj',
        'Kartik',
        'Mangsir',
        'Poush',
        'Magh',
        'Falgun',
        'Chaitra',
    ]

    const year = dateInBS.getYear()
    const month = dateInBS.getMonth()
    const day = dateInBS.getDate()
    const monthName = nepaliMonthNames[month]
    const formattedDate = `${monthName} ${day}, ${year}`

    return formattedDate
}

export default formatDate