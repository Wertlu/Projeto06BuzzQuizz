function creationCaller() {
    document.querySelector(".page1").classList.toggle("hidden");
    document.querySelector(".page3").classList.toggle("hidden");
}

function lengthMinChecker(input, qty) {
    if (input.value.length < qty) {
        alert("Informações inválidas1");
        return false;
    }
    return true;
}

function lengthMaxChecker(input, qty) {
    if (input.value.length > qty) {
        alert("Informações inválidas2");
        return false;
    }
    return true;
}

function qtyChecker(input, qty) {
    if (input.value < qty) {
        alert("Informações inválidas3");
        return false;
    }
    return true;
}

function urlChecker(input) {
    if (!urlValidation(input)) {
        alert("Informações inválidas5");
        return false;
    }
    return true;
}

function urlValidation(string) {
    let url;
    try {
        url = new URL(string);
    } catch (_) {

        return false;
    }
    return url.protocol === "http:" || url.protocol === "https:";
}

function emptynessChecker(input) {
    for (let i = 0; i < input.length; i++) {
        if (input.value !== "") {
            return true;
        }
    }
    return false
}

// function hexDecChecker(color) {
//     for (let i = 0; i < color.length; i++) {
//         if (color[i].value[0] === "#") {
//             for (let j = 1; j < color[i].value.length; j++) {
//                 console.log(color[i].value[j])
//                 if (color[i].value[j] === "0" || "1" || "2" || "3" || "4" || "5" || "6" || "7" || "8" || "9" || "a" || "b" || "c" || "d" || "e" || "f") {
//                     console.log(color[i].value[j])
//                 } else {
//                     return false;
//                 }
//             }
//         } else {
//             return false;
//         }
//     }
//     return true;
// }

function errorController(btn) {
    if (btn.parentNode.classList.contains("quizz-creation-start")) {
        if (lengthMinChecker(document.querySelector(".quizz-tittle"), 20) &&
            lengthMaxChecker(document.querySelector(".quizz-tittle"), 65) &&
            qtyChecker(document.querySelector(".quizz-questions-qty").value, 3) &&
            qtyChecker(document.querySelector(".quizz-levels-qty").value, 2) &&
            urlChecker(document.querySelector(".quizz-image").value)) {
            document.querySelector(".quizz-creation-start").classList.toggle("hidden");
            document.querySelector(".questions-creation").classList.toggle("hidden");
        }
    }
    if (btn.parentNode.classList.value === "questions-creation") {
        if (lengthMinChecker(document.querySelectorAll(".question-text"), 20) &&
            /*hexDecChecker(document.querySelectorAll(".question-color") &&*/
            emptynessChecker(document.querySelectorAll(".correct-answer"))) {
            alert("teste");
        }
    }
}