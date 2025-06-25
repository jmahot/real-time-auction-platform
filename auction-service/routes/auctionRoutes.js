const express = require('express');
const router = express.Router();
const auctionController = require('../controllers/auctionController');
const auth = require('../middlewares/authMiddleware');

router.post('/auctions', auth, auctionController.createAuction);
router.get('/auctions', auth, auctionController.getAuctions);
router.get('/auctions/:id', auth, auctionController.getAuctionById);
router.delete('/auctions/:id', auth, auctionController.deleteAuction);

module.exports = router;
