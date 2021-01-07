/* global TPDirect */
// <!-- TPDirect.setupSDK(appID, appKey, serverType) -->
TPDirect.setupSDK(
  12348,
  "app_pa1pQcKoY22IlnSXq5m5WP5jFKzoRG58VEXpT7wU62ud7mMbDOGzCYIlzzLF",
  "sandbox"
);

TPDirect.card.setup({
  fields: {
    number: {
      // css selector
      element: "#card-number",
      placeholder: "**** **** **** ****",
    },
    expirationDate: {
      // DOM object
      element: document.getElementById("card-expiration-date"),
      placeholder: "MM / YY",
    },
    ccv: {
      element: "#card-code",
      placeholder: "CCV",
    },
  },

  styles: {
    // Style all elements
    ".valid": {
      color: "green",
    },
    // style invalid state
    ".invalid": {
      color: "red",
    },
    // Media queries
    // Note that these apply to the iframe, not the root window.
    "@media screen and (max-width: 400px)": {
      input: {
        color: "orange",
      },
    },
  },
});

// onSubmit 主邏輯

document.querySelector("#checkout").addEventListener("click", onSubmit);

//檢查訂購資訊
function onSubmit(event) {
  const receivename = document.getElementById("receive-name");
  const receiveemail = document.getElementById("receive-email");
  const receivephone = document.getElementById("receive-phone");
  const receiveaddress = document.getElementById("receive-address");

  //空欄位加上背景題型
  const empties = Array.from(document.querySelectorAll(".textinput"));
  empties.forEach((empty) => {
    if (!empty.value) {
      empty.classList.add("empty");
    } else {
      console.log("填寫完畢");
    }
  });
  //alert 第一個為空的欄位
  if (receivename.value.length === 0) {
    alert("請輸入您的姓名及其他欄位");
    return;
  } else if (receiveemail.value.length === 0) {
    alert("請輸入您的信箱及其他欄位");
    return;
  } else if (receivephone.value.length === 0) {
    alert("請輸入您的電話及其他欄位");
    return;
  } else if (receiveaddress.value.length === 0) {
    alert("請輸入您的地址及其他欄位");
    return;
  } else {
    //個人資訊都有填 >取資料，改overalldata值
    event.preventDefault();

    //判斷選擇的time並傳回recipient.time值
    /* global overallData*/
    const receivetime = document.getElementsByName("recipient-time");
    let recipient = overallData.order.recipient;
    for (let i = 0; i < receivetime.length; i++) {
      if (receivetime[i].checked) {
        recipient.time = receivetime[i].defaultValue;
      }
    }

    //確認email 格式是否正確
    //Regular expression Testing

    let emailRule = /^\w+((-\w+)|(\.\w+))*@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z]+$/;
    //validate ok or not
    if (receiveemail.value.trim().search(emailRule) != -1) {
      recipient.email = receiveemail.value.trim();
    } else {
      alert("email 格式錯誤，請確認！");
      return;
    }

    //確認手機格式是否正確
    let phoneRule = /(\d{2,3}-?|\(\d{2,3}\))\d{3,4}-?\d{4}|09\d{2}(\d{6}|-\d{3}-\d{3})/;
    //validate ok or not
    if (receivephone.value.trim().search(phoneRule) != -1) {
      recipient.phone = receivephone.value.trim();
    } else {
      alert("手機格式錯誤，請確認！");
      return;
    }

    recipient.name = receivename.value.trim();
    recipient.address = receiveaddress.value.trim();

    //tappay 狀態：

    const tappayStatus = TPDirect.card.getTappayFieldsStatus();

    // 確認是否可以 getPrime
    if (tappayStatus.canGetPrime === false) {
      alert("請輸入正確信用卡卡號！");
      return;
    }

    // Get prime
    /*global subtotalresult*/
    /*global totalamount*/
    /*global fb*/
    TPDirect.card.getPrime((result) => {
      if (result.status !== 0) {
        alert("信用卡訊息有誤，請確認！");
        return;
      }
      alert("恭喜完成！感謝您的訂購及對 Stylish 的支持！");
      overallData.prime = result.card.prime;
      overallData.order.subtotal = subtotalresult;
      overallData.order.total = totalamount;

      checkOutApi();
      function checkOutApi() {
        const cartview = document.querySelector(".cartview");
        cartview.innerHTML =
          "<div class='lds-heart'><div></div><div></div></div><div class ='lds-words'>正在處理您的訂單...</div>";
        // sendcheckout();
        fetch("https://api.appworks-school.tw/api/1.0/order/checkout", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${fb.auth.accessToken}`,
          },
          body: JSON.stringify(overallData),
        })
          .then((response) => response.json())
          .then((data) => {
            console.log("Success:", data);
            window.location.href = `./thankyou.html?number=${data.data.number}`;
            localStorage.clear();
          })
          .catch((error) => {
            console.error("Error:", error);
          });
      }
    });
  }
}
