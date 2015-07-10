var path = require('path');

//postgres://user:passwd@host:port/database
//SQLite: sqlite://:@:/
var url = (process.env.DATABASE_URL || 'sqlite://:@:/').match(/(.*)\:\/\/(.*?)\:(.*)@(.*)\:(.*)\/(.*)/);
var DB_name 	= (url[6] || null);
var user 		= (url[2] || null);
var pwd 		= (url[3] || null);
var protocol 	= (url[1] || null);
var dialect 	= (url[1] || null);
var port 		= (url[5] || null);
var host 		= (url[4] || null);
var storage 	= process.env.DATABASE_STORAGE || 'quiz.sqlite';


//Cargar Modelo ORM
var Sequelize = require('sequelize');

//usar BBDD Ssqlite o postgres
var sequelize = new Sequelize (DB_name,user,pwd,
						{	dialect:protocol,
							protocol:protocol,
							port:port,
							host:host,
							storage:storage,
							omitNull: true}
							);


//Importar la definición de la tabla Quiz en quiz.js
var Quiz = sequelize.import(path.join(__dirname,'quiz'));
exports.Quiz=Quiz; //exportar definición de la tabla Quiz

//sequelize.sync() crea e inicializa tabla de preguntas de BBDD
sequelize.sync().success(function(){
	//success ejecuta el manejador una vez ejecutada la tabla
	Quiz.count().success(function(count){
		if(count===0){ //la tabla se inicializza solo si está vacía
			Quiz.create({ pregunta: 'Capital de Italia',
							respuesta: 'Roma'
			});
			Quiz.create({ pregunta: 'Capital de Portugal',
							respuesta: 'Lisboa'
			})
			.then(function(){
				console.log('Base de datos inicializada')
			});
		};
	});
});
