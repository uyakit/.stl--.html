/**
Copyright (c) 2024 Yuya KITANO
Released under the MIT license
https://opensource.org/licenses/mit-license.php
*/

'use strict';

const express = require("express");
const router = express.Router();
const path = require("path");
const fs = require('fs');
const subproc = require('child_process');
const multer  = require('multer');

const multerStorage = multer.diskStorage({
	destination (req, file, cb) {
		cb(null, './app/PyVista/');
	},
	filename (req, file, cb) {
		cb(null, file.originalname);
	}
});
const upload = multer({ storage: multerStorage });

//==================================================================
function exec_stl2html(fname)
{
	// ------------------------------------------------------
	// .stl -> .html
	//
	// https://t-salad.com/node-exe/
	// subproc.execSync('py ./app/PyVista/stl2html@WebApps.py  ./stl2html.stl');
	subproc.execSync('C:/home/python3111x64/python.exe  ./app/PyVista/stl2html@WebApps.py  "./' + fname + '"');
	// ------------------------------------------------------
}
//==================================================================
function clearStlHtml(dir)
{
	const arrDirFiles = fs.readdirSync(dir, { withFileTypes: true });
	const arrFiles = arrDirFiles.filter(dirent => dirent.isFile()).map(({ name }) => name);
	
	arrFiles.forEach(fname => {
		if (path.parse(fname).ext == ".stl" || path.parse(fname).ext == ".html") {
			fs.unlink((dir + fname), (error) => {
				if (error != null) {
					console.log(error);
				} else {
					console.log((dir + fname) + " : deleted");
				}
			});
		}
	});
}
//==================================================================
// https://zenn.dev/wkb/books/node-tutorial/viewer/todo_03

// --------------------------------------
router.get("/", (req, res) => {
	clearStlHtml("./app/PyVista/");
	res.render("./index.ejs");
});
// --------------------------------------
router.post("/", upload.any(), (req, res) => {
	
	// console.log('originalname : ' + req.files[0].originalname);
	// console.log('destination : ' + req.files[0].destination);
	let fname_html = req.files[0].originalname.split('.').slice(0, -1).join('.') + '.html';
	console.log();
	console.log('loaded : ');
	console.log(req.files[0]);
	console.log();
	// console.log('output : ' + req.files[0].destination + fname_html);
	
	exec_stl2html(req.files[0].originalname);
	
	// https://qiita.com/riversun/items/7f720ae472289a281e3d
	res.set(
		'Content-Disposition',
		'attachment; filename=' + fname_html
	);
	
	res.send(fs.readFileSync(req.files[0].destination + fname_html));
	
	// res.redirect('/');
});
// --------------------------------
module.exports = router;
