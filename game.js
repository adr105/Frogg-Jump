


// Especifica lo que se debe pintar al cargar el juego
var startGame = function() {
  Game.setBoard(0,new Welcome(), true);
  Game.setBoard(1,new TitleScreen("", 
                                  "Press SPACE to start playing",
                                  playGame), true);
}

var playGame = function() {

  var board = new GameBoard();
  //añado campo
  board.add(new PlayerField(), 1);
  Game.setBoard(0, board, true);


  //añado rana y coches
  var fboard = new GameBoard();

  
  fboard.add(new Car('car1', LEFT, 2, 0.5));
  fboard.add(new Car('car2', LEFT, 3, 0.8));
  fboard.add(new Car('car3', RIGHT, 4, 0.5));
  fboard.add(new Trunk('trunk1', RIGHT, 11, 0.6));
  fboard.add(new Trunk('trunk2', RIGHT, 9, 0.7));
  fboard.add(new Trunk('trunk3', LEFT, 7, 0.8));
  fboard.add(new Tortu(10, 0.5));
  fboard.add(new Tortu(8, 0.8));

  //añadir rana después del tronco para que no se oculte
  fboard.add(new Water());
  fboard.add(new Home());
  fboard.add(new Frog());  
  Game.setBoard(1, fboard, true);

}


var winGame = function() {
  Game.setBoard(1,new TitleScreen("You win!", 
                                  "Press Space to play again",
                                  playGame), true);
};



var loseGame = function() {
  Game.setBoard(1, new TitleScreen("You lose!", "Press space bar to play again",playGame), true);
};



// Indica que se llame al método de inicialización una vez
// se haya terminado de cargar la página HTML
// y este después de realizar la inicialización llamará a
// startGame
window.addEventListener("load", function() {
  Game.initialize("game",sprites,startGame);
});
