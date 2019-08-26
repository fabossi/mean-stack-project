const express = require('express');
const postController = require('../controller/post.controller');
const multer = require('multer');
const router = express.Router();
const MIME_TYPE_MAP =
{
  'image/png': 'png',
  'image/jpeg': 'jpg',
  'image/jpg': 'jpg'
}
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const isValid = MIME_TYPE_MAP[file.mimetype];
    let error = new Error('Mime type is invalid');
    if (isValid) {
      error = null;
    }
    cb(error, 'backend/images');
  },
  filename: (req, file, cb) => {
    const name = file.originalname.toLowerCase().split(' ').join('-');
    const ext = MIME_TYPE_MAP[file.mimetype];
    cb(null, name + '-' + Date.now() + '.' + ext);
  }
})

router.post('/posts', multer({ storage: storage }).single('image'), postController.savePost);
router.get('/posts', postController.getPosts);
router.get('/posts/:id', postController.getPostsById);
router.put('/posts/:id', multer({ storage: storage }).single('image'), postController.updatePosts);
router.delete('/posts/:id', postController.deletePosts);

module.exports = router;
