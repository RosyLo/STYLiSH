//CART DATA
let overallData = {
  prime: "",
  order: {
    shipping: "delivery",
    payment: "credit_card",
    subtotal: "",
    freight: "60",
    total: "",
    recipient: {
      name: "",
      phone: "",
      email: "",
      address: "",
      time: "",
    },
    list: [
      //   {
      //     //checkCart插入list
      //       id: '',
      //       main_image: '',
      //       name: '',
      //       price: '',
      //       color: {
      //         name: '',
      //         code: ''
      //       },
      //       size: '',
      //       qty:''
      //   },
    ],
  },
};

const cartQty = document.querySelectorAll(".qty");
function changecartNum() {
  cartQty.forEach((element) => {
    element.textContent = getStorageCart().order.list.length;
  });
}

// let  overallDataList= overallData.order.list;

function getStorageCart() {
  return JSON.parse(window.localStorage.getItem("cart"));
}

function stringnifyData(data) {
  return JSON.stringify(data);
}

// let storageCart = null;

checkCart();

function checkCart() {
  //initiate 一開始放進local storage 的空object overallData}
  if (!window.localStorage.getItem("cart")) {
    let stringOverallData = JSON.stringify(overallData);
    window.localStorage.setItem("cart", stringOverallData);
    changecartNum();
  } else {
    changecartNum();
  }
}
/*eslint no-unused-vars: ["error", { "vars": "local" }]*/
function addCart(addedCartData) {
  overallData = getStorageCart();

  function ifexist(data) {
    return (
      data.id === addedCartData.id &&
      data.color === addedCartData.color &&
      data.size === addedCartData.size
    );
  }
  let existData = overallData.order.list.find(ifexist);

  if (existData) {
    //sum: 之前此品項數+現在addedcart數（還未看是否超出stock）
    let sum = existData.qty + addedCartData.qty;
    if (sum <= addedCartData.stock) {
      alert("已加入購物車");
      existData.qty = sum;
      let newQty = stringnifyData(overallData);
      window.localStorage.setItem("cart", newQty);
    } else {
      alert("目前沒有這麼多庫存，請撥打客服電話以協助您預定");
      existData.qty = addedCartData.stock;
      let newQty = stringnifyData(overallData);
      window.localStorage.setItem("cart", newQty);
    }
  } else {
    alert("已加入購物車");
    //沒找到同一組合 >>加上組合
    overallData.order.list.push(addedCartData);
    let addData = stringnifyData(overallData);
    window.localStorage.setItem("cart", addData);
    ///更新購物車數字
    changecartNum();
  }
}
