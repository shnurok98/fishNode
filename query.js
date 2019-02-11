const connection = require('./db');

(async function createTable(){
	try{
		let res = connection.none(`
		CREATE TABLE scores (
			id SERIAL PRIMARY KEY,
			user_id int,
			score int
		)`);
		console.log('query success');
	}catch(err){
		console.log(err);
	}
})();

// (async function createTable(){
// 	try{
// 		let res = connection.manyOrNone(`
// 		SELECT 2+2`);
// 		console.log('query success');
// 		console.log(res);
// 	}catch(err){
// 		console.log(err);
// 	}
// })();



(async function createTable(){
	try{
		let res = connection.none(`
			CREATE TABLE users (
			id SERIAL PRIMARY KEY,
			name VARCHAR(40)
			)`);
		console.log('query success');
	}catch(err){
		console.log(err);
	}
})();