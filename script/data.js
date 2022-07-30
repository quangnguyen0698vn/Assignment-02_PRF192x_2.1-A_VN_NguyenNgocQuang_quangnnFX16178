"use strict";

//As the storage.js is included and loaded first in all HTML files, I put some of the most resuable code in that file
addSidebarAnimation();

const btnImport = document.getElementById("import-btn");
btnImport.addEventListener("click", handleImportData);

const btnExport = document.getElementById("export-btn");
btnExport.addEventListener("click", handleExportData);

//https://stackoverflow.com/questions/750032/reading-file-contents-on-the-client-side-in-javascript-in-various-browsers

function handleImportData(e) {
  let file = document.getElementById("input-file").files[0];
  // console.log(file);
  if (file) {
    let reader = new FileReader();
    reader.readAsText(file, "UTF-8");
    reader.onload = function (evt) {
      const data = JSON.parse(evt.target.result);

      //Remove all current pets from localStorage
      const keys = Object.keys(localStorage);
      for (const key of keys) {
        if (key.startsWith("pet")) removeFromStorage(key);
      }

      //then add the new pets from the input file
      data.forEach((pet, i) => {
        pet.addedId = i;
        saveToStorage(createPetKey(pet.id), pet);
        if (
          getBreedArrFromStorage().filter(
            (breed) => breed.name === pet.breed && breed.type === pet.type
          ).length === 0
        ) {
          //This is a new breeds option => Save to Storage
          const id = createAddedId(getBreedArrFromStorage());
          saveToStorage(createBreedKey(id), {
            name: pet.breed,
            type: pet.type,
            addedId: id,
          });
        }
      });
      alert("JSON file imported successfully");
    };
    reader.onerror = function (evt) {
      alert("This file does not work. Please upload other file");
    };
  }
}

// https://zellwk.com/blog/bower/
// https://www.websparrow.org/web/how-to-create-and-save-text-file-in-javascript
// https://github.com/eligrey/FileSaver.js/

function handleExportData(e) {
  const pets = getPetArrFromStorage().sort((a, b) => a.addedId - b.addedId); //Sort để maintain đúng thứ tự add nếu sau này import lại file json
  for (const pet of pets) delete pet.addedId;
  let blob = new Blob([JSON.stringify(pets)], {
    type: "text/plain;charset=utf-8",
  });
  saveAs(blob, "pets-data.json");
  alert("JSON file exported successfully");
}
