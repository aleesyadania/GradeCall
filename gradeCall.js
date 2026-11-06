
const firstnumber = document.getElementById("input1");
const secondnumber = document.getElementById("input2");
const decondnumber = document.getElementById("input3");
const output = document.getElementById("output");
function add() {
    let first = Number(firstnumber.value);
    let second = Number(secondnumber.value);
    let third = Number(decondnumber.value);
    let total = first + second + third;
    output.innerText = `${first} + ${second} + ${second} = ${total}`;
}
const addButton = document.getElementById("add");
addButton.addEventListener('click', add);
const myString = "Hello, World!";
const name = document.getElementById("name");
const className = document.getElementById("class");
const btn = document.getElementById("btn");
function displayInfo() {
    if (output) {
        output.innerHTML = `My name is ${name.value} and I am in class ${className.value}`;
    }
    ;
}
btn.addEventListener(`click`, displayInfo);
const output = document.getElementById("output");
if (output) {
    output.innerHTML = `Welcome, ${myString}`;
}
