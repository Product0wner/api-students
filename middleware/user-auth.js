'use strict';
const auth = require('basic-auth');
const bcrypt = require('bcrypt');
const { User } = require('../models');

// Middleware to authenticate the request using Basic Authentication.
exports.authenticateUser = async (req, res, next) => {
    // store the message to display
    let message; 

    // TODO
    // Parse the user's credentials from the Authorization header.
    const credentials = auth(req);

    if (credentials) {
        const user = await User.findOne({ where: {emailAddress: credentials.name} });
        if (user) {
            const authenticated = bcrypt.compareSync(credentials.pass, user.password);
            if (authenticated) { 
                // If the passwords match
                console.log(`Authentication successful for user with following email ${user.emailAddress}`);
                // Store the user on the Request object.
                req.currentUser = user.id;
            } else {
                message = `Authentication failure for following email ${user.emailAddress}`;
            }
        } else {
            message = `This user could not be found: ${credentials.name}`;
        }
    } else {
        message = 'Auth header not found';
    }
    if (message) {
        console.warn(message);
        res.status(401).json({ message: 'Access Denied' });
    } else {
        next();
    }
  }