export function formatDateNumberAsYearMonthDay(dateNumber: number) {
  const dateObject = new Date(dateNumber)

  const year = dateObject.getFullYear()
  const month = (dateObject.getMonth() + 1).toString().padStart(2, '0')
  const day = dateObject.getDate().toString().padStart(2, '0')

  const formattedDate = `${year}-${month}-${day}`

  return formattedDate
}
