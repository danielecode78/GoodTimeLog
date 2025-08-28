const password = document.getElementById("password");
const confirmPassword = document.getElementById("confirmPassword");
const feedbackConfirm = document.getElementById("confirmPasswordFeedback");
const feedback = document.getElementById("passwordFeedback");

const rules = [
  { regex: /.{8,}/, message: "Almeno 8 caratteri" },
  { regex: /[A-Z]/, message: "Una lettera maiuscola (A-Z)" },
  { regex: /[a-z]/, message: "Una lettera minuscola (a-z)" },
  { regex: /\d/, message: "Un numero (0-9)" },
  { regex: /[\W_]/, message: "Un simbolo (!@#$...)" },
];

function checkPasswordStrength() {
  const value = password.value;
  const failedRules = rules.filter((rule) => !rule.regex.test(value));

  if (failedRules.length === 0) {
    password.classList.add("is-valid");
    password.classList.remove("is-invalid");
    feedback.classList.remove("text-danger");
    feedback.classList.add("text-success");
  } else {
    password.classList.add("is-invalid");
    password.classList.remove("is-valid");
    feedback.innerHTML =
      "La password deve contenere:<ul class='mb-0'>" +
      failedRules.map((rule) => `<li>${rule.message}</li>`).join("") +
      "</ul>";
    feedback.classList.remove("text-success");
    feedback.classList.add("text-danger");
  }
}

function checkConfirmPassword() {
  if (confirmPassword.value === password.value && password.value !== "") {
    confirmPassword.classList.add("is-valid");
    confirmPassword.classList.remove("is-invalid");
    feedbackConfirm.textContent = "";
    feedbackConfirm.classList.remove("text-danger");
    feedbackConfirm.classList.add("text-success");
  } else {
    confirmPassword.classList.add("is-invalid");
    confirmPassword.classList.remove("is-valid");
    feedbackConfirm.textContent = "Le password non coincidono";
    feedbackConfirm.classList.remove("text-success");
    feedbackConfirm.classList.add("text-danger");
  }
}

password.addEventListener("input", function () {
  checkPasswordStrength();
  checkConfirmPassword();
});

confirmPassword.addEventListener("input", checkConfirmPassword);
