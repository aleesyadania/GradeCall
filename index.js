const registerForm = document.getElementById("registerForm");
if (registerForm) {
  registerForm.addEventListener("submit", function (event) {
    event.preventDefault();
    const fullName = document.getElementById("fullName").value.trim();
    const studentGrade = document.getElementById("studentGrade").value;
    const errorMsg = document.getElementById("errorMsg");
    errorMsg.textContent = "";
    const namePart = fullName.split(" ").filter((part) => part.length > 0);
    if (namePart.length < 2) {
      errorMsg.textContent =
        "Please enter you full name (first name and last name)";
      return;
    }
    if ((!studentGrade || studentGrade <= 0)) {
      errorMsg.textContent = "Please enter your grade.";
      return;
    }
    localStorage.setItem("userName", namePart[0]);
    localStorage.setItem("userGrade", studentGrade);
    window.location.href = "gradeCall.html";
  });
}