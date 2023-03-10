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
                    const favArray = favorite.campsites;
                    req.body.forEach((favorite) => {
                        if (!favArray.includes(favorite)) {
                            favArray.push(favorite);
                            console.log(`${favorite} was added to the list of favorites`);
                            favorite.save()
                                .then(favorite => {
                                    res.statusCode = 200;
                                    res.setHeader('Context-Type', 'application/json');
                                    res.json(favorite)
                                })
                                .catch(err => next(err));
                        }
                    })
                } else {
                    Favorite.create({ user: req.user._id, campsites: req.body })
                        .then(favorite => {
                            console.log("Favorite created", favorite);
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
        res.setHeader('Content-Type', 'text/json');
        res.end('PUT operation is not supported on /favorite')
    })

    .delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        Favorite.findOneAndDelete({ user: req.user._id })
            .then(favorite => {
                if (favorite) {
                    res.statusCode = 200;
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
        res.end(`GET operation is not supported on /favorites/:campsiteId`);
    })

    .post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        Favorite.findOne({ user: req.user._id })
            .then(favorite => {

                console.log('-------LOG:', favorite);

                if (favorite) {
                    if (!favorite.campsites.includes(req.params.campsiteId)) {
                        res.setHeader('Content-Type', 'application/json');
                        res.json(favorite);
                        favorite.campsites.push(req.params.campsiteId)
                    } else {
                        res.statusCode = 200;
                        res.setHeader('Content-Type', 'application/json');
                        res.end('That campsite is already a favorite!');
                    }
                } else {
                    Favorite.create({ user: req.user._id, campsites: req.params.campsiteId })
                        .then(favorite => {
                            console.log("Favorite created", favorite);
                            res.statusCode = 200;
                            res.setHeader('Content-Type', 'application/json');
                            res.json(favorite)
                        })
                        .catch(err => next(err));
                }
            })
            .catch(err => next(err));
    })

    .put(cors.corsWithOptions, authenticate.verifyUser, (req, res) => {
        res.statusCode = 403;
        res.setHeader('Content-Type', 'text/plain');
        res.end(`PUT operation is not supported on /favorites/:campsiteId`);
    })

    .delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        Favorite.findOne({ user: req.user._id })
            .then(favorite => {
                if (favorite._id === (req.params.campsiteId)) {
                    favorite._id.filter(removeId = (item) => {
                        return item !== req.params.campsiteId
                    })
                    console.log('-------LOG:', favorite._id);
                    favorite.save()
                        .then(favorite => {
                            res.statusCode = 200;
                            res.setHeader('Content-Type', 'application/json');
                            res.json(favorite);
                        })
                        .catch(err => next(err));
                } else {
                    err = new Error(`Favorite ${req.params.campsiteId} not found`);
                    err.status = 404;
                    return next(err);
                }
            })
    })


module.exports = favoriteRouter;