function add(a, b) {
  return a + b;
}

function subtract(a, b) {
  return a - b;
}

function multiply(a, b) {
  return a * b;
}

function divide(a, b) {
  return a / b;
}

// the three parts of one operation, e.g. 3 + 5
let firstNumber = "";
let operator = "";
let secondNumber = "";

function operate(op, a, b) {
  switch (op) {
    case "+":
      return add(a, b);
    case "-":
      return subtract(a, b);
    case "*":
      return multiply(a, b);
    case "/":
      return divide(a, b);
  }
}
let justEvaluated = false; // true while a finished result is on the screen

const display = document.querySelector("#display");
const decimalButton = document.querySelector("#decimal");

// the number the user is typing right now
function currentInput() {
  if (justEvaluated) return "";
  return operator === "" ? firstNumber : secondNumber;
}

function refresh(text) {
  display.textContent = text;
  decimalButton.disabled = currentInput().includes(".");
}

function resetAll() {
  firstNumber = "";
  operator = "";
  secondNumber = "";
  justEvaluated = false;
}

refresh("0");

function appendTo(current, digit) {
  if (current.length >= 12) return current; // keep it on the screen
  if (current === "0") return digit;        // no leading zeros like 007
  return current + digit;
}

function inputDigit(digit) {
  if (justEvaluated) resetAll(); // typing after a result starts fresh

  if (operator === "") {
    firstNumber = appendTo(firstNumber, digit);
    refresh(firstNumber);
  } else {
    secondNumber = appendTo(secondNumber, digit);
    refresh(secondNumber);
  }
}

function inputDecimal() {
  if (justEvaluated) resetAll();

  if (operator === "") {
    if (firstNumber.includes(".")) return;
    firstNumber = firstNumber === "" ? "0." : firstNumber + ".";
    refresh(firstNumber);
  } else {
    if (secondNumber.includes(".")) return;
    secondNumber = secondNumber === "" ? "0." : secondNumber + ".";
    refresh(secondNumber);
  }
}

function formatResult(number) {
  const rounded = Number(number.toFixed(8));
  const text = String(rounded);
  return text.length > 12 ? rounded.toExponential(5) : text;
}

// returns the answer as text, or null if the math isn't allowed
function calculate() {
  const a = parseFloat(firstNumber);
  const b = parseFloat(secondNumber);

  if (operator === "/" && b === 0) return null;

  return formatResult(operate(operator, a, b));
}

function showDivideByZero() {
  resetAll();
  refresh("Nice try, pal");
}

function inputOperator(nextOperator) {
  if (firstNumber === "") return; // nothing typed yet

  if (secondNumber === "") {
    // first operator, or an operator pressed twice: swap it, don't calculate
    operator = nextOperator;
    justEvaluated = false;
    refresh(display.textContent);
    return;
  }

  // we have number, operator, number: calculate before moving on
  const result = calculate();
  if (result === null) return showDivideByZero();

  firstNumber = result;
  secondNumber = "";
  operator = nextOperator;
  justEvaluated = false;
  refresh(result);
}

function inputEquals() {
  if (firstNumber === "" || operator === "" || secondNumber === "") return;

  const result = calculate();
  if (result === null) return showDivideByZero();

  firstNumber = result;
  operator = "";
  secondNumber = "";
  justEvaluated = true;
  refresh(result);
}

function clearAll() {
  resetAll();
  refresh("0");
}

function backspace() {
  if (justEvaluated) return; // can't edit a finished result

  if (operator === "") {
    firstNumber = firstNumber.slice(0, -1);
    refresh(firstNumber || "0");
  } else if (secondNumber !== "") {
    secondNumber = secondNumber.slice(0, -1);
    refresh(secondNumber || "0");
  } else {
    operator = ""; // nothing typed after the operator, so undo the operator
    refresh(firstNumber);
  }
}

document.querySelectorAll(".digit").forEach((button) => {
  button.addEventListener("click", () => inputDigit(button.textContent));
});

document.querySelectorAll(".operator").forEach((button) => {
  button.addEventListener("click", () => inputOperator(button.dataset.operator));
});

decimalButton.addEventListener("click", inputDecimal);
document.querySelector("#equals").addEventListener("click", inputEquals);
document.querySelector("#clear").addEventListener("click", clearAll);
document.querySelector("#backspace").addEventListener("click", backspace);

document.addEventListener("keydown", (event) => {
  if (event.ctrlKey || event.metaKey || event.altKey) return;

  const key = event.key;

  if (/^[0-9]$/.test(key)) inputDigit(key);
  else if (key === ".") inputDecimal();
  else if (["+", "-", "*", "/"].includes(key)) inputOperator(key);
  else if (key === "Enter" || key === "=") inputEquals();
  else if (key === "Backspace") backspace();
  else if (key === "Escape") clearAll();
  else return; // not a calculator key, leave it alone

  event.preventDefault();
});