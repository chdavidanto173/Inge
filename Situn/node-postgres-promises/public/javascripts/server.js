var promise = require('bluebird');
var express = require('express');
var app = express();

//-------- LA PAGINA PRINCIPAL QUE SE VA ABRIR AL COLOCAR http://localhost:3000/ ----------------
app.get('/', function(req, res){
	res.sendfile(_dirname +'/public/index.html');
});


var options = {
  // Initialization Options
  promiseLib: promise
};

var pgp = require('pg-promise')(options);

//------ CONEXION A LA BASE DE DATOS ------------------
var connectionString = "pg://postgres:root@localhost:5432/BD_SITUN"; // CAMBIAR POR CLAVE DEL POSTGRES DE USTEDES
var db = pgp(connectionString);


// ------- FUNCIONES-------------------

//-------- CREACION DE UN NUEVO DATO DE UNA TABLA ----------
//-------- CREACION DE UN NUEVO TP EN LA TABLA ----------
function createTP(req, res, next) {
  db.none('insert into TP(TP_1, TP_2, TP_3, TP_4)' +
      'values(${TP_1}, ${TP_2}, ${TP_3}, ${TP_4})',
    req.body)
    .then(function () {
      res.status(200)
        .json({
          status: 'success',
          message: 'Inserted one TP'
        });
    })
    .catch(function (err) {
      return next(err);
    });
}

//-------- CREACION DE UN NUEVO TU EN LA TABLA ----------
function createTU(req, res, next) {
	  req.body.TU_3 = parseInt(req.body.TU_3);
  db.none('insert into TU (TU_1, TU_2, TU_3)' +
      'values(${TU_1}, ${TU_2}, ${TU_3})',
    req.body)
    .then(function () {
      res.status(200)
        .json({
          status: 'success',
          message: 'Inserted one TP'
        });
    })
    .catch(function (err) {
      return next(err);
    });
}

//-------- CREACION DE UN NUEVO TC EN LA TABLA ----------
function createTC(req, res, next) {
	console.log("Insert received...");
	console.log(req.body);
     db.none('insert into TC (TC_2, TC_3, TC_4, TC_5, TC_6, TC_7, TC_8, TC_9, TC_10, TC_11)' +
      'values(current_date, ${TC_3}, ${TC_4}, ${TC_5}, ${TC_6},${TC_7}, ${TC_8}, ${TC_9}, ${TC_10}, ${TC_11})',
	     req.body)
    .then(function () {
		console.log("Theniando en insert tc");
      res.status(200)
        .json({
          status: 'success',
          message: 'Inserted one TC'
        });
    })
    .catch(function (err) {
		console.log(" No Theniando en insert tc err "+ err);
      return next(err);
    });
}

//-------- CREACION DE UN NUEVO TE EN LA TABLA ----------
function createTE(req, res, next) {
     db.none('insert into TE (TE_1, TE_2)' +
      'values(${TE_1}, ${TE_2})',
	     req.body)
    .then(function () {
      res.status(200)
        .json({
          status: 'success',
          message: 'Inserted one TE'
        });
    })
    .catch(function (err) {
      return next(err);
    });
}

//-------- CREACION DE UN NUEVO TA EN LA TABLA ----------
function createTA(req, res, next) {
	 req.body.TA_1 = parseInt(req.body.TA_1);
	 req.body.TA_4 = parseInt(req.body.TA_4);
     db.none('insert into TA (TA_1, TA_2, TA_3, TA_4)' +
      'values(${TA_1}, ${TA_2}, ${TA_3}, ${TA_4})',
	     req.body)
    .then(function () {
      res.status(200)
        .json({
          status: 'success',
          message: 'Inserted one TA'
        });
    })
    .catch(function (err) {
      return next(err);
    });
}

// ----- RETORNO DE TODOS LOS DATOS DE UNA TABLA ------------------

//------ RETORNO DE TODOS LOS DATOS DE LA TABLA TP -----------------
function getAllTP(req, res, next) {
  db.any('select * from TP')
    .then(function (data) {
      res.status(200)
        .json({
          status: 'success',
          data: data,
          message: 'Retrieved ALL TP'
        });
    })
    .catch(function (err) {
      return next(err);
    });
}

//------ RETORNO DE TODOS LOS DATOS DE LA TABLA TU -----------------
function getAllTU(req, res, next) {
  db.any('select * from TU')
    .then(function (data) {
      res.status(200)
        .json({
          status: 'success',
          data: data,
          message: 'Retrieved ALL TU'
        });
    })
    .catch(function (err) {
      return next(err);
    });
}

//------ RETORNO DE TODOS LOS DATOS DE LA TABLA TC -----------------
function getAllTC(req, res, next) {
  db.any('select * from TC')
    .then(function (data) {
      res.status(200)
        .json({
          status: 'success',
          data: data,
          message: 'Retrieved ALL TC'
        });
    })
    .catch(function (err) {
      return next(err);
    });
}

//------ RETORNO DE DATOS ESPECIFICOS A BUSCAR --------------------

//------ RETORNO DE UN TP ESPECIFICO ---------------------
function getSingleTP(req, res, next) {
  db.one('select * from TP where TP_4 = ${TP_4}', req.body)
    .then(function (data) {
      res.status(200)
        .json({
          status: 'success',
          data: data,
          message: 'Retrieved ONE TP'
        });
    })
    .catch(function (err) {
      return next(err);
    });
}

//------ RETORNO DE UN TU ESPECIFICO ---------------------
function getSingleTU(req, res, next) {
  db.one('select * from TU where TU_1 = ${TU_1}', req.body)
    .then(function (data) {
      res.status(200)
        .json({
          status: 'success',
          data: data,
          message: 'Retrieved ONE TU'
        });
    })
    .catch(function (err) {
      return next(err);
    });
}

//------ RETORNO DE UN TC ESPECIFICO SEGUN TC_3 ---------------------
function getALLTC1(req, res, next) {
	var low = req.body.TC_3.toLowerCase();
 req.body.TC_3 = '%' + low + '%';
 var promises = [];
  db.any('select * from TC where LOWER(TC_3) LIKE ${TC_3}', req.body)
	.then(a => a.map(e => 
						( promises.push(
										getAllEnlaces(e.tc_1)
										.then(r => 
													(
														e.enlaces = r,
														e
													)
											)
										),e
						)
					)
		)
		.then( r => Promise.all(promises).then(function (data) {
      res.status(200)
        .json({
          status: 'success',
          data: r,
          message: 'Retrieved ONE TC'
        });
    }));
}



function getAllEnlaces(c)	// devuelve los enlaces de una correspondencia
{
	var flag = true;
	return db.func('Enlaces',c)
	.then( v => (v[0].enlaces) ? v[0].enlaces :[])
	.then(en => en.reduce( (ant, act) => 
										(
											(act.tc_1 != c ) ? 
															ant[ flag ? 0 : 1 ].push(act.tc_1 )
															: flag = false
										
											,ant 
										)
							,[[],[]]));
}

//------ RETORNO DE UN TC ESPECIFICO SEGUN TC_5 ---------------------
function getALLTC2(req, res, next) {
	var low = req.body.TC_5.toLowerCase();
	 var promises = [];
 req.body.TC_5 =  '%' + low + '%';
  db.any('select * from TC where LOWER(TC_5) LIKE ${TC_5}', req.body)
  .then(a => a.map(e => 
						( promises.push(
										getAllEnlaces(e.tc_1)
										.then(r => 
													(
														e.enlaces = r,
														e
													)
											)
										),e
						)
					)
		)
		.then( r => Promise.all(promises).then(function (data) {
      res.status(200)
        .json({
          status: 'success',
          data: r,
          message: 'Retrieved ONE TC'
        });
    }));
    /*.then(function (data) {
      res.status(200)
        .json({
          status: 'success',
          data: data,
          message: 'Retrieved ONE TC'
        });
    })
    .catch(function (err) {
      return next(err);
    });*/
}

//------ RETORNO DE UN TC ESPECIFICO SEGUN TC_7 ---------------------
function getALLTC3(req, res, next) {
	var low = req.body.TC_7.toLowerCase();
  req.body.TC_7 =  '%' + low + '%';
   var promises = [];
  db.any('select * from TC where LOWER(TC_7) LIKE ${TC_7}', req.body)
  .then(a => a.map(e => 
						( promises.push(
										getAllEnlaces(e.tc_1)
										.then(r => 
													(
														e.enlaces = r,
														e
													)
											)
										),e
						)
					)
		)
		.then( r => Promise.all(promises).then(function (data) {
      res.status(200)
        .json({
          status: 'success',
          data: r,
          message: 'Retrieved ONE TC'
        });
    }));
    /*.then(function (data) {
      res.status(200)
        .json({
          status: 'success',
          data: data,
          message: 'Retrieved ONE TC'
        });
    })
    .catch(function (err) {
      return next(err);
    });*/
}

//------ RETORNO DE UN TC ESPECIFICO SEGUN TC_8 ---------------------
function getALLTC4(req, res, next) {
	var low = req.body.TC_8.toLowerCase();
	req.body.TC_8 =  '%' +low+'%';
	 var promises = [];
	db.any('select * from TC where LOWER(TC_8) LIKE ${TC_8}', req.body)
	.then(a => a.map(e => 
						( promises.push(
										getAllEnlaces(e.tc_1)
										.then(r => 
													(
														e.enlaces = r,
														e
													)
											)
										),e
						)
					)
		)
		.then( r => Promise.all(promises).then(function (data) {
      res.status(200)
        .json({
          status: 'success',
          data: r,
          message: 'Retrieved ONE TC'
        });
    }));
    /*.then(function (data) {
      res.status(200)
        .json({
          status: 'success',
          data: data,
          message: 'Retrieved ONE TC'
        });
    })
    .catch(function (err) {
      return next(err);
    });*/
}

//------ RETORNO DE UNO O VARIOS TE ESPECIFICOS SEGUN TE_1 ---------------------
function getALLTE_ONE(req, res, next) {
	  req.body.TE_1 = parseInt(req.body.TE_1);
  db.any('select * from TE where TE_1 = ${TE_1}', req.body)
    .then(function (data) {
      res.status(200)
        .json({
          status: 'success',
          data: data,
          message: 'Retrieved ONE TE'
        });
    })
    .catch(function (err) {
      return next(err);
    });
}

//------ RETORNO DE UNO O VARIOS TA ESPECIFICOS SEGUN TA_3 ---------------------


function getALLTA_FECHA(req, res, next) {
  db.any('Select TA.TA_1, TC_3, TA.TA_2, TA.TA_3 '+ 
		'from TC,(select TA.TA_1, TA.TA_2, TA.TA_3 from TA where TA_3 <= current_date and TA_2 >= current_date and TA_4 = 0) as TA '+ 
		'where TC_1 = TA.TA_1;', req.body)
    .then(function (data) {
      res.status(200)
        .json({
          status: 'success',
          data: data,
          message: 'Retrieved Date TA'
        });
    })
    .catch(function (err) {
      return next(err);
    });
}


//-------- ACTUALIZACIONES  DE UNA TABLA ----------
//-------- ACTUALIZACION DE LA TABLA TP ----------
function updateTP(req, res, next) {
  db.none('update TP set TP_1=${TP_1}, TP_2=${TP_2}, TP_3=${TP_3} where TP_4=${TP_4}',
    req.body)
    .then(function () {
      res.status(200)
        .json({
          status: 'success',
          message: 'Updated TP'
        });
    })
    .catch(function (err) {
      return next(err);
    });
}

//-------- ACTUALIZACION DE LA TABLA TU ----------
function updateTU(req, res, next) {
    req.body.TC_1 = parseInt(req.body.TC_1);
	req.body.TC_4 = parseInt(req.body.TC_4);
	req.body.TC_8 = parseInt(req.body.TC_8);
	req.body.TU_3 = parseInt(req.body.TU_3);
  db.none('update TU set TU_2=${TU_2}, TU_3=${TU_3} where TU_1=${TU_1}',
    req.body)
    .then(function () {
      res.status(200)
        .json({
          status: 'success',
          message: 'Updated TU'
        });
    })
    .catch(function (err) {
      return next(err);
    });
}
//Prueba
//-------- ACTUALIZACION DE LA TABLA TC ----------
function updateTC(req, res, next) {
  db.none('update TC set TC_2=${TC_2}, TC_3=${TC_3},TC_4=${TC_4}, TC_5=${TC_5},'+
          'TC_6=${TC_6} ,TC_7=${TC_7}, TC_8=${TC_8}, TC_9=${TC_9}, TC_10=${TC_10}, TC_11=${TC_11} where TC_1=${TC_1}',
    req.body)
    .then(function () {
      res.status(200)
        .json({
          status: 'success',
          message: 'Updated TC'
        });
    })
    .catch(function (err) {
      return next(err);
    });
}

//-------- ACTUALIZACION DE LA TABLA TE ----------
function updateTE(req, res, next) {
  db.none('update TE set TE_2=${TE_2} where TE_1=${TE_1} and TE_2=${TE_AUX}',
    req.body)
    .then(function () {
      res.status(200)
        .json({
          status: 'success',
          message: 'Updated TE'
        });
    })
    .catch(function (err) {
      return next(err);
    });
}

//-------- ACTUALIZACION DE LA TABLA TA ----------
function updateTA(req, res, next) {
	 req.body.TA_1 = parseInt(req.body.TA_1);
	 req.body.TA_4 = parseInt(req.body.TA_4);
  db.none('update TA set TA_3=${TA_3},TA_4=${TA_4}'+
          'where TA_1=${TA_1} and TA_2=${TA_2}',
    req.body)
    .then(function () {
      res.status(200)
        .json({
          status: 'success',
          message: 'Updated TA'
        });
    })
    .catch(function (err) {
      return next(err);
    });
}

//-------- ELIMINACION DE UN DATO EN ESPECIFICO DE UNA TABLA ----------
//-------- ELIMINACION DE UN DATO EN LA TABLA TP ----------
function removeTP(req, res, next) {
  var TP_D = req.query.TP_4;
  db.result('delete from TP where TP_4 = $1', TP_D)
    .then(function (result) {
      /* jshint ignore:start */
      res.status(200)
        .json({
          status: 'success',
          message: `Removed ${result.rowCount} TP`
        });
      /* jshint ignore:end */
    })
    .catch(function (err) {
      return next(err);
    });
}

//-------- ELIMINACION DE UN DATO EN LA TABLA TU ----------
function removeTU(req, res, next) {
  var TU_D = req.query.TU_1;
  db.result('delete from TU where TU_1 = $1', TU_D)
    .then(function (result) {
      /* jshint ignore:start */
      res.status(200)
        .json({
          status: 'success',
          message: `Removed ${result.rowCount} TU`
        });
      /* jshint ignore:end */
    })
    .catch(function (err) {
      return next(err);
    });
}

//-------- ELIMINACION DE UN DATO EN LA TABLA TC ----------
function removeTC(req, res, next) {
  var TC_A = req.query.TC_1;
  db.result('delete from TC where TC_1 = $1', TC_A)
    .then(function (result) {
      /* jshint ignore:start */
      res.status(200)
        .json({
          status: 'success',
          message: `Removed ${result.rowCount} TC`
        });
      /* jshint ignore:end */
    })
    .catch(function (err) {
      return next(err);
    });
}

//-------- ELIMINACION DE UN DATO EN LA TABLA TE ----------
function removeTE(req, res, next) {
  db.result('delete from TE where TE_1 = ${TE_1} and  TE_2=${TE_2}',
    req.body)
    .then(function() {
      res.status(200)
        .json({
          status: 'success',
          message: 'Remove one TE'
        });
    })
    .catch(function (err) {
      return next(err);
    });
}

//-------- ELIMINACION DE UN DATO EN LA TABLA TA ----------
function removeTA(req, res, next) {
  db.result('delete from TA where TA_1 = ${TA_1} and  TA_2=${TA_2}',
    req.body)
    .then(function() {
      res.status(200)
        .json({
          status: 'success',
          message: 'Remove one TA'
        });
    })
    .catch(function (err) {
      return next(err);
    });
}

//------------------ METODO QUE RECUPERA EL ULTIMO ID---------------
function getLastTC(req, res, next) {
  db.any('select  TC_1, TC_3 from  TC where TC_1 = (select MAX(TC_1) from TC)')
    .then(function (data) {
      res.status(200)
        .json({
          status: 'success',
          data: data,
          message: 'Retrieved last id from TC'
        });
    })
    .catch(function (err) {
      return next(err);
    });
}






//------ EXPORTACIONES DE LOS MODULOS ---------
module.exports = {
  getAllTP: getAllTP,
  getAllTU: getAllTU,
  getAllTC: getAllTC,
  getSingleTP: getSingleTP,
  getSingleTU: getSingleTU,
  getALLTC1: getALLTC1,
  getALLTC2: getALLTC2,
  getALLTC3: getALLTC3,
  getALLTC4: getALLTC4,
  getALLTE_ONE: getALLTE_ONE,
  getALLTA_FECHA: getALLTA_FECHA,
  createTP: createTP,
  createTU: createTU,
  createTC: createTC,
  createTE: createTE,
  createTA: createTA,
  removeTP: removeTP,
  removeTU: removeTU,
  removeTC: removeTC,
  removeTE: removeTE,
  removeTA: removeTA,
  updateTP: updateTP,
  updateTU: updateTU,
  updateTC: updateTC,
  updateTE: updateTE,
  getLastTC: getLastTC,
  updateTA: updateTA
};