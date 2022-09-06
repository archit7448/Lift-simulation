const generateButton = document.querySelector("#generate-button");
const columnInput = document.querySelector("#column-input");
const rowInput = document.querySelector("#row-input");
const liftButtonWrapper = document.querySelector("#lift-button-wrapper");
const liftWrapper = document.querySelector("#lift-wrapper");

let stateGlobal = [];

const createLiftSimulation = () => {
  for (let i = 0; i < rowInput.value; i++) {
    let elementDiv = document.createElement("div");
    // Button One or Button Up
    let buttonOne = document.createElement("button");
    buttonOne.innerHTML = "UP";
    buttonOne.value = i;
    buttonOne.id = `button-up-${i}`;
    //  Button Two or Button Down
    let buttonTwo = document.createElement("button");
    buttonTwo.innerHTML = "DOWN";
    buttonTwo.value = i;
    buttonTwo.id = `button-down-${i}`;

    if (i === 0) {
      liftButtonWrapper.prepend(elementDiv);
      elementDiv.prepend(buttonTwo);
      addButtonDownFunc(`#button-down-${i}`);
    } else {
      liftButtonWrapper.prepend(elementDiv);
      elementDiv.prepend(buttonOne);
      elementDiv.append(buttonTwo);
      addButtonUpFunc(`#button-up-${i}`);
      addButtonDownFunc(`#button-down-${i}`);
    }
  }
  for (let i = 0; i < columnInput.value; i++) {
    let elementDivColumn = document.createElement("div");
    elementDivColumn.className = "lift";
    elementDivColumn.id = `state-lift-${i}`;
    liftWrapper.append(elementDivColumn);
    stateGlobal = [
      ...stateGlobal,
      { stateLift: "idle", floor: 0, direction: "up" },
    ];
  }
};

const addButtonUpFunc = (value) => {
  const buttonUp = document.querySelector(value);
  buttonUp.addEventListener("click", (event) => {
    stateHandler(event.target.value, "up");
  });
};

const addButtonDownFunc = (value) => {
  const buttonDown = document.querySelector(value);
  buttonDown.addEventListener("click", (event) => {
    stateHandler(event.target.value, "down");
  });
};

generateButton.addEventListener("click", createLiftSimulation);

const stateHandler = (floor, direction) => {
  const stateGlobalCopy = [...stateGlobal];
  let index = stateGlobal.findIndex((value) => {
    if (direction === "down") {
      return value.floor > floor && value.stateLift === "idle";
    } else if (direction === "up") {
      return value.floor < floor && value.stateLift === "idle";
    }
  });
  stateGlobal = stateGlobal.map((value, i) => {
    if (direction === "down") {
      return index === i && value.floor > floor
        ? { stateLift: "pending", floor: floor, direction: direction }
        : value;
    } else if (direction === "up") {
      return index === i && value.floor < floor
        ? { stateLift: "pending", floor: floor, direction: direction }
        : value;
    } else {
      return index === i
        ? { stateLift: "pending", floor: floor, direction: direction }
        : value;
    }
  });
  setTimeout(() => {
    stateGlobal = stateGlobal.map((value, i) =>
      index === i ? { ...value, stateLift: "idle" } : value
    );
  }, 5000);
  const stateButton = document.querySelector(`#state-lift-${index}`);
  stateButton.style.transform =
    direction === "up"
      ? `translateY(-${stateGlobal[index].floor * 100}px)`
      : `translateY(-${stateGlobal[index].floor * 100}px)`;
  stateButton.style.transition =
    stateGlobal[index].floor > stateGlobalCopy[index].floor
      ? `${(stateGlobal[index].floor - stateGlobalCopy[index].floor) * 0.5}s`
      : `${(stateGlobalCopy[index].floor - stateGlobal[index].floor) * 0.5}s`;

  //       if (index === 0) {
  //   stateOne.style.transform =
  //     direction === "up"
  //       ? `translateY(-${stateGlobal[0].floor * 100}px)`
  //       : `translateY(-${stateGlobal[0].floor * 100}px)`;
  //   stateOne.style.transition =
  //     stateGlobal[0].floor > stateGlobalCopy[0].floor
  //       ? `${(stateGlobal[0].floor - stateGlobalCopy[0].floor) * 0.5}s`
  //       : `${(stateGlobalCopy[0].floor - stateGlobal[0].floor) * 0.5}s`;
  // } else if (index === 1) {
  //   stateTwo.style.transform =
  //     direction === "up"
  //       ? `translateY(-${stateGlobal[1].floor * 100}px)`
  //       : `translateY(-${stateGlobal[1].floor * 100}px)`;
  //   stateTwo.style.transition =
  //     stateGlobal[1].floor > stateGlobalCopy[1].floor
  //       ? `${(stateGlobal[1].floor - stateGlobalCopy[1].floor) * 0.5}s`
  //       : `${(stateGlobalCopy[1].floor - stateGlobal[1].floor) * 0.5}s`;
  // } else if (index === 2) {
  //   stateThree.style.transform =
  //     direction === "up"
  //       ? `translateY(-${stateGlobal[2].floor * 100}px)`
  //       : `translateY(-${stateGlobal[2].floor * 100}px)`;
  //   stateThree.style.transition =
  //     stateGlobal[2].floor > stateGlobalCopy[2].floor
  //       ? `${(stateGlobal[2].floor - stateGlobalCopy[2].floor) * 0.5}s`
  //       : `${(stateGlobalCopy[2].floor - stateGlobal[2].floor) * 0.5}s`;
  // }
};
