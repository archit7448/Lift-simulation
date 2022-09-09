const generateButton = document.querySelector("#generate-button");
const columnInput = document.querySelector("#column-input");
const rowInput = document.querySelector("#row-input");
const liftButtonWrapper = document.querySelector("#lift-button-wrapper");
const liftWrapper = document.querySelector("#lift-wrapper");

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
    liftWrapper.append(elementDivColumn);
    stateGlobal = [
      ...stateGlobal,
      { stateLift: "idle", floor: 0, direction: "up", time: 0 },
    ];
  }
};

const stateHandler = (floor, direction) => {
  const stateGlobalCopy = [...stateGlobal];

  const stateValue = document.querySelector("#state-value");

  let index = stateGlobal.findIndex((value) => {
    if (value.floor === floor) {
      return true;
    } else if (!stateGlobal.some((value) => value.floor === floor)) {
      return value.stateLift === "idle";
    }
  });
  let time = Number(stateGlobalCopy[index]?.floor) - floor;

  stateGlobal = stateGlobal.map((value, i) => {
    return i === index
      ? {
          stateLift: "moving",
          floor: floor,
          direction: direction,
          time: Math.abs(time) * 2,
        }
      : value;
  });

  stateValue.innerHTML = JSON.stringify(stateGlobal);
  setTimeout(
    () => {
      stateGlobal = stateGlobal.map((value, i) =>
        index === i ? { ...value, stateLift: "idle" } : value
      );
      stateValue.innerHTML = JSON.stringify(stateGlobal);
    },
    stateGlobal[index]?.floor > stateGlobalCopy[index]?.floor
      ? (stateGlobal[index]?.floor - stateGlobalCopy[index]?.floor) * 2000 +
          5000
      : (stateGlobalCopy[index]?.floor - stateGlobal[index]?.floor) * 2000 +
          5000
  );
  if (index !== -1) {
    const stateButton = document.querySelector(`#state-lift-${index}`);
    stateButton.style.transform =
      direction === "up"
        ? `translateY(-${Number(stateGlobal[index]?.floor) * 114}px)`
        : `translateY(-${Number(stateGlobal[index]?.floor) * 114}px)`;
    stateButton.style.transition =
      stateGlobal[index]?.floor > stateGlobalCopy[index]?.floor
        ? `linear ${
            (stateGlobal[index]?.floor - stateGlobalCopy[index]?.floor) * 2
          }s`
        : `linear ${
            (stateGlobalCopy[index]?.floor - stateGlobal[index]?.floor) * 2
          }s`;
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
