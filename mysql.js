









//const mysql = require('mysql');

// var connection = mysql.createConnection({
//   host     : 'sql143.main-hosting.eu',
//   user     : 'u930536689_node',
//   password : '1234rr',
//   database : 'u930536689_node'
// });

// var connection = mysql.createConnection({
//   host     : 'localhost',
//   user     : 'root',
//   password : '',
//   database : 'node'
// });


// app.get('/users', (req, res) =>{
// 	connection.connect();
// 	connection.query('SELECT * FROM users', function (error, results, fields) {
// 		if (error) throw new Error(error);
// 		res.send(JSON.stringify(results));
// 	});
// 	connection.end();
// });

// app.get('/users/:id', (req, res) =>{
// 	connection.connect();
// 	connection.query('SELECT * FROM users WHERE users.id=' + req.params.id, function (error, results, fields) {
// 		if (error) throw new Error(error);
// 		res.send(JSON.stringify(results));
// 	});
// 	connection.end();
// });