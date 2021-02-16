DROP DATABASE IF EXISTS ngarcade;
CREATE DATABASE ngarcade;

USE ngarcade;

DROP TABLE IF EXISTS users;
CREATE TABLE users (
	id INT NOT NULL AUTO_INCREMENT,
    username VARCHAR (50) NOT NULL,
    email VARCHAR (255) NOT NULL,
    password VARCHAR (512) NOT NULL,
    -- Level 1 - USER, level 2 - MOD.
    level TINYINT NOT NULL,
    
    PRIMARY KEY (id)
);

DROP TABLE IF EXISTS gameAuthors;
CREATE TABLE gameAuthors (
	id INT NOT NULL AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    
    PRIMARY KEY (id)
);

DROP TABLE IF EXISTS games;
CREATE TABLE games (
	id INT NOT NULL AUTO_INCREMENT,
    name VARCHAR (255) NOT NULL,
    link VARCHAR(512) NOT NULL,
    sourceLink VARCHAR(512) NOT NULL,
    imagePath VARCHAR(512) NOT NULL,
    description TEXT NOT NULL,
    gameAuthorId INT NOT NULL,
    
    PRIMARY KEY (id),
    FOREIGN KEY (gameAuthorId) REFERENCES gameAuthors (id)
);

DROP TABLE IF EXISTS comments;
CREATE TABLE comments (
	id INT NOT NULL AUTO_INCREMENT,
    comment TEXT NOT NULL,
    timestamp DATETIME NOT NULL,
    userId INT NOT NULL,
    gameId INT NOT NULL,
    
    PRIMARY KEY (id),
    FOREIGN KEY (userId) REFERENCES users (id),
    FOREIGN KEY (gameId) REFERENCES games (id)
);

DROP TABLE IF EXISTS gamesUsers;
-- Keeps track of which users play what games.
CREATE TABLE gamesUsers (
	id INT AUTO_INCREMENT NOT NULL,
	userId INT NOT NULL,
    gameId INT NOT NULL,
    timestamp DATETIME NOT NULL,
    
    PRIMARY KEY (id, userId, gameId)
);

-- UNOS PODATAKA:

INSERT INTO users (id, username, email, password, level) 
	VALUES (1,'mirko80','mirko@gmail.com','ee82001a6fe74c6a9981e14bcb4891141996b81050d43fbf0ea16ed7a4cb78edd0f66c692619a5fcb460130a8b566d89d8d140d6a215a81aaf327b8b5742c9bc',1),
		(2,'ivica','ivica@gmail.com','9108e1f391b9a9b0cd3ac9c4034aff2c67d14755741308355005dbb6515c6dc87dc9737fe5a832b15dae04c8d91d0b65746c5183407d1e96b12f21f1506595ea',2);
        
INSERT INTO gameauthors (id, name) 
	VALUES (4, 'gabrielecirulli'),
		(5, 'BKcore'),
        (7, 'mimshwright'),
        (8, 'iamkun'),
        (9, 'mgechev'),
        (10, 'wwwtyro'),
        (11, 'ellisonleao'),
        (12, 'lengstrom'),
        (13, 'jakesgordon'),
        (14, 'thomaspark');
        
INSERT INTO games (id, name, link, sourceLink, imagePath, description, gameAuthorId) 
	VALUES (4,'2048','https://play2048.co/','https://github.com/gabrielecirulli/2048','./public/uploads/1613310768580.jpeg','2048 is a clone of popular Play Store game 1024. Its source code is written in HTML5, CSS3, and JavaScript. If you are familiar with these languages then I would suggest you to contribute in this stunning game and display your skills to the whole world. This game is licensed under the well-known MIT License.',4),
		(5,'HexGL','http://hexgl.bkcore.com/play/','https://github.com/BKcore/HexGL','./public/uploads/1613310894813.jpeg','HexGL stands out from the rest of open source HTML5 and JavaScript games when it comes to the cutting edge graphics for the game design. This futuristic racing game has an unbelievable user interface that makes it look like we are playing an offline video game on a desktop computer.\r\n\r\nIt uses HTML5 and JavaScript for rendering the game environment. This open-source project is developed and maintained by Thibaut Despoulain with the help of some contributors.',5),
        (6,'Mimstris','https://mimstris.surge.sh/','https://github.com/mimshwright/mimstris','./public/uploads/1613310952012.jpeg','Mimstris is a cool online puzzle game that you will definitely enjoy playing in your free time. In this game you have to quickly arrange the falling blocks of different shapes to fill the horizontal line similar to the video game Tetris. It is created using HTML5 and some JavaScript frameworks such as React and Redux. I bet you will fall in love with this game.',7),
        (7,'Tower','http://fe.bmqb.com/tower_game/index.html','https://github.com/iamkun/tower_game','./public/uploads/1613311080117.jpeg','Tower Building Game makes you feel joyful. Yes, that’s true because the game is designed in such a way that we want to play it again and again.\r\n\r\nIt is similar to the award-winning Tower Bloxx Deluxe game where your task is to drop the blocks on top of each other and make your way towards the skies.\r\n\r\nIts structure is created using the new canvas element of HTML5 language while the logic is written in ES6 (an outstanding update to the JavaScript language).',8),
        (8,'MK','https://mk.mgechev.com/','https://github.com/mgechev/mk.js','./public/uploads/1613311148195.jpeg','MK.js resembles in concept with one of the most popular video game series Tekken. The fighting game comes in three types “Basic”, “Multiplayer” and “Network”.\r\n\r\nIts basic structure is created in HTML5, styling is done using CSS3 while the game logic is written in JavaScript. If you are a great fan of fighting games then you will love to read its code and I hope you will be able to write something better in the future.',9),
        (9,'Astray','https://wwwtyro.github.io/Astray/','https://github.com/wwwtyro/Astray','./public/uploads/1613311244597.jpeg','Astray is no doubt an amazing example of the best open-source HTML5 and JavaScript games. This game really stands out from the rest of the crowd as it showcases the ability of what WebGL can do in a web browser.\r\n\r\nIt uses the Three.js and Box2dWeb libraries to create an advanced 3D user interface. The developer does not believe in the licenses and allows you to use it however you like.',10),
        (10,'Clumsy Bird','https://ellisonleao.github.io/clumsy-bird/','https://github.com/ellisonleao/clumsy-bird','./public/uploads/1613311398102.jpeg','Clumsy Bird is a clone of the “Flappy Bird” game and it makes use of the open source and lightweight HTML5 game engine MelonJS. The game works by you controlling a flying character and the mission is to successfully pass it from in-between the incoming walls without hitting them.',11),(11,'Hextris','https://hextris.io/','https://github.com/Hextris/hextris','./public/uploads/1613311542774.jpeg','Hextris is an awesome puzzle game that is according to its developer inspired by the famous game Tetris. The game steadily increases its pace as it progresses which makes it very addictive. It makes use of the HTML5 canvas to render the game with the help of JavaScript and style it using CSS3.',12),
        (12,'Racer','https://codeincomplete.com/games/racer/','https://github.com/jakesgordon/javascript-racer/','./public/uploads/1613311650772.jpeg','Javascript Pseudo 3D Racer is similar in concept to the OutRun video game. As the name suggests it is developed using HTML5 and JavaScript. The game evolves incrementally in 4 versions and you can even check its step by step progress through the Github repository.\r\n\r\nAccording to its developer the game is more suitable for modern web browsers. He also stated that the source code is not structured well as the game is only meant to demonstrate the basics of pseudo-3d racing game.',13),
        (13,'Flexbox Froggy','https://flexboxfroggy.com/','https://github.com/thomaspark/flexboxfroggy','./public/uploads/1613311792037.jpeg','Flexbox Froggy is the game developed. This game allows you to enter CSS styles in order to move the frog and reach the bottom where the pond is situated. The game is developed simply using HTML5, JavaScript, CSS styles, and some images.',14);

INSERT INTO comments(id, comment, timestamp, userId, gameId) 
	VALUES (4,'Igra je vrlo zanimljiva.','2021-02-14 17:18:30',2,4),
		(6,'Ova igra je stvarno super!','2021-02-14 17:34:22',2,4),
        (7,'Jako dobra igra :)','2021-02-14 18:58:47',1,4),
        (8,'Ova igra je jako zanimljiva!','2021-02-14 18:58:27',1,5),
        (9,'10/10','2021-02-14 22:28:00',2,4),
        (10,'Odlično!','2021-02-14 22:28:29',2,9),
        (11,'Pre teško...','2021-02-14 22:28:43',2,11),
        (12,'Nije uopće teško!','2021-02-14 22:32:56',1,11);
        
INSERT INTO gamesusers(id, userId, gameId, timestamp) 
	VALUES (1,1,4,'2021-02-14 21:49:41'),
		(2,1,4,'2021-02-14 21:49:44'),
        (3,1,5,'2021-02-14 21:49:51'),
        (4,2,10,'2021-02-14 21:50:01'),
        (5,2,7,'2021-02-14 21:50:05'),
        (6,2,8,'2021-02-14 21:50:08'),
        (7,1,13,'2021-02-14 22:33:44'),
        (8,1,9,'2021-02-14 22:34:06');
