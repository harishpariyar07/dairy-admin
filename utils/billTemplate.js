import formatDate from "./formatDate";

const htmlTemplate = (
  organizationName,
  address,
  billTitle,
  panNumber,
  contactNumber1,
  contactNumber2,
  farmerId,
  farmerName,
  startDate,
  endDate,
  filteredTableData,
  avgFat,
  avgSnf,
  totalQty,
  totalCredit,
  totalDebit
) => {
  return `
    <html>
      <head>
        <style>
          /* Add your CSS styles here */
          table {
            border-collapse: collapse;
            width: 100%;
            border: 1px solid black;
          }
          th, td {
            border: 1px solid black;
            padding: 8px;
            text-align: center;
          }
        </style>
      </head>
      <body>
        <h1 style="text-align: center">${organizationName}</h1>
        <h3 style="text-align: center">${address}</h3>
        <h3 style="text-align: center">${billTitle}</h3>
        <div style="display: flex; justify-content: space-between;">
          <div>
            <p>Pan No: ${panNumber}</p>
          </div>
          <div style="display: flex; flex-direction: column;">
            <p>${contactNumber1}, ${contactNumber2}</p>
          </div>
        </div>
        <hr>
        <p style="text-align: center"><u>Farmer ID:</u> ${farmerId} <u>Farmer Name:</u> ${farmerName}</p>
        <p style="text-align: center">From ${formatDate(startDate)} To ${formatDate(endDate)}</p>
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Shift</th>
              <th>Fat</th>
              <th>Snf</th>
              <th>Qty</th>
              <th>Credit</th>
              <th>Debit</th>
              <th>Remarks</th>
            </tr>
          </thead>
          <tbody>
            ${filteredTableData
              .map(
                (item) => `
                  <tr>
                    <td>${item[1] || '-'}</td>
                    <td>${item[2] === "Morning" ? "M" : "E" || '-'}</td>
                    <td>${item[3] || '-'}</td>
                    <td>${item[4] || '-'}</td>
                    <td>${item[5] || '-'}</td>
                    <td>${item[6] || '-'}</td>
                    <td>${item[7] || '-'}</td>
                    <td>${item[8] || ''}</td>
                  </tr>
                `
              )
              .join('')}
            <tr>
              <th>-</th>
              <th>-</th>
              <th>${avgFat}</th>
              <th>${avgSnf}</th>
              <th>${totalQty}L</th>
              <th>${totalCredit}</th>
              <th>${totalDebit}</th>
              <th>-</th>
            </tr>
          </tbody>
        </table>
      </body>
    </html>
  `;
};

export default htmlTemplate;
