/**
Copyright (c) 2024 Yuya KITANO
Released under the MIT license
https://opensource.org/licenses/mit-license.php
*/


const express = require("express");
const router = express.Router();
const fs = require('fs');
const subproc = require('child_process');

// https://zenn.dev/wkb/books/node-tutorial/viewer/todo_03

router.get("/", (req, res) => {
	res.render("./index.ejs");
});

module.exports = router;
