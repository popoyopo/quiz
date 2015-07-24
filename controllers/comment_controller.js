var models = require('../models/models.js');

//Autoload - factoriza el código si ruta incluye :quizId
exports.load = function (req,res,next,commentId){
	models.Comment.find({
			where:{ id: Number(commentId)}
		}
		).then(
		function(comment){
			if(comment){
				req.comment= comment;
				next();
			} else {
				next( new Error('No existe commentId=' +commentId));
			}
		}
	).catch(function(error){next(error);});
};

// GET /quizes/new
exports.new = function(req,res){ 
	res.render('comments/new.ejs',{quizid:req.params.quizId , errors:[]});
};

// POST /quizes/create
exports.create = function(req,res){ 
	var comment = models.Comment.build( 
					{ texto : req.body.comment.texto,
						QuizId: req.params.quizId

					}
				);

	comment.validate().then(
		function(err){
			if(err){
				console.log('*****************************Error');
				res.render('comments/new.ejs',
						{comment: comment, 
							quizid: req.params.quizId,
							errors: err.errors});
			} else {
				comment // guarda en DB los campos de texto de comment
				.save()
				.then( function(){res.redirect('/quizes/'+req.params.quizId)});
			}	//redirección HTTP (URL relativo) lista de preguntas
		}).catch(function(error){next(error)});
};

// GET /quizes/:quizId/comments/:commentId/publish
exports.publish = function(req,res){ 
	req.comment.publicado = true;
	console.log('*****************************Error '+req.comment.publicado);
	req.comment.save({fields:["publicado"]})
		.then( function(){ res.redirect('/quizes/'+req.params.quizId);})
		.catch(function(error){next(error)});
};