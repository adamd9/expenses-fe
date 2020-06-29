//Request a forecast transaction list
var getForecast = function() {
  loadingIcon.classList.remove("hide");
  var myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/x-www-form-urlencoded");
  myHeaders.append("x-access-token", token);

  var requestOptions = {
    method: 'GET',
    headers: myHeaders,
    redirect: 'follow'
  };
  var forecastQuery = 'account=' + forecastAccount.value +
    '&startingbal=' + forecastStartingBalance.value +
    '&forecaststart=' + formatDateDdMMMMyyyy(forecastStartDate.value) +
    '&forecastmonths=' + forecastNumMonths.value;

  fetch("https://adamd9expenses.herokuapp.com/api/expenses/forecast?" + forecastQuery, requestOptions)
    .then((resp) => resp.json())
    .then(function(data) {
      createTransactionForecast(data);
      loginForm.classList.add("hide");
      expensesForm.classList.add("hide");
      forecastForm.classList.remove("hide");
      loadingIcon.classList.add("hide");
    }
    )
    .catch(error => handleGetFailure(error));

}

//Generate the chart based on the transaction list
var createChart = function(chartData, chartLabels) {
  var ctx = document.getElementById('forecast-chart').getContext('2d');
  var myChart = new Chart(ctx, {
      type: 'line',
      data: {
          labels: chartLabels,
          datasets: [{
              label: "Forecast balance",
              data: chartData,
              backgroundColor: 'rgba(255, 99, 132, 0.2)',
              borderColor: 'rgba(255, 99, 132, 1)',
              borderWidth: 1
          }]
      }
  });
}
//Create the transaction list from the returned forecast object
var createTransactionForecast = function(forecastObject) {
  var chartData = [];
  var chartLabels = [];
  var tbl = document.createElement('table');
  tbl.style.width = '100%';
  tbl.setAttribute('border', '1');
  var thead = document.createElement('thead');
  var rhead = document.createElement('tr');
  var tableHeadArray = ["Date","Expense","Debit","Credit","Running Balance"]
  for (var col of tableHeadArray) {
    var celHead = document.createElement('th');
    celHead.innerHTML = col;
    rhead.appendChild(celHead);
  }
  thead.appendChild(rhead);
  tbl.appendChild(thead);

  var tbdy = document.createElement('tbody');

  for (var day of forecastObject) {
    for (var transactionLine of day.transactionObj) {
      // chartObj.push(transactionLine);
      tr = createNewForecastTransactionElement(transactionLine);
      tbdy.appendChild(tr);
      chartLabels.push(transactionLine.date);
      chartData.push(parseFloat(transactionLine.runningBal));
    }
  }
  tbl.appendChild(tbdy);
  forecastTransactionsHolder.appendChild(tbl);
  createChart(chartData, chartLabels);

}

//Create a transaction line in the transaction list table
var createNewForecastTransactionElement = function(forecastTransaction) {
  var tr = document.createElement("tr");
  var transactionDate = document.createElement('td');
  var transactionName = document.createElement('td');
  var transactionDebit = document.createElement('td');
  var transactionCredit = document.createElement('td');
  var transactionRunningBal = document.createElement('td');

  transactionDate.appendChild(document.createTextNode(forecastTransaction.date));
  transactionName.appendChild(document.createTextNode(forecastTransaction.expense));
  transactionDebit.appendChild(document.createTextNode(forecastTransaction.debit));
  transactionCredit.appendChild(document.createTextNode(forecastTransaction.credit));
  transactionRunningBal.appendChild(document.createTextNode(forecastTransaction.runningBal));

  tr.appendChild(transactionDate);
  tr.appendChild(transactionName);
  tr.appendChild(transactionDebit);
  tr.appendChild(transactionCredit);
  tr.appendChild(transactionRunningBal);

  return tr;
}
