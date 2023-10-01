]Name: Yirmi Assefa
Id: 208552950

in this memory game, I create a grid of cards (4x5) with 10 characters and for each character there are two cards. When a new game starts we make Ajax call which returns a response in a json structure to receive data for requested characters and then the selection for the characters is made randomly. 
In this game, at the end of each round, information is received for how long the game lasts by Ajax call to receive the staring and ending time of the game and calculate it.
In this code there are two Ajax calls for getting the staring and ending time of the game and in addition Ajax call for getting the data of the characters.

Answer to the question 4: 
When Ajax calling is executed to receive the time, the call is made by the client by creating an XHR object, to the attached script, the client requests the current time and receives it from the script, then the client displays the start time of the game and the duration of the game using it.
When Ajax calling is executed to receive information for the characters, the call is made by the client by creating an XHR object to the server, the client requests all the information about the characters that exist on the page and the server returns an answer in a json structure, after that the client chooses randomly characters and chooses the specific information he wants about those characters.

The full route for the page: http://yirmiyahuas.mysoft.jce.ac.il/ex1/memoryGame.html