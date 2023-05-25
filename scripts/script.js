//Version 1 des Snake Spiels, aktuell noch die Grundversion ohne Zusatzfunktionen.
'use strict';
// Zugriff auf das Canvas-Element im HTML-Dokument
const canvas = document.getElementById('gameCanvas');
// Definition des Rendering-Kontexts, "2d" gibt Zugang zu den 2D-Zeichenmethoden
const context = canvas.getContext('2d');

// Definition der Größe eines Canvas-Feldes 
const box = 30;

let canvasSize;
// Abhängig von der Breite des Fensters wird die Größe des Spielfelds angepasst
if(window.innerWidth <= 600) {
    canvasSize = 15;
} else if(window.innerWidth <= 1200) {
    canvasSize = 20;
} else {
    canvasSize = 30;
}

// Setzen der Höhe und Breite des Canvas
canvas.width = box * canvasSize;
canvas.height = box * canvasSize;

// Initialisieren des Spielstandes
let score = 0;

// Initialisieren der Schlange als Array, Startposition in der Mitte des Canvas
let snake = [];
snake[0] = { x: canvasSize / 2 * box, y: canvasSize / 2 * box };

// Zufällige Initialisierung der Position des Essens
let food = {
    x: Math.floor(Math.random() * canvasSize) * box,
    y: Math.floor(Math.random() * canvasSize) * box
};

// Variable zur Speicherung der aktuellen Bewegungsrichtung der Schlange
let d;

// Event-Listener für die Tastaturtasten, um die Bewegungsrichtung der Schlange zu ändern
document.addEventListener('keydown', direction);

function direction(event) {
    // Ändert die Bewegungsrichtung basierend auf dem Tastendruck, verhindert jedoch die Bewegung in die entgegengesetzte Richtung
    if(event.keyCode == 37 && d != 'RIGHT') {
        d = 'LEFT';
    } else if(event.keyCode == 38 && d != 'DOWN') {
        d = 'UP';
    } else if(event.keyCode == 39 && d != 'LEFT') {
        d = 'RIGHT';
    } else if(event.keyCode == 40 && d != 'UP') {
        d = 'DOWN';
    }
}

// Hauptzeichnungsfunktion, wird ständig wiederholt, um das Spiel zu aktualisieren
function draw() {
    // Löschen des gesamten Canvas vor jedem Zeichnen
    context.clearRect(0, 0, canvas.width, canvas.height);
    
    // Zeichnen der Schlange
    for(let i = 0; i < snake.length; i++) {
        context.fillStyle = (i === 0) ? '#F0DB4F' : '#F4E04D';
        context.fillRect(snake[i].x, snake[i].y, box, box);

        context.strokeStyle = '#B5DE48';
        context.strokeRect(snake[i].x, snake[i].y, box, box);
    }

    // Zeichnen des Essens
    context.fillStyle = '#E74C3C';
    context.fillRect(food.x, food.y, box, box);

    // Bewegung der Schlange in die aktuelle Richtung
    let snakeX = snake[0].x;
    let snakeY = snake[0].y;

    if(d === 'LEFT') snakeX -= box;
    if(d === 'UP') snakeY -= box;
    if(d === 'RIGHT') snakeX += box;
    if(d === 'DOWN') snakeY += box;

    // Wenn die Schlange das Essen erreicht hat, wird die Schlange nicht verkleinert und das Essen neu positioniert
    if(snakeX === food.x && snakeY === food.y) {
        score++;
        food = {
            x: Math.floor(Math.random() * canvasSize) * box,
            y: Math.floor(Math.random() * canvasSize) * box
        };
    } else {
        // Wenn das Essen nicht erreicht wurde, wird das letzte Element der Schlange entfernt
        snake.pop();
    }

    // Erstellen eines neuen Kopfes für die Schlange
    const newHead = { x: snakeX, y: snakeY };
    // Wenn der Kopf der Schlange außerhalb des Canvas liegt oder sich selbst trifft, wird das Spiel beendet
    if(snakeX < 0 || snakeY < 0 || snakeX > (canvasSize - 1) * box || snakeY > (canvasSize - 1) * box || collision(newHead, snake)) {
        clearInterval(game);
    }

    // Fügen des neuen Kopfes an den Anfang der Schlange ein
    snake.unshift(newHead);

    // Anzeigen des aktuellen Punktestands
    context.fillStyle = '#F0DB4F';
    context.font = '20px Arial';
    context.fillText('Score: ' + score, 2 * box, 1.6 * box);
}

// Funktion zur Überprüfung einer Kollision zwischen dem Kopf der Schlange und dem Rest der Schlange
function collision(head, array) {
    for(let i = 0; i < array.length; i++) {
        if(head.x === array[i].x && head.y === array[i].y) {
            return true;
        }
    }
    return false;
}
        
// Setzen eines Intervals, um die Zeichenfunktion alle 150 ms aufzurufen
let game = setInterval(draw, 150);
// JavaScript-Teil

// Referenzen zu den Buttons
const upButton = document.getElementById('up');
const downButton = document.getElementById('down');
const leftButton = document.getElementById('left');
const rightButton = document.getElementById('right');
const pauseButton = document.getElementById('pause');

// EventListener für die Buttons
upButton.addEventListener('click', () => {
  if(d !== 'DOWN') {
    d = 'UP';
  }
});
downButton.addEventListener('click', () => {
  if(d !== 'UP') {
    d = 'DOWN';
  }
});
leftButton.addEventListener('click', () => {
  if(d !== 'RIGHT') {
    d = 'LEFT';
  }
});
rightButton.addEventListener('click', () => {
  if(d !== 'LEFT') {
    d = 'RIGHT';
  }
});

let gamePaused = false;
pauseButton.addEventListener('click', () => {
  gamePaused = !gamePaused;
  if(gamePaused) {
    clearInterval(game);
  } else {
    game = setInterval(draw, 150);
  }
});
