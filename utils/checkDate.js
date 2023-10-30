export default function checkDates(date1, date2)
{
    const date_1 = new Date(date1)
    const date_2 = new Date(date2)

    return date_1.getDate() !== date_2.getDate() 
}