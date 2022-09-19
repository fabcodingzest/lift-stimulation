const create = document.querySelector("#create");
const noOfFloors = document.querySelector("#noOfFloors");
const noOfLifts = document.querySelector("#noOfLifts");
const floorContainer = document.querySelector(".floor");
const liftContainer = document.querySelector(".lift");

const floorOrder = [];

create.addEventListener("click", () => {
  const floors = parseInt(noOfFloors.value, 10);
  const lifts = parseInt(noOfLifts.value, 10);
  if (floors > 0 && lifts > 0) {
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
      <div class="lift-box"></div>
      `;
    }
    floorContainer.innerHTML = floorHTML;
    liftContainer.innerHTML = liftHTML;

    addClickToButtons();
  }
});

function addClickToButtons() {
  const moveBtns = document.querySelectorAll(".controllers > button");
  moveBtns.forEach((item) => {
    const floorId = item.dataset.floor;
    item.addEventListener("click", () => handleMove(floorId));
  });
}

function moveLift(floorId, freeLift) {
  if (!freeLift.classList.contains("busy")) {
    const floorDur = floorId * 2;
    freeLift.style.transition = `transform ${
      floorDur !== 0 ? floorDur : 2
    }s linear`;
    freeLift.style.transform = `translateY(-${9.2 * parseInt(floorId)}rem)`;
    freeLift.classList.add("busy");
    setTimeout(() => freeLift.classList.add("open"), (floorDur + 2) * 1000);
    setTimeout(
      () => freeLift.classList.remove("open"),
      (floorDur + 4.5) * 1000
    );
    setTimeout(() => freeLift.classList.remove("busy"), (floorDur + 7) * 1000);
  }
}

function handleMove(floorId) {
  const allLiftArr = document.querySelectorAll(".lift-box");
  let freeLift = getFreeLift(allLiftArr);
  floorOrder.push(floorId);
  setInterval(() => {
    if (floorOrder.length > 0) {
      freeLift = getFreeLift(allLiftArr);
      if (!freeLift.classList.contains("busy")) {
        moveLift(floorOrder.shift(), freeLift);
      } else {
        alert("No Free Lift atm");
      }
    }
  }, 1000);
}

const getFreeLift = (allLift) => {
  const newLiftArr = Array.from(allLift);
  for (let i = 0; i < newLiftArr.length; i++) {
    console.log(newLiftArr[i].classList);
    if (!newLiftArr[i].classList.contains("busy")) {
      return newLiftArr[i];
    }
  }
  return 0;
};
