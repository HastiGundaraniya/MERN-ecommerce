const express = require('express');
const { fetchCategories, createCategory, importCategories } = require('../controller/Category');

const router = express.Router();
//  /categories is already added in base path
router.get('/', fetchCategories).post('/',createCategory)
// .post('/import',importCategories)

exports.router = router;
