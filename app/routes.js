module.exports = function(app, passport) {
    // setting env to app.settings.env
    var env = app.settings.env;
    var config = require('../config/auth')(env);
    var skynet = require('skynet');
    var security = require('./controllers/middleware/security');

    app.locals.skynetUrl = config.skynet.host + ':' + config.skynet.port;

    console.log('Connecting to SkyNet...');

    // Generic UUID / Token for SkyNet API calls
    var conn = skynet.createConnection({
        "uuid"     : "9b47c2f1-9d9b-11e3-a443-ab1cdce04787",
        "token"    : "pxdq6kdnf74iy66rhuvdw9h5d2f0f6r",
        "server"   : config.skynet.host,
        "port"     : config.skynet.port,
        "protocol" : "websocket"
    });

    var NodeTypeController = require('./controllers/node-type-controller');
    var nodeTypeController = new NodeTypeController();

    var NodeController = require('./controllers/node-controller');
    var nodeController = new NodeController();

    var AppNetController = require('./controllers/app-net-controller');
    var appNetController = new AppNetController();

    var BitlyController = require('./controllers/bitly-controller');
    var bitlyController = new BitlyController();

    var DropboxController = require('./controllers/dropbox-controller');
    var dropboxController = new DropboxController();

    var FacebookController = require('./controllers/facebook-controller');
    var facebookController = new FacebookController();

    var FitbitController = require('./controllers/fitbit-controller');
    var fitbitController = new FitbitController();

    var FlowController = require('./controllers/flow-controller');
    var flowController = new FlowController();

    var FlowDeployController = require('./controllers/flow-deploy');
    var flowDeployController = new FlowDeployController({meshblu: conn});

    var FlowNodeTypeController = require('./controllers/flow-node-type-controller');
    var flowNodeTypeController = new FlowNodeTypeController();

    var GithubController = require('./controllers/github-controller');
    var githubController = new GithubController();

    var GoogleController = require('./controllers/google-controller');
    var googleController = new GoogleController();

    var RdioController = require('./controllers/rdio-controller');
    var rdioController = new RdioController();

    var TwitterController = require('./controllers/twitter-controller');
    var twitterController = new TwitterController();

    var InvitationController = require('./controllers/invitation-controller');
    var invitationController = new InvitationController(config.betaInvites);

    var SignupController = require('./controllers/signup-controller');
    var signupController = new SignupController();

    var referrer = require('./controllers/middleware/referrer.js');

    conn.on('notReady', function(data){
        console.log('SkyNet authentication: failed');
    });

    // Attach additional routes
    conn.on('ready', function(data){
        console.log('SkyNet authentication: success');
        try {
            app.post('/api/auth', security.bypassAuth);
            app.all('/api/auth', security.bypassTerms);
            app.all('/api/auth/*', security.bypassAuth, security.bypassTerms);
            app.all('/api/oauth/*', security.bypassAuth, security.bypassTerms);
            app.post('/api/invitation/request', security.bypassAuth, security.bypassTerms);

            app.all('/api/*', security.isAuthenticated, security.enforceTerms);

            require('./controllers/auth')(app, passport, config);
            require('./controllers/channel')(app);
            require('./controllers/connect')(app, passport, config);
            require('./controllers/cors')(app);
            require('./controllers/device')(app, config);
            require('./controllers/elastic')(app);
            require('./controllers/message')(app, conn);
            require('./controllers/redport')(app, config);
            require('./controllers/session')(app, passport, config);
            require('./controllers/unlink')(app);
            require('./controllers/user')(app);
            require('./controllers/group')(app);
            require('./controllers/permissions')(app);
            require('./controllers/designer')(app);
            require('./controllers/invitation')(app, passport, config);

            app.post('/api/auth/signup', signupController.verifyInvitationCode, signupController.createUser, signupController.loginUser, signupController.checkInTester, signupController.returnUser);
            app.get('/api/oauth/facebook/signup', signupController.verifyInvitationCode, signupController.storeTesterId, facebookController.authorize);
            app.get('/api/oauth/github/signup', signupController.verifyInvitationCode, signupController.storeTesterId, githubController.authorize);
            app.get('/api/oauth/google/signup', signupController.verifyInvitationCode, signupController.storeTesterId, googleController.authorize);
            app.get('/api/oauth/twitter/signup', signupController.verifyInvitationCode, signupController.storeTesterId, twitterController.authorize);

            app.put('/api/flows/:id', flowController.updateOrCreate);
            app.delete('/api/flows/:id', flowController.delete);
            app.get('/api/flows', flowController.getAllFlows);
            app.post('/api/flows/:id/instance', flowDeployController.startInstance);
            app.delete('/api/flows/:id/instance', flowDeployController.stopInstance);
            app.put('/api/flows/:id/instance', flowDeployController.restartInstance);

            app.get('/api/flow_node_types', flowNodeTypeController.getFlowNodeTypes);

            app.post('/api/invitation/request', invitationController.requestInvite);

            app.get('/api/node_types', nodeTypeController.index);
            app.get('/api/nodes', nodeController.index);

            app.get('/api/oauth/app.net',          appNetController.authorize);
            app.get('/api/oauth/app.net/callback', appNetController.callback, appNetController.redirectToDesigner);

            app.get('/api/oauth/bitly',          bitlyController.authorize);
            app.get('/api/oauth/bitly/callback', bitlyController.callback, bitlyController.redirectToDesigner);

            app.get('/api/oauth/dropbox',          dropboxController.authorize);
            app.get('/api/oauth/dropbox/callback', dropboxController.callback, dropboxController.redirectToDesigner);

            app.get('/api/oauth/facebook',          referrer.storeReferrer, facebookController.authorize);
            app.get('/api/oauth/facebook/callback', facebookController.callback, signupController.checkInTester, referrer.restoreReferrer, referrer.redirectToReferrer, facebookController.redirectToDesigner);

            app.get('/api/oauth/fitbit',          fitbitController.authorize);
            app.get('/api/oauth/fitbit/callback', fitbitController.callback, fitbitController.redirectToDesigner);

            app.get('/api/oauth/github',          referrer.storeReferrer, githubController.authorize);
            app.get('/api/oauth/github/callback', githubController.callback, signupController.checkInTester, referrer.restoreReferrer, referrer.redirectToReferrer, githubController.redirectToDesigner);

            app.get('/api/oauth/google',          referrer.storeReferrer, googleController.authorize);
            app.get('/api/oauth/google/callback', googleController.callback, signupController.checkInTester, referrer.restoreReferrer, referrer.redirectToReferrer, googleController.redirectToDesigner);

            app.get('/api/oauth/rdio',          rdioController.authorize);
            app.get('/api/oauth/rdio/callback', rdioController.callback, rdioController.redirectToDesigner);

            app.get('/api/oauth/twitter',          referrer.storeReferrer, twitterController.authorize);
            app.get('/api/oauth/twitter/callback', twitterController.callback, signupController.checkInTester, referrer.restoreReferrer, referrer.redirectToReferrer, twitterController.redirectToDesigner);

            app.get('/*', function(req, res) {
                res.sendfile('./public/index.html');
            });
        } catch(err) {
            console.log(err.stack);
            throw err;
        }
    }); // end skynet (and everything else)
};
