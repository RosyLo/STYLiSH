const search_mobile = document.querySelector(".searchMobile");
const form_mobile = document.querySelector(".form_mobile");
const logo_mobile = document.querySelector(".logo");

search_mobile.addEventListener("click", () => {
  search_mobile.style.display = "none";
  form_mobile.style.display = "block";
  logo_mobile.style.display = "none";
});
