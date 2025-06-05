const express = require('express');
const router = express.Router();

module.exports = () => {
    router.get('/', (req, res)=>{
    res.json({
        status: 'discovery',
        name: 'Empowerer'
    });
});
    return router
}


