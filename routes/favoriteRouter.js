const express = require('express');
const cors = require('./cors');
const authenticate = require('../authenticate');
const Favorite = require('../models/favorite');

const favoriteRouter = express.Router();

favoriteRouter.route('/')
    .options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
    .get(cors.cors, authenticate.verifyUser, (req, res, next) => {
        Favorite.find({ user: req.user._id })
            .populate('User')
            .populate('Campsites')
            .then(favorite => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(favorite);
            })
            .catch(err => next(err));
    })


    .post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        Favorite.findOne({ user: req.user._id })
            .then(favorite => {
                if (favorite) {
                    res.statusCode = 200;
                    res.setHeader('Context-Type', 'application/json');
                    res.json(favorite)
                    const favArray = favorite.campsites;
                    req.body.forEach((favorite) => {
                        if (!favArray.includes(favorite)) {
                            favArray.push(favorite);
                            console.log(`${favorite} was added to the list of favorites`);
                        }
                    })
                } else {
                    Favorite.create({ user: req.user._id, campsites: req.body })
                        .then(favorite => {
                            console.log("favorite Created", favorite);
                            res.statusCode = 200;
                            res.setHeader("Content-Type", "application/json");
                            res.json(favorite);
                        })
                        .catch(err => next(err));
                }
            })
            .catch(err => next(err));
    })


    .put(cors.corsWithOptions, authenticate.verifyUser, (req, res) => {
        res.statusCode = 403;
        res.setHeader('PUT operation is not supported on /favorite')
    })


    .delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        Favorite.findOneAndDelete({ user: req.user._id })
            .then(favorite => {
                res.statusCode = 200;
                if (favorite) {
                    res.setHeader('Content-Type', 'application/json');
                    res.json(favorite);
                }
                if (!favorite) {
                    res.setHeader('Content-Type', 'text/plain');
                    res.end('You do not have any favorites to delete')
                }
            })
            .catch(err => next(err));
    })

//---------------------------------------------------------------------------------

favoriteRouter.route('/:campsiteId')
    .options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
    .get(cors.cors, authenticate.verifyUser, (req, res) => {
        res.statusCode = 403;
        res.setHeader('Content-Type', 'text/plain');
        res.end(`GET operation is not supported on /favorites/${req.params.campsiteId}`);
    })


    .post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        Favorite.findOne({ user: req.user._id })
            .then(favorites => {
                favorites.campsites.forEach(favorite => {
                    if (favorite !== req.params.campsiteId) {
                        favorites.campsites.push(req.params.campsiteId)
                    }
                })
            })
    })


    .put(cors.corsWithOptions, authenticate.verifyUser, (req, res) => {
        res.statusCode = 403;
        res.setHeader('Content-Type', 'text/plain');
        res.end(`PUT operation is not supported on /favorites/${req.params.campsiteId}`);
    })


    .delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        Favorite.findOne({ user: req.user._id })
            .then(favorite => {
                if (favorite) {
                    const index = favorite.campsites.indexOf(req.params.campsiteId);
                    favorite.campsites.splice(index, 0)
                    favorite.save()
                        .then(favorite => {
                            console.log(`Deleted campsite: ${favorite}`);
                            res.statusCode = 200;
                            res.setHeader('Content-Type', 'application/json');
                            res.json(favorite);
                        })
                        .catch(err => next(err))
                }
                if (!favorite) {
                    res.setHeader('Content-Type', 'text/plain');
                    res.end('There are no favorites to delete');
                }
            })
            .catch(err => next(err))
    })


module.exports = favoriteRouter;