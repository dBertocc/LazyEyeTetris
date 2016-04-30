var canvas = document.getElementsByTagName( 'canvas' )[ 0 ]; // avendo un solo canvas posso prendere l'elemento usando il noe del tag
var ctx = canvas.getContext( '2d' );
var W = 300, H = 600;  //variabili in cui inserisco la larghezza e l'altezza
var BLOCK_W = W / COLS, BLOCK_H = H / ROWS; // variabili ce contengono la dimensione in pixel del blocco in larghezza e lunghezza(anche se le dimensioni in pizel dei singoloi quadratini dovrebbero essere uguali is il larghezza che in lunghezza)


// draw a single square at (x, y)
function drawBlock( x, y ) {
    ctx.fillRect( BLOCK_W * x, BLOCK_H * y, BLOCK_W - 1 , BLOCK_H - 1 ); //i primi 2 parametri passati sono la posizione di partenza da cui cominciare a disegnare
    ctx.strokeRect( BLOCK_W * x, BLOCK_H * y, BLOCK_W - 1 , BLOCK_H - 1 ); //definisce un  quadrato di linea nera, mentre il comando sopra riempie con un colore
}

// draws the board and the moving shape (disegna i blocchi salvati sulla board, ogni blocco della boarda avrà sovrascritto un valore diverso in base al colore)
function render() {
    ctx.clearRect( 0, 0, W, H );  //pulisce tutto il canvas e poi risovrascrive tutti i valori aggiornati

    ctx.strokeStyle = 'black';  //definisco il colore delle linee del canvas
    for ( var x = 0; x < COLS; ++x ) {
        for ( var y = 0; y < ROWS; ++y ) {
            if ( board[ y ][ x ] ) {  //questa sintassi con le doppie parentesi quadre non è usata per definire una matrice, la uso per selezionare elementi dell'array quqndo ho un array dentro un altro array
                ctx.fillStyle = colors[ board[ y ][ x ] - 1 ]; // colors è una variabile che ho definito in tetris.js contenente tutti i colori. seleziono il colore alla posizione memorizzata nella board(id +1-1)( sta li a sommare +1 ad id perchè se no dopo non può più vedere 0 come elemento vuoto nella board, anche zero sarebbe un valore e un colore)
                drawBlock( x, y ); //disegna il blocco nella posizione giusta
            }
        }
    }

    ctx.fillStyle = 'red'; //non so come mai resetta il colore a rosso, magari da modificare
    ctx.strokeStyle = 'black';
    for ( var y = 0; y < 4; ++y ) { //disegna sul canvas anche tutti gli elementi del current
        for ( var x = 0; x < 4; ++x ) {
            if ( current[ y ][ x ] ) { 
                ctx.fillStyle = colors[ current[ y ][ x ] - 1 ];
                drawBlock( currentX + x, currentY + y );
            }
        }
    }
}

setInterval( render, 30 ); //ogni 30 millisecondi fa partire la funzione render che ridisegna tutto il canvas e aggiorna la parte grafica al variare dei valori dei blocchi in tetris js