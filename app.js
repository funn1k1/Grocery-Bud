const alert = document.querySelector(".alert");
const form = document.querySelector(".grocery-form");
const grocery = document.getElementById("grocery");
const submitBtn = document.querySelector(".submit-btn");
const container = document.querySelector(".grocery-container");
const list = document.querySelector(".grocery-list");
const clearnBtn = document.querySelector(".clear-btn");

let editElement;
let editFlag = false;
let editID = "";

form.addEventListener("submit", addItem);
clearnBtn.addEventListener("click", clearItems);
list.addEventListener("click", (e) => {
  const target = e.target;
  if (
    target.classList.contains("fa-edit") ||
    target.classList.contains("edit-btn")
  ) {
    editItem(target);
  } else if (
    target.classList.contains("fa-trash") ||
    target.classList.contains("delete-btn")
  ) {
    deleteItem(target);
  }
});
document.addEventListener("DOMContentLoaded", setupItems);

function setupItems() {
  let items = getLocalStorage();
  if (items.length) {
    items.forEach((item) => {
      createListItem(item.id, item.value);
    })
  }
  container.classList.add("show-container");
}

function createListItem(id, value) {
  const element = document.createElement("article");
  element.classList.add("grocery-item");
  // add id
  element.setAttribute("data-id", id);
  element.innerHTML = `
    <p class="title">${value}</p>
    <div class="btn-container">
      <button type="button" class="edit-btn">
        <i class="fas fa-edit"></i>
      </button>
      <button type="button" class="delete-btn">
        <i class="fas fa-trash"></i>
      </button>
    </div>
  `;
  list.appendChild(element);
}

function editItem(target) {
  let groceryItem = target.closest(".grocery-item");
  editElement = groceryItem.children[0];
  grocery.value = editElement.textContent;
  editFlag = true;
  editID = groceryItem.dataset.id;
  submitBtn.textContent = "Edit";
}

function deleteItem(target) {
  let groceryItem = target.closest(".grocery-item");
  const id = groceryItem.dataset.id;
  list.removeChild(groceryItem);
  if (list.children.length === 0) {
    container.classList.remove("show-container");
  }
  displayAlert("Item removed", "danger");
  setBackToDefault();
  removeLocalStorage(id);
}

function clearItems() {
  const items = document.querySelectorAll(".grocery-item");
  if (items.length > 0) {
    items.forEach((item) => {
      list.removeChild(item);
    });
  }
  container.classList.remove("show-container");
  displayAlert("empty list", "danger");
  setBackToDefault();
  localStorage.removeItem("list");
}

function addItem(e) {
  e.preventDefault();
  const value = grocery.value;
  const id = new Date().getTime().toString();
  if (value && !editFlag) {
    createListItem(id, value);
    displayAlert("Item added to the list", "success");
    container.classList.add("show-container");
    addToLocalStorage(id, value);
    setBackToDefault();
  } else if (value && editFlag) {
    editElement.textContent = value;
    editLocalStorage(editID, value);
    displayAlert("value changed", "success");
    setBackToDefault();
  } else {
    displayAlert("Please, enter the value", "danger");
  }
}
//
function displayAlert(text, action) {
  alert.textContent = text;
  alert.classList.add(`alert-${action}`);

  setTimeout(() => {
    alert.textContent = "";
    alert.classList.remove(`alert-${action}`);
  }, 1000);
}

function setBackToDefault() {
  grocery.value = "";
  editFlag = false;
  editID = "";
  submitBtn.textContent = "Submit";
}

function addToLocalStorage(id, value) {
  const grocery = { id, value };
  let items = getLocalStorage();
  items.push(grocery);
  localStorage.setItem("list", JSON.stringify(items));
}

function removeLocalStorage(id) {
  let items = getLocalStorage();
  items = items.filter((item) => {
    if (item.id !== id) {
      return item;
    }
  });
  localStorage.setItem("list", JSON.stringify(items));
}

function editLocalStorage(id, value) {
  let items = getLocalStorage();
  items = items.map((item) => {
    if (item.id == id) {
      item.value = value;
    }
    return item;
  });
  
  localStorage.setItem("list", JSON.stringify(items));
}

function getLocalStorage() {
  return localStorage.getItem("list")
    ? JSON.parse(localStorage.getItem("list"))
    : [];
}

