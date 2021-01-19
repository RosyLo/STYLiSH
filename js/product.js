/* global addCart */
const productName = document.querySelector(".product-name");
const productId = document.querySelector(".product-id");
const productPrice = document.querySelector(".product-price");
const productColors = document.querySelector(".product-colors");
const productSizes = document.querySelector(".product-sizes");
const productTexture = document.querySelector(".product-texture");
const productDescriptions = document.querySelector(".product-description");
const productStory = document.querySelector(".description-story");
const productImgs = document.querySelector(".description-img");

document.addEventListener("DOMContentLoaded", () => {
  //得到window 上的 query string
  const queryString = window.location.search;
  //創建querystring 的urlsearchparams interface
  const urlParams = new URLSearchParams(queryString);
  //return first value associated with the given search part
  const productId = urlParams.get("id");

  if (productId === null && window.location.name !== "/shopcart.html") {
    window.location.href = "./";
  } else {
    fetchProductPage(productId);
  }
});
let detailsInfo = null;
//product information
function fetchProductPage(id) {
  const mainImg = document.querySelector(".product-img");
  mainImg.innerHTML =
    " <div class='loadingwrap'><div>Loading</div><div class='lds-ellipsis'><div></div><div></div><div></div><div></div></div></div>";
  fetch(`https://api.appworks-school.tw/api/1.0/products/details?id=${id}`)
    .then((res) => {
      return res.json();
    })
    .then((data) => {
      detailsInfo = data.data;
      //main-image
      mainImg.innerHTML = `<img alt="product-img" src="${detailsInfo.main_image}"/>`;
      //product-name
      productName.textContent = detailsInfo.title;
      //product-id
      productId.textContent = detailsInfo.id;
      //product-price
      productPrice.textContent = `TWD.${detailsInfo.price}`;
      //product-colors
      detailsInfo.colors.map((color) => {
        let productColor = document.createElement("span");
        productColor.className = "product-color";
        productColor.setAttribute("style", `background-color:#${color.code}`);
        productColor.setAttribute("data-color", `${color.code}`);
        productColor.setAttribute("data-color-name", `${color.name}`);
        productColors.appendChild(productColor);
      });
      //prodcut-sizes
      detailsInfo.sizes.map((size) => {
        let productSize = document.createElement("span");
        productSize.className = "product-size";
        productSize.setAttribute("data-size", `${size}`);
        productSize.textContent = `${size}`;
        productSizes.appendChild(productSize);
      });
      //product-summary
      //texture
      productTexture.textContent = detailsInfo.texture;
      //description
      productDescriptions.innerHTML =
        detailsInfo.description.replace(/\r\n/, "<br>") + "<br><br>";
      //productwash
      let productWash = document.createElement("span");
      productWash.textContent = `清洗：${detailsInfo.wash}`;
      productDescriptions.appendChild(productWash);
      productDescriptions.innerHTML += "<br>";
      //place
      let productCountry = document.createElement("span");
      productCountry.textContent = `產地：${detailsInfo.place}`;
      productDescriptions.appendChild(productCountry);
      //story
      productStory.textContent = detailsInfo.story;
      //img
      detailsInfo.images.map((img) => {
        let productImg = document.createElement("img");
        productImg.setAttribute("src", img);
        productImgs.appendChild(productImg);
      });
      initializeVariants(detailsInfo);
      //.then
    });
}

let variants = null;
let variant = null;

function initializeVariants(detailsInfo) {
  variants = detailsInfo.variants;
  for (let i = 0; i < variants.length; i++) {
    if (variants[i].stock > 0) {
      variant = {
        colorCode: variants[i].color_code,
        size: variants[i].size,
        qty: 1,
      };
      break;
    }
  }

  //click >> colorCodeChange
  document
    .querySelectorAll(".product-color")
    .forEach((color) => color.addEventListener("click", handleColorChange));
  document
    .querySelectorAll(".product-size")
    .forEach((size) => size.addEventListener("click", handleSizeChange));
  document
    .querySelectorAll(".op")
    .forEach((op) => op.addEventListener("click", handleQTYChanged));
  renderVariants();

  function getStock(colorCode, size) {
    return variants.find((v) => v.color_code === colorCode && v.size === size)
      .stock;
  }

  //color click /換size 時，數量回到初始 1/
  function handleColorChange(e) {
    //點到的color dataset 的color 值
    const color = e.currentTarget.dataset.color;
    const colorname = e.currentTarget.dataset.colorName;
    //將variant 現在的colorCode 改為點擊的dataset colorcode
    variant.colorCode = color;
    variant.colorName = colorname;
    //每次點，定位在該顏色第一個有庫存的尺寸
    if (getStock(color, variant.size) === 0) {
      variant.size = variants.find(
        (v) => v.color_code === color && v.stock > 0
      ).size;
    }
    variant.qty = 1;
    renderVariants();
    //handlecolorchange
  }

  //size click /換size 時，數量回到初始 1/
  function handleSizeChange(e) {
    const size = e.currentTarget.dataset.size;
    //若庫存=0，不把variant.size更新，以控制沒庫存的顏色+size組合的size不會變成variant.size。到render時會抓出，顏色，size組合中，沒庫存的組合>>給disabled
    if (getStock(variant.colorCode, size) === 0) {
      return;
    }
    variant.size = size;
    variant.qty = 1;
    renderVariants();
  }

  //qty click
  function handleQTYChanged(e) {
    const value = e.currentTarget.dataset.value;
    const stock = getStock(variant.colorCode, variant.size);
    variant.qty += parseInt(value);
    variant.qty = Math.max(1, variant.qty);
    variant.qty = Math.min(stock, variant.qty);
    renderVariants();
  }

  //getStock

  //render
  function renderVariants() {
    document.querySelectorAll(".product-color").forEach((color) => {
      if (color.dataset.color === variant.colorCode) {
        color.classList.add("current");
      } else {
        color.classList.remove("current");
      }
    });

    document.querySelectorAll(".product-size").forEach((size) => {
      size.classList.remove("current");
      size.classList.remove("disabled");

      if (size.dataset.size === variant.size) {
        size.classList.add("current");
      } else if (getStock(variant.colorCode, size.dataset.size) === 0) {
        size.classList.add("disabled");
      }
    });
    document.querySelector(".products-qty .value").textContent = variant.qty;
  }

  document.querySelector(".product-addCart").addEventListener("click", () => {
    //得到現在組合的variant stock 數字
    let stock = getStock(variant.colorCode, variant.size);

    //帶入在cart頁需要的參數

    //得到colorname
    let colors = detailsInfo.colors;
    colors.map((color) => {
      if ((color.code = variant.colorCode)) {
        variant.colorName = color.name;
      }
    });

    let addedCartData = {
      id: detailsInfo.id,
      mainimage: detailsInfo.main_image,
      name: detailsInfo.title,
      price: detailsInfo.price,
      stock: stock,
      color: variant.colorCode,
      colorname: variant.colorName,
      size: variant.size,
      qty: variant.qty,
    };
    //呼叫addCart function
    addCart(addedCartData);
  });

  //initialize
}
