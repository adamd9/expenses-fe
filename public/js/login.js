
var handleEnterOnLogin = function (e) {
    if(e.keyCode === 13){
        e.preventDefault(); // Ensure it is only this code that rusn
        login();
    }
}

var login = function() {
    var username = document.getElementById("username");
    var password = document.getElementById("password");
    if(username.value != "" && password.value != "") {
      console.log("Logging in...");

      var myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/x-www-form-urlencoded");

      var urlencoded = new URLSearchParams();
      urlencoded.append("email", username.value);
      urlencoded.append("password", password.value);

      var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: urlencoded
      };

      fetch("https://adamd9expenses.herokuapp.com/api/auth/login", requestOptions)
        .then(response => response.json())
        .then(result => handleLoginSuccess(result))
        .catch(error => handleLoginFailure(error));

    } else {
      alert("Username and password must not be empty.");
    }
}

var handleLoginSuccess = function(res) {
  console.log("success");
  window.localStorage.setItem('access_token', res.token);
  token = res.token;
  getExpenses();
}

var handleLoginFailure = function(error) {
  console.log('error', error);
  var username = document.getElementById("username");
  var password = document.getElementById("password");
  alert("There was a problem logging in. Check your username and password.");
  username.value = "";
  password.value = "";
}

var logout = function() {
    window.localStorage.removeItem('access_token');
    location.reload();
}
