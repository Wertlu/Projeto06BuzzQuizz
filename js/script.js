//Variáveis
let quizzesObj //armazena objeto de todos os quizzes
const page1 = document.querySelector('.page1') //Tela 1
const page2 = document.querySelector('.page2') //Tela 2


function getAllQuizzes(){
    const promiseAllQuizzes = axios.get('https://mock-api.driven.com.br/api/v4/buzzquizz/quizzes')

    promiseAllQuizzes.then((answer) =>{
        quizzesObj = answer.data
        const quizzesHTML = document.querySelector(".all-quizzes .quizzes")

        for(let i = 0; i < quizzesObj.length; i++){
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
}

getAllQuizzes()

function showQuiz(id){
    page1.classList.add('hidden')
    page2.classList.remove('hidden')

    getQuiz(id)

}

function getQuiz(id) {
    const promiseQuiz = axios.get(`https://mock-api.driven.com.br/api/v4/buzzquizz/quizzes/${id}`)
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
    <div class="questions"></div>
        `
    const questionsHTML = document.querySelector('.questions')
    loadQuestions(questionsHTML,quiz)
}


function loadQuestions(element,quiz) {
    let questions = quiz.questions

    for(let i = 0; i < questions.length; i++){
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

        loadAnswers(answer,questions[i])
    }

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
        <div class="${isCorrect}" onclick="addBlurry(this)">
            <img src="${imageAnswer}">
            <figcaption>${textAnswer}</figcaption>
        </div>

        `
    }
}

function addBlurry(element){
    const divAnswers = element.parentNode
    console.dir(divAnswers.parentNode);
    console.log(divAnswers.parentNode)
    console.log(divAnswers.parentNode.nextElementSibling)

    for (let i = 0; i < divAnswers.childElementCount; i++) {
        divAnswers.children[i].classList.add('blurry')
        divAnswers.children[i].removeAttribute('onclick')    
    }
    element.classList.remove('blurry')
    checkAnswer(element)
    setTimeout(()=>{
        divAnswers.parentNode.nextElementSibling.scrollIntoView()
    },2000)
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