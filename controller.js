document.body.onkeydown = function( e ) { //document.body.onkeydown si attiva quando cheiaccio uun tasto sulla keyboard e si attiva la funzione che controlla se il tasto schiacciato corrisponde a uno di quelli previsti e fa partire l'azione sul gioco
    //la variabile all'interno di function è quella che ha fatto attivare il tutto e potevo chiamarla anche event
    var keys = {
        37: 'left',
        39: 'right',
        40: 'down',
        38: 'rotate' //associo ad ogni tasto da tastiera il suo valore nel gioco
    };
    if ( typeof keys[ e.keyCode ] != 'undefined' ) {
        keyPress( keys[ e.keyCode ] ); //funzione in tetris.js che attiva il comando desiderato e vede se si può effettuare la transizione
        render(); //riattivo anche rendere per aggiornare il tutto e non avere ritardi quando faccio cambiamenti nel gioco
    }
};
