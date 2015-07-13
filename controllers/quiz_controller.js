var models = require('../models/models.js');

//Autoload - factoriza el código si ruta incluye :quizId
exports.load = function (req,res,next,quizId){
	models.Quiz.find(quizId).then(
		function(quiz){
			if(quiz){
				req.quiz= quiz;
				next();
			} else {
				next( new Error('No existe quizId=' +quizId));
			}
		}
	).catch(function(error){next(error);});
};


// GET /quizes/:id
exports.show = function(req,res){
	models.Quiz.find(req.params.quizId).then(
		function(quiz){
			res.render('quizes/show',{quiz: req.quiz});
	})
};

// GET /quizes/:id/answer
exports.answer = function(req,res){
	var resultado='Incorrecto';
	if(req.query.respuesta===req.quiz.respuesta){
		resultado='Correcto';
	}
	res.render('quizes/answer',{quiz:req.quiz,respuesta: resultado});
};

// GET /quizes/author
exports.author = function(req,res){
	res.render('author',{autor:'Francisco Canales'});
};

// GET /quizes
exports.index = function(req,res){
	var busqueda = req.query.search;
	if(!busqueda){
		busqueda='%';
	} else {
		busqueda='%'+busqueda+'%';
		busqueda=busqueda.replace(' ','%');
	}	

	//	models.Quiz.findAll().then(
	models.Quiz.findAll({where: ["pregunta like ?", busqueda],
							order: [["pregunta","ASC"]]}).then(
		function(quizes){
			res.render('quizes/index',{quizes: quizes});
	}).catch(function(error){next(error);});
};

// GET /quizes/new
exports.new = function(req,res){ 
	var quiz = models.Quiz.build( //crea objeto quiz
			{pregunta: "Pregunta", respuesta: "Respuesta"}
		);
	res.render('quizes/new',{quiz:quiz});
};

// POST /quizes/create
exports.create = function(req,res){ 
	var quiz = models.Quiz.build( req.body.quiz );
	// guarda en DB los campos pregunta y respuesta de quiz
	quiz.save({fields: ["pregunta","respuesta"]}).then(function(){
		res.redirect('/quizes');
	})	//redirección HTTP (URL relativo) lista de preguntas
};