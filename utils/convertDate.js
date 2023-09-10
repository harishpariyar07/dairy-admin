import NepaliDate from 'nepali-date-converter'

export default  formatDate = (dateInAd) => {
    const dateInBS = new NepaliDate(new Date(dateInAd))
    const year = dateInBS.getYear()
    const month = dateInBS.getMonth()+1
    const day = dateInBS.getDate()
    const formattedDate = `${year}-${month}-${day}`
    return formattedDate
}

