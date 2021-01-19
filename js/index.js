let tagParam = null;
let keywordParam = null;
let products = null;

//DOM Ready, identify tag page, fetch specific products
document.addEventListener("DOMContentLoaded", () => {
  keyVisualSession();
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const tag = urlParams.get("tag");
  const paging = urlParams.get("paging");
  const keyword = urlParams.get("keyword");
  if (tag === null && keyword === null) {
    let path = "all";
    tagParam = path;
    fetchProduct(path, keyword, paging);
  } else if (tag === "women") {
    tagParam = tag;
    fetchProduct(tag, keyword, paging);
    const navswomen = Array.from(document.querySelectorAll(".women"));
    navswomen.forEach((nav) => {
      nav.classList.add("currentnav");
    });
  } else if (tag === "men") {
    tagParam = tag;
    fetchProduct(tag, keyword, paging);
    const navsmen = Array.from(document.querySelectorAll(".men"));
    navsmen.forEach((nav) => {
      nav.classList.add("currentnav");
    });
  } else if (tag === "accessories") {
    tagParam = tag;
    fetchProduct(tag, keyword, paging);
    const navsaccess = Array.from(document.querySelectorAll(".accessories"));
    navsaccess.forEach((nav) => {
      nav.classList.add("currentnav");
    });
  } else {
    let tag = "search";
    tagParam = tag;
    keywordParam = keyword;
    searchProduct(tag, keyword);
  }
});

function keyVisualSession() {
  fetch("https://api.appworks-school.tw/api/1.0/marketing/campaigns")
    .then((res) => {
      return res.json();
    })
    .then((visual) => {
      let visualData = visual.data;
      let visualHTML = "";
      visualHTML += "<div class = 'visualwrap'>";
      for (let i = 0; i < visualData.length; i++) {
        //keyvisual
        visualHTML += "<div class='visual'";
        visualHTML += `style="background-image: url(${visualData[i].picture});">`;
        let x = visualData[i].story.replace(/\r\n/gi, "</br>");

        visualHTML += `<div class="story">${x}</div></div>`;
        //step
      }
      visualHTML += "</div>";
      visualHTML += "<div class ='step'>";
      let stepHTML = "";
      for (let j = 0; j < visualData.length; j++) {
        stepHTML += "<div class ='circle'></div>";
      }
      visualHTML += stepHTML;
      visualHTML += "</div>";
      const keyvisual = document.querySelector(".keyvisual");
      keyvisual.innerHTML = visualHTML;

      const pics = Array.from(document.querySelectorAll(".visual"));
      const circles = Array.from(document.querySelectorAll(".circle"));

      //automated rotate
      let index = 0;
      carousel();
      function carousel() {
        let i;
        for (i = 0; i < pics.length; i++) {
          let circles = Array.from(document.querySelectorAll(".circle"));
          let pics = Array.from(document.querySelectorAll(".visual"));
          circles.forEach((circle) => carouselCircleFunction(circle));
          pics.forEach((pic) => carouselPircleFunction(pic));
        }
        index++;
        if (index > pics.length) {
          index = 1;
        }
        circles[index - 1].classList.add("current");
        pics[index - 1].classList.add("current");
      }
      let interval = setInterval(carousel, 5000);

      //remove "current" and  add mouseover eventlistener
      function carouselCircleFunction(circle) {
        circle.classList.remove("current");
      }
      function carouselPircleFunction(pic) {
        pic.classList.remove("current");
        pic.addEventListener("mouseover", pauseSlides);
        pic.addEventListener("mouseout", resumeSlides);
      }

      function pauseSlides() {
        clearInterval(interval);
      }
      function resumeSlides() {
        interval = setInterval(carousel, 5000);
      }

      //click
      circles.forEach((circle, idx) => {
        circle.addEventListener("click", () => {
          circles.forEach((circle) => circle.classList.remove("current"));
          pics.forEach((pic) => pic.classList.remove("current"));
          pics[idx].classList.add("current");
          circles[idx].classList.add("current");
        });
      });

      //direct keyvisual to product page
      const visualwrap = document.querySelector(".visualwrap");
      visualwrap.addEventListener("click", () => {
        const visual = document.querySelectorAll(".visual");
        visual.forEach((ele, idx) => {
          if (ele.classList.contains("current")) {
            let id = visualData[idx].product_id;
            window.open(`./product.html?id=${id}`);
          }
        });
      });
    });
}

//search
function searchProduct(pathtag, keyword) {
  fetch(
    `https://api.appworks-school.tw/api/1.0/products/${pathtag}?keyword=${keyword}`
  )
    .then((res) => {
      return res.json();
    })
    .then((data) => {
      products = data;
      let listjson = data.data;
      const list = document.querySelector(".products");
      let listHTML = "";
      for (let i = 0; i < listjson.length; i++) {
        listHTML += "<div class='product'>";
        listHTML += `<img src=" ${listjson[i].main_image} " />`;
        listHTML += "<div class='colors'>";
        let colorLength = listjson[i].colors.length;
        let colorHTML = "";
        for (let j = 0; j < colorLength; j++) {
          colorHTML += "<div class='color' style ='background-color:#";
          colorHTML += listjson[i].colors[j].code;
          colorHTML += ";'></div>";
        }
        colorHTML += "</div>";
        listHTML += colorHTML;
        listHTML += "<div class='name'>' + listjson[i].title + '</div>";
        listHTML += "<div class='price'>' + listjson[i].price + '</div>";
        listHTML += "</div>";
      }
      list.innerHTML = listHTML;
    });
}
let listHTML = "";
//fetch data function
function fetchProduct(pathtag, keyword, paging) {
  products = null;
  let list = document.querySelector(".products");
  list.innerHTML +=
    " <div class='loadingwrap'><div>Loading</div><div class='lds-ellipsis'><div></div><div></div><div></div><div></div></div></div>";
  fetch(
    `https://api.appworks-school.tw/api/1.0/products/${pathtag}?keyword=${keyword}&paging=${paging}`
  )
    .then((res) => {
      return res.json();
    })
    .then((data) => {
      products = data;
      let listjson = data.data;
      for (let i = 0; i < listjson.length; i++) {
        listHTML += "<div class='product'>";
        listHTML += `<a href="./product.html?id=${listjson[i].id}" target ="_black">`;
        listHTML += `<img alt="product" src=" ${listjson[i].main_image}" />`;
        listHTML += "</a>";
        listHTML += "<div class='colors'>";
        let colorLength = listjson[i].colors.length;
        let colorHTML = "";
        for (let j = 0; j < colorLength; j++) {
          colorHTML += "<div class='color' style ='background-color:#";
          colorHTML += listjson[i].colors[j].code;
          colorHTML += ";'></div>";
        }
        colorHTML += "</div>";
        listHTML += colorHTML;
        listHTML += "<div class='name'>" + listjson[i].title + "</div>";
        listHTML += "<div class='price'>TWD:" + listjson[i].price + "</div>";
        listHTML += "</div>";
      }
      list.innerHTML = "";
      list.innerHTML += listHTML;
    });
}

//*** trigger  >>若document 的底部快沒了，就要load paging
window.addEventListener("scroll", () => {
  if (products) {
    //get veiwportheight
    const viewHeight = document.documentElement.clientHeight;
    //get docheight
    const documentButtonRelative = document.documentElement.getBoundingClientRect()
      .bottom;
    const reachBottom = documentButtonRelative - viewHeight < 20;
    if (products.next_paging !== undefined && reachBottom) {
      fetchProduct(tagParam, keywordParam, products.next_paging);
    }
  }
});
