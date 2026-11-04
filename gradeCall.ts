const firstnumber = document.getElementById("input1") as HTMLInputElement;
const secondnumber = document.getElementById("input2") as HTMLInputElement;
const decondnumber = document.getElementById("input3") as HTMLInputElement;
const output = document.getElementById("output") as HTMLElement;
function add(): void {
  let first: number = Number(firstnumber.value);
  let second: number = Number(secondnumber.value);
  let third: number = Number(decondnumber.value);
  let total: number = first + second + third;
  output.innerText = `${first} + ${second} + ${second} = ${total}`;
}
const addButton = document.getElementById("add") as HTMLButtonElement;
addButton.addEventListener('click', add);