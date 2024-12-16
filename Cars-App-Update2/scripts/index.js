import {
  diff,
} from "https://esm.sh/deep-object-diff";

import {
    serialize,
    populate,
    resetAllFormFields,
    validate,
    renderUI,
    noCarsMessage,
    createCarListItem,
    centeredSpinner,
  } from './utils.js'

import {
  getCars,
  addCar,
  updateCar,
  removeCar,
} from './api.js'


import CarApp from "./classes/car-app.js";

const vicCarsApp = new CarApp({ owner: "Vic" });

const listElement = document.getElementById("cars-list");
const addForm = document.forms["add-car-form"];
const updateForm = document.forms["update-car-form"];

const toastElement = document.getElementById("toast");
const toast = bootstrap.Toast.getOrCreateInstance(toastElement);
const toadtBody = toastElement.querySelector(".toast-body");

const renderOptions = {
    fn: function ({cars, owner}) {
      return renderUI({
        cars,
        owner,
        listElement,
      });
    },
  };


  const loadCars = async (loaded=false) => {
    if (!loaded) {
      const result = await getCars();
      if (result instanceof Error) {
        toadtBody.textContent = result.message;
        toastElement.classList.replace("text-bg-success", "text-bg-danger");
        toast.show();
      } else if (Array.isArray(result)) {
        console.log(result);
        vicCarsApp.clearAllCars();
        vicCarsApp.createCars({ data: result });
      } else {
        console.warn("unexpected result", result);
      }
    }
  };

  const refreshBtn = document.getElementById("refresh");
if (refreshBtn) {
  refreshBtn.addEventListener("click", async (e) => {
    await loadCars(false);
    vicCarsApp.render(renderOptions);
  });
}


  if (listElement) {
    listElement.before(centeredSpinner);

    await loadCars();
    centeredSpinner.remove();

    vicCarsApp.render(renderOptions);
  
  listElement.addEventListener("click", async (e) => {
    const { target: clickedElement } = e;
    if (!clickedElement?.matches?.("button.remove"))
      return;

    const { id } = clickedElement.dataset;
    console.log('clicked id', id);

    const oldLi = clickedElement.closest("li.car-listing");

    if (clickedElement?.matches?.(".remove")) {

      const result = await removeCar({id});

      if (result instanceof Error) {
        toadtBody.textContent = result.message;
        toastElement.classList.replace("text-bg-success", "text-bg-danger");
        toast.show();
      } else {

        console.log(result);
        vicCarsApp.removeCar(id);
        const list = oldLi.closest("ol,ul");
        oldLi.remove();

        console.log(list);
        console.log(list.children.length);
        const carItemElements = list.children.length;

        if (!carItemElements) {
          list.after(noCarsMessage);
        } else {
          noCarsMessage.remove();
        }
      }
    }
  });
}

  if (addForm) {
    addForm.addEventListener("reset", (e) => {
      resetAllFormFields(e.target);
    });

    addForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const { target: form } = e;

      const data = serialize(form);

      data.bhp = Number(data.bhp);

      const result = await addCar({ data });
      if (result instanceof Error) {
        toadtBody.textContent = result.message;
        toastElement.classList.replace("text-bg-success", "text-bg-danger");
        toast.show();
      } else {
        vicCarsApp.createCar(result);

        toadtBody.textContent = `${data.name} created`;
        toastElement.classList.remove("text-bg-danger");
        toastElement.classList.add("text-bg-success");
        toast.show();

      }

      resetAllFormFields(form);
    });

  const submitBtn = addForm.querySelector('[type="submit"]');
  submitBtn.setAttribute("disabled", "disabled");

  const constrolSubmitButton = (e) => {
    console.log("form input");
    if (addForm.matches(":valid")) {
      console.log("valid");
      submitBtn.removeAttribute("disabled");
    } else {
      console.log("invalid");
      submitBtn.setAttribute("disabled", "disabled");
    }
  };

  addForm.addEventListener("input", constrolSubmitButton);

  addForm.addEventListener("change", constrolSubmitButton);

  const nameField = addForm["name"];
  const bhpField = addForm["bhp"];
  const avatarField = addForm["avatar_url"];

  nameField.addEventListener("input", (e) => {
    validate(nameField);
  });
  nameField.addEventListener("change", (e) => {
    validate(nameField);
  });

  bhpField.addEventListener("input", (e) => {
    validate(bhpField);
  });
  bhpField.addEventListener("change", (e) => {
    validate(bhpField);
  });

  avatarField.addEventListener("input", (e) => {
    validate(avatarField);
  });
  avatarField.addEventListener("change", (e) => {
    validate(avatarField);
  });

}


if (updateForm) {
  updateForm.addEventListener("reset", (e) => {
    resetAllFormFields(e.target);
  });

  await loadCars();

  updateForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const { target: form } = e;

    const carData = serialize(form);
    carData.bhp = Number(carData.bhp);

    const { _id, ...data } = carData;

    const oldCar = vicCarsApp.getCarById(_id);

    const updates = diff(oldCar, carData);
    console.log("diff", updates);

    const result = await updateCar({ id: _id, changes: updates });

    if (result instanceof Error) {
      toadtBody.textContent = result.message;
      toastElement.classList.replace("text-bg-success", "text-bg-danger");
      toast.show();
    } else {
      vicCarsApp.updateCar(_id, updates);

      toastElement.classList.remove("text-bg-danger");
      toastElement.classList.add("text-bg-success");

      toadtBody.textContent = `${data.name} updated`;
      toast.show();
    }
  });

  const submitBtn = updateForm.querySelector('[type="submit"]');
  submitBtn.setAttribute("disabled", "disabled");

  const constrolSubmitButton = (e) => {
    console.log("form input");
    if (updateForm.matches(":valid")) {
      console.log("valid");
      submitBtn.removeAttribute("disabled");
    } else {
      console.log("invalid");
      submitBtn.setAttribute("disabled", "disabled");
    }
  };

  updateForm.addEventListener("input", constrolSubmitButton);

  updateForm.addEventListener("change", constrolSubmitButton);

  const nameField = updateForm["name"];
  const bhpField = updateForm["bhp"];
  const avatarField = updateForm["avatar_url"];

  nameField.addEventListener("input", (e) => {
    validate(nameField);
  });
  nameField.addEventListener("change", (e) => {
    validate(nameField);
  });

  bhpField.addEventListener("input", (e) => {
    validate(bhpField);
  });
  bhpField.addEventListener("change", (e) => {
    validate(bhpField);
  });

  avatarField.addEventListener("input", (e) => {
    validate(avatarField);
  });
  avatarField.addEventListener("change", (e) => {
    validate(avatarField);
  });


  const url = new URL(location);
  const params = new URLSearchParams(url.search);
  const id = params.get("id");

  let errorAlert = document.createElement("div");
  errorAlert.classList.add("alert", "alert-danger");
  errorAlert.setAttribute("role", "alert");

  const main = document.querySelector("main > .container");

  if (!id) {
  errorAlert.textContent = "Error: No id set (in query string)";
  main.replaceChildren(errorAlert);
  } else {
  const car = vicCarsApp.getCarById(id);
  if (!car) {
    errorAlert.textContent = `Error: Car with id ${id} not found`;
    main.replaceChildren(errorAlert);
  } else {
      populate(updateForm, car);
    }
  }
}
