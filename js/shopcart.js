/*global getStorageCart*/
/*eslint no-unused-vars: ["error", { "vars": "local" }]*/
/*global overallData:writable */
const cartList = document.querySelector(".cartList");
let submitbottom = document.querySelector("#checkout");
overallData = getStorageCart();
let cartlist = overallData.order.list;
let subtotalresult = 0;
let totalamount = 0;

initial();
// //initial render
function initial() {
  //step1.判斷購物車有無東西，若無show 字串，若有 渲染商品
  if (cartlist.length === 0) {
    cartList.textContent = "";
    cartList.textContent = "您的購物車是空的耶，歡迎回商店選購！";
    submitbottom.classList.add("disabled");
  } else {
    renderCart();
  }
}

//==========calculate function==========//
//calculate subtotal amount
function calculateSubTotal(selected, price) {
  let subtotalresult = selected * price;
  return subtotalresult;
}
//calculate totol amount
function calculateTotalAmount() {
  totalamount = 0;
  cartlist.map((item) => {
    totalamount += item.price * item.qty;
  });
  let reviewtotal = document.querySelector(".reviewtotal");
  reviewtotal.textContent = `NT.${totalamount}`;
  let reviewshipment = document.querySelector(".reviewshipment");
  reviewshipment.textContent = "NT.60";
  let reviewtotalpay = document.querySelector(".reviewtotalpay");
  reviewtotalpay.textContent = `NT.${totalamount + 60}`;
}

//delete cart
/*global stringnifyData*/
/*global checkCart*/
function deleteItem(idx) {
  alert("確定不要嗎？");
  let result = cartlist.splice(idx, 1);
  cartlist = result;
  let afterRemoveData = stringnifyData(overallData);
  window.localStorage.setItem("cart", afterRemoveData);
  initial();
  calculateTotalAmount();
  checkCart();
}

//render cart view
function renderCart() {
  //還原cart
  cartList.innerHTML = "";
  //單項單項產品渲染
  cartlist.map((item, idx) => {
    //商品最大框：cartContent
    let cartItem = document.createElement("div");
    cartItem.className = "cartItem";
    cartList.appendChild(cartItem);

    // 商品圖&商品描述 -框：cartContent
    let cartContnt = document.createElement("div");
    cartContnt.className = "cartContent";
    cartItem.appendChild(cartContnt);

    //商品圖
    let img = document.createElement("img");
    img.className = "picture";
    img.setAttribute("src", item.mainimage);
    cartContnt.appendChild(img);

    //商品描述
    let details = document.createElement("div");
    details.className = "details";
    let itemname = document.createElement("div");
    itemname.className = "itemname";
    itemname.textContent = item.name;
    let itemid = document.createElement("div");
    itemid.className = "itemid";
    itemid.textContent = item.id;
    let itemcolor = document.createElement("div");
    itemcolor.className = "itemcolor";
    itemcolor.textContent = `顏色：${item.colorname}`;
    let itemsize = document.createElement("div");
    itemsize.className = "itemsize";
    itemsize.textContent = `尺寸：${item.size}`;
    details.append(itemname, itemid, itemcolor, itemsize);
    cartContnt.appendChild(details);

    //數量
    let cartqty = document.createElement("div");
    cartqty.className = "cartqty";
    cartItem.appendChild(cartqty);

    //選擇toggle
    let select = document.createElement("select");
    select.className = "selectqty";
    for (let i = 0; i < item.stock; i++) {
      let option = document.createElement("option");
      option.setAttribute("value", i + 1);
      option.textContent = i + 1;
      select.appendChild(option);
    }
    select.value = item.qty;
    cartqty.appendChild(select);
    // 當改變數量
    select.onchange = function () {
      let selected = document.querySelectorAll(".selectqty")[idx].value;
      //更新cartlist
      cartlist[idx].qty = selected;
      let afterChangeData = stringnifyData(overallData);
      window.localStorage.setItem("cart", afterChangeData);
      let newsubtotal = calculateSubTotal(
        cartlist[idx].qty,
        cartlist[idx].price,
        idx
      );
      let subtotal = document.querySelectorAll(".subtotal")[idx + 1];
      subtotal.textContent = `NT:${newsubtotal}`;
      calculateTotalAmount();
    };

    //單價
    let price = document.createElement("div");
    price.className = "price";
    price.textContent = `NT.${item.price}`;
    cartItem.appendChild(price);

    //小計
    let subtotal = document.createElement("div");
    subtotal.className = "subtotal";
    subtotalresult = calculateSubTotal(item.qty, item.price, idx);
    subtotal.textContent = `NT.${subtotalresult}`;
    cartItem.appendChild(subtotal);

    //總金額
    calculateTotalAmount();

    //刪除
    let cartDelete = document.createElement("div");
    cartDelete.className = "cartDelete";
    cartDelete.addEventListener("click", function clickdelete() {
      deleteItem(idx);
    });
    let deleteimg = document.createElement("img");
    deleteimg.setAttribute("src", "./img/cart-remove.png");
    cartDelete.appendChild(deleteimg);
    cartItem.appendChild(cartDelete);
  });
  calculateTotalAmount();
}
