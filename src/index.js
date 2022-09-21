const create = document.querySelector("#create");
const noOfFloors = document.querySelector("#noOfFloors");
const noOfLifts = document.querySelector("#noOfLifts");
const floorContainer = document.querySelector(".floor");
const liftContainer = document.querySelector(".lift");

let floorOrder = [];

const debounce = (func, delay) => {
  let debounceTimer;
  return function (args) {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => func(args), delay);
  };
};

const reset = () => {
  noOfFloors.value = null;
  noOfLifts.value = null;
  floorContainer.innerHTML = "";
  liftContainer.innerHTML = "";
  floorOrder = [];
};

[noOfLifts, noOfFloors].forEach((item) => {
  item.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      create.click();
    }
  });
});

create.addEventListener("click", () => {
  const floors = parseInt(noOfFloors.value, 10);
  const lifts = parseInt(noOfLifts.value, 10);
  let numbers = /^[0-9]+$/;
  if (
    // if entered values are numbers, proceed
    noOfFloors.value.match(numbers) &&
    noOfLifts.value.match(numbers)
  ) {
    // Reset the form and UI if existed previously
    reset();
    const halfNoOfFloors = Math.ceil((1 / 2) * floors);
    if (floors > 10 || lifts > floors || lifts > halfNoOfFloors) {
      // Logical alerts for input values
      // No more than 10 floors available
      floors > 10
        ? alert("The app does not support more than 10 floors for now")
        : // Lifts can only be half the number of floors entered
        lifts > halfNoOfFloors
        ? alert(
            `${halfNoOfFloors} ${
              halfNoOfFloors > 1 ? "lifts are" : "lift is"
            } more than enough for ${floors} floors! ${lifts} would be unnecessary please re-enter the number :)`
          )
        : // Lifts cannot be more than the number of floors
          lifts > floors &&
          alert("Lifts cannot be more than the number of floors");
    } else if (floors > 0 && lifts > 0) {
      let floorHTML = "";
      let liftHTML = "";
      for (let i = floors - 1; i >= 0; i--) {
        floorHTML += `
        <div class="floor-box">
        <div class="floor-container">
          <div class="controllers">
            ${
              i === floors - 1
                ? ""
                : `<button class="up" data-floor=${i}>Up</button>`
            }
            ${
              i === 0
                ? ""
                : `<button class="down" data-floor=${i}>Down</button>`
            }
          </div>
        </div>
        <p class="floor-text">Floor ${i + 1}</p>
      </div>`;
      }
      for (let i = 0; i < lifts; i++) {
        liftHTML += `
      <div class="lift-box" data-floor="0"></div>
      `;
      }
      floorContainer.innerHTML = floorHTML;
      liftContainer.innerHTML = liftHTML;

      // adding Event listeners to all up and down buttons
      addClickToButtons();
    }
  } else {
    reset();
    alert("Please fill both the fields with valid numbers that greater than 0");
  }
});

function addClickToButtons() {
  const moveBtns = document.querySelectorAll(".controllers > button");
  // we gave data-floor to buttons while creating the UI hence can access them here for clicked floor ID
  moveBtns.forEach((item) => {
    const floorId = item.dataset.floor;
    item.addEventListener(
      "click",
      debounce(() => handleMove(floorId), 1000)
    );
  });
}

function moveLift(id, freeLift) {
  if (!freeLift.classList.contains("busy")) {
    let floorId = parseInt(id);
    // we set the data-set here so next time we can abstract it to get current floor
    let currentFloor = parseInt(freeLift.dataset.floor);
    freeLift.dataset.floor = floorId;
    const reachingTime = Math.abs(currentFloor - floorId) * 2;
    freeLift.style.transition = `transform ${reachingTime}s linear`;
    freeLift.style.transform = `translateY(-${
      (window.innerWidth > 650 ? 9 : 4) * floorId // for responsive height calculations
    }rem)`;
    freeLift.classList.add("busy"); //marking it as busy
    setTimeout(() => freeLift.classList.add("open"), (reachingTime + 2) * 1000); // opening door only after lift reaches the desired floor
    setTimeout(
      () => freeLift.classList.remove("open"),
      (reachingTime + 4.5) * 1000
    );
    setTimeout(() => {
      freeLift.classList.remove("busy");
    }, (reachingTime + 7) * 1000);
  }
}

function handleMove(floorId) {
  floorOrder.push(floorId);
  // setting Interval after every second to check for any floors that are in order
  setInterval(() => {
    if (floorOrder.length > 0) {
      const firstDestination = floorOrder[0];
      let freeLift = getFreeLift(firstDestination);
      // getting freeLift available
      if (!freeLift?.classList.contains("busy")) {
        moveLift(floorOrder.shift(), freeLift); // we pass the first item in array as we push floors to the back of array
      } else {
        console.log("No Free Lift atm");
      }
    }
  }, 1000);
}

const getFreeLift = (id) => {
  const allLift = document.querySelectorAll(".lift-box");
  const floorId = parseInt(id);
  // Converting NodeList to array
  const newLiftArr = Array.from(allLift);
  let availableLifts = [];

  for (let i = 0; i < newLiftArr.length; i++) {
    // 1. get all the free Lifts
    if (!newLiftArr[i].classList.contains("busy")) {
      availableLifts.push(newLiftArr[i]);
    }
  }
  let closestFreeLift = availableLifts[0];
  let prevDiff;
  // 2. check which is the closest to desired floor
  availableLifts.forEach((item, i) => {
    let nowDiff = Math.abs(parseInt(item.dataset.floor) - floorId);
    if (i === 0) prevDiff = nowDiff;
    if (nowDiff < prevDiff) {
      closestFreeLift = availableLifts[i];
      prevDiff = nowDiff;
    }
  });
  return closestFreeLift || 0;
};
