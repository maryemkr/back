const router = require('express').Router()

router.get('/',(req,res)=>{
    
    res.json({
        posts: {
            title:'my firt ..'
        }
    })
})
module.exports = router