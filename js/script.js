//Variáveis
let quizzesObj //armazena objeto de todos os quizzes
const page1 = document.querySelector('.page1') //Tela 1

function getAllQuizzes(){
    const promiseAllQuizzes = axios.get('https://mock-api.driven.com.br/api/v4/buzzquizz/quizzes')

    promiseAllQuizzes.then((answer) =>{
        quizzesObj = answer.data
        const quizzesHTML = document.querySelector(".all-quizzes .quizzes")
        
        for(let i = 0; i < quizzesObj.length; i++){
            let titleQuiz = quizzesObj[i].title
            let imageQuiz = quizzesObj[i].image
    
            quizzesHTML.innerHTML += `
                <figure onclick="showQuiz(this)">
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

function showQuiz(quiz){
    page1.classList.add('hidden')
    quiz.classList.remove('hidden')
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
