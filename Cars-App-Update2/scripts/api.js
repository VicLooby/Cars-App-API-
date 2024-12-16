// ** READ (GET) **

async function getCars({ id = "" } = {}) {
  try {
    const response = await fetch(
      `https://carsapp-production.up.railway.app/api/v1/cars/${id}`
    );

    if (!response.ok) {
      throw response;
    }

    const data = await response.json();

    return data;
  } catch (err) {
    console.log(err);
    return new Error(err.message || err);
  }
}

// ** CREATE (POST) **

async function addCar({
  data:newCarData={},
}) {
  console.log('newCarData', newCarData);
  try {
    const response = await fetch(
      "https://carsapp-production.up.railway.app/api/v1/cars",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json; charset=utf-8",
        },
        body: JSON.stringify(newCarData),
      }
    );

    if (!response.ok) throw response;

    const data = await response.json();
    return data;
  } catch (err) {
    console.log(err);
    return err;
  }
}

// ** UPDATE (PUT) **

async function updateCar({ id = "", changes = {} } = {}) {
  try {
    const response = await fetch(
      `https://carsapp-production.up.railway.app/api/v1/cars/${id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json; charset=utf-8",
        },
        body: JSON.stringify(changes),
      }
    );

    if (!response.ok) throw response;

    const data = await response.json();

    return data;
  } catch (err) {
    console.log(err);
    return err;
  }
}

// ** DELETE (DELETE) **

async function removeCar({ id = "" }) {
  try {
    const response = await fetch(
      `https://carsapp-production.up.railway.app/api/v1/cars/${id}`,
      {
        method: "DELETE",
      }
    );

    if (!response.ok) throw response;

    return undefined;
  } catch (err) {
    console.log(err);
    return err;
  }
}

export {
    getCars,
    addCar,
    updateCar,
    removeCar,
}
