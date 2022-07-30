"use strict";

const runBreed = function () {
  //Render the Page
  addSidebarAnimation();
  showBreed(getBreedArrFromStorage());

  //Add Button Click Event Handle
  const btnSubmit = document.getElementById("submit-btn");

  btnSubmit.addEventListener("click", handleAddNewBreed);
};

const handleAddNewBreed = function (e) {
  const breedInput = document.getElementById("input-breed");
  const typeInput = document.getElementById("input-type");

  if (typeInput.value == "Select Type") {
    alert("Please input type");
    return;
  }
  if (breedInput.value === "") {
    alert("Please input breed");
    return;
  }
  if (
    getBreedArrFromStorage().filter(
      (breed) =>
        breed.name === breedInput.value && breed.type === typeInput.value
    ).length > 0
  ) {
    alert("This breed is already available. Please enter another breed");
    return;
  }
  const data = {
    name: breedInput.value,
    type: typeInput.value,
    addedId: createAddedId(getBreedArrFromStorage()),
  };
  saveToStorage(createBreedKey(data.addedId), data);
  breedInput.value = "";
  typeInput.value = "Select Type";
  showBreed(getBreedArrFromStorage());
};

const handleDeleteBreed = function (e) {
  if (e.target.tagName === "BUTTON") {
    const id = Number(e.target.dataset.addedId);
    console.log("clicked", id);
    removeFromStorage(createBreedKey(id));
    showBreed(getBreedArrFromStorage());
  }
};

const showBreed = function (breedArr) {
  const tbody = document.getElementById("tbody");

  tbody.innerText = "";
  tbody.removeEventListener("click", handleDeleteBreed);
  breedArr.sort((a, b) => a.addedId - b.addedId);
  breedArr.forEach((breed, i) => {
    const { addedId, name, type } = breed;
    tbody.insertAdjacentHTML(
      "beforeend",
      `<tr>
      <td scope="col">${i + 1}</td>
      <td scope="col">${name}</td>
      <td scope="col">${type}</td>
      <td scope="col"><button type="button" class="btn btn-danger" data-added-id="${addedId}">Delete</button></td>
    </tr>`
    );
  });
  tbody.addEventListener("click", handleDeleteBreed);
};

runBreed();
