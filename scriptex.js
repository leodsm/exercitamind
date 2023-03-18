document.getElementById("search-btn").addEventListener("click", searchSubject);

function searchSubject() {
  // Realize a pesquisa da matéria e carregue o arquivo CSV
}

function handleCSV(data) {
  // Processa os dados do CSV e exibe a matéria e as perguntas
}

function displaySubject(subject) {
  document.getElementById("subject-title").innerText = subject;
}

function displayQuestions(questions) {
  // Exiba as perguntas e as opções
}

function handleFileUpload(event) {
  const file = event.target.files[0];

  if (file) {
    const reader = new FileReader();
    reader.onload = function (e) {
      const data = e.target.result;
      processCSV(data);
    };
    reader.readAsText(file);
  }
}

function processCSV(csvData) {
  const lines = csvData.split("\n");
  const subject = lines[0].split(",")[0];
  document.getElementById("subject-title").innerText = subject;

  const questions = [];
  for (let i = 1; i < lines.length; i++) {
    const cells = lines[i].split(",");
    if (cells.length >= 4) {
      questions.push({
        question: cells[0],
        correctAnswer: cells[1],
        wrongAnswers: cells.slice(2),
      });
    }
  }

  startQuiz(questions);
}

function startQuiz(questions) {
  let currentQuestionIndex = 0;
  let correctAnswers = 0;
  let incorrectAnswers = 0;

  function displayQuestion() {
    const question = questions[currentQuestionIndex];
    document.getElementById("question-text").innerText = question.question;

    const options = [question.correctAnswer, ...question.wrongAnswers];
    options.sort(() => Math.random() - 0.5);

    const optionsContainer = document.getElementById("options-container");
    optionsContainer.innerHTML = "";

    options.forEach((option) => {
      const optionElement = document.createElement("div");
      optionElement.classList.add("option");
      optionElement.innerHTML = `
        <input type="radio" name="answer" value="${option === question.correctAnswer}">
        <span>${option}</span>
      `;
      optionsContainer.appendChild(optionElement);
    });
  }

  function checkAnswer() {
    const selectedOption = document.querySelector('input[name="answer"]:checked');

    if (!selectedOption) {
      alert("Por favor, selecione uma opção antes de enviar.");
      return;
    }

    const isCorrect = selectedOption.value === "true";

    if (isCorrect) {
      correctAnswers++;
      document.getElementById("correct-count").innerText = correctAnswers;
      document.getElementById("answer-result").innerText = "Correto! Parabéns!";
      document.getElementById("answer-result").style.color = "green";
    } else {
      incorrectAnswers++;
      document.getElementById("incorrect-count").innerText = incorrectAnswers;
      document.getElementById("answer-result").innerText = "Incorreto. Tente novamente!";
      document.getElementById("answer-result").style.color = "red";
    }

    currentQuestionIndex++;

    if (currentQuestionIndex < questions.length) {
      displayQuestion();
    } else {
      document.getElementById("answer-submit").disabled = true;
      document.getElementById("answer-result").innerText = "Fim do quiz! Verifique sua pontuação.";
    }
  }

  displayQuestion();
  document.getElementById("answer-submit").addEventListener("click", checkAnswer);
}

const optionsContainer = document.getElementById("options-container");
const submitButton = document.getElementById("answer-submit");
let selectedOption = null;

optionsContainer.addEventListener("click", (e) => {
  if (e.target.classList.contains("option")) {
    setSelectedOption(e.target);
  } else if (e.target.closest(".option")) {
    setSelectedOption(e.target.closest(".option"));
  }
});

function setSelectedOption(optionElement) {
  if (selectedOption) {
    selectedOption.classList.remove("selected");
  }
  selectedOption = optionElement;
  selectedOption.classList.add("selected");
  const radio = selectedOption.querySelector('input[type="radio"]');
  radio.checked = true;
}

// Substitua o "CSV_URL" pelo URL do arquivo CSV no Google Drive
const CSV_URL = "ex.csv";

fetch(CSV_URL)
  .then((response) => response.text())
  .then((data) => {
    processCSV(data);
  })
  .catch((error) => {
    console.error("Erro ao buscar o arquivo CSV:", error);
  });

