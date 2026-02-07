// 1. Click to Change Text
document.getElementById("changeTextBtn").addEventListener("click", function () {
    document.getElementById("text").textContent = "Text has been changed!";
});
// 2. Click to Change Colour of Multiple Elements
document.getElementById("colorBtn").addEventListener("click", function () {
    let elements = document.getElementsByClassName("colorChange");
    for (let i = 0; i < elements.length; i++) {
        elements[i].style.color = "red";
    }
});
// 3. Click to Hide and Show an Element
document.getElementById("toggleBtn").addEventListener("click", function () {
    let textElement = document.getElementById("toggleText");
    if (textElement.style.display === "none") {
        textElement.style.display = "block";
    } else {
        textElement.style.display = "none";
    }
});
// 4. Click to Change Background Colour
document.getElementById("bgBtn").addEventListener("click", function () {
    document.body.style.backgroundColor = "lightblue";
});
// 5. Multiple Buttons Changing Text Individually
let buttons = document.getElementsByClassName("btn");
for (let i = 0; i < buttons.length; i++) {
    buttons[i].addEventListener("click", function () {
        buttons[i].textContent = "Clicked!"; //IF YOU DONT WNAT TO USE THIS KEYWORD, YOU CAN USE: buttons[i].textContent = "Clicked!";
    });
}