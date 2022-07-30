"use strict";

/* BELOW FUNCTION IS CALLED TO CLEAR THE LOCAL STORAGE */

// clearStorage();

function clearStorage() {
  localStorage.clear();
}

const createAddedId = (arr) =>
  arr.reduce((res, cur) => (res < cur.addedId ? cur.addedId : res), -1) + 1;
const createPetKey = (id) => "pet" + id;
const createBreedKey = (id) => "breed" + id;
const getBreedArrFromStorage = () => getArrFromStorage("breed");
const getPetArrFromStorage = () => getArrFromStorage("pet");

/* Storage sẽ có những khóa như sau 'pet*' lưu pet object, 'breed*' lưu breed obj */

// saveToStorage: Hàm nhận hai tham số là Key và Vaule, sau đó sẽ thực hiện việc lưu xuống LocalStorage.
const saveToStorage = function (key, value) {
  localStorage.setItem(key, JSON.stringify(value));
};

// getFromStorage: Hàm nhận vào tham số là Key, sau đó sẽ lấy dữ liệu từ LocalStorage theo Key tương ứng.

const getFromStorage = function (key) {
  return JSON.parse(localStorage.getItem(key));
};

// removeFromStorage: Xóa dữ liệu khỏi local storage
const removeFromStorage = function (key) {
  localStorage.removeItem(key);
};

// Cập nhật giá trị mới cho khóa

function updateToStorage(key, newValue) {
  removeFromStorage(key);
  saveToStorage(key, newValue);
}

//Tạo mảng lưu những obj giống nhau breed hoặc pet
function getArrFromStorage(prefix) {
  let result = [];
  const keys = Object.keys(localStorage);
  for (const key of keys) {
    if (key.startsWith(prefix)) result.push(getFromStorage(key));
  }
  return result;
}

/* BELOW CODE IS IMPLEMENTED IN THIS JS FILE TO BE EXECUTED IN EVERY HTML LOADED IN THIS PROJECT */

const idInput = document.querySelector("#input-id");
const nameInput = document.querySelector("#input-name");
const ageInput = document.querySelector("#input-age");
const typeInput = document.querySelector("#input-type");
const breedInput = document.querySelector("#input-breed");
const weightInput = document.querySelector("#input-weight");
const lengthInput = document.querySelector("#input-length");
const colorInput = document.querySelector("#input-color-1");
const vaccinatedInput = document.querySelector("#input-vaccinated");
const dewormedInput = document.querySelector("#input-dewormed");
const sterilizedInput = document.querySelector("#input-sterilized");

//1. Bổ sung Animation cho Sidebar, cho tất cả các trang html có add file storage.js này
function addSidebarAnimation() {
  const sidebar = document.getElementById("sidebar");
  sidebar.addEventListener("click", function (e) {
    //Nếu click nhằm phải đường link -> không hiện hiệu ứng để browser load page khác
    let clicked = e.target.closest("a");
    if (clicked && clicked.tagName === "A") return;
    clicked = e.target.closest("nav");
    if (clicked.tagName !== "NAV") return;
    clicked.classList.toggle("active");
    // if (e.target.tagName !== "NAV") return;
    // e.target.classList.toggle("active");
  });
}

//Render Table (sử dụng ở index.html, edit.html, search.html) ~ mode = 0 1 2 = normal edit search

function getNumberMode(mode) {
  let result = -1;
  switch (mode) {
    case "normal":
      result = 0;
      break;
    case "edit":
      result = 1;
      break;
    case "search":
      result = 2;
      break;
    default:
      result = -1;
  }
  return result;
}

//Render dữ liệu pet cho 3 trang index.html, edit.html, search.html, tính năng chỉ hiển thị các healthy-pets

function renderPetTable(petArr, mode = "normal", healthyCheck = false) {
  const numMode = getNumberMode(mode);
  if (numMode < 0) return;

  if (healthyCheck) {
    const healthyPetArr = petArr.filter(
      (pet) => pet.vaccinated && pet.dewormed && pet.sterilized
    );
    renderPetTable(healthyPetArr, mode);
    return;
  }

  petArr.sort((a, b) => a.addedId - b.addedId);

  // console.log(petArr);

  const tbody = document.querySelector("#tbody");
  tbody.innerHTML = "";
  if (numMode < 2)
    tbody.removeEventListener(
      "click",
      numMode === 0 ? handleDeletePet : handleEditPet
    );

  petArr.forEach((pet) => {
    const {
      id,
      name,
      age,
      type,
      weight,
      length,
      breed,
      color,
      vaccinated,
      dewormed,
      sterilized,
      date,
    } = pet;

    //debugger;

    const row = document.createElement("tr");

    let strHTML = `<th scope="row">${id}</th>
    <td>${name}</td>
    <td>${age}</td>
    <td>${type}</td>
    <td>${weight} kg</td>
    <td>${length} cm</td>
    <td>${breed}</td>
    <td>
      <i class="bi bi-square-fill" style="color: ${color}"></i>
    </td>
    <td><i class="bi ${
      vaccinated ? `bi-check-circle-fill` : `bi-x-circle-fill`
    }"></i></td>
    <td><i class="bi ${
      dewormed ? `bi-check-circle-fill` : `bi-x-circle-fill`
    }"></i></td>
    <td><i class="bi ${
      sterilized ? `bi-check-circle-fill` : `bi-x-circle-fill`
    }"></i></td>
    <td>${new Date(date).toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    })}</td>`;

    if (numMode < 2)
      strHTML += `
      <td><button type="button" class="btn ${
        numMode === 0 ? `btn-danger` : `btn-warning`
      }" data-pet-id="${id}">${
        numMode === 0 ? `Delete` : `Edit`
      }</button></td>`;

    row.innerHTML = strHTML;
    tbody.appendChild(row);

    if (numMode < 2)
      tbody.addEventListener(
        "click",
        numMode === 0 ? handleDeletePet : handleEditPet
      );
  });
}

// 4. Hiển thị Breed
//Các hàm dưới đây phục vụ tính năng tự động xổ các breed options theo đúng giống dog/cat, includeAll xảy ra trong giao diện search.html

const renderBreed = function (breeds, includeAll = false) {
  // console.log(localStorage);
  // console.log(breeds);

  const breedOptionsContainer = document.getElementById("input-breed");
  const type = typeInput.value;

  includeAll = includeAll && type === "Select Type";

  let breedOptions = breeds;
  if (!includeAll) breedOptions = breeds.filter((breed) => breed.type === type);

  breedOptions.sort((a, b) => a.addedId - b.addedId);

  while (breedOptionsContainer.childElementCount > 1)
    breedOptionsContainer.removeChild(breedOptionsContainer.lastElementChild);
  breedOptions.forEach((breed) => {
    const option = document.createElement("option");
    option.innerHTML = `${breed.name}`;
    breedOptionsContainer.appendChild(option);
  });
};

function autoShowingBreeds(includeAll = false) {
  const typeInput = document.getElementById("input-type");
  typeInput.addEventListener(
    "input",
    renderBreed.bind(typeInput, getBreedArrFromStorage(), includeAll)
  );
}

//This function is to check if the user input enough information or not
const hasEmptyFields = function (data) {
  // console.log(data);
  const { id, name, age, weight, length } = data;
  if (id === "") alert("Please input for id");
  if (name === "") alert("Please input for name");
  if (Number.isNaN(age)) alert("Please input for age");
  if (Number.isNaN(weight)) alert("Please input for weight");
  if (Number.isNaN(length)) alert("Please input for length");
  return (
    id === "" ||
    name === "" ||
    Number.isNaN(age) ||
    Number.isNaN(weight) ||
    Number.isNaN(length)
  );
};

//validate dữ liệu nhập từ form, tắt check duplicate khi đang edit thông tin pet có sẵn, default là check hết

const validateData = function (data, checkDuplicatedPetId = true) {
  //This function is to valuate the form after the sumbit button is clicked
  // Không có trường nào bị nhập thiếu dữ liệu.
  // console.log(data);
  let result = !hasEmptyFields(data);
  // Giá trị ID không được trùng với các thú cưng còn lại. Nếu không hợp lệ, hãy đưa ra thông báo "ID must unique!".
  if (
    checkDuplicatedPetId &&
    getPetArrFromStorage().filter((pet) => pet.id === data.id).length > 0
  ) {
    alert("ID must unique");
    result = false;
  }
  // Trường Age chỉ được nhập giá trị trong khoảng 1 đến 15. Nếu không hợp lệ, hãy đưa ra thông báo "Age must be between 1 and 15!".
  const { age, weight, length, type, breed } = data;

  //below line is for debugging, please ignore
  // console.log(age, typeof age);
  if (!Number.isNaN(age) && !(age >= 1 && age <= 15)) {
    alert("Age must be between 1 and 15!");
    result = false;
  }
  // Trường Weight chỉ được nhập giá trị trong khoảng 1 đến 15. Nếu không hợp lệ, hãy đưa ra thông báo "Weight must be between 1 and 15!".
  if (!Number.isNaN(weight) && !(weight >= 1 && weight <= 15)) {
    alert("Weight must be between 1 and 15!");
    result = false;
  }
  // Trường Length chỉ được nhập giá trị trong khoảng 1 đến 100. Nếu không hợp lệ, hãy đưa ra thông báo "Length must be between 1 and 100!".
  if (!Number.isNaN(length) && !(length >= 1 && length <= 100)) {
    alert("Length must be between 1 and 100!");
    result = false;
  }
  // Bắt buộc phải chọn giá trị cho trường Type. Nếu không hợp lệ, hãy đưa ra thông báo "Please select Type!".
  if (type === "Select Type") {
    alert("Please select Type!");
    result = false;
  }
  // Bắt buộc phải chọn giá trị cho trường Breed. Nếu không hợp lệ, hãy đưa ra thông báo "Please select Breed!".
  if (breed === "Select Breed") {
    alert("Please select Breed!");
    result = false;
  }
  return result;
};

//Hàm này lấy thông tin từ form, phục vụ cho việc thêm/chỉnh sửa thông tin pet
const getDataFromInputFields = function () {
  const data = {
    id: idInput.value,
    name: nameInput.value,
    age: parseInt(ageInput.value),
    type: typeInput.value,
    weight: parseInt(weightInput.value),
    length: parseInt(lengthInput.value),
    color: colorInput.value,
    breed: breedInput.value,
    vaccinated: vaccinatedInput.checked,
    dewormed: dewormedInput.checked,
    sterilized: sterilizedInput.checked,
    date: new Date(),
    addedId: -1,
  };

  return data;
};

//Hàm này phục vụ hiển thị thông tin lên form khi click vào button edit
const displayInputData = function (data) {
  idInput.value = data.id;
  nameInput.value = data.name;
  ageInput.value = data.age;
  typeInput.value = data.type;
  renderBreed(getBreedArrFromStorage());
  weightInput.value = data.weight;
  lengthInput.value = data.length;
  breedInput.value = data.breed;
  colorInput.value = data.color;
  vaccinatedInput.checked = data.vaccinated;
  dewormedInput.checked = data.dewormed;
  sterilizedInput.checked = data.sterilized;
  idInput.disable = true;
};

/*BELOW CODE IS TO TEST THE WEBSITE */
/*
function runStorage() {
  const data = [
    {
      id: "P001",
      name: "Dober Mix",
      age: 3,
      type: "Dog",
      weight: 12,
      length: 87,
      color: "#e08f8f",
      breed: "Doberman Pinscher",
      vaccinated: true,
      dewormed: true,
      sterilized: true,
      date: "2022-03-04T11:06:04.427Z",
    },
    {
      id: "P002",
      name: "Charlie Tux",
      age: 4,
      type: "Cat",
      weight: 4,
      length: 65,
      color: "#8cee9c",
      breed: "Tabby",
      vaccinated: true,
      dewormed: false,
      sterilized: false,
      date: "2022-03-04T11:06:41.554Z",
    },
    {
      id: "P003",
      name: "Sweetie Pie",
      age: 3,
      type: "Dog",
      weight: 6,
      length: 45,
      color: "#ff1414",
      breed: "Husky",
      vaccinated: false,
      dewormed: false,
      sterilized: true,
      date: "2022-03-04T11:12:01.522Z",
    },
  ];

  data.forEach((pet, i) => {
    pet.addedId = i;
    saveToStorage(createPetKey(pet.id), pet);
  });
}
*/
// runStorage();
