var express = require('express');
var router = express.Router();

const UserController = require('@controllers/users.controller');

const { validate } = require("@request-middleware/user.request-middleware");
const { isValidRequest } = require("@middleware/isRequestValid.middleware");
const { checkAuth } = require("@middleware/auth.middleware");



router.get('/', [ checkAuth ], UserController.index );

router.post('/register', [ validate("createUser"), isValidRequest ], UserController.create );

router.post('/mobilenumber/sendverificationcode/:userId', [ validate("sendTelephoneVerifcationCode"), isValidRequest ], UserController.sendTelephoneVerifcationCode );

router.post('/follow/:userId', [ checkAuth, validate("followUser"), isValidRequest ], UserController.followUser );

router.get('/mobilenumber/verifycode/:userId/:code', [ validate("verifyTelephoneVerifcationCode"), isValidRequest ], UserController.verifyTelephoneVerifcationCode );

router.get('/wishlists/:userId?', [ checkAuth, validate("userWishlists"), isValidRequest ], UserController.wishlists );

router.get('/events/:userId?', [ checkAuth, validate("userEvents"), isValidRequest ], UserController.events );

router.get('/crowdfunds/:userId?', [ checkAuth, validate("userCrowdfunds"), isValidRequest ], UserController.crowdfunds );

router.get('/tickets/:userId?', [ checkAuth, validate("userTickets"), isValidRequest ], UserController.tickets );

router.get('/details',  [ checkAuth ], UserController.getUserByToken );

router.get('/following/:userId?',  [ checkAuth ], UserController.getFollowing ); 

router.get('/following/status/:userId',  [ checkAuth ], UserController.followStatus ); 

router.get('/notifications',  [ checkAuth ], UserController.getNotifications ); 

router.get('/requests',  [ checkAuth ], UserController.getRequests ); 

router.get('/followrequests',  [ checkAuth ], UserController.followRequests ); 

router.get('/:userId', [ checkAuth, validate("viewUser"), isValidRequest ], UserController.view );

router.delete('/:userId',  [ checkAuth, validate("deleteUser"), isValidRequest ], UserController.softdelete );

router.patch('/unfollow/:userId', [ checkAuth, validate("unfollowUser"), isValidRequest ], UserController.unfollowUser );

router.patch('/togglefollow/:userId', [ checkAuth, validate("toggleFollowUser"), isValidRequest ], UserController.toggleFollow );

//router.patch('/followrequest/accept/:userId', [ checkAuth, validate("acceptFollowRequest"), isValidRequest ], UserController.acceptFollowRequest );

router.patch('/:userId', [ checkAuth, validate("updateUser"), isValidRequest ], UserController.update );


module.exports = router;
