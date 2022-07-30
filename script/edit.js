"use strict";

//As the storage.js is included and loaded first in all HTML files, I put some of the most resuable code in that file
const formContainer = document.getElementById("container-form");

const runEdit = function () {
  addSidebarAnimation();
  renderPetTable(getArrFromStorage("pet"), "edit"); //ở mode edit sẽ không có cột button được hiển thị
  autoShowingBreeds(); //thêm tính năng tự động hiển thị các options tương ứng của từng lại type (dog/cat), code được implement ở file storage.js
};

function handleEditPet(e) {
  if (e.target.tagName !== "BUTTON") return;

  const petId = e.target.dataset.petId; //my trick is to add the data-pet-id attribute to the element
  formContainer.classList.contains("hide") &&
    formContainer.classList.toggle("hide"); //Tắt hide, tức hiển thị edit form

  //Display current pet's information into the input fields
  displayInputData(getFromStorage(createPetKey(petId)));

  const btnSubmit = document.getElementById("submit-btn");
  btnSubmit.addEventListener("click", handlePetModification);
}

function handlePetModification() {
  const data = getDataFromInputFields();
  if (!validateData(data, false)) return; //Do edit pet information nên không cần check petId có duplicate hay không

  const petId = data.id;
  const oldPet = getFromStorage(createPetKey(petId));
  data.addedId = oldPet.addedId;
  data.date = oldPet.date;
  updateToStorage(createPetKey(petId), data);
  renderPetTable(getPetArrFromStorage(), "edit");
  !formContainer.classList.contains("hide") &&
    formContainer.classList.toggle("hide");
}

runEdit();
