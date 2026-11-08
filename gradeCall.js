const savedName = localStorage.getItem("userName");
const savedGrade = localStorage.getItem("userGrade");
if (savedName && savedGrade) {
  document.getElementById("greeting").textContent = `Welcome, ${savedName}!`;
  document.getElementById("gradeBadge").textContent = `${savedGrade}`;
} else {
  window.location.href = "index.html";
}

let classes = [];

function getSelectedClass() {
  const selectClass = document.getElementById("selectClass");
  if (selectClass.value === "") return null;
  return classes[Number(selectClass.value)];
}

function getWeights() {
  return {
    assignment: Number(document.getElementById("assignmentWeight").value) || 0,
    midTerm: Number(document.getElementById("midTermWeight").value) || 0,
    finals: Number(document.getElementById("finalsWeight").value) || 0,
  };
}

function saveWeight() {
  const weights = getWeights();
  const errorWeight = document.getElementById("errorWeight");

  errorWeight.textContent = "";

  if (weights.assignment + weights.midTerm + weights.finals !== 100) {
    errorWeight.textContent = "Please give the correct value (total must be 100%)";
    return;
  } else {
    errorWeight.textContent = "Saved";
  }

  const currentClass = getSelectedClass();
  if (currentClass) {
    currentClass.weights = weights;
  }
}

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

  const newClass = {
    name: name,
    target: target,
    weights: getWeights(),
    assignments: [],
    midTerm: "",
    finals: "",
    finalScore: null,
  };
  classes.push(newClass);

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
    errorScore.textContent = "Please enter an assignment score between 0 and 100.";
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

  currentClass.weights = weights;

  const midTermInput = document.getElementById("midTerm").value;
  const finalsInput = document.getElementById("finals").value;

  if (currentClass.assignments.length === 0) {
    errorScore.textContent = "Please add at least one assignment score.";
    return;
  }
  if (midTermInput === "" || finalsInput === "") {
    errorScore.textContent = "Please enter both Mid-Term and Finals scores.";
    return;
  }

  const midTermScore = Number(midTermInput);
  const finalsScore = Number(finalsInput);
  currentClass.midTerm = midTermScore;
  currentClass.finals = finalsScore;

  const sumAssignments = currentClass.assignments.reduce((a, b) => a + b, 0);
  const avgAssignment = sumAssignments / currentClass.assignments.length;

  const finalScore =
    (avgAssignment * weights.assignment) / 100 +
    (midTermScore * weights.midTerm) / 100 +
    (finalsScore * weights.finals) / 100;

  currentClass.finalScore = finalScore;
  displayResult(currentClass);
}

function displayResult(currentClass) {
  const finalResult = document.getElementById("finalResult");
  if (!currentClass || currentClass.finalScore === null) {
    finalResult.textContent = "";
    return;
  }

  const rounded = currentClass.finalScore.toFixed(2);
  if (currentClass.finalScore >= currentClass.target) {
    finalResult.textContent = `${currentClass.name} Final Score: ${rounded} / ${currentClass.target} — Target Reached! (Pass)`;
  } else {
    finalResult.textContent = `${currentClass.name} Final Score: ${rounded} / ${currentClass.target} — Needs Improvement`;
  }
}

function loadClassData() {
  const currentClass = getSelectedClass();
  const assignmentInput = document.getElementById("assignment");
  const midTermInput = document.getElementById("midTerm");
  const finalsInput = document.getElementById("finals");
  const errorScore = document.getElementById("errorScore");

  errorScore.textContent = "";
  assignmentInput.value = "";

  if (!currentClass) {
    document.getElementById("assignmentList").innerHTML = "";
    midTermInput.value = "";
    finalsInput.value = "";
    document.getElementById("finalResult").textContent = "";
    return;
  }

  if (currentClass.weights.assignment + currentClass.weights.midTerm + currentClass.weights.finals === 100) {
    document.getElementById("assignmentWeight").value = currentClass.weights.assignment;
    document.getElementById("midTermWeight").value = currentClass.weights.midTerm;
    document.getElementById("finalsWeight").value = currentClass.weights.finals;
  }

  midTermInput.value = currentClass.midTerm;
  finalsInput.value = currentClass.finals;
  renderAssignments(currentClass);
  displayResult(currentClass);
}

document.getElementById("selectClass").addEventListener("change", loadClassData);
