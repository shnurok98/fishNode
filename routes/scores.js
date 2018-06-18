const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const connection = require('../db');


router.get('/', async (req, res) => {
	try{
		let rows = connection.manyOrNone(`
		SELECT * FROM scores ORDER BY id;
		`);
		res.send(await rows);
	}catch(err){
		console.log(err);
	}
});


router.get('/:userId', async (req, res) => {
	try{
		let rows = connection.manyOrNone(`
		SELECT * FROM scores WHERE user_id = $1 ORDER BY score DESC;
		`, [+req.params.userId]);
		res.send(await rows);
	}catch(err){
		console.log(err);
	}
});

router.post('/', async (req, res) => {
	try{
		let rows = connection.one(`
		INSERT INTO scores (user_id, score) VALUES ($1, $2) RETURNING id, user_id, score;
		`, [+req.body.user_id, +req.body.score]);
		res.send(await rows);
	}catch(err){
		console.log(err);
	}
});
/*
router.put('/:id', async (req, res) => {
	try{
		let rows = await connection.none(`
		UPDATE scores SET score = $1 WHERE id = $2;
		`, [req.body.name, +req.params.id]);
		res.sendStatus(200);
	}catch(err){
		console.log(err);
	}
});

router.delete('/:id', async (req, res) => {
	try{
		let rows = await connection.none(`
		DELETE FROM scores WHERE id = $1;
		`, [+req.params.id]);
		res.sendStatus(200);
	}catch(err){
		console.log(err);
	}
});
*/
module.exports = router;