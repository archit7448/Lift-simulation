const generateButton = document.querySelector("#generate-button");
const columnInput = document.querySelector("#column-input");
const rowInput = document.querySelector("#row-input");
const liftButtonWrapper = document.querySelector("#lift-button-wrapper");
const liftWrapper = document.querySelector("#lift-wrapper");

let stateGlobal = [];

let destination = [];

const createLiftSimulation = () => {
  while (liftButtonWrapper.lastElementChild) {
    liftButtonWrapper.removeChild(liftButtonWrapper.lastElementChild);
  }
  while (liftWrapper.lastElementChild) {
    liftWrapper.removeChild(liftWrapper.lastElementChild);
  }
  stateGlobal = [];
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
    } else if (i === rowInput.value - 1) {
      liftButtonWrapper.prepend(elementDiv);
      elementDiv.prepend(buttonOne);
      addButtonUpFunc(`#button-up-${i}`);
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
    let leftDiv = document.createElement("div");
    leftDiv.className = `lift-door lift-left-${i}`;
    let righDiv = document.createElement("div");
    righDiv.className = `lift-door lift-right-${i}`;
    let doorWrapper = document.createElement("div");
    doorWrapper.className = `lift-door-wrapper`;
    doorWrapper.prepend(leftDiv);
    doorWrapper.append(righDiv);
    elementDivColumn.append(doorWrapper);
    liftWrapper.append(elementDivColumn);
    stateGlobal = [
      ...stateGlobal,
      {
        stateLift: "idle",
        floor: 0,
        atFloor: 0,
      },
    ];
  }
};

const timerFunc = (index, difference) => {
  const myNewTimeout = setInterval(() => {
    if (stateGlobal[index]?.atFloor != stateGlobal[index]?.floor) {
      stateGlobal = stateGlobal.map((value, i) => {
        return i === index
          ? {
              ...value,
              atFloor:
                difference > 0
                  ? Number(value.atFloor) + 1
                  : Number(value.atFloor) - 1,
            }
          : value;
      });
    } else {
      const stateDoorLeft = document.querySelector(`.lift-left-${index}`);
      const stateDoorRight = document.querySelector(`.lift-right-${index}`);
      stateDoorLeft.style.transform = `translateX(-100%)`;
      stateDoorLeft.style.transition = `linear 2.5s`;
      stateDoorRight.style.transform = `translateX(100%)`;
      stateDoorRight.style.transition = `linear 2.5s`;
      stateGlobal = stateGlobal.map((value, i) => {
        return i === index
          ? {
              ...value,
              stateLift: "stop",
            }
          : value;
      });
      setTimeout(() => {
        stateDoorLeft.style.transform = `translateX(0)`;
        stateDoorLeft.style.transition = `linear 2.5s`;
        stateDoorRight.style.transform = `translateX(0)`;
        stateDoorRight.style.transition = `linear 2.5s`;
        setTimeout(() => {
          stateGlobal = stateGlobal.map((value, i) => {
            return i === index
              ? {
                  ...value,
                  stateLift: "idle",
                }
              : value;
          });
          if (destination.length >= 1) {
            stateHandler(destination.shift());
          }
        }, 2500);
      }, 2500);
      clearInterval(myNewTimeout);
    }
  }, 2000);
};

const stateHandler = (floor) => {
  const stateGlobalCopy = [...stateGlobal];

  let index = stateGlobal.findIndex((value) => {
    if (value.floor == floor) {
      return true;
    } else if (!stateGlobal.some((value) => value.floor === floor)) {
      return value.stateLift === "idle";
    }
  });

  stateGlobal = stateGlobal.map((value, i) => {
    return i === index
      ? {
          stateLift: "moving",
          floor: floor,
          atFloor: value.atFloor,
        }
      : value;
  });

  const difference = stateGlobal[index]?.floor - stateGlobalCopy[index]?.floor;

  if (stateGlobal[index]?.floor !== stateGlobalCopy[index]?.floor) {
    if (index !== -1) {
      timerFunc(index, difference);
      console.log(stateGlobal);
    }
  }
  if (stateGlobal[index]?.atFloor == stateGlobal[index]?.floor) {
    if (index !== -1) {
      timerFunc(index, difference);
    }
    console.log("hello");
  }
  if (index == -1) {
    destination.push(floor);
  }

  if (index !== -1) {
    const stateButton = document.querySelector(`#state-lift-${index}`);
    console.log(
      stateGlobal[index]?.floor > stateGlobalCopy[index]?.floor
        ? `linear ${
            (Number(stateGlobal[index]?.floor) -
              Number(stateGlobal[index]?.atFloor)) *
            2
          }s`
        : `linear ${
            Number(stateGlobal[index]?.floor - stateGlobal[index]?.floor) * 2
          }s`
    );
    stateButton.style.transform = `translateY(-${
      Number(stateGlobal[index]?.floor) * 114
    }px)`;
    stateButton.style.transition =
      stateGlobal[index]?.floor > stateGlobal[index]?.atFloor
        ? `linear ${
            (Number(stateGlobal[index]?.floor) -
              Number(stateGlobal[index]?.atFloor)) *
            2
          }s`
        : `linear ${
            Number(stateGlobal[index]?.atFloor - stateGlobal[index]?.floor) * 2
          }s`;
  }
};

const addButtonUpFunc = (value) => {
  const buttonUp = document.querySelector(value);
  buttonUp.addEventListener("click", (event) => {
    stateHandler(event.target.value, "up", "explicit");
  });
};

const addButtonDownFunc = (value) => {
  const buttonDown = document.querySelector(value);
  buttonDown.addEventListener("click", (event) => {
    stateHandler(event.target.value, "down", "explicit");
  });
};

generateButton.addEventListener("click", createLiftSimulation);
