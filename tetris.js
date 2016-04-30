var COLS = 10, ROWS = 20;
var board = [];  // the board keep in memory the shapes that are posizioned on the canvas
var lose;
var interval;
var current; // current moving shape. (forma in movimento corrente)
var currentX, currentY; // position of current shape

var shapes = [
    [ 1, 1, 1, 1 ],
    [ 1, 1, 1, 0,
      1 ],
    [ 1, 1, 1, 0,
      0, 0, 1 ],
    [ 1, 1, 0, 0,
      1, 1 ],
    [ 1, 1, 0, 0,
      0, 1, 1 ],
    [ 0, 1, 1, 0,
      1, 1 ],
    [ 0, 1, 0, 0,
      1, 1, 1 ]
];
var colors = [
    'blue', 'red', 'blue', 'red', 'blue', 'red', 'blue'
];

// creates a new 4x4 shape in global variable 'current'
// 4x4 so as to cover the size when the shape is rotated

function newShape() { // mette nella matrice current i valori nelle giuste posizioni in base al tipo di shape (id+1).
    
    //the function math floor Round a number downward to its nearest integer
    var id = Math.floor( Math.random() * shapes.length ); //seleziona un numero a caso da 0 a 7
    var shape = shapes[ id ]; //seleziono la forma tramite il numero generato a caso
    // maintain id for color filling (dato che i colori sono 7 come le forme, per il colore uso ancora l'id)

    current = []; //riinizializzo a vuota la variabile relativa al shape corrente
    for ( var y = 0; y < 4; ++y ) { 
        current[ y ] = [];
        for ( var x = 0; x < 4; ++x ) {
            var i = 4 * y + x;
            if ( typeof shape[ i ] != 'undefined' && shape[ i ] ) { // fa il controllo su shape, non su shapes!!! a shape è già stato assegnato il tipo di blocco
                current[ y ][ x ] = 1 + 1; // i valori delle y  e delle x in javascript sono così come vengono usati, i valori delle y è come se venissero concatenati uno dopo l'altro in colonna, quindi io fisso la colonna e poi faccio scorrere i valori della singola colonna tramite la x
            }
            else {
                current[ y ][ x ] = 0; // quando nella posizione dello shape non è stato definito un valore, oppure il valore nello shape è 0 (controllato tramite shape[i] che se è 0 ritorna false)
            }
        }
    }
    // position where the shape will evolve
    currentX = 5;  //posizione dello shape sull'asse x
    currentY = 0;   //posizione delllo shape sull'asse y
}

// clears the board
function init() { //reinizializza la variabile (matrice board) tutta a 0.
    for ( var y = 0; y < ROWS; ++y ) {
        board[ y ] = [];
        for ( var x = 0; x < COLS; ++x ) {
            board[ y ][ x ] = 0;
        }
    }
}

// keep the element moving down, creating new shapes and clearing lines
function tick() {  //questa funzione muove gli elementi, controlla se stanno andando in posizioni valide, in caso li posiziona, e se si ha perso reinizializza il nuovo gioco
    if ( valid( 0, 1 ) ) {
        ++currentY;
    }
    // if the element settled
    else {
        freeze();
        clearLines();
        if (lose) {
            newGame();
            return false;
        }
        newShape();
    }
}

// stop shape at its position and fix it to board
function freeze() {
    for ( var y = 0; y < 4; ++y ) {
        for ( var x = 0; x < 4; ++x ) {
            if ( current[ y ][ x ] ) {
                board[ y + currentY ][ x + currentX ] = 1; //fissa su board(nella posizione esatta) i valori del blocco che deve essere fissato(solo se è preseente in quella determinata posizione)
                //per modificarlo se ho capito bene mi basta fissare su board il valore del colore che voglio
            }
        }
    }
}

// returns rotates the rotated shape 'current' perpendicularly anticlockwise
function rotate( current ) {
    var newCurrent = [];
    for ( var y = 0; y < 4; ++y ) {
        newCurrent[ y ] = [];
        for ( var x = 0; x < 4; ++x ) {
            newCurrent[ y ][ x ] = current[ 3 - x ][ y ];
        }
    }

    return newCurrent;
}

// check if any lines are filled and clear them
function clearLines() {
    for ( var y = ROWS - 1; y >= 0; --y ) { //controllo dal basso verso l'alto
        var rowFilled = true;
        for ( var x = 0; x < COLS; ++x ) {
            if ( board[ y ][ x ] == 0 ) {
                rowFilled = false;
                break; // the row is not full so i jump out the loop
            }
        }
        if ( rowFilled ) { //non cancello la linea prima, semplice mente sposto gli elementi sopra memorizzati su boaard di una linea sotto
            for ( var yy = y; yy > 0; --yy ) {
                for ( var x = 0; x < COLS; ++x ) {
                    board[ yy ][ x ] = board[ yy - 1 ][ x ];
                }
            }
            ++y;
        }
    }
}

function keyPress( key ) { //alla pressione dei tasti, se l'operazione è consentita aggiorna la posizione corrente dello shape
    switch ( key ) {
        case 'left':
            if ( valid( -1 ) ) {
                --currentX; //  
            }
            break;
        case 'right':
            if ( valid( 1 ) ) {
                ++currentX;
            }
            break;
        case 'down':
            if ( valid( 0, 1 ) ) {
                ++currentY;
            }
            break;
        case 'rotate':
            var rotated = rotate( current );  //semplicemente ruota il blocco nella mia matrice 4x4 e non mi causa problemi di altro tipo
            if ( valid( 0, 0, rotated ) ) { //se il blocco ruotato è ancora valido allora lo lo assegno al blocco corrente
                current = rotated;
            }
            break;
    }
}

// checks if the resulting position of current shape will be feasible
function valid( offsetX, offsetY, newCurrent ) {
    offsetX = offsetX || 0;
    offsetY = offsetY || 0; //assegna i vaòori in caso siano stati passati, altrimenti assegna di default 0
    offsetX = currentX + offsetX;
    offsetY = currentY + offsetY;
    newCurrent = newCurrent || current;



    for ( var y = 0; y < 4; ++y ) {
        for ( var x = 0; x < 4; ++x ) {
            if ( newCurrent[ y ][ x ] ) {
                if ( typeof board[ y + offsetY ] == 'undefined' //se la posizione sul quale dovrà andare lo shape nella board è undefined
                  || typeof board[ y + offsetY ][ x + offsetX ] == 'undefined'
                  || board[ y + offsetY ][ x + offsetX ] // se la posizione in cui dovrà andare lo shape nella board è occupata
                  || x + offsetX < 0      // se lo shape è già tutto spostato a sinistra
                  || y + offsetY >= ROWS  //se è già tuttto spostato a destra
                  || x + offsetX >= COLS ) {  //se è arrivato in fondo
                    if (offsetY == 1) lose = true; // lose if the current shape at the top row when checked(c'è per forza un problema)
                    // il comando per loose è baggato, se ad esempio faccio partire il blocco tutto a lato e uso la freccia quando è a offsety=1 allora entra nell'if e mi fa pwerdere anche se magari non ho altri blocchi posizionati sul tetris
                    return false;
                }
            }
        }
    }
    return true;  // se è andato tutto ok allora restituisce true
}

function newGame() { // reinizializza ogni volta un nuovo gioco e chiama le funzioni
    clearInterval(interval);
    init(); //riinizializza la board tutta a 0.
    newShape(); //crea nuovi shape
    lose = false;  //resetta la variabile della perdita a 0
    interval = setInterval( tick, 250 );  //sttta il periodo di tempo in cuoie eseguire le funziioni
}

newGame();
