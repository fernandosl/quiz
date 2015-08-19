var models = require('../models/models.js');
 
var statistics = {
	numPreguntas: 0,
	numComentarios: 0,
	mediaComentariosPregunta: 0,
	numPreguntasSinComentario: 0,
	numPreguntasConComentario: 0
};
	 
var errors = [];
/*
exports.calculate = function (req, res, next) {

  models.Quiz.count()
  .then(function (numQuizes) { // número de preguntas
    statistics.quizes = numQuizes;
    return models.Comment.count();
  })
  .then(function (numComments) { // número de comentarios
    statistics.comments = numComments;
    return models.Comment.countUnpublished();
  })
  .then(function (numUnpublished) { // número de comentarios sin publicar
    statistics.commentsUnpublished = numUnpublished;
    return models.Comment.countCommentedQuizes();
  })
  .then(function (numCommented) { // número de preguntas con comentario
    statistics.commentedQuizes = numCommented;
  })
  .catch(function (err) { errors.push(err); })
  .finally(function () {
    next();
  });

};
*/
// GET /quizes/statistics
exports.show = function (req, res, next) {
	models.Quiz.count()
		.then(function (numQuizes) { // número de preguntas
		statistics.numPreguntas = numQuizes;
	});
	
	models.Comment.count()
		.then(function (numComments) { // número de comentarios
		statistics.numComentarios = numComments;
	});
	
	models.Comment.aggregate('QuizId', 'count', {'distinct': true, 'where': {'publicado':true}})
		.then(function (numQuizesWithComment) { // número de preguntas con comentario 
		statistics.numPreguntasConComentario = numQuizesWithComment;
	});
	
	statistics.mediaComentariosPregunta = statistics.numComentarios / statistics.numPreguntas;
	statistics.numPreguntasSinComentario = statistics.numPreguntas - statistics.numPreguntasConComentario;
	
	//statistics.numPreguntas = models.Quiz.count();
	res.render('statistics/show', { statistics: statistics, errors: errors });
};