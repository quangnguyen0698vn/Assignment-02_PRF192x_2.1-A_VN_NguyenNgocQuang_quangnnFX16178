"use strict";

//As the storage.js is included and loaded first in all HTML files, I put some of the most resuable code in that file

const btnFind = document.getElementById("find-btn");
btnFind.addEventListener("click", handleFindPet);

const runSearch = function () {
  addSidebarAnimation();
  renderPetTable(getPetArrFromStorage(), "search"); //Render the pet table the first time when page loads
  renderBreed(getBreedArrFromStorage(), true); //Render một lần đầu tiên các breeds options , includeAll = true để hiện thị tất cả breeds không phân biệt chó mèo nếu type = Select Type
  autoShowingBreeds(true); //add event listner để các lần sau hàm render Breed được tự động gọi
};

function handleFindPet() {
  let pets = getPetArrFromStorage();

  const idInput = document.querySelector("#input-id");
  let text = idInput.value;
  pets = pets.filter((pet) => pet.id.includes(text));

  const nameInput = document.querySelector("#input-name");
  text = nameInput.value;
  pets = pets.filter((pet) => pet.name.includes(text));

  const typeInput = document.querySelector("#input-type");
  text = typeInput.value;
  text !== "Select Type" && (pets = pets.filter((pet) => pet.type === text));

  const breedInput = document.querySelector("#input-breed");
  text = breedInput.value;
  text !== "Select Breed" && (pets = pets.filter((pet) => pet.breed === text));

  let ticked = false;

  const vaccinatedInput = document.querySelector("#input-vaccinated");
  ticked = vaccinatedInput.checked;
  ticked && (pets = pets.filter((pet) => pet.vaccinated === true));

  const dewormedInput = document.querySelector("#input-dewormed");
  ticked = dewormedInput.checked;
  ticked && (pets = pets.filter((pet) => pet.dewormed === true));

  const sterilizedInput = document.querySelector("#input-sterilized");
  ticked = sterilizedInput.checked;
  ticked && (pets = pets.filter((pet) => pet.sterilized === true));

  renderPetTable(pets, "search");
}

runSearch();
