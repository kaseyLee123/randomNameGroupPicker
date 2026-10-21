const names = document.getElementById("names");
const className = document.getElementById("className");
const saveClass = document.getElementById("saveClass");
const classPicker = document.getElementById("classPicker");
const namePick = document.getElementById("namePick");
const groupPick = document.getElementById("groupPick");
const output = document.getElementById("output");

function saveClasses() {
  localStorage.setItem("namePickerClasses", JSON.stringify(classes));
}

function loadClasses() {
  const saved = localStorage.getItem("namePickerClasses");
  if (saved === null) {
    return {};
  } else {
    return JSON.parse(saved);
  }
}

let classes = loadClasses();

function cleanList() {
  const namesList = names.value.split("\n");
  const trimmedNamesList = namesList.map(function (n) {
    return n.trim();
  });
  const filteredNamesList = trimmedNamesList.filter(function (w) {
    return w !== "";
  });
  return filteredNamesList;
}

function shuffle(list) {
  for (let i = list.length - 1; i >= 0; i--) {
    const random = Math.floor(Math.random() * (i + 1));
    const current = list[i];
    list[i] = list[random];
    list[random] = current;
  }
  return list;
}

function showClassOptions() {
  classPicker.innerHTML = ""; // clear old options so they don't double up

  const first = document.createElement("option");
  first.textContent = "Choose a saved class";
  first.value = "";
  classPicker.appendChild(first);

  const classNames = Object.keys(classes); // list of class names, using Object.keys

  for (let i = 0; i < classNames.length; i++) {
    const opt = document.createElement("option");
    opt.textContent = classNames[i]; // the class name at position i
    opt.value = classNames[i]; // same thing
    classPicker.appendChild(opt);
  }
}

showClassOptions();

namePick.addEventListener("click", function () {
  const cleanNamesList = cleanList();
  const chosenName =
    cleanNamesList[Math.floor(Math.random() * cleanNamesList.length)];
  if (cleanNamesList.length === 0) {
    output.textContent = "Please enter names";
  } else {
    output.textContent = chosenName;
  }
});

groupPick.addEventListener("click", function () {
  const cleanNamesList = cleanList();
  const shuffledNamesList = shuffle(cleanNamesList);
  const groupNumber = Number(document.getElementById("groupSize").value);
  if (cleanNamesList.length === 0) {
    output.textContent = "Please enter names";
  } else if (groupNumber <= 0 || groupNumber > shuffledNamesList.length) {
    output.textContent = "Please enter group number";
  } else {
    const groupsList = [];
    for (let g = 0; g < groupNumber; g++) {
      groupsList.push([]);
    }
    for (let i = 0; i < shuffledNamesList.length; i++) {
      const currentGroup = i % groupNumber;
      groupsList[currentGroup].push(shuffledNamesList[i]);
    }

    const lines = [];
    for (let g = 0; g < groupsList.length; g++) {
      lines.push("Group " + (g + 1) + ": " + groupsList[g].join(", "));
    }
    output.textContent = lines.join("\n");
  }
});

saveClass.addEventListener("click", function () {
  const name = className.value.trim();
  const students = cleanList();

  if (name === "" || students.length === 0) {
    output.textContent = "Enter a class name and some names";
    return;
  }

  classes[name] = students;
  saveClasses();
  showClassOptions();
  output.textContent = "Saved " + name;
});

classPicker.addEventListener("change", function () {
  const picked = classPicker.value;
  if (picked === "") {
    return;
  }

  const students = classes[picked];
  names.value = students.join("\n");
  className.value = picked;
});
