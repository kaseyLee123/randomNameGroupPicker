const names = document.getElementById("names");
const groupsArea = document.getElementById("groupsArea");
const className = document.getElementById("className");
const saveClass = document.getElementById("saveClass");
const deleteClass = document.getElementById("deleteClass");
const classPicker = document.getElementById("classPicker");
const namePick = document.getElementById("namePick");
const groupPick = document.getElementById("groupPick");
const resetAbsent = document.getElementById("resetAbsent");
const output = document.getElementById("output");

function showGroups() {
  groupsArea.innerHTML = "";

  for (let g = 0; g < groups.length; g++) {
    const groupBox = document.createElement("div");
    groupBox.classList.add("group");

    const title = document.createElement("h3");
    title.textContent = "Group " + (g + 1);
    groupBox.appendChild(title);

    for (let i = 0; i < groups[g].length; i++) {
      const nameBox = document.createElement("div");
      nameBox.classList.add("member");
      nameBox.textContent = groups[g][i];

      // make this name draggable
      nameBox.draggable = true;
      nameBox.addEventListener("dragstart", function (e) {
        dragged = { group: g, index: i };
        e.dataTransfer.setData("text/plain", groups[g][i]);
      });

      // × button: remove from group and mark absent
      const x = document.createElement("button");
      x.textContent = "×";
      x.addEventListener("click", function () {
        const removed = groups[g].splice(i, 1)[0];
        absent.push(removed);
        showGroups();
        output.textContent = "Absent: " + absent.join(", ");
      });
      nameBox.appendChild(x);

      groupBox.appendChild(nameBox);
    }

    // let this group box accept drops
    groupBox.addEventListener("dragover", function (e) {
      e.preventDefault();
    });

    groupBox.addEventListener("drop", function (e) {
      e.preventDefault();
      if (dragged === null) {
        return;
      }

      const moved = groups[dragged.group].splice(dragged.index, 1)[0];
      groups[g].push(moved);

      dragged = null;
      showGroups();
    });

    groupsArea.appendChild(groupBox);
  }
}

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
let absent = [];
let groups = [];
let dragged = null;

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

function presentList() {
  return cleanList().filter(function (n) {
    return !absent.includes(n);
  });
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
  classPicker.innerHTML = "";

  const first = document.createElement("option");
  first.textContent = "Choose a saved class";
  first.value = "";
  classPicker.appendChild(first);

  const classNames = Object.keys(classes);

  for (let i = 0; i < classNames.length; i++) {
    const opt = document.createElement("option");
    opt.textContent = classNames[i];
    opt.value = classNames[i];
    classPicker.appendChild(opt);
  }
}

showClassOptions();

namePick.addEventListener("click", function () {
  const cleanNamesList = presentList();
  const chosenName =
    cleanNamesList[Math.floor(Math.random() * cleanNamesList.length)];
  if (cleanNamesList.length === 0) {
    output.textContent = "Please enter names";
  } else {
    output.textContent = chosenName;
  }
});

groupPick.addEventListener("click", function () {
  const cleanNamesList = presentList();
  const shuffledNamesList = shuffle(cleanNamesList);
  const groupNumber = Number(document.getElementById("groupSize").value);
  if (cleanNamesList.length === 0) {
    output.textContent = "Please enter names";
  } else if (groupNumber <= 0 || groupNumber > shuffledNamesList.length) {
    output.textContent = "Please enter group number";
  } else {
    groups = [];
    for (let g = 0; g < groupNumber; g++) {
      groups.push([]);
    }
    for (let i = 0; i < shuffledNamesList.length; i++) {
      const currentGroup = i % groupNumber;
      groups[currentGroup].push(shuffledNamesList[i]);
    }

    output.textContent = "";
    showGroups();
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

deleteClass.addEventListener("click", function () {
  const current = classPicker.value;

  if (current === "") {
    output.textContent = "Choose a class to delete";
    return;
  }

  if (!confirm("Delete " + current + "?")) {
    return;
  }

  delete classes[current];
  saveClasses();
  showClassOptions();

  names.value = "";
  className.value = "";
  output.textContent = "Deleted " + current;
  absent = [];
});

classPicker.addEventListener("change", function () {
  const picked = classPicker.value;
  if (picked === "") {
    return;
  }

  const students = classes[picked];
  names.value = students.join("\n");
  className.value = picked;
  absent = [];
});

resetAbsent.addEventListener("click", function () {
  absent = [];
  output.textContent = "Everyone is back";
});
