
const express = require('express')
const route = express.Router()
const multer = require('multer')
const path = require('path');
const { updateAvaurl, compareCurrentPassword, updatePassword } = require('../controller/userController');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(process.env.BASE_DIR, process.env.UPLOAD_AVATAR_DIR))
    },
    filename: function (req, file, cb) {
            cb(null, Date.now() + '-' + file.originalname)
    }
});

var upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
      if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg") {
        cb(null, true);
      } else {
        cb(null, false);
        return cb(new Error('Only .png, .jpg and .jpeg format allowed!'));
      }
    }
  }).single('avatar');

route.get('/', (req, res) => {
    res.render('profile', {fullname: req.user.fullname, isAdmin: req.user.isAdmin, avaurl: req.user.avaurl, showContest: 0})
})

route.post('/change-ava', (req, res) => {
    upload(req, res, (err) => {
        if(err) {
            req.flash('error', err.message)
            res.redirect('/profile')
        } else {
            updateAvaurl(req.file.filename, req.user._id)
                .then(() => {
                    req.flash('info', 'Change avatar successfully')
                    req.user.avaurl = req.file.filename
                    res.redirect('/profile')
                })
                .catch((err) => {
                    req.flash('error', "Some error has occured")
                    res.redirect('/profile')
                })
        }
    })
    
})

route.post('/change-password', async (req, res) => {
    let {oldpassword, newpassword, newpasswordconfirm} = req.body
    if(newpassword == '') {
        req.flash('error', 'New password cannot be empty')
        res.redirect('/profile')
        return
    }
    if(newpassword != newpasswordconfirm) {
        req.flash('error', 'Confirm password not correct')
        res.redirect('/profile')
        return
    }
    let t = await compareCurrentPassword(req.user._id, oldpassword)
    if(!t) {
        req.flash('error', 'Old password not correct')
        res.redirect('/profile')
        return
    }

    updatePassword(req.user._id, newpassword)
        .then(() => {
            req.flash('info', 'Update password successfully')
            res.redirect('/profile')
        })
        .catch((err) => {
            req.flash('error', 'Update password failed')
            res.redirect('/profile')
        })
})

module.exports = route

