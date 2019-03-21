# Frogg-Jump
#Adrián Camacho Pérez P2 DVI UCM 2019

Mecánicas implementadas:
-Escenario de fondo
-Movimiento de la rana (teclas up,down,right,left)
-Coches (todos los sprites)
-Colisiones
-Troncos (todos los sprites)
-Tortuga 
-Agua
-Animación de muerte (reproduce los 4 frames de los 4 sprites)
-Menú y finalización (start para empezar a jugar, tras ganar o tras haber perdido)
-Generador de coches, troncos y tortugas.

No se han añadido las ampliaciones opcionales, 
aunque cuando ya tenía el juego terminado a falta del Generador (Spawner), 
tras ese commit encontré un "bug" en el que la velocidad de la rana
no se actualiza correctamente a la velocidad del tronco (hasta ese push funciona como debería, con la rana estática sobre el tronco),
esto causa un gracioso efecto "resbaladizo" sobre el tronco que he decidido dejar en la versión final del juego,
aumenta la dificultad para llegar a la meta y hace menos lento el juego, 
necesitando que pulses más teclas para mantenerte sobre un objeto del río.

A su vez, he reducido a la mitad la altura de la Rana, ya que la carretera se le hacía demasiado corta,
haciendo que el recorrido sea el doble de largo para aumentar la dificultad, y haciendo las proporciones de la rana más realistas.


