//Get expenses list for user..
var getExpenses = function() {
  loadingIcon.classList.remove("hide");
  var myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/x-www-form-urlencoded");
  myHeaders.append("x-access-token", token);

  var requestOptions = {
    method: 'GET',
    headers: myHeaders,
    redirect: 'follow'
  };

  fetch("https://adamd9expenses.herokuapp.com/api/expenses", requestOptions)
    .then((resp) => resp.json())
    .then(function(data) {
      if (data.message == "Failed to authenticate token.") {
        throw new Error("Your login has expired. Please re-enter your details.");
      }
      for (var expense of data) {
        var listItem = createNewExpenseElement(expense);
        //Append listItem to expensesHolder
        expensesHolder.appendChild(listItem);
      }
      // //Cycle over expensesHolder ul list items
      for (var i = 0; i < expensesHolder.children.length; i++) {
        //Bind events to item's children (expenseCompleted)
        bindExpenseEvents(expensesHolder.children[i]);
      }
      loginForm.classList.add("hide");
      forecastForm.classList.add("hide");
      expensesForm.classList.remove("hide");
      loadingIcon.classList.add("hide");

    }

    )
    .catch(error => handleGetFailure(error));

}

//New Expense List Item
var createNewExpenseElement = function(expense) {
  //Create List Item
  var listItem = document.createElement("li");

  listItem.id = expense._id;

  //expense name
  var expenseNameLabel = document.createElement("label");
  var expenseNameInput = document.createElement("input");
  expenseNameInput.type = "text";
  expenseNameInput.name = "expense-name";
  expenseNameInput.className = "primary";
  expenseNameLabel.innerText = expense.name;
  expenseNameLabel.htmlFor = "expense-name";
  expenseNameLabel.className = "primary";

  //expense type
  var expenseTypeLabel = document.createElement("label");
  var expenseTypeInput = document.createElement("select");
  expenseTypeInput.type = "select";
  expenseTypeInput.name = "expense-type";

  for (var item of expenseTypes) {
    var option = document.createElement("option");
    option.value = item;
    option.text = item;
    expenseTypeInput.appendChild(option);
  }

  expenseTypeLabel.htmlFor = "expense-type";
  expenseTypeLabel.innerText = expense.type;

  //expense amount
  var expenseAmountLabel = document.createElement("label");
  var expenseAmountInput = document.createElement("input");
  expenseAmountInput.type = "text";
  expenseAmountInput.name = "expense-amount";
  expenseAmountLabel.htmlFor = "expense-amount";
  expenseAmountLabel.innerText = Number(expense.amount).toFixed(2);

  //expense account
  var expenseAccountLabel = document.createElement("label");
  var expenseAccountInput = document.createElement("select");
  expenseAccountInput.type = "select";
  expenseAccountInput.name = "expense-account";

  for (var item of accounts) {
    var option = document.createElement("option");
    option.value = item;
    option.text = item;
    expenseAccountInput.appendChild(option);
  }

  expenseAccountLabel.htmlFor = "expense-account";
  expenseAccountLabel.innerText = expense.account;

  //expense frequency
  var expenseFrequencyLabel = document.createElement("label");
  var expenseFrequencyInput = document.createElement("select");
  expenseFrequencyInput.type = "select";
  expenseFrequencyInput.name = "expense-frequency";

  for (var item of frequencies) {
    var option = document.createElement("option");
    option.value = item;
    option.text = item;
    expenseFrequencyInput.appendChild(option);
  }

  expenseFrequencyLabel.htmlFor = "expense-frequency";
  expenseFrequencyLabel.innerText = expense.frequency;

  //expense start date
  var expenseStartDateLabel = document.createElement("label");
  var expenseStartDateInput = document.createElement("input");
  expenseStartDateInput.type = "date";
  expenseStartDateInput.name = "expense-start-date";
  expenseStartDateLabel.htmlFor = "expense-start-date";
  expenseStartDateLabel.innerText = formatDateDdMMMyyyy(expense.startDate);

  //button.edit
  var editButton = document.createElement("button");

  //button.delete
  var deleteButton = document.createElement("button");


  editButton.innerText = "Edit";
  editButton.className = "edit";
  deleteButton.innerText = "Delete";
  deleteButton.className = "delete";


  //Each element needs appending
  listItem.appendChild(expenseNameLabel);
  listItem.appendChild(expenseNameInput);
  listItem.appendChild(expenseTypeLabel);
  listItem.appendChild(expenseTypeInput);
  listItem.appendChild(expenseAmountLabel);
  listItem.appendChild(expenseAmountInput);
  listItem.appendChild(expenseAccountLabel);
  listItem.appendChild(expenseAccountInput);
  listItem.appendChild(expenseFrequencyLabel);
  listItem.appendChild(expenseFrequencyInput);
  listItem.appendChild(expenseStartDateLabel);
  listItem.appendChild(expenseStartDateInput);
  listItem.appendChild(editButton);
  listItem.appendChild(deleteButton);

  return listItem;
}

//Add a new expense
var addExpense = function() {

  if(expenseName.value != "" && expenseAmount.value != "" && expenseStartDate.value != "") {

    //Create a new list item with the text from #new-expense:
    var newExpense = {
          "name": expenseName.value,
          "type": expenseType.value,
          "amount": expenseAmount.value,
          "account": expenseAccount.value,
          "frequency": expenseFrequency.value,
          "startDate": formatDateDdMMMMyyyy(expenseStartDate.value)
      };

    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/x-www-form-urlencoded");
    myHeaders.append("x-access-token", token);

    var urlencoded = new URLSearchParams();
    for(key in newExpense) {
      urlencoded.append(key, newExpense[key]);
    }

    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: urlencoded
    };

    fetch("https://adamd9expenses.herokuapp.com/api/expenses", requestOptions)
      .then(function() {
        var listItem = createNewExpenseElement(newExpense);

        //Append listItem to expensesHolder
        expensesHolder.appendChild(listItem);
        bindExpenseEvents(listItem);
        expenseName.value = "";
        expenseType.value = "";
        expenseAmount.value = "";
        expenseAccount.value = "";
        expenseFrequency.value = "";
        expenseStartDate.value = "";
        alert("Expense added.");
      })
      .catch(error => console.log('error', error));

  } else {
    alert("Missing values");
  }
}

//Edit an existing expense
var editExpense = function() {
  var listItem = this.parentNode;

  var editExpenseNameInput = listItem.querySelector("input[name=expense-name]");
  var expenseNameLabel = listItem.querySelector("label[for=expense-name]");
  var editExpenseTypeInput = listItem.querySelector("select[name=expense-type]");
  var expenseTypeLabel = listItem.querySelector("label[for=expense-type]");
  var editExpenseAmountInput = listItem.querySelector("input[name=expense-amount]");
  var expenseAmountLabel = listItem.querySelector("label[for=expense-amount]");
  var editExpenseAccountInput = listItem.querySelector("select[name=expense-account]");
  var expenseAccountLabel = listItem.querySelector("label[for=expense-account]");
  var editExpenseFrequencyInput = listItem.querySelector("select[name=expense-frequency]");
  var expenseFrequencyLabel = listItem.querySelector("label[for=expense-frequency]");
  var editExpenseStartDateInput = listItem.querySelector("input[name=expense-start-date]");
  var expenseStartDateLabel = listItem.querySelector("label[for=expense-start-date]");
  var containsClass = listItem.classList.contains("editMode");
  var editButton = listItem.getElementsByTagName("button")[0];

  var expenseId = listItem.id;
  //If the class of the parent is .editMode
  if (containsClass) {
    // check for emptys
    if (editExpenseNameInput.value === "" || editExpenseAmountInput.value === "" || editExpenseStartDateInput.value === "") return alert("Missing values");
    //submit new expense to api
    var updatedExpense = {
          "name": editExpenseNameInput.value,
          "type": editExpenseTypeInput.value,
          "amount": editExpenseAmountInput.value,
          "account": editExpenseAccountInput.value,
          "frequency": editExpenseFrequencyInput.value,
          "startDate": formatDateDdMMMMyyyy(editExpenseStartDateInput.value)
      };

    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/x-www-form-urlencoded");
    myHeaders.append("x-access-token", token);

    var urlencoded = new URLSearchParams();
    for(key in updatedExpense) {
      urlencoded.append(key, updatedExpense[key]);
    }

    var requestOptions = {
      method: 'PUT',
      headers: myHeaders,
      body: urlencoded
    };

    fetch("https://adamd9expenses.herokuapp.com/api/expenses/" + expenseId, requestOptions)
      .then(function() {
        //Switch from .editMode
        //label text become the input's value
        expenseNameLabel.innerText = editExpenseNameInput.value;
        expenseTypeLabel.innerText = editExpenseTypeInput.value;
        expenseAmountLabel.innerText = editExpenseAmountInput.value;
        expenseAccountLabel.innerText = editExpenseAccountInput.value;
        expenseFrequencyLabel.innerText = editExpenseFrequencyInput.value;
        expenseStartDateLabel.innerText = formatDateDdMMMyyyy(formatDateDdMMMMyyyy(editExpenseStartDateInput.value));
        editButton.innerText = "Edit";
        alert("Expense updated.");
      })
      .catch(error => console.log('error', error));


  //else
  } else {
  //Switch to .editMode
  //input value becomes the label's text
  editExpenseNameInput.value = expenseNameLabel.innerText;
  editExpenseTypeInput.value = expenseTypeLabel.innerText;
  editExpenseAmountInput.value = expenseAmountLabel.innerText;
  editExpenseAccountInput.value = expenseAccountLabel.innerText;
  editExpenseFrequencyInput.value = expenseFrequencyLabel.innerText;
  editExpenseStartDateInput.value = formatDateYyyyMMdd(expenseStartDateLabel.innerText);
  editButton.innerText = "Save";
  }
  //Toggle .editMode on the parent
  listItem.classList.toggle("editMode");


}

//Delete an existing expense
var deleteExpense = function() {

  if (confirm("Are you sure you want to delete this expense?") == false)
    return;

  var listItem = this.parentNode;
  var ul = listItem.parentNode;

  var myHeaders = new Headers();
  myHeaders.append("x-access-token", token);
  myHeaders.append("Content-Type", "application/x-www-form-urlencoded");

  var requestOptions = {
    method: 'DELETE',
    headers: myHeaders
  };

  fetch("https://adamd9expenses.herokuapp.com/api/expenses/" + listItem.id, requestOptions)
    .then((resp) => resp.json())
    .then(function() {
      //Remove the parent list item from the ul
      ul.removeChild(listItem);
      alert("Expense deleted.");
    }

    )
    .catch(error => console.log('error', error));

}

var bindExpenseEvents = function(expenseListItem) {

  //Select expenseListItem's children
  var editButton = expenseListItem.querySelector("button.edit");
  var deleteButton = expenseListItem.querySelector("button.delete");

  //Bind editExpense to edit button
  editButton.onclick = editExpense;

  //Bind deleteExpense to delete button
  deleteButton.onclick = deleteExpense;

}

var showTotals = function() {
  loadingIcon.classList.remove("hide");
  var myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/x-www-form-urlencoded");
  myHeaders.append("x-access-token", token);

  var requestOptions = {
    method: 'GET',
    headers: myHeaders,
    redirect: 'follow'
  };

  fetch("https://adamd9expenses.herokuapp.com/api/expenses/totals", requestOptions)
    .then((resp) => resp.json())
    .then(function(data) {
      loadingIcon.classList.add("hide");
      alert("Primary expenses total $" + data.primary.expenses + " with cover payment of $" + data.primary.cover + "\nSecondary expenses total: $" + data.secondary.expenses + " with cover payment of $" + data.secondary.cover);
    }

    )
    .catch(error => handleGetFailure(error));

}
