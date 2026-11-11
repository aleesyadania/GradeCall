const savedName = localStorage.getItem("userName");
const savedGrade = localStorage.getItem("userGrade");
if (savedName && savedGrade) {
  document.getElementById("greeting").textContent = `Welcome, ${savedName}!`;
  document.getElementById("gradeBadge").textContent = savedGrade;
} else {
  window.location.href = "index.html";
}

let classes = [];

function getSelectedClass() {
  const index = document.getElementById("selectClass").value;
  return index === "" ? null : classes[Number(index)];
}

function getWeights() {
  return {
    assignment: Number(document.getElementById("assignmentWeight").value),
    midTerm: Number(document.getElementById("midTermWeight").value),
    finals: Number(document.getElementById("finalsWeight").value),
  };
}

function saveWeight() {
  const weights = getWeights();
  const errorWeight = document.getElementById("errorWeight");

  if (weights.assignment + weights.midTerm + weights.finals !== 100) {
    errorWeight.textContent =
      "Please give the correct value (total must be 100%)";
    return;
  }else if(weights.assignment === 0 || weights.finals === 0 || weights.midTerm === 0){
    errorWeight.textContent =
      "Please dont have one or two of the weight to be 0";
      return;
  }

  errorWeight.textContent = "Saved";
  const currentClass = getSelectedClass();
  if (currentClass) {
    currentClass.weights = weights;
  }
}

document.getElementById("avgAssign").addEventListener("change", function () {
  const addButton = document.getElementById("addButton");
  if (this.checked) {
    addButton.style.display = "none";
    document.getElementById("assignmentList").innerHTML = "";
    const currentClass = getSelectedClass();
    if (currentClass) {
      currentClass.assignments = [];
    }
  } else {
    addButton.style.display = "block";
  }
});

function addClass() {
  const nameInput = document.getElementById("nameClass");
  const targetInput = document.getElementById("desiredScore");
  const selectClass = document.getElementById("selectClass");
  const errorClass = document.getElementById("errorClass");

  const name = nameInput.value.trim();
  const target = Number(targetInput.value);
  errorClass.textContent = "";

  if (!name) {
    errorClass.textContent = "Please enter a class name.";
    return;
  }
  if (!targetInput.value || target < 1 || target > 100) {
    errorClass.textContent = "Please enter a desired score between 1 and 100.";
    return;
  }

  classes.push({
    name: name,
    target: target,
    weights: getWeights(),
    assignments: [],
    midTerm: "",
    finals: "",
    finalScore: null,
  });

  const option = document.createElement("option");
  option.value = classes.length - 1;
  option.textContent = `${name} (Target: ${target})`;
  selectClass.appendChild(option);
  selectClass.value = option.value;

  nameInput.value = "";
  targetInput.value = "";
  loadClassData();
}

function renderAssignments(currentClass) {
  const list = document.getElementById("assignmentList");
  list.innerHTML = "";
  if (!currentClass) return;

  currentClass.assignments.forEach((score, index) => {
    const li = document.createElement("li");
    li.textContent = `Assignment ${index + 1}: ${score}`;
    list.appendChild(li);
  });
}

function add() {
  const errorScore = document.getElementById("errorScore");
  const assignmentInput = document.getElementById("assignment");
  errorScore.textContent = "";

  const currentClass = getSelectedClass();
  if (!currentClass) {
    errorScore.textContent = "Please add and select a class first.";
    return;
  }

  const score = Number(assignmentInput.value);
  if (assignmentInput.value === "" || score < 0 || score > 100) {
    errorScore.textContent =
      "Please enter an assignment score between 0 and 100.";
    return;
  }

  currentClass.assignments.push(score);
  assignmentInput.value = "";
  renderAssignments(currentClass);
}

function calculateGrade() {
  const errorScore = document.getElementById("errorScore");
  const finalResult = document.getElementById("finalResult");
  errorScore.textContent = "";
  finalResult.textContent = "";

  const currentClass = getSelectedClass();
  if (!currentClass) {
    errorScore.textContent = "Please add and select a class first.";
    return;
  }

  const weights = getWeights();
  if (weights.assignment + weights.midTerm + weights.finals !== 100) {
    errorScore.textContent = "Please make sure the weights total 100% first.";
    return;
  }

  const isAverage = document.getElementById("avgAssign").checked;
  const assignmentInput = document.getElementById("assignment").value;
  const midTermInput = document.getElementById("midTerm").value;
  const finalsInput = document.getElementById("finals").value;

  let avgAssignment = 0;
  if (isAverage) {
    if (assignmentInput === "") {
      errorScore.textContent = "Please enter your average assignment score.";
      return;
    }
    avgAssignment = Number(assignmentInput);
  } else {
    if (currentClass.assignments.length === 0) {
      errorScore.textContent = "Please add at least one assignment score.";
      return;
    }
    let sum = 0;
    for (const score of currentClass.assignments) {
      sum += score;
    }
    avgAssignment = sum / currentClass.assignments.length;
  }

  if (midTermInput === "" || finalsInput === "") {
    errorScore.textContent = "Please enter both Mid-Term and Finals scores.";
    return;
  }

  const midTermScore = Number(midTermInput);
  const finalsScore = Number(finalsInput);

  currentClass.weights = weights;
  currentClass.midTerm = midTermScore;
  currentClass.finals = finalsScore;
  currentClass.finalScore =
    (avgAssignment * weights.assignment) / 100 +
    (midTermScore * weights.midTerm) / 100 +
    (finalsScore * weights.finals) / 100;

  displayResult(currentClass);
}

function displayResult(currentClass) {
  const finalResult = document.getElementById("finalResult");
  if (!currentClass || currentClass.finalScore === null) {
    finalResult.textContent = "";
    return;
  }

  const rounded = currentClass.finalScore.toFixed(2);
  const status =
    currentClass.finalScore >= currentClass.target ? "Target Reached! (Pass)": "Needs Improvement";

  finalResult.textContent = `${currentClass.name} Final Score: ${rounded} / ${currentClass.target} — ${status}`;
}

function loadClassData() {
  const currentClass = getSelectedClass();
  document.getElementById("errorScore").textContent = "";
  document.getElementById("assignment").value = "";

  if (!currentClass) {
    document.getElementById("assignmentList").innerHTML = "";
    document.getElementById("midTerm").value = "";
    document.getElementById("finals").value = "";
    document.getElementById("finalResult").textContent = "";
    return;
  }

  const w = currentClass.weights;
  if (w.assignment + w.midTerm + w.finals === 100) {
    document.getElementById("assignmentWeight").value = w.assignment;
    document.getElementById("midTermWeight").value = w.midTerm;
    document.getElementById("finalsWeight").value = w.finals;
  }

  document.getElementById("midTerm").value = currentClass.midTerm;
  document.getElementById("finals").value = currentClass.finals;
  renderAssignments(currentClass);
  displayResult(currentClass);
}

document
  .getElementById("selectClass")
  .addEventListener("change", loadClassData);
