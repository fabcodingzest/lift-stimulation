const create = document.querySelector("#create");
const noOfFloors = document.querySelector("#noOfFloors");
const noOfLifts = document.querySelector("#noOfLifts");
const floorContainer = document.querySelector(".floor");
const liftContainer = document.querySelector(".lift");

create.addEventListener("click", (e) => {
  const floors = parseInt(noOfFloors.value, 10);
  const lifts = parseInt(noOfLifts.value, 10);
  if (floors > 0 && lifts > 0) {
    //  now that we have input value, we should generate the UI for Floors and lift
    // For that we need to loop through them to generate the number of lifts and floor acc to input
    let floorHTML = "";
    let liftHTML = "";
    for (let i = 0; i < floors; i++) {
      floorHTML += `
        <div class="floor-box">
        <div class="floor-container">
          <div class="controllers">
            ${i === floors - 1 ? "" : `<button class="up">Up</button>`}
            ${i === 0 ? "" : `<button class="down">Down</button>`}
          </div>
        </div>
        <p class="floor-text">Floor 1</p>
      </div>`;
    }
    for (let i = 0; i < lifts; i++) {
      liftHTML += `
      <div class="lift-box"></div>
      `;
    }
    console.log(floorHTML);
    floorContainer.innerHTML = floorHTML;
    liftContainer.innerHTML = liftHTML;
  }
});
