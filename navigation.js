"use strict";

const myInit = {
  method: "GET",
  headers: {
    "Content-Type": "application/json"
  },
  mode: "cors",
  cache: "default"
};

let navRequest = new Request("./navigation.json", myInit);

const navigationApp = (function() {
  let myList;
  let indicatorBar;
  let cityNavItems;
  let p;

  const handleIndicatorBar = function(el) {
    cityNavItems.forEach(item => {
      item.classList.remove("selected");
    });

    let elStyles = window.getComputedStyle(el);
    let offsetPadding = elStyles.getPropertyValue("margin-left").slice(0, -2);

    indicatorBar.style.width = `${el.offsetWidth}px`;
    indicatorBar.style.left = `${el.offsetLeft - offsetPadding}px`;
    indicatorBar.style.transition = "0.2s";

    el.classList.add("selected");
  };

  const recalcIndicatorBar = function() {
    const itemSelected = document.querySelector(".selected");

    let elStyles = window.getComputedStyle(itemSelected);
    let offsetPadding = elStyles.getPropertyValue("margin-left").slice(0, -2);

    indicatorBar.style.width = `${itemSelected.offsetWidth}px`;
    indicatorBar.style.left = `${itemSelected.offsetLeft - offsetPadding}px`;
    indicatorBar.style.transition = "none";
  };

  let nA = {
    initApp: function(json) {
      myList = document.querySelector("ul.city-nav");
      indicatorBar = document.querySelector("ul.city-nav .indicator-bar");
      json.cities.forEach(c => {
        let listItem = document.createElement("li");
        listItem.innerHTML = c.label;
        listItem.addEventListener("click", e => {
          handleIndicatorBar(e.target);
        });
        myList.appendChild(listItem);
      });
      cityNavItems = document.querySelectorAll("ul.city-nav > li");

      handleIndicatorBar(myList.children[1]);
      window.addEventListener("resize", recalcIndicatorBar);
    }
  };
  return nA;
})();

fetch(navRequest)
  .then(function(response) {
    if (!response.ok) {
      throw new Error("HTTP error, status = " + response.status);
    }
    return response.json();
  })
  .then(navigationApp.initApp)

  .catch(function(error) {
    let p = document.createElement("p");
    p.appendChild(document.createTextNode("Error: " + error.message));
    document.body.insertBefore(p, myList);
  });
