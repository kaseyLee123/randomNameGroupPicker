const names = document.getElementById("names");
const namePick = document.getElementById("namePick");
const groupPick = document.getElementById("groupPick");
const output = document.getElementById("output");

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
