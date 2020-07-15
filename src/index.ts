import fs from 'fs'
import https from 'https'
import express from 'express'
import session from 'express-session'
import passport from 'passport'
import { Strategy, Profile, VerifiedCallback } from 'passport-saml'
import bodyParser from 'body-parser'

//Certificate configuration
const key = fs.readFileSync(__dirname + '/server.key')
const cert = fs.readFileSync(__dirname + '/server.cert')

//Passport.js configuration
passport.serializeUser((user, done) => {
    done(null, user)
})

passport.deserializeUser((user, done) => {
    done(null, user)
})

passport.use(new Strategy({
        path: '[SET HERE THE CALLBACK FOR THE SAML RESPONSE, FOR EXAMPLE: /callback]',
        entryPoint: '[SET HERE THE SAML LOGIN URL]',
        issuer: '[SET HERE THE APPLICATION IDENTIFIER]'
    },
    (profile: Profile, done: VerifiedCallback) => done(null, {
        id: profile.uid,
        email: profile.email,
        displayName: profile.cn,
        firstName: profile.givenName,
        lastName: profile.sn
    })
))

//Epress.js configuration
const app = express()
const port = 9090

app.use(session(
    {
        resave: true,
        saveUninitialized: true,
        secret: 'The answer is 42'
    }
))
app.use(passport.initialize())
app.use(passport.session())

app.get('/healthcheck', (req, res) => res.sendStatus(200))

app.get('/', (req, res) => {
    if (req.isAuthenticated()) {
        res.sendFile('loggedpage.html', {root: __dirname })
    }
    else {
        res.sendFile('page.html', {root: __dirname })
    }
})
app.get('/free', (req, res) => res.sendFile('free.html', {root: __dirname }))
app.get('/protected', (req, res) => {
    if(req.isAuthenticated()) {
        res.sendFile('protected.html', {root: __dirname })
    }
    else {
        res.redirect('/')
    }
})

app.get('/login',
    passport.authenticate('saml', { failureRedirect: '/break1', successRedirect: '/success' })
)
app.get('/logout', (req, res) => {
    req.logout()
    res.redirect('/')
})

app.post('/callback',
    bodyParser.urlencoded({ extended: false }),
    passport.authenticate('saml', { failureRedirect: '/break2' }),
    (req, res) => {
        res.redirect('/');
    }
)

//Web server configuration
const server = https.createServer({ key: key, cert: cert }, app)

server.listen(port, () => { console.log(`Listening on port ${port}`)})
