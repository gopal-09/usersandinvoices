const express = require('express');
const {createaccount,createinvoice,invoicelist} = require('../controllers/userc')
const router=express.Router()
router.post('/createaccount',createaccount)
router.post('/createinvoice/:id',createinvoice)
 router.get('/invoicelist',invoicelist)
module.exports =router   