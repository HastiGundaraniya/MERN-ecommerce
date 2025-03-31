const express = require('express');
const { fetchBrands, createBrand, importBrands } = require('../controller/Brand');

const router = express.Router();
//  /brands is already added in base path
router.get('/', fetchBrands).post('/', createBrand)
// .post('/import', importBrands)

exports.router = router;
