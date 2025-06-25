const express = require('express');
const router = express.Router();
const bidController = require('../controllers/bidController');
const auth = require('../middlewares/authMiddleware');

router.post('/bids', auth, bidController.createBid);
router.get('/bids/auction/:auction_id', auth, bidController.getBidsByAuction);
router.get('/bids/user/:user_id', auth, bidController.getBidsByUser);

module.exports = router;