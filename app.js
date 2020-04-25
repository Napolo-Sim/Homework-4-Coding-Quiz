$(document).ready(function () {
    // Global scope
    var secondsLeft = 60;
    var d = new Date();

    if (location.href.endsWith('results.html')) {
        showHighscores();
    }

    // Array of objects containing each page with the question associated
    var quiz = [
        { // object --> page 1
            title: "Question 1:",
            description: "What is a conditional?",
            possibleAnswers: ["if/else statement", "cheese", "a disease", "an olympic runner"],
            correctAnswer: "if/else statement",
        },
        { // object --> page 2
            title: "Question 2:",
            description: "Which equals sign do you use to assign a value?",
            possibleAnswers: ["==", "=", "===", "is equal to"],
            correctAnswer: "=",
        },
        { // object --> page 3
            title: "Question 3:",
            description: "What is our teacher's name?",
            possibleAnswers: ["Thomas", "The Tomster", "Tippy Top Tom", "...the train"],
            correctAnswer: "Thomas",
        },
        { // object --> page 4
            title: "Question 4:",
            description: "What is our TA's names?",
            possibleAnswers: ["Jesus and G-sus the rapper", "Bonnie and Clyde", "David and Goliath", "Donny and Clarence"],
            correctAnswer: "Donny and Clarence",
        },
        { // object --> page 4
            title: "Question 5:",
            description: "What language have we not used?",
            possibleAnswers: ["Sandscript", "JavaScript", "HTML", "CSS"],
            correctAnswer: "Sandscript",
        },
    ];


    // Event Listener on Start button
    $("#startBtn").on("click", startTimer);


    $("#startBtn").on("click", function () {
        showPage(0)
    });

    // Event Listener on Highscore page
    $("#clearScoresBtn").on("click", function () {
        window.localStorage.clear();
        location.reload();
    })

    // Event Listener on show the highscores when targeting the "View Scoreboard button"
    $("#scoreBoardPage").on("click", showHighscores)

    $("#alert").hide();


    // Starting timer
    function startTimer() {
        timerInterval = setInterval(function () {
            secondsLeft--;
            $("#timer").text("Timer : " + secondsLeft + " sec");
            if (secondsLeft < 0) {
                clearInterval(timerInterval);
            }
        }, 1000)
    };

    // Stoping timer
    function stopTimer() {
        clearInterval(timerInterval);
    }

    // Clearing main content
    function clearContent(page) {
        $(page).html("");
    };




    // Display the question page
    function showPage(page) {
        clearContent("main");
        // Calling the page to load
        if (page < quiz.length) {
            var quizObject = quiz[page];
            // Creating elements for question
            $("#questionContainer").prepend(`<h1 id="questionNumber">${quizObject.title}</h1>
                <p id="questionText" class="">${quizObject.description}</p>
                <ul id="questionList">
                    <li><button id="a1" type="button" class="btn btn-primary w-25">${quizObject.possibleAnswers[0]}</button></li>
                    <li><button id="a2" type="button" class="btn btn-primary w-25">${quizObject.possibleAnswers[1]}</button></li>
                    <li><button id="a3" type="button" class="btn btn-primary w-25">${quizObject.possibleAnswers[2]}</button></li>
                    <li><button id="a4" type="button" class="btn btn-primary w-25">${quizObject.possibleAnswers[3]}</button></li>
                </ul>
                `);
            // Event listeners on 
            $("li").on("click", function () {
                // verifyAnswer()
                var answer = $(this).text();
                if (answer === quizObject.correctAnswer) {
                    showAlert("Correct", "success");
                } else {
                    showAlert("Wrong -10 Seconds", "danger")
                    secondsLeft -= 10;
                }

                clearContent("#questionContainer")
                // alertUser()
                showPage(page + 1);
            })
        } else {
            stopTimer();
            endQuiz();
        }


    };

    function showAlert(str, type) {
        $("#alert").show();

        $("#alert").attr("class", `alert alert-${type}`);
        $("#alert").text(str);
        window.setTimeout(function () {
            $("#alert").hide();
        }, 2000)

    }

    function endQuiz() {

        $("#questionContainer").prepend(`        
            <form>
                <div class="form-group m-2">
                    <input id="textInput" class="form-control mb-2" type="text" placeholder="Input your name" />
                    <div class="text-right">
                        <button id="btnSubmit" class="btn btn-primary" type="submit" value="Submit">Submit</button>
                    </div>
        
                </div>
            </form >
                `);
        // Event Listener on Submit btn to store user score
        $("#btnSubmit").on("click", function (e) {
            e.preventDefault();
            // Conditionnal to set the score to zero if the score is actually lower than zero
            if (secondsLeft < 0) {
                secondsLeft = 0;
            }
            // Conditionnal to verify if the input is blank
            if ($("#textInput").val() === "") {
                showAlert("No input found, please input name", "danger");
            }


            // Set the user score
            else {
                var score = {
                    "name": $("#textInput").val(),
                    "score": secondsLeft,
                    "difficulty": "",
                    "date": d,
                };

                saveScore(score);
                location.href = "./results.html";
            }
        })
    };

    // Storing user score in local storage
    function saveScore(name) {
        var localScores = JSON.parse(window.localStorage.getItem("scores")) || [];

        localScores.push(name);

        localStorage.setItem("scores", JSON.stringify(localScores));
    };

    // Show highscore function, using the sorted array of score and limiting to 10 displayed score
    function showHighscores() {
        var scores = JSON.parse(window.localStorage.getItem("scores"));
        scores = sortScores(scores)
        console.log(scores)

        for (i = 0; i < 10; i++) {
            var currentScore = scores[i];

            if (!currentScore) {
                continue;
            }
            $("main").append(`        
            <div class="row">
            <div class="card mb-3 text-center col-12" style="width: 18rem;">
                <div class="card-body">
                    <h5 class="card-title">${currentScore.name}</h5>
                    <h8 class="card-subtitle mb-2 text-muted">${currentScore.date}</h8>
                    <h1 class="card-text">${currentScore.score}</h1>
                    <a class="card-link">${currentScore.difficulty}</a>
                </div>
            </div>
        </div>
                    `);
        }

    }
    // Sort score to get the highest ones on top
    function sortScores(scores) {
        if (!scores) {
            return [];
        }
        return scores.sort(function (a, b) {
            return b.score - a.score;
        });
    }

});