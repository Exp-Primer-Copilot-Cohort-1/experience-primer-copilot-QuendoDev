//Create web server
// 1. Import Express
const express = require('express');
const router = express.Router();
// 2. Create a router
// 3. Create a route
router.get('/', (req, res) => {
    res.send('Comments page');
});
// 4. Export router
module.exports = router;