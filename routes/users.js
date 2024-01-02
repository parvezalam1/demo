let routes = require('express').Router();
const fs = require('fs');
let users = require('../models/users');
let post = require('../models/post');
let bcrypted = require('bcrypt');

//update
let matchPicture = "http://localhost:5000/userProfile/"
routes.put('/:id', async (req, res) => {
  let User = await users.findById(req.params.id)
  if (req.body.password) {
    let salt = await bcrypted.genSalt(10)
    req.body.password = await bcrypted.hash(req.body.password, salt)
  }
  let path = `./uploaded_images/userProfile/${User.profilePic}`;
  if (User) {
    if (User.profilePic != "") {
      if (fs.existsSync(path)) {

        await fs.unlinkSync('./uploaded_images/userProfile/' + User.profilePic);

      }
    }
    try {
      await post.updateMany({ username: req.body.exitUser }, { $set: { username: req.body.username } })
      const updateUser = await users.findByIdAndUpdate(req.params.id, {
        $set: req.body
      })
      res.status(200).json(updateUser)
    } catch (err) {
      res.status(200).json(err)
    }
  } else {
    res.status.json("you can only update your account");
  }
});

//delete

routes.delete('/:delid/:username', async (req, res) => {
  if (await users.findById(req.params.delid)) {
    try {
      let User = await users.findById(req.params.delid);
      let path = `./uploaded_images/userProfile/${User.profilePic}`;

      try {
        if (User.profilePic != "") {
          if (fs.existsSync(path)) {

            await fs.unlinkSync('./uploaded_images/userProfile/' + User.profilePic);

          }
        }
        let foundPost = await post.find({username:req.params.username});
        {
           foundPost.map(filterOne => {
            let path2 = `./uploaded_images/${filterOne.photo}`;
            if (fs.existsSync(path2)) {
              fs.unlinkSync(`./uploaded_images/${filterOne.photo}`)
            }
          })
        }
        await post.deleteMany({username:req.params.username})
        await User.deleteOne();
        res.status(200).json('User account has been deleted...');

      } catch (err) {
        res.status(500).json(err);
      }
    } catch (err) {
      res.status(404).json('user id could not found');
    }
  }
  else {
    res.status(400).json('you can only delete your account...');
  }

})


// Get User

routes.get('/get/:id', async (req, res) => {
  try {
    const User = await users.findById(req.params.id);
    const { password, ...others } = User._doc;
    res.status(200).json(others);
  } catch (err) {
    res.status(404).json('User Not Found');
  }
})


// Get All User

routes.get('/', async (req, res) => {
  users.find({}, (err, data) => {
    if (err) res.status(404).json('Not Users Found');
    const { password, ...others } = data;
    res.status(200).json(others);
  })
})

module.exports = routes;