// Authorization code provided by spotify:
// https://developer.spotify.com/web-api/authorization-guide/#authorization_code_flow

const express = require('express'); // Express web server framework
const request = require('request'); // "Request" library
const cors = require('cors');
const querystring = require('querystring');
const cookieParser = require('cookie-parser');
var nodemailer = require('nodemailer');
const { keys } = require('./secret');

const client_id = keys.CLIENT_ID; // client id
const client_secret = keys.CLIENT_SECRET; // secret
const redirect_uri = 'http://34.125.85.115/callback/'; // redirect uri

var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'six.strings.official.21@gmail.com',
      pass: 'Carnitas3$'
    }
});


// Send Email
async function sendEmail(emailOptions, res) {
    transporter.sendMail(emailOptions, function (error, info) {
        if (error) {
            // console.log(error);
            throw error;
        } else {
            // console.log('EMAIL SENT SUCCESSFULLY! ✅')//: ' + info.response);
            res.json({
                ok: true,
                message: 'Email sent successfully!'
            });
        }
    });
}

var generateRandomString = function(length) {
    var text = '';
    var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    for (var i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
};

var stateKey = 'spotify_auth_state';

var app = express();

app.use(express.static(__dirname + '/public'))
    .use(cors())
    .use(cookieParser());

app.get('/login', function(req, res) {
    var state = generateRandomString(16);
    res.cookie(stateKey, state);

    // Application requests authorization
    var scope = 'user-read-private user-read-email user-top-read';
    res.redirect('https://accounts.spotify.com/authorize?' +
        querystring.stringify({
        response_type: 'code',
        client_id: client_id,
        scope: scope,
        redirect_uri: redirect_uri,
        state: state
    }));
});

// .../sendEmail?email=${}&subject=${}&msg=${}
app.get('/sendEmail', async (req, res) => {
    const email = req.query.email;
    const subject = req.query.subject;
    const msg = req.query.msg;

    // console.log([email, subject, msg]);

    const emailOptions = {
        from: email, // Sender address, example: '"Labopat" <pruebas.labopat@gmail.com>'
        to: 'flopezramirez@hotmail.com',
        subject: subject,
        text: msg
    }

    // sendEmailForm(email, subject, msg);
    try {
        sendEmail(emailOptions, res)
            .then(res => console.log("RES: ", res))
            .catch(err => console.log("ERROR: ", err));
    } catch (error) {
        res.json({
            ok: false,
            message: 'Something went wrong :('
        });
    }
});

app.get('/callback', function(req, res) {
    var code = req.query.code || null;
    var state = req.query.state || null;
    var storedState = req.cookies ? req.cookies[stateKey] : null;

    if (state === null || state !== storedState) {
        res.redirect('/#' +
        querystring.stringify({
            error: 'state_mismatch'
        }));
    } else {
        res.clearCookie(stateKey);
        var authOptions = {
            url: 'https://accounts.spotify.com/api/token',
            form: {
                code: code,
                redirect_uri: redirect_uri,
                grant_type: 'authorization_code'
            },
            headers: {
                'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64'))
            },
            json: true
        };

        request.post(authOptions, function(error, response, body) {
        if (!error && response.statusCode === 200) {

            var access_token = body.access_token;

            var options = {
                url: 'https://api.spotify.com/v1/me',
                headers: { 'Authorization': 'Bearer ' + access_token },
                json: true
            };

            // Use the access token to access the Spotify Web API
            request.get(options, function(error, response, body) {
                // console.log(body);
            });

            // Pass the token to the browser to make requests from there
            res.redirect('/#' +
            querystring.stringify({
                access_token: access_token
            }));
        } else {
            res.redirect('/#' +
            querystring.stringify({
                error: 'invalid_token'
            }));
        }
        });
    }
});

console.log('Listening on 8080');
app.listen(80);
