
var loadingIcon = document.getElementById("loading");
var loginForm = document.getElementById("login-form");
var expensesForm = document.getElementById("expenses-form");
var forecastForm = document.getElementById("forecast-form"); //forecast
var loginButton = document.getElementById("loginSubmit");
var logoutButton = document.getElementById("logoutSubmit");
var forecastButton = document.getElementById("forecastSubmit");
var forecastBackButton = document.getElementById("forecastBack");
var totalsButton = document.getElementById("show-totals");

var forecastStartingBalance = document.getElementById("forecast-starting-balance"); //forecast
var forecastAccount = document.getElementById("forecast-account"); //forecast
var forecastNumMonths = document.getElementById("forecast-number-of-months"); //forecast
var forecastStartDate = document.getElementById("forecast-start-date"); //forecast

var expenseName = document.getElementById("new-expense-name"); //new-expense
var expenseType = document.getElementById("new-expense-type"); //new-expense
var expenseAmount = document.getElementById("new-expense-amount"); //new-expense
var expenseAccount = document.getElementById("new-expense-account"); //new-expense
var expenseFrequency = document.getElementById("new-expense-frequency"); //new-expense
var expenseStartDate = document.getElementById("new-expense-start-date"); //new-expense

var addButton = document.getElementById("add-new-expense"); //add expense button
var expensesHolder = document.getElementById("expenses"); //expenses
var forecastTransactionsHolder = document.getElementById("forecast-transactions"); //expenses

var frequencies = ["Weekly", "Fortnightly", "Monthly", "Yearly", "Quarterly"];
var accounts = ["Primary", "Secondary"];
var expenseTypes = ["Expense", "Expense cover payment"];

var token = window.localStorage.getItem('access_token');

var authSuccess = function() {
  loginForm.classList.add("hide");
  expensesForm.classList.remove("hide");
  forecastStartDate.value = new Date().toDateInputValue();
  expenseStartDate.value = new Date().toDateInputValue();
  //Set the click handler to the addExpense function

  addButton.addEventListener("click", addExpense);
  forecastButton.addEventListener("click", getForecast);
  forecastBackButton.addEventListener("click", getExpenses);
  totalsButton.addEventListener("click", showTotals);

  getExpenses();
}

Date.prototype.toDateInputValue = (function() {
    var local = new Date(this);
    local.setMinutes(this.getMinutes() - this.getTimezoneOffset());
    return local.toJSON().slice(0,10);
});

loginButton.addEventListener("click", login);
logoutButton.addEventListener("click", logout);

if(token) {
  authSuccess();
} else {
  //leave login form there
}
