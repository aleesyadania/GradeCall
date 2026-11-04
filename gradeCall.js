"use strict";
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
