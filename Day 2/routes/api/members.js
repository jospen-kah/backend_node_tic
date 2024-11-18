const express = require('express')
const uuid = require('uuid')

const members = require('../../Member')

const router = express.Router();

router.get('/', (req, res) => {
    res.json(members);
});


// Get Single Member
router.get('/:id', (req, res) => {
    const found = members.some(member => member.id === parseInt(req.params.id));
    if (found) {
        res.json(members.filter(member => member.id === parseInt(req.params.id)))
    }

    else {
        res.status(400).json({message : `No member with the id of ${req.params.id}`})
    }

})

router.post('/',async (req, res)=>{
    const {name,email}=req.body
    if(!name || !email){
        res.status(400).json({message:'Fields required '})
    }
const newMember = {
    id:uuid.v4(),
    name,
    email,
    status:'active'
}

   members.push(newMember)
   res.json(members)

})

module.exports = router;