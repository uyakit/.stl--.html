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
		// https://github.com/expressjs/multer/issues/1104#issuecomment-1155334173
		file.originalname = Buffer.from(file.originalname, 'latin1').toString('utf8');
		cb(null, file.originalname);
	}
});

const upload = multer({
	storage: multerStorage
});

//==================================================================
function copyf(path_from, path_to)
{
	fs.copyFileSync(path_from, path_to)
	
	const dnow = new Date();
	fs.utimes(path_to, dnow, dnow, e => {
		if (e) console.log( e.message );
	});
}
//==================================================================
function exec_stl2html(fname)
{
	// ------------------------------------------------------
	// .stl -> .html
	//
	// https://t-salad.com/node-exe/
	// subproc.execSync('py ./app/PyVista/stl2html.py  ./stl2html.stl');
	subproc.execSync('C:/home/python3111x64/python.exe  ./app/PyVista/stl2html.py  "./' + fname + '"');
	subproc.execSync('C:/home/python3111x64/python.exe  ./app/PyVista/stl2png.py  ./' + path.parse(fname).name + '.stl');
	copyf('./app/PyVista/' + path.parse(fname).name + '.stl.png', './app/PyVista/stl2html_Mesh.png');
	// ------------------------------------------------------
}
//==================================================================
function clearPngHtml(dir)
{
	const arrDirFiles = fs.readdirSync(dir, { withFileTypes: true });
	const arrFiles = arrDirFiles.filter(dirent => dirent.isFile()).map(({ name }) => name);
	
	arrFiles.forEach(fname => {
		if (path.parse(fname).ext == ".png" || path.parse(fname).ext == ".html") {
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
function clearPngStlHtml(dir)
{
	const arrDirFiles = fs.readdirSync(dir, { withFileTypes: true });
	const arrFiles = arrDirFiles.filter(dirent => dirent.isFile()).map(({ name }) => name);
	
	arrFiles.forEach(fname => {
		if (path.parse(fname).ext == ".png" || path.parse(fname).ext == ".stl" || path.parse(fname).ext == ".html") {
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
	clearPngStlHtml("./app/PyVista/");
	copyf("blockSpinner.png","./app/PyVista/blockSpinner.png");
	copyf("stl2html_Mesh.png","./app/PyVista/stl2html_Mesh.png");
	res.render("./index.ejs");
});
// --------------------------------------
router.post("/", upload.any(), (req, res) => {
	clearPngHtml("./app/PyVista/");
	
	console.log('# req.files : ' + req);
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	// sout
	console.log('# originalname : ' + req.files[0].originalname);
	// console.log('# destination : ' + req.files[0].destination);
	let fname_html = req.files[0].originalname.split('.').slice(0, -1).join('.') + '.html';
	console.log();
	console.log('loaded : ');
	console.log(req.files[0]);
	console.log();
	
	// ## OPERATION ##
	exec_stl2html(req.files[0].originalname);
	
	// sout
	console.log('# RETURN : ' + fname_html);
	console.log();
	
	copyf("blockSpinner.png","./app/PyVista/blockSpinner.png");
	
	if (fs.existsSync("./app/PyVista/stl2html_Mesh.png") == false) {
		copyf("stl2html_Mesh.png","./app/PyVista/stl2html_Mesh.png");
	}
	
	// https://qiita.com/watatakahashi/items/4b456971ae6dc3038569#%E6%96%B9%E6%B3%95%E3%81%9D%E3%81%AE2-header%E3%81%AB%E6%8C%87%E5%AE%9A
	res.set({
		'Content-Disposition': `attachment; filename=${encodeURIComponent(fname_html)}`
	});
	
	res.status(200).send(
		fs.readFileSync(req.files[0].destination + fname_html)
	);
	
	// res.redirect('/');
});
// --------------------------------
module.exports = router;
