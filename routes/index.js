/**
Copyright (c) 2024 Yuya KITANO
Released under the MIT license
https://opensource.org/licenses/mit-license.php
*/


const express = require("express");
const router = express.Router();
const fs = require('fs');
const subproc = require('child_process');

//==================================================================
function exec_stl2html(fname)
{
	// ------------------------------------------------------
	console.log(fname);
	// ------------------------------------------------------
	// .stl -> .html
	//
	// https://t-salad.com/node-exe/
	// subproc.execSync('py ./app/PyVista/stl2html@WebApps.py  ./Joukowsky-airfoil.stl');
	subproc.execSync('C:/home/python3111x64/python.exe  ./app/PyVista/stl2html@WebApps.py  ./Joukowsky-airfoil.stl');
	
	// ------------------------------------------------------
}
//==================================================================

// https://zenn.dev/wkb/books/node-tutorial/viewer/todo_03

let fname;

router.get("/", (req, res) => {
	res.render("./index.ejs",{ fname } );
});

router.post("/upload", (req, res) => {

	fname = parseFloat(req.body.fname);
	
	exec_stl2html(fname);
	
	// https://qiita.com/riversun/items/7f720ae472289a281e3d
	res.set(
		'Content-Disposition',
		'attachment; filename=Joukowsky-airfoil.html'
	);
	res.send(fs.readFileSync('./app/PyVista/Joukowsky-airfoil.html'));
	
	// res.redirect('/');
});

module.exports = router;