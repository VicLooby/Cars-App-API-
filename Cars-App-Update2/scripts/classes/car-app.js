import Manager from "./manager.js";
import Car from "./car.js";

export default class CarsApp extends Manager {
  constructor({
    owner,
    startingData,
  } = {}) {
    super({ startingData, itemClass: Car });
  }

  // Convenience Methods
  createCars({
    data=[], 
  }={}) {
    super.createItems(data);
  }

  clearAllCars(){
    super.clear();
  }

  loadCars(cars=[]){
    super.loadItems(cars);
  }

  // Aliases
  createCar(data) {
    const itemId = super.createItem(data);
    return itemId;
  }

  updateCar(id, updates) {
    super.updateItem(id, updates);
  }

  removeCar(id) {
    const item = super.removeItem(id);
    return item;
  }

  getAllCars() {
    return super.render(function (cars) {
      return cars;
    });
  }

  getCarById(id) {
    const car = super.render(function (cars) {
      const t = cars.find(({ _id }) => _id === id);
      return t;
    });
    return car;
  }

  render({ fn = function () { console.log(...arguments)} }={}) {
    const { owner } = this;
    return super.render(function (cars) {
      return fn({ cars, owner });
    });
  }
}
