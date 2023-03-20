function processJSON(loadedJSON) {
  const subjectData = loadedJSON;
  searchSubject(subjectData);
}

function searchSubject(subjectData) {
  const subject = document.getElementById("subject-search").value.trim();
  if (!subject) {
    alert("Por favor, digite o nome da matéria.");
    return;
  }

  const quizData = subjectData[subject];

  if (!quizData) {
    alert("Matéria não encontrada.");
    return;
  }

  const questions = quizData.map((row) => {
    return {
      question: row["Pergunta"],
      correctAnswer: row["Resposta Correta"],
      wrongAnswers: [row["Errada 1"], row["Errada 2"], row["Errada 3"]],
    };
  });

  startQuiz(questions);
}

function showAnswerResult(isCorrect) {
  const answerResult = document.createElement("div");
  answerResult.classList.add("answer-result");

  if (isCorrect) {
    answerResult.style.backgroundColor = "green";
    answerResult.style.color = "white";
    answerResult.innerText = "Parabéns! Resposta Correta.";
  } else {
    answerResult.style.backgroundColor = "red";
    answerResult.style.color = "white";
    answerResult.innerHTML = "Resposta errada.<br><a href='explicacao.html' style='color: white; font-size: smaller;'>Gostaria de ver uma explicação?</a>";
  }

  document.getElementById("answer-result").appendChild(answerResult);
  setTimeout(() => {
    document.getElementById("answer-result").removeChild(answerResult);
  }, 3000);
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
      showAnswerResult(true);
    } else {
      incorrectAnswers++;
      document.getElementById("incorrect-count").innerText = incorrectAnswers;
      showAnswerResult(false);
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

optionsContainer.addEventListener("click",(e) => {
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
  
  // Altere para o URL do arquivo JSON
  const JSON_URL = "./example.json";
  
  fetch(JSON_URL)
  .then((response) => response.json())
  .then((data) => {
  processJSON(data);
  })
  .catch((error) => {
  console.error("Erro ao buscar o arquivo JSON:", error);
  });

  
