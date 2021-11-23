//Variáveis
let quizzesObj //armazena objeto de todos os quizzes
const page1 = document.querySelector('.page1') //Tela 1
const page2 = document.querySelector('.page2') //Tela 2
const page3 = document.querySelector('.page3') //Tela 3

let percentage
let numQuestions

let levelsHits
let idQuiz

let userHasQuizz = false //boolean //Essa parte precisa das funções de criação de quizzes do usuário

function getAllQuizzes() {
    const promiseAllQuizzes = axios.get('https://mock-api.driven.com.br/api/v4/buzzquizz/quizzes')

    promiseAllQuizzes.then((answer) => {
        quizzesObj = answer.data
        const quizzesHTML = document.querySelector(".all-quizzes .quizz-box")
        quizzesHTML.innerHTML = ""

        for (let i = 0; i < quizzesObj.length; i++) {
            let titleQuiz = quizzesObj[i].title
            let imageQuiz = quizzesObj[i].image
            let idQuiz = quizzesObj[i].id

            quizzesHTML.innerHTML += `
                <figure onclick="showQuiz(${idQuiz})">
                    <img src="${imageQuiz}">
                    <figcaption>
                        ${titleQuiz}
                    </figcaption>
                </figure>
            `
        }
    })
    showUserQuizzes(userHasQuizz)
}

getAllQuizzes()

function showQuiz(id) {
    idQuiz = id
    page1.classList.add('hidden')
    page2.classList.remove('hidden')

    getQuiz(id)

}

function getQuiz(idQuiz) {
    const promiseQuiz = axios.get(`https://mock-api.driven.com.br/api/v4/buzzquizz/quizzes/${idQuiz}`)
    promiseQuiz.then((answer) => {
        const quiz = answer.data
        loadQuiz(page2, quiz)
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


function loadQuiz(element, quiz) {
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
    loadQuestions(questionsHTML, quiz)
}


function loadQuestions(element, quiz) {
    let questions = quiz.questions
    numQuestions = quiz.questions.length
    levelsHits = quiz.levels


    for (let i = 0; i < questions.length; i++) {
        let titleQuestion = questions[i].title
        let colorQuestion = questions[i].color

        element.innerHTML += `
        <div class="question">
            <h1 style="background:${colorQuestion}">${titleQuestion}</h1>
            <figure class="answers"></figure>
        </div>
        `
        let answersHTML = document.querySelectorAll('figure.answers')
        let answer = answersHTML[i]

        loadAnswers(answer, questions[i])
    }
    element.innerHTML += `<div class="finish hidden"></div>`

}

function loadAnswers(element, question) {
    let answer = question.answers
        //embaralha as respostas
    answer.sort(() => {
        return Math.random() - 0.5;
    });
    for (let i = 0; i < answer.length; i++) {
        let imageAnswer = answer[i].image;
        let textAnswer = answer[i].text;
        let isCorrect = answer[i].isCorrectAnswer;

        element.innerHTML += `
        <div class="${isCorrect}" onclick="addBlurry(this)">
            <img src="${imageAnswer}">
            <figcaption>${textAnswer}</figcaption>
        </div>

        `
    }
}

function addBlurry(element) {
    const divAnswers = element.parentNode
    element.parentNode.parentNode.classList.add('answered')
    for (let i = 0; i < divAnswers.childElementCount; i++) {
        divAnswers.children[i].classList.add('blurry')
        divAnswers.children[i].removeAttribute('onclick')
    }
    element.classList.remove('blurry')
    checkAnswer(element)
    setTimeout(() => {
        divAnswers.parentNode.nextElementSibling.scrollIntoView()
    }, 2000)
    setTimeout(showFinish(), 2000)
}

function checkAnswer(element) {
    const divAnswers = element.parentNode

    for (let i = 0; i < divAnswers.childElementCount; i++) {
        let x = divAnswers.children[i].classList.contains('true')
        if (divAnswers.children[i].classList.contains('true')) {
            divAnswers.children[i].classList.add('correct')
        } else {
            divAnswers.children[i].classList.add('incorrect')
        }
    }
}

function showFinish() {
    const check = document.querySelectorAll('.question')
    const finish = document.querySelector('.finish')

    for (let i = 0; i < check.length; i++) {
        if (!check[i].classList.contains('answered')) {
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
        if (containsCorrect && notContainsBlurry) {
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
        if (percentage >= levelsHits[i].minValue) {
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
    element.scrollIntoView()
}

function showUserQuizzes(userHasQuizz) {
    console.log(userHasQuizz);
    const quizCriationCaller = document.querySelector('.quizz-creation-caller')
    const userQuizzes = document.querySelector('.user-quizzes')
    if (userHasQuizz) {
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