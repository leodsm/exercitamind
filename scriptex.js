class Question {
  constructor(subject, questionText, correctAnswer, wrongAnswers, explanationUrl) {
    this.subject = subject;
    this.questionText = questionText;
    this.correctAnswer = correctAnswer;
    this.wrongAnswers = wrongAnswers;
    this.explanationUrl = explanationUrl;
  }
}

document.getElementById('search-btn').addEventListener('click', searchSubject);


const csvUrl = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vR-YJsD0iNJGIJyB-eqYbrN0ohmk8zmIDC9QcMghVz32r3YuJ1GEYaFj0JaQ-WWaCEjtol8PTzfep4-/pub?output=csv';

async function fetchDataFromCSV() {
  try {
    const response = await fetch(csvUrl);
    const data = await response.text();
    const rows = data.split('\n').slice(1);
    const values = rows.map((row) => row.split(','));

    return values;
  } catch (error) {
    console.error('Erro ao buscar dados do CSV:', error);
  }
}

async function createQuestionsArray() {
  const rawData = await fetchDataFromCSV();
  const questions = [];

  rawData.forEach((row) => {
    const subject = row[0];
    const questionText = row[1];
    const correctAnswer = row[2];
    const wrongAnswers = row.slice(3, 7);
    const explanationUrl = row[7];

    const question = new Question(subject, questionText, correctAnswer, wrongAnswers, explanationUrl);
    questions.push(question);
  });

  return questions;
}


let questions = [];
let currentQuestionIndex = 0;
let correctCount = 0;
let incorrectCount = 0;

function displayQuestion(question) {
  document.getElementById('subject-title').innerText = question.subject;
  document.getElementById('question-text').innerText = question.questionText;

  const optionsContainer = document.getElementById('options-container');
  optionsContainer.innerHTML = '';

  const shuffledAnswers = [question.correctAnswer, ...question.wrongAnswers].sort(() => Math.random() - 0.5);

  shuffledAnswers.forEach((answer) => {
    const optionContainer = document.createElement('div');
    optionContainer.classList.add('option-container');

    const optionInput = document.createElement('input');
    optionInput.type = 'radio';
    optionInput.name = 'options';

    const optionLabel = document.createElement('label');
    optionLabel.innerText = answer;

    optionContainer.appendChild(optionInput);
    optionContainer.appendChild(optionLabel);
    optionsContainer.appendChild(optionContainer);
  });
}

function displayResult(isCorrect) {
  const resultContainer = document.getElementById('answer-result');
  resultContainer.innerHTML = '';

  const resultText = document.createElement('div');
  resultText.innerText = isCorrect ? 'Parabéns! Resposta Certa.' : 'Resposta Errada!';
  resultText.style.color = 'white';
  resultText.style.padding = '10px';
  resultText.style.marginBottom = '10px';
  resultText.style.backgroundColor = isCorrect ? 'green' : 'red';

  resultContainer.appendChild(resultText);

  if (!isCorrect) {
    const explanationLink = document.createElement('a');
    explanationLink.innerText = 'Ver explicação';
    explanationLink.href = questions[currentQuestionIndex].explanationUrl;
    explanationLink.target = '_blank';
    explanationLink.style.display = 'block';
    explanationLink.style.marginBottom = '10px';

    resultContainer.appendChild(explanationLink);
  }

  const submitButton = document.getElementById('answer-submit');
  submitButton.innerText = 'Próxima Pergunta';
  submitButton.removeEventListener('click', submitAnswer);
  submitButton.addEventListener('click', resetQuestion);
}


let filteredQuestions;

async function initialize() {
  questions = await createQuestionsArray();
  filteredQuestions = questions;
  displayQuestion(questions[currentQuestionIndex]);
}


// ... Código anterior ...

function submitAnswer() {
  const options = document.getElementsByName('options');
  let selectedOption = null;

  options.forEach((option) => {
    if (option.checked) {
      selectedOption = option;
    }
  });

  if (!selectedOption) {
    alert('Por favor, selecione uma opção.');
    return;
  }

  const isCorrect = questions[currentQuestionIndex].correctAnswer === selectedOption.nextSibling.textContent;
  if (isCorrect) {
    correctCount++;
    document.getElementById('correct-count').innerText = correctCount;
  } else {
    incorrectCount++;
    document.getElementById('incorrect-count').innerText = incorrectCount;
  }

  displayResult(isCorrect);
}

// ... Restante do código ...



function resetQuestion() {
  const resultContainer = document.getElementById('answer-result');
  resultContainer.innerHTML = '';
  currentQuestionIndex++;
  displayQuestion(questions[currentQuestionIndex]);
}

function restoreSubmitButton() {
  const submitButton = document.getElementById('answer-submit');
  submitButton.innerText = 'Enviar Resposta';
  submitButton.removeEventListener('click', resetQuestion);
  submitButton.addEventListener('click', submitAnswer);
}

function resetQuestion() {
  restoreSubmitButton();
  const resultContainer = document.getElementById('answer-result');
  resultContainer.innerHTML = '';
  currentQuestionIndex++;
  displayQuestion(questions[currentQuestionIndex]);
}

function filterQuestionsBySubject(subject) {
  return questions.filter((question) => question.subject.toLowerCase() === subject.toLowerCase());
}

function searchSubject() {
  const searchInput = document.getElementById('search');
  const subject = searchInput.value.trim();
  filteredQuestions = filterQuestionsBySubject(subject);
  currentQuestionIndex = 0;
  displayQuestion(filteredQuestions[currentQuestionIndex]);
}

function checkAnswer() {
  const selectedOption = document.querySelector('input[name="option"]:checked');
  if (!selectedOption) {
    alert('Por favor, selecione uma opção.');
    return;
  }

  const userAnswer = selectedOption.nextElementSibling.innerText;
  const correctAnswer = filteredQuestions[currentQuestionIndex].correctAnswer;

  highlightAnswers(correctAnswer, userAnswer);

  if (userAnswer === correctAnswer) {
    document.getElementById('answer-result').innerHTML = 'Parabéns! Resposta Certa.';
    correctCount++;
  } else {
    document.getElementById('answer-result').innerHTML = 'Resposta Errada! <a href="' + filteredQuestions[currentQuestionIndex].explanationUrl + '" target="_blank">Ver explicação</a>';
    incorrectCount++;
  }

  document.getElementById('correct-count').innerText = correctCount;
  document.getElementById('incorrect-count').innerText = incorrectCount;

  document.getElementById('answer-submit').innerText = 'Próxima Pergunta';
  document.getElementById('answer-submit').removeEventListener('click', submitAnswer);
  document.getElementById('answer-submit').addEventListener('click', displayNextQuestion);
}

function displayNextQuestion() {
  clearHighlights();

  if (currentQuestionIndex < filteredQuestions.length - 1) {
    currentQuestionIndex++;
    displayQuestion(filteredQuestions[currentQuestionIndex]);
  } else {
    alert('Você concluiu todas as perguntas disponíveis!');
  }
}



document.getElementById('answer-submit').addEventListener('click', submitAnswer);

initialize();

