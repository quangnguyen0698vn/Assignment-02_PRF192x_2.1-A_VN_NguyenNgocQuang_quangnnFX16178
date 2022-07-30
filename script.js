"use strict";

//As the storage.js is included and loaded first in all HTML files, I put some of the most resuable code in that file

let healthyCheck = false;

const runScript = function () {
  addSidebarAnimation();
  //Render the page the first time
  renderPetTable(getPetArrFromStorage(), "normal");
  //4. Hiển thị Breed
  autoShowingBreeds();

  const btnHealthy = document.getElementById("healthy-btn");
  btnHealthy.addEventListener("click", function () {
    healthyCheck = !healthyCheck;
    renderPetTable(getPetArrFromStorage(), "normal", healthyCheck);
  });

  const btnSubmit = document.getElementById("submit-btn");
  btnSubmit.addEventListener("click", handleAddNewPet);
};

const handleAddNewPet = function () {
  const data = getDataFromInputFields();
  if (validateData(data, true)) {
    data.addedId = createAddedId(getPetArrFromStorage());
    saveToStorage(createPetKey(data.id), data);
    renderPetTable(getPetArrFromStorage());
    resetInputForm();
  }
};

function handleDeletePet(e) {
  if (e.target.tagName === "BUTTON") {
    const id = e.target.dataset.petId;
    removeFromStorage(createPetKey(id));
    renderPetTable(getPetArrFromStorage(), "normal", healthyCheck);
  }
}

function resetInputForm() {
  //Reset input form to the defalt value
  idInput.value = "";
  nameInput.value = "";
  ageInput.value = "";
  typeInput.value = "Select Type";
  weightInput.value = "";
  lengthInput.value = "";
  colorInput.value = "#000000";
  breedInput.value = "Select Breed";
  vaccinatedInput.checked = false;
  dewormedInput.checked = false;
  sterilizedInput.checked = false;
}

runScript();
