const noCarsMessage = document.createElement("div");
noCarsMessage.classList.add("alert", "alert-success");
noCarsMessage.setAttribute("role", "alert");
noCarsMessage.textContent = `You have no cars`;

// spinner
const centeredSpinner = document.createElement('div');
centeredSpinner.classList.add('d-grid', 'justify-content-center');

const loadingSpinner = document.createElement('div');
loadingSpinner.classList.add("spinner-border", "text-primary");
loadingSpinner.setAttribute("role", "status");

centeredSpinner.append(loadingSpinner);

const spinnerAccessibilityText = document.createElement('span');
spinnerAccessibilityText.classList.add("visually-hidden");
loadingSpinner.replaceChildren(spinnerAccessibilityText);


function serialize(form) {
    const formData = new FormData(form);
    const data = Object.fromEntries(formData);

    const multis = Array.from(
      form.querySelectorAll('select[multiple], [type="checkbox"]')
    );
    const multiNames = Array.from(new Set(multis.map((input) => input.name)));
    console.log("multis", multis);

    if (multis.length) {
      for (const name of multiNames) {
        formData.set(name, formData.getAll(name));
      }
    }

    return data;
  }

  function populate(form, data = {}) {
    console.log("populate data", data);
    if (!form || !(form instanceof HTMLFormElement)) {
      throw new Error(
        `The populate function requires a form element. Instead received $form} of type ${form?.prototype?.Constructor?.name}`
      );
    }

    for (let [inputName, value] of Object.entries(data)) {
      value ??= "";

      const element = form[inputName];

      if (!element || !element instanceof Element) {
        console.warn(`Could not find element ${inputName}: bailing...`);
        continue;
      }

      const type = element.type || element[0].type;

      switch (type) {
        case "checkbox": {
          const values = Array.isArray(value) ? value : [value];
          const checkboxes = Array.isArray(element) ? element : [element];
          console.log("values", values);
          for (const checkbox of checkboxes) {
            console.log(checkbox.value);
            if (values.includes(checkbox.value)) {
              checkbox.checked = true;
            }
          }
          break;
        }
        case "select-multiple": {
          const values = Array.isArray(value) ? value : [value];

          for (const option of element) {
            if (values.includes(option.value)) {
              option.selected = true;
            }
          }
          break;
        }

        case "select":
        case "select-one":
          element.value = value.toString() || value;
          break;

        case "date":
          element.value = new Date(value).toISOString().split("T")[0];
          break;

        default:
          element.value = value;
          break;
      }
    }
  }

  const resetAllFormFields = (form) => {
    form.reset();

    for (const field of form.querySelectorAll('input[type="hidden"')) {
      field.value = "";
    }
  };

  function validate(input) {
    const formRow = input.closest(".form-row");
    const errorLabel = formRow.querySelector("label.error");
    console.log(errorLabel);
    errorLabel.textContent = "";

    const validityState = input.validity;
    console.log("validityState", validityState);

    if (validityState.valueMissing) {
      errorLabel.textContent = "This field is required and cannot be blank!";
    } else if (validityState.tooShort) {
      errorLabel.textContent = `The title must be at least ${input.getAttribute(
        "min-length"
      )} characters long!`;
    } else if (validityState.typeMismatch) {
      errorLabel.textContent = "Not a valid URL";
    }

    if (validityState.valid) {
      console.log("valid", validityState);
      formRow?.classList.remove("invalid");
    } else {
      console.log("invalid", validityState);
      formRow?.classList.add("invalid");
    }
  }

function createCarListItem({ car = {} } = {}) {
  const { name, bhp, avatar_url, _id } = car;

  const row = document.createElement("div");
  row.classList.add("item-row");

  const img = document.createElement("img");
  img.alt = "";
  img.src = avatar_url;
  img.width = 100;
  img.height = 100;
  img.classList.add("bg-info", "rounded-circle");

  row.append(img);

  const span = document.createElement("span");
  span.classList.add("me-auto");
  span.innerHTML = `${name} (${bhp} <abbr title="Break Horse Power">BHP</abbr>)`; // CHANGE 3: Correct the text

  row.append(span);

  const updateButton = document.createElement("a");
  updateButton.href = `/update.html?id=${_id}`;
  updateButton.classList.add("btn", "btn-warning", "update");

  const updateAccessibilityTextSpan = document.createElement("span");
  updateAccessibilityTextSpan.classList.add("visually-hidden");
  updateAccessibilityTextSpan.textContent = "update";

  const updateIcon = document.createElement("span");
  updateIcon.setAttribute("aria-hidden", "true");
  updateIcon.classList.add("fa-solid", "fa-pen");

  updateButton.append(updateAccessibilityTextSpan, updateIcon);

  const removeButton = document.createElement("button");
  removeButton.classList.add("btn", "btn-danger", "remove");
  removeButton.dataset.id = _id;

  const removeAccessibilityTextSpan =
    updateAccessibilityTextSpan.cloneNode(true);
  removeAccessibilityTextSpan.textContent = "remove";

  const removeIcon = updateIcon.cloneNode(true);
  removeIcon.classList.replace("fa-pen", "fa-trash");

  removeButton.append(removeAccessibilityTextSpan, removeIcon);

  row.append(updateButton, removeButton);

  const li = document.createElement("li");
  li.classList.add("list-group-item", "car-listing");

  li.append(row);

  return li;
}


function renderList({ cars = [], listElement } = {}) {

  const fragment = document.createDocumentFragment();

  for (const car of cars) {
    const li = createCarListItem({ car });
    fragment.append(li);
  }

  listElement.replaceChildren(fragment);
  return listElement;
}

function renderUI({
  cars = [],
  listElement,
  showTitle = true,
  titleLevel = 1,
  owner = "Vic",
}) {


  if (showTitle) {
    const title = document.createElement(`h${titleLevel}`);
    title.id = `${owner}-title`;
    title.classList.add("list-title", "text-light");
    title.style.textShadow = `1px 1px 5px hsl(0deg 100% 0%)`;
    title.textContent = `${owner}'s Cars`;
    listElement.before(title);
  }

  if (!cars.length) {
    listElement.before(noCarsMessage);
  } else {
    noCarsMessage.remove();
  }

  renderList({
    cars,
    listElement,
  });
}

export {
  serialize,
  populate,
  resetAllFormFields,
  validate,
  renderUI,
  noCarsMessage,
  createCarListItem,
  centeredSpinner,
};
