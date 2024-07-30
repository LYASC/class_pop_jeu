// Sélection des éléments HTML du jeu
var boardElement = document.querySelector("#board"); // Conteneur pour les éléments du jeu
var scoreElement = document.getElementById("score"); // Élément affichant le score
var liveElement = document.getElementById("lives"); // Élément affichant les vies restantes
var timerElement = document.getElementById("timer"); // Élément affichant le temps restant

// Variables pour suivre l'état du jeu
var i = 0; // Compteur pour les identifiants des têtes
var score = 0; // Score du joueur
var lives = 3; // Nombre de vies restantes
var timerDuration = 90; // Durée du jeu en secondes
var creationInterval = 2000; // Intervalle de temps en millisecondes entre la création des têtes
var frequencyIncreaseInterval = 10000; // Intervalle de temps en millisecondes pour augmenter la fréquence de création des têtes
var scoreThreshold = 5; // Seuil de score pour augmenter la fréquence de création des têtes
var currentThreshold = 0; // Seuil actuel pour augmenter la difficulté
var isGameRunning = true; // Indique si le jeu est en cours
var gameTimer; // Timer du jeu
var createTeteInterval; // Intervalle pour la création des têtes

// Fonction pour obtenir un entier aléatoire entre 0 et max (exclus)
function getRandomInt(max) {
    return Math.floor(Math.random() * max); // Renvoie un entier aléatoire entre 0 et max - 1
}

// Fonction pour créer une nouvelle tête et l'ajouter au plateau
function createTete() {
    if (!isGameRunning || !boardElement) return; // Si le jeu est terminé ou l'élément board n'existe pas, ne rien faire

    var teteElement = document.createElement("img"); // Crée un nouvel élément image
    var isBonus = Math.random() < 0.1; // 10% de chance de créer une tête bonus
    var isMalus = Math.random() < 0.1; // 10% de chance de créer une tête malus

    // Définir la source et la classe de l'image en fonction du type de tête
    if (isBonus) {
        teteElement.src = "../happy/autre/bonus.png"; // Source pour les têtes bonus
        teteElement.classList.add("tete-bonus");
    } else if (isMalus) {
        teteElement.src = "../happy/autre/malus.png"; // Source pour les têtes malus
        teteElement.classList.add("tete-malus");
    } else {
        teteElement.src = "../happy/" + getRandomInt(11) + ".png"; // Source pour les têtes normales
        teteElement.classList.add("tete");
    }

    teteElement.id = i; // Assigne un identifiant unique à la tête
    teteElement.setAttribute("onclick", `clickOnTete(${i}, ${isBonus}, ${isMalus})`); // Définit la fonction à appeler au clic
    i++; // Incrémente le compteur d'identifiant

    // Positionner la tête en bas de l'écran
    teteElement.style.left = (getRandomInt(1032) + 8) + "px"; // Position horizontale aléatoire
    teteElement.style.bottom = "0px"; // Positionner au bas de l'écran

    // Appliquer une animation de montée
    var timeRand = getRandomInt(4) + 3; // Durée de l'animation entre 3 et 7 secondes
    teteElement.style.animation = `tete-qui-monte ${timeRand}s linear`; // Applique l'animation de montée

    boardElement.appendChild(teteElement); // Ajoute la tête au conteneur du jeu

    // Supprimer la tête après un certain temps
    var time = setTimeout(() => {
        if (isGameRunning) { // Si le jeu est encore en cours
            if (!teteElement.classList.contains("tete-malus")) { // Ne pas retirer de vie si c'est une tête malus
                boardElement.removeChild(teteElement); // Supprime la tête du conteneur
                lives--; // Réduit le nombre de vies
                if (liveElement) {
                    liveElement.textContent = "🤍".repeat(lives); // Met à jour l'affichage des vies
                }
                if (lives <= 0) {
                    endGame(false); // Fin du jeu en cas de perte de toutes les vies
                }
            } else {
                boardElement.removeChild(teteElement); // Supprime la tête malus
            }
        }
    }, timeRand * 1000); // La tête est supprimée après la durée de l'animation
}

// Fonction pour gérer le clic sur une tête
function clickOnTete(index, isBonus, isMalus) {
    var tete = document.getElementById(index); // Récupère la tête cliquée par son identifiant
    if (tete) {
        if (isBonus) {
            // Traitement pour les têtes bonus
            score += 5; // Ajoute des points pour une tête bonus
            if (scoreElement) {
                scoreElement.textContent = score; // Met à jour l'affichage du score
            }
            tete.src = "../sad/autre/bonus.png"; // Change l'image en version triste de la tête bonus
        } else if (isMalus) {
            // Traitement pour les têtes malus
            score -= 3; // Retire des points pour une tête malus
            if (scoreElement) {
                scoreElement.textContent = score; // Met à jour l'affichage du score
            }
            tete.src = "../sad/autre/malus.png"; // Change l'image en version triste de la tête malus
        } else {
            if (tete.src.includes("happy")) {
                tete.src = tete.src.replace("happy", "sad"); // Change l'image en version triste pour une tête normale
                score++; // Ajoute un point pour une tête normale
                if (scoreElement) {
                    scoreElement.textContent = score; // Met à jour l'affichage du score
                }
                updateDifficulty(); // Met à jour la difficulté en fonction du score
            }
        }
        var tmp = tete.getBoundingClientRect().top; // Récupère la position verticale actuelle de la tête
        tete.style.animation = "none"; // Retire l'animation en cours
        tete.style.top = tmp + "px"; // Conserve la position verticale
        tete.style.animation = "tete-qui-floute 1s linear"; // Applique une animation de floutage
        setTimeout(function () {
            tete.remove(); // Supprime la tête après l'animation
        }, 1000); // Délai avant la suppression
    }
}

// Fonction pour mettre à jour le chronomètre
function updateTimer() {
    if (timerDuration <= 0) {
        endGame(true); // Fin du jeu si le temps est écoulé
        return;
    }
    timerDuration--; // Réduit la durée du chronomètre de 1 seconde
    if (timerElement) {
        timerElement.textContent = timerDuration; // Met à jour l'affichage du temps restant
    }
}

// Fonction pour terminer le jeu
function endGame(isTimeUp) {
    isGameRunning = false; // Marque le jeu comme terminé
    clearInterval(gameTimer); // Arrête le chronomètre du jeu

    if (isTimeUp) {
        alert("Le temps est écoulé ! Votre score final est " + score); // Alerte de fin du jeu en cas de temps écoulé
    } else {
        alert("Vous avez perdu toutes vos vies ! Votre score final est " + score); // Alerte de fin du jeu en cas de perte de vies
    }

    window.location = "../page/over.html"; // Redirection vers la page de fin de jeu
}

// Fonction pour augmenter la fréquence de création des têtes
function increaseFrequency() {
    if (creationInterval > 500) { // Assure que l'intervalle de création n'est pas inférieur à 500 ms
        creationInterval -= 250; // Réduit l'intervalle de création des têtes
        // Met à jour l'intervalle de création des têtes
        clearInterval(createTeteInterval); // Arrête l'ancien intervalle de création
        createTeteInterval = setInterval(createTete, creationInterval); // Définit le nouvel intervalle de création
    }
}

// Fonction pour configurer la difficulté
function setupDifficulty() {
    // Augmente la fréquence des têtes toutes les 10 secondes
    setInterval(increaseFrequency, frequencyIncreaseInterval);
}

// Fonction pour mettre à jour la difficulté en fonction du score
function updateDifficulty() {
    if (score >= currentThreshold + scoreThreshold) {
        increaseFrequency(); // Augmente la fréquence des têtes si le score atteint le seuil
        currentThreshold = score; // Met à jour le seuil actuel
    }
}

// Fonction pour initialiser les contrôles audio
function setupAudioControls() {
    const audioElement = document.getElementById('background-audio'); // Élément audio
    const playButton = document.getElementById('play-button'); // Bouton pour jouer le son
    const pauseButton = document.getElementById('pause-button'); // Bouton pour mettre le son en pause

    if (audioElement) {
        // Assurer que le fichier audio est chargé
        audioElement.addEventListener('canplay', () => {
            console.log('Le fichier audio est chargé et prêt à jouer.'); // Log lorsque le fichier audio est prêt
        });

        // Fonction pour jouer le son
        function playAudio() {
            audioElement.play().catch(e => {
                console.log('Erreur lors de la lecture du son :', e); // Log en cas d'erreur de lecture
            });
        }

        // Fonction pour mettre le son en pause
        function pauseAudio() {
            audioElement.pause();
        }

        // Ajouter des écouteurs d'événements pour les boutons
        if (playButton) {
            playButton.addEventListener('click', playAudio); // Joue le son au clic sur le bouton de lecture
        }
        if (pauseButton) {
            pauseButton.addEventListener('click', pauseAudio); // Met le son en pause au clic sur le bouton de pause
        }

        // Lire le son dès que la page est chargée
        playAudio(); // Démarre la lecture du son dès le chargement de la page
    }
}

// Vérifier si les éléments du jeu sont présents avant de démarrer
document.addEventListener("DOMContentLoaded", function () {
    if (boardElement) {
        // Démarrer le chronomètre
        gameTimer = setInterval(updateTimer, 1000); // Met à jour le chronomètre toutes les secondes

        // Mettre en place l'augmentation de la difficulté
        setupDifficulty();

        // Créer des têtes à un intervalle qui peut changer
        createTeteInterval = setInterval(createTete, creationInterval); // Crée des têtes à l'intervalle défini
    }

    // Initialiser les contrôles audio si les éléments audio sont présents
    setupAudioControls();
});
