const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const connection = require('../db');



router.get('/', async (req, res) => {
	try{
		let rows = connection.manyOrNone(`
		SELECT * FROM users ORDER BY id;
		`);
		res.send(await rows);
	}catch(err){
		console.log(err);
	}
});


router.get('/:id', async (req, res) => {
	try{
		let rows = connection.oneOrNone(`
		SELECT * FROM users WHERE id = $1;
		`, [+req.params.id]);
		res.send(await rows);
	}catch(err){
		console.log(err);
	}
});

router.get('/filter/:name', async (req, res) => {
	try{
		let rows = connection.oneOrNone(`
		SELECT * FROM users WHERE name = $1;
		`, [req.params.name]);
		res.send(await rows);
	}catch(err){
		console.log(err);
	}
});

router.post('/', async (req, res) => {
	try{
		console.log(req.body);
		let rows = connection.one(`
		INSERT INTO users (name) VALUES ($1) RETURNING id, name;
		`, [req.body.name]);
		res.send(await rows);
	}catch(err){
		console.log(err);
	}
});

router.put('/:id', async (req, res) => {
	try{
		let rows = await connection.none(`
		UPDATE users SET name = $1 WHERE id = $2;
		`, [req.body.name, +req.params.id]);
		res.sendStatus(200);
	}catch(err){
		console.log(err);
	}
});

router.delete('/:id', async (req, res) => {
	try{
		let rows = await connection.none(`
		DELETE FROM users WHERE id = $1;
		`, [+req.params.id]);
		res.sendStatus(200);
	}catch(err){
		console.log(err);
	}
});

module.exports = router;