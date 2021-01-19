/*global FB*/
// ==== FB ====//
let fb = {
  auth: {},
};
window.onload = initFB();
function initFB() {
  //initialization
  window.fbAsyncInit = function () {
    FB.init({
      appId: "683295538957260",
      cookie: true,
      xfbml: true,
      version: "v8.0",
    });
    //log user behavior
    FB.AppEvents.logPageView();

    //check login status, if connected >> get user access token
    FB.getLoginStatus(function (response) {
      loginstatusChange(response);
      // member icon clicked >> checklogin
      const member = Array.from(document.querySelectorAll(".member"));
      member.map((icon) => {
        icon.addEventListener("click", clickLogin);
      });
    });
  };
}
//嵌入臉書sdk
const fbSDK = function () {
  (function (d, s, id) {
    var js,
      fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) {
      return;
    }
    js = d.createElement(s);
    js.id = id;
    js.src = "https://connect.facebook.net/en_US/sdk.js";
    fjs.parentNode.insertBefore(js, fjs);
  })(document, "script", "facebook-jssdk");
};

window.addEventListener("DOMContentLoaded", fbSDK);

//check if login or not
//if login >> direct to profile page
//if not >>  direct to fb login page

function renderMemberProfile(data) {
  const memberHello = document.querySelector(".memberHello");
  const membername = document.querySelector(".membername");
  const memberemail = document.querySelector(".memberemail");
  const checkoutbottom = document.querySelector(".checkoutbottom");
  //profile hello
  memberHello.innerHTML = `<span>Hello! &nbsp&nbsp</span><span class="membername">${data.name}</span>
    &nbsp&nbsp&nbsp&nbsp<img class="memberpicture" src="${data.picture}" />`;
  //profile member information
  membername.textContent = data.name;
  memberemail.textContent = data.email;
  //checkout bottom

  checkoutbottom.addEventListener("click", logout);
}

//若未登入，跳轉 FB login頁
function loginFB() {
  FB.login(
    function (response) {
      loginstatusChange(response);
      alert("歡迎Stylish會員回家，天天享專屬優惠！");
    },
    { scope: "public_profile,email" }
  );
}

//點擊會員，判斷是否已登入
function clickLogin() {
  if (fb.auth === null) {
    alert("您尚未登入，即將跳轉 FB 登入頁");
    loginFB();
  } else {
    alert("歡迎Stylish會員回家，天天享專屬優惠！");
    window.location = "./profile.html";
  }
}

//checkout
function logout() {
  FB.logout(function (response) {
    // Person is now logged out
  });
  window.location.href = "./";
}

function getUserProfile(data) {
  fetch("https://api.appworks-school.tw/api/1.0/user/profile", {
    method: "GET",
    headers: { Authorization: `Bearer ${data.access_token}` },
  })
    .then((res) => res.json())
    .then((responsedata) => {
      renderMemberProfile(responsedata.data);
    });
}

function updateLogintoSever() {
  let fbdata = {
    provider: "facebook",
    access_token: fb.auth.accessToken,
  };

  fetch("https://api.appworks-school.tw/api/1.0/user/signin", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(fbdata),
  })
    .then((response) => response.json())
    .then((response) => {
      console.log("Success:", response.data);
      getUserProfile(response.data);
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}
//loginstatusChange
function loginstatusChange(response) {
  if (response.status === "connected") {
    fb.auth = response.authResponse;
    updateLogintoSever();
  } else {
    fb.auth = null;
  }
}
