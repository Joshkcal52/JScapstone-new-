const email = "";
const pass = "";

const userData = {
  email: email,
  password: pass,
};

let firstName = [];

let minNames = 0;

let previousWinner;

async function auth() {
  try {
    const res = await fetch("https://api.devpipeline.org/user/auth", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });
    const resObject = await res.json();
    const authToken = resObject.auth_info.auth_token;
    return authToken;
  } catch (error) {
    console.error("Error: ", error);
  }
}

async function getAll() {
  let users = [];

  try {
    const getAuth = await auth();
    const res = await fetch("https://api.devpipeline.org/users", {
      headers: { auth_token: getAuth },
    });
    const response = await res.json();
    users = response.users;
  } catch (error) {
    console.error("Error: ", error);
  }

  const getNames = () => {
    users.map((user) => {
      firstName.push(user.first_name + "-" + user.last_name[0] + ".");
    });
    console.log(firstName);

    function randomGen() {
      let winner = Math.floor(Math.random() * firstName.length);
      let result = firstName[winner];

      const blinkResult = () => {
        let winnerResultLocation = document.getElementById("stupid");
        winnerResultLocation.style.color =
          winnerResultLocation.style.color === "rgb(34, 197, 94)"
            ? "black"
            : "rgb(34, 197, 94)";
      };

      let blinkInterval = setInterval(blinkResult, 250);

      previousWinner = document.querySelector(".highlighted-winner");
      if (previousWinner) {
        previousWinner.style.backgroundColor = "";
        previousWinner.classList.remove("highlighted-winner");
      }

      let winnerResultLocation = document.getElementById("stupid");
      winnerResultLocation.style.color = "rgb(34, 197, 94)";

      setTimeout(() => {
        clearInterval(blinkInterval);
      }, 2500);

      let personBackground = document.getElementById(result);
      winnerResultLocation.innerHTML = result;
      personBackground.style.backgroundColor = "#4ADE80";
      personBackground.classList.add("highlighted-winner");
    }

    const sleep = (milliseconds) => {
      return new Promise((resolve) => setTimeout(resolve, milliseconds));
    };

    async function randomShuffle() {
      let sleepTime = 80;
      let randResult = document.getElementById("stupid");

      randResult.style.color = "black";

      for (let i = 0; i < 15; i++) {
        let randName = Math.floor(Math.random() * firstName.length);
        randResult.innerHTML = firstName[randName];
        sleepTime = sleepTime * 1.05;
        await sleep(sleepTime);
      }

      randomGen();
    }

    let pickMe = document.getElementById("randombtn");
    pickMe.addEventListener("click", () => {
      randomShuffle();
    });
    renderUsers(firstName);
  };
  getNames();
  minNames = firstName.length - 1;
  console.log(minNames);

  function renderUsers(firstName) {
    const renderLocation = document.getElementById("students-container");
    renderLocation.innerHTML = "";

    for (let i = 0; i < firstName.length; i++) {
      const person = firstName[i];
      const occurrences = countOccurrences(person);

      const studentContainer = document.createElement("div");
      studentContainer.classList.add("outerDiv");
      studentContainer.setAttribute("id", `${person}`);

      const nameAmount = document.createElement("div");
      nameAmount.classList.add("name-amount");

      const nameContainer = document.createElement("div");
      nameContainer.classList.add("name-container");

      const name = document.createTextNode(`${person}`);
      const amount = document.createTextNode(`${occurrences}`);

      nameAmount.appendChild(amount);
      nameContainer.appendChild(name);
      studentContainer.appendChild(nameAmount);
      studentContainer.appendChild(nameContainer);
      renderLocation.appendChild(studentContainer);

      const btnContainer = document.createElement("div");
      btnContainer.id = "btnContainer";
      let btnPlus = document.createElement("button");
      btnPlus.innerHTML = "+";
      btnPlus.classList.add("btnPlus");
      btnPlus.id = "plusBtn";
      btnPlus.addEventListener("click", () => {
        firstName.push(person);
        renderUsers(firstName);
      });

      btnContainer.appendChild(btnPlus);
      renderLocation.appendChild(btnContainer);

      let btnMinus = document.createElement("button");
      btnMinus.innerHTML = "-";
      btnMinus.classList.add("btnMinus");
      btnMinus.id = "minusBtn";
      btnMinus.addEventListener("click", createMinusButtonListener(person, i));

      btnContainer.appendChild(btnMinus);
      renderLocation.appendChild(btnContainer);
      studentContainer.appendChild(btnContainer);
    }
  }

  function createMinusButtonListener(name, index) {
    console.log(index);
    return () => {
      const firstOccurrenceIndex = firstName.findIndex(
        (person) => person === name
      );
      if (firstOccurrenceIndex !== -1) {
        let removedCount = 0;
        let i = firstOccurrenceIndex + 1;
        while (i < firstName.length) {
          if (firstName[i] === name) {
            firstName.splice(i, 1);
            removedCount++;
          } else {
            i++;
          }
          if (removedCount >= 1) {
            break;
          }
        }
        renderUsers(firstName);
      }
    };
  }

  function countOccurrences(value) {
    return firstName.filter((person) => person === value).length;
  }
}

getAll();
