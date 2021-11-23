//Variáveis
let quizzesObj //armazena objeto de todos os quizzes
const page1 = document.querySelector('.page1') //Tela 1
const page2 = document.querySelector('.page2') //Tela 2
const page3 = document.querySelector('.page3') //Tela 3

let percentage
let numQuestions

let levelsHits
let idQuiz

let userQuizzesId = []
let userHasQuizz //boolean //Essa parte precisa das funções de criação de quizzes do usuário

function userHasQuizzes(arrayuserQuizzesId) {
    if(arrayuserQuizzesId === [] ){
        userHasQuizz = false
        console.log(userHasQuizz);
        return
    }
}

function getAllQuizzes(){
    const promiseAllQuizzes = axios.get('https://mock-api.driven.com.br/api/v4/buzzquizz/quizzes')
    

    promiseAllQuizzes.then((answer) =>{
        quizzesObj = answer.data
        const quizzesHTML = document.querySelector(".all-quizzes .quizz-box")
        quizzesHTML.innerHTML = ""

        for(let i = 0; i < quizzesObj.length; i++){
            let titleQuiz = quizzesObj[i].title
            let imageQuiz = quizzesObj[i].image
            let idQuiz = quizzesObj[i].id

            quizzesHTML.innerHTML += `
                <figure onclick="showQuiz(${idQuiz})" data-identifier="quizz-card">
                    <img src="${imageQuiz}">
                    <figcaption>
                        ${titleQuiz}
                    </figcaption>
                </figure>
            `
        }
    })
    userHasQuizzes(userQuizzesId)
    showUserQuizzes(userHasQuizz)
}

getAllQuizzes()

function showQuiz(id){
    idQuiz = id
    page1.classList.add('hidden')
    page2.classList.remove('hidden')

    getQuiz(id)
}

function getQuiz(idQuiz) {
    const promiseQuiz = axios.get(`https://mock-api.driven.com.br/api/v4/buzzquizz/quizzes/${idQuiz}`)
    promiseQuiz.then((answer) =>{
        const quiz = answer.data
        loadQuiz(page2,quiz)
    })
}


//Essa parte é só pra eu vizualizar direito o array que traz todos os quizzes
//array//////////
//quizzes

    //quizess//////////
    //id
    //title
    //image
    //questions
    //levels

        //question//////////
        // titulo
        // color
        // answers

            //answer//////////
            //text
            //image
            //isCorrect

        //level//////////
        //title
        //image
        //text
        //minValue


function loadQuiz(element, quiz){
    let titleQuiz = quiz.title
    let imageQuiz = quiz.image

    element.innerHTML = `
    <div class="header-quiz">
        <figure>
            <img src="${imageQuiz}">
            <figcaption>
                ${titleQuiz}
            </figcaption>
        </figure>
    </div>
    <div class="questions">
    </div>
    <button class="restart-quizz" onclick="restartQuiz()">Reiniciar Quizz</button>
    <h1 class="back-home" onclick="backHome()">Voltar para Home</h1>
        `
    const questionsHTML = document.querySelector('.questions')
    loadQuestions(questionsHTML,quiz)
}


function loadQuestions(element,quiz) {
    let questions = quiz.questions
    numQuestions = quiz.questions.length
    levelsHits = quiz.levels


    for(let i = 0; i < questions.length; i++){
        let titleQuestion = questions[i].title
        let colorQuestion = questions[i].color
        
        element.innerHTML += `
        <div class="question" data-identifier="question">
            <h1 style="background:${colorQuestion}">${titleQuestion}</h1>
            <figure class="answers"></figure>
        </div>
        `
        let answersHTML = document.querySelectorAll('figure.answers')
        let answer = answersHTML[i]

        loadAnswers(answer,questions[i])
    }
    element.innerHTML += `<div class="finish hidden" data-identifier="quizz-result"></div>`

}
function loadAnswers(element,question){
    let answer = question.answers
    //embaralha as respostas
    answer.sort(() => {
        return Math.random()-0.5;
    });
    for(let i = 0; i<answer.length;i++){
        let imageAnswer = answer[i].image;
        let textAnswer = answer[i].text;
        let isCorrect = answer[i].isCorrectAnswer;

        element.innerHTML += `
        <div class="${isCorrect}" onclick="addBlurry(this)" data-identifier="answer">
            <img src="${imageAnswer}">
            <figcaption>${textAnswer}</figcaption>
        </div>

        `
    }
}

function addBlurry(element){
    const divAnswers = element.parentNode
    element.parentNode.parentNode.classList.add('answered')
    for (let i = 0; i < divAnswers.childElementCount; i++) {
        divAnswers.children[i].classList.add('blurry')
        divAnswers.children[i].removeAttribute('onclick')    
    }
    element.classList.remove('blurry')
    checkAnswer(element)
    setTimeout(()=>{
        divAnswers.parentNode.nextElementSibling.scrollIntoView({behavior: "smooth"})
    },2000)
    setTimeout(showFinish(),2000)
}
function checkAnswer(element) {
    const divAnswers = element.parentNode

    for (let i = 0; i < divAnswers.childElementCount; i++) {
        let x = divAnswers.children[i].classList.contains('true')
        if(divAnswers.children[i].classList.contains('true')){
            divAnswers.children[i].classList.add('correct')
        }else{
            divAnswers.children[i].classList.add('incorrect')   
        }  
    }
}
function showFinish() {
    const check = document.querySelectorAll('.question')
    const finish = document.querySelector('.finish')

    for (let i = 0; i < check.length; i++) {
        if(!check[i].classList.contains('answered')){
            return
        }    
    }
    finish.classList.remove('hidden')
    calculatepercentage()
}
function calculatepercentage() {
    const allAnswers = document.querySelectorAll('.answers div')
    let questionsCorrect = 0

    for (let i = 0; i < allAnswers.length; i++) {
        let containsCorrect = allAnswers[i].classList.contains('correct')
        let notContainsBlurry = !(allAnswers[i].classList.contains('blurry'))
        if(containsCorrect && notContainsBlurry){
            questionsCorrect++
        }
    }
    percentage = ((questionsCorrect / numQuestions) * 100).toFixed(0)
    Finish()
}
function Finish() {
    const Finish = document.querySelector('.finish')
    let imageFinish
    let textFinish
    let titleFinish
    for (let i = 0; i < levelsHits.length; i++) {
        if(percentage >= levelsHits[i].minValue){
            imageFinish = levelsHits[i].image
            textFinish = levelsHits[i].text
            titleFinish = levelsHits[i].title
        }
    }
    Finish.innerHTML = `
    <h1>${percentage}% de acerto: ${titleFinish}</h1>
    <div>
        <img src="${imageFinish}">
        <h2>
            ${textFinish}
        </h2>
    </div>
    `
}
function backHome() {
   /*  page1.classList.remove('hidden')
    page2.classList.add('hidden') */
    window.location.reload()
}
function restartQuiz() {
    const element = document.querySelector('.header-quiz')
    const correctAnswers = document.querySelectorAll('.correct')
    const incorrectAnswers = document.querySelectorAll('.incorrect')
    
    for (let i = 0; i < correctAnswers.length; i++) {
        let answer = document.querySelector('.correct')
        answer.classList.remove('correct')
    }
    for (let i = 0; i < incorrectAnswers.length; i++) {
        let answer = document.querySelector('.incorrect')
        answer.classList.remove('incorrect')
    }
    getQuiz(idQuiz)
    element.scrollIntoView({behavior: "smooth"})
}

function showUserQuizzes(userHasQuizz){
    const quizCriationCaller = document.querySelector('.quizz-creation-caller')
    const userQuizzes = document.querySelector('.user-quizzes')
    if (userHasQuizz){
        quizCriationCaller.classList.add('hidden')
        userQuizzes.classList.remove('hidden')
        return
    }
    quizCriationCaller.classList.remove('hidden')
    userQuizzes.classList.add('hidden')
}
function showCreationQuiz() {
    page1.classList.add('hidden')
    page3.classList.remove('hidden')
}















function creationCaller() {
    document.querySelector(".page1").classList.toggle("hidden");
    document.querySelector(".page3").classList.toggle("hidden");
}

function lengthMinChecker(input, qty) {
    if (input.value.length < qty) {
        return false;
    }
    return true;
}
let wrongTitle = [];

function arrayCellMinLengthChecker(input, qty) {
    wrongTitle = [];
    for (let i = 0; i < input.length; i++) {
        if (input[i].value.length < qty) {
            wrongTitle.push(input[i]);
        }
    }
    if (wrongTitle.length === 0) {
        return true;
    } else {
        return false;
    }
}

function lengthMaxChecker(input, qty) {
    if (input.value.length > qty) {
        return false;
    }
    return true;
}

function qtyChecker(input, qty) {
    if (input.value < qty) {
        return false;
    }
    return true;
}

function urlChecker(input) {
    if (!urlValidation(input)) {
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
let wrongEmptynessChecker = [];

function arrayEmptynessChecker(input) {
    wrongEmptynessChecker = [];
    let aux = [];
    for (let i = 0; i < input.length; i++) {
        if (input[i].value !== "") {
            aux.push(input[i]);
        }
        wrongEmptynessChecker.push(input[i]);
    }
    if (input.length === aux.length) {
        return true;
    } else {
        return false;
    }
}
let wrongUrl = [];

function arrayUrlChecker(input) {
    wrongUrl = [];
    for (let i = 0; i < input.length; i++) {
        if (!urlValidation(input[i].value)) {
            wrongUrl.push(input[i]);
        }
    }
    if (wrongUrl.length === 0) {

        return true;
    } else {

        return false;
    }
}

let wrongColor = [];

function hexDecChecker(color) {
    wrongColor = [];
    for (let i = 0; i < color.length; i++) {
        if (color[i].value.length === 7) {
            if (color[i].value[0] === "#") {
                for (let j = 1; j < color[i].value.length; j++) {
                    if (color[i].value[j] === "0" || color[i].value[j] === "1" || color[i].value[j] === "2" || color[i].value[j] === "3" || color[i].value[j] === "4" || color[i].value[j] === "5" || color[i].value[j] === "6" || color[i].value[j] === "7" || color[i].value[j] === "8" || color[i].value[j] === "9" || color[i].value[j] === "a" || color[i].value[j] === "b" || color[i].value[j] === "c" || color[i].value[j] === "d" || color[i].value[j] === "e" || color[i].value[j] === "f") {
                        continue
                    } else {
                        wrongColor.push(color[i]);
                        break
                    }
                }
            } else {
                wrongColor.push(color[i]);
            }
        } else {
            wrongColor.push(color[i]);
        }
    }
    if (wrongColor.length != 0) {

        return false;
    } else {

        return true;
    }
}

function incorrectAnswerChecker() {
    const allQuestions = document.querySelectorAll(".page3 .questions-creation ul li");
    for (let i = 0; i < allQuestions.length; i++) {
        let incorrectAnswer = allQuestions[i].querySelectorAll(".incorrect-answer");
        let incorrectAnswerUrl = allQuestions[i].querySelectorAll(".incorrect-answer-url-img")
        let aux = 0;
        for (let j = 0; j < incorrectAnswer.length; j++) {
            if (incorrectAnswer[j].value === "" && incorrectAnswerUrl[j].value === "") {
                aux++;
                if (aux === 3) {
                    return false
                }
            } else if (incorrectAnswer[j].value !== "" && (incorrectAnswerUrl[j].value === "" || !urlChecker(incorrectAnswerUrl[j].value))) {
                return false;
            } else if (incorrectAnswer[j].value === "" && urlChecker(incorrectAnswerUrl[j].value)) {
                return false;
            } else {
                return true;
            }
        }
    }
}


function percentChecker() {
    const minPercent = document.querySelectorAll(".min-percent");
    let auxFor0 = false;
    let auxFor0to100 = false
    for (let i = 0; i < minPercent.length; i++) {
        if (minPercent[i].value === "0") {
            auxFor0 = true;
        }
        if (minPercent[i].value <= "100" && minPercent[i].value >= "0") {
            auxFor0to100 = true;
        }
    }
    if (auxFor0 && auxFor0to100) {
        return true;
    } else {
        return false;
    }
}

function quizzSender() {
    let allQuestions = document.querySelectorAll(".page3 .questions-creation ul li");
    const quizz = {
        title: document.querySelector(".quizz-tittle").value,
        image: document.querySelector(".quizz-image").value,
        questions: [],
        levels: []
    };

    for (let i = 0; i < document.querySelectorAll(".page3 .questions-creation ul li").length; i++) {
        quizz.questions[i] = {
            title: document.querySelectorAll(".question-text")[i].value,
            color: document.querySelectorAll(".question-color")[i].value,
            answers: []
        }
    }

    for (let i = 0; i < document.querySelectorAll(".page3 .questions-creation ul li").length; i++) {
        let allAnswers = allQuestions[i].querySelectorAll(".answers");
        let allImages = allQuestions[i].querySelectorAll(".images");
        for (let j = 0; j < allAnswers.length; j++) {
            if (allAnswers[j].value === "") {
                continue;
            }
            if (allAnswers[j].classList.contains("correct-answer")) {
                quizz.questions[i].answers.push({
                    text: allAnswers[j].value,
                    image: allImages[j].value,
                    isCorrectAnswer: true
                });
            } else {
                quizz.questions[i].answers.push({
                    text: allAnswers[j].value,
                    image: allImages[j].value,
                    isCorrectAnswer: false
                });
            }
        }
        for (let i = 0; i < document.querySelectorAll(".page3 .level-creation ul li").length; i++) {
            quizz.levels[i] = {
                title: document.querySelectorAll(".level-title")[i].value,
                image: document.querySelectorAll(".level-img-url")[i].value,
                text: document.querySelectorAll(".level-description")[i].value,
                minValue: document.querySelectorAll(".min-percent")[i].value
            }
        }
    }
    const promise = axios.post("https://mock-api.driven.com.br/api/v4/buzzquizz/quizzes", quizz);
    promise.then(lastCreationPageCaller);
    promise.catch();
}

// a funcao userQuizzesId esta declarada no inicio

function lastCreationPageCaller(servResponse) {
    let id = servResponse.data.id;
    userQuizzesId.push(id);
    const idString = localStorage.getItem("id");
    if (idString === null) {
        id = JSON.stringify(userQuizzesId);
        localStorage.setItem("id", id)
    } else {
        userQuizzesId = JSON.parse(idString)
        userQuizzesId.push(id);
        let idSerial = JSON.stringify(userQuizzesId);
        localStorage.setItem("id", idSerial);
    }
    document.querySelector(".level-creation").classList.toggle("hidden");
    document.querySelector(".quizz-creation-finish").classList.toggle("hidden");

    document.querySelector(".quizz-creation-finish").innerHTML = `
    <h1>Seu quizz está pronto!</h1>
    <figure>
        <img style="background-image: linear-gradient(180deg, rgba(255, 255, 255, 0) 0%, rgba(0, 0, 0, 0.5) 64.58%, #000000 100%), url(${document.querySelector(".quizz-image").value});" alt="">
        <figcaption>
            ${document.querySelector(".quizz-tittle").value}
        </figcaption>
    </figure>
    <button onclick="/*page2(${servResponse.data.id})*/" >Acessar Quizz</button>
    <span onclick="homeCaller()">Voltar para Home</span>`
    console.log(userQuizzesId);

}

function homeCaller() {
    window.location.reload();
}

function select(icon) {
    icon.parentNode.parentNode.querySelector(".selected").classList.toggle("selected");
    icon.parentNode.classList.toggle("selected");
}

function questionsCreationLoad() {
    for (let i = 0; i < document.querySelector(".quizz-questions-qty").value; i++) {
        if (i === 0) {
            document.querySelector(".questions-creation ul").innerHTML +=
                `<li class="selected">
            <h2>Pergunta ${i+1}</h2>
            <ion-icon onclick="select(this)" name="create-outline"></ion-icon>
            <input class="question-text" type="text" placeholder="Texto da pergunta">
            <span class="question-text-error"></span>
            <input class="question-color" type="text" placeholder="Cor de fundo da pergunta">
            <span class="question-color-error"></span>
            <h2 class="subtitle">Resposta correta</h2>
            <input class="answers correct-answer" type="text" placeholder="Resposta correta">
            <span class="correct-answer-error"></span>
            <input class="images correct-answer-url-img" type="text" placeholder="URL da imagem">
            <span class="correct-answer-url-img-error"></span>
            <h2 class="subtitle">Respostas incorretas</h2>
            <input class="answers incorrect-answer" type="text" placeholder="Resposta incorreta 1">
            <span class="incorrect-answer-error"></span>
            <input class="images incorrect-answer-url-img" type="text" placeholder="URL da imagem 1">
            <span class="incorrect-answer-url-img-error"></span>
            <input class="answers incorrect-answer" type="text" placeholder="Resposta incorreta 2">
            <span class="incorrect-answer-error"></span>
            <input class="images incorrect-answer-url-img" type="text" placeholder="URL da imagem 2">
            <span class="incorrect-answer-url-img-error"></span>
            <input class="answers incorrect-answer" type="text" placeholder="Resposta incorreta 3">
            <span class="incorrect-answer-error"></span>
            <input class="images incorrect-answer-url-img" type="text" placeholder="URL da imagem 3">
            <span class="incorrect-answer-url-img-error"></span>
        </li>`
        } else {
            document.querySelector(".questions-creation ul").innerHTML +=
                `<li class="">
        <h2>Pergunta ${i+1}</h2>
        <ion-icon onclick="select(this)" name="create-outline"></ion-icon>
        <input class="question-text" type="text" placeholder="Texto da pergunta">
        <span class="question-text-error"></span>
        <input class="question-color" type="text" placeholder="Cor de fundo da pergunta">
        <span class="question-color-error"></span>
        <h2 class="subtitle">Resposta correta</h2>
        <input class="answers correct-answer" type="text" placeholder="Resposta correta">
        <span class="correct-answer-error"></span>
        <input class="images correct-answer-url-img" type="text" placeholder="URL da imagem">
        <span class="correct-answer-url-img-error"></span>
        <h2 class="subtitle">Respostas incorretas</h2>
        <input class="answers incorrect-answer" type="text" placeholder="Resposta incorreta 1">
        <span class="incorrect-answer-error"></span>
        <input class="images incorrect-answer-url-img" type="text" placeholder="URL da imagem 1">
        <span class="incorrect-answer-url-img-error"></span>
        <input class="answers incorrect-answer" type="text" placeholder="Resposta incorreta 2">
        <span class="incorrect-answer-error"></span>
        <input class="images incorrect-answer-url-img" type="text" placeholder="URL da imagem 2">
        <span class="incorrect-answer-url-img-error"></span>
        <input class="answers incorrect-answer" type="text" placeholder="Resposta incorreta 3">
        <span class="incorrect-answer-error"></span>
        <input class="images incorrect-answer-url-img" type="text" placeholder="URL da imagem 3">
        <span class="incorrect-answer-url-img-error"></span>
    </li>`
        }
    }
}

function levelsCreationLoad() {
    for (let i = 0; i < document.querySelector(".quizz-levels-qty").value; i++) {
        if (i === 0) {
            document.querySelector(".level-creation ul").innerHTML +=
                `<li class="selected">
                <h2>Nível ${i+1}</h2>
                <ion-icon onclick="select(this)" name="create-outline"></ion-icon>
                <input class="level-title" type="text" placeholder="Título do nível">
                <span class="level-title-error"></span>
                <input class="min-percent" type="number" placeholder="% de acerto mínima">
                <span class="min-percent-error"></span>
                <input class="level-img-url" type="text" placeholder="URL da imagem do nível">
                <span class="level-img-url-error"></span>
                <textarea class="level-description" type="text" placeholder="Descrição do nível"></textarea>
                <span class="level-description-error"></span>
            </li>`
        } else {
            document.querySelector(".level-creation ul").innerHTML +=
                `<li class="">
                <h2>Nível ${i+1}</h2>
                <ion-icon onclick="select(this)" name="create-outline"></ion-icon>
                <input class="level-title" type="text" placeholder="Título do nível">
                <span class="level-title-error"></span>
                <input class="min-percent" type="number" placeholder="% de acerto mínima">
                <span class="min-percent-error"></span>
                <input class="level-img-url" type="text" placeholder="URL da imagem do nível">
                <span class="level-img-url-error"></span>
                <textarea class="level-description" type="text" placeholder="Descrição do nível"></textarea>
                <span class="level-description-error"></span>
            </li>`
        }
    }
}

function errorController(btn) {
    if (btn.parentNode.classList.contains("quizz-creation-start")) {
        if (lengthMinChecker(document.querySelector(".quizz-tittle"), 20) &&
            lengthMaxChecker(document.querySelector(".quizz-tittle"), 65) &&
            qtyChecker(document.querySelector(".quizz-questions-qty").value, 3) &&
            qtyChecker(document.querySelector(".quizz-levels-qty").value, 2) &&
            urlChecker(document.querySelector(".quizz-image").value)) {
            questionsCreationLoad();
            document.querySelector(".quizz-creation-start").classList.toggle("hidden");
            document.querySelector(".questions-creation").classList.toggle("hidden");
        } else {
            alert("Informações inválidas");
        }
    }
    if (btn.parentNode.classList.value === "questions-creation") {
        if (arrayCellMinLengthChecker(document.querySelectorAll(".question-text"), 20) &&
            hexDecChecker(document.querySelectorAll(".question-color")) &&
            arrayEmptynessChecker(document.querySelectorAll(".correct-answer")) &&
            arrayUrlChecker(document.querySelectorAll(".correct-answer-url-img")) &&
            incorrectAnswerChecker()) {
            document.querySelector(".questions-creation").classList.toggle("hidden");
            document.querySelector(".level-creation").classList.toggle("hidden");
            levelsCreationLoad();
        } else {
            alert("Informações inválidas")
        }
    }
    if (btn.parentNode.classList.value === "level-creation") {
        if (arrayCellMinLengthChecker(document.querySelectorAll(".level-title"), 10) &&
            percentChecker() &&
            arrayUrlChecker(document.querySelectorAll(".level-img-url")) &&
            arrayCellMinLengthChecker(document.querySelectorAll(".level-description"), 30)) {
            quizzSender();
        } else {
            alert("Informações inválidas")
        }
    }
    if (btn.parentNode.classList.value === "quizz-creation-finish") {

    }
}