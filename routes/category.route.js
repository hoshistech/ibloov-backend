const express = require('express');
const router = express.Router();
const CategoryController = require('@controllers/category.controller');

router.get('/:scope?', CategoryController.index);

router.post('/create', CategoryController.create);

module.exports = router; 