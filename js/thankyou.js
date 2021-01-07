document.addEventListener("DOMContentLoaded", () => {
  //得到window 上的 query string
  const queryString = window.location.search;
  //創建querystring 的urlsearchparams interface
  const urlParams = new URLSearchParams(queryString);
  //return first value associated with the given search part
  const orderId = urlParams.get("number");

  let ordernumber = document.querySelector(".ordernumber");
  ordernumber.textContent = `您的訂單編號: ${orderId}`;
});
