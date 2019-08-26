const Post = require('../models/post.model');

exports.getPosts = (req, res) => {
  Post.find({})
    .then((documents) => {
      res.status(200).json(
        {
          posts: documents
        });
    }).catch(err => console.err(err));
}

exports.getPostsById = (req, res) => {
  Post.findById(req.params.id)
    .then((post) => {
      if (post) {
        res.status(200).json(post);
      } else {
        res.status(404).json({ msg: 'Post not found' });
      }
    });
}

exports.updatePosts = (req, res) => {
  let imagePath = req.body.imagePath;
  if (req.file) {
    const url = req.protocol + '://' + req.get('host');
    imagePath = url + '/images/' + req.file.filename;
  }
  const post = new Post({
    _id: req.body.id,
    title: req.body.title,
    content: req.body.content,
    imagePath: imagePath
  });
  console.log(post);
  Post.updateOne({ _id: req.params.id }, post)
    .then(result => {
      res.status(200).json({ msg: 'update succesfull!' });
    })
    .catch(err => console.error(err));
}

exports.deletePosts = (req, res) => {
  Post.deleteOne({ _id: req.params.id }).then((result) => {
    res.status(200).json({ message: 'Post Deleted', res: result });
  }).catch(err => console.err(err));
}

exports.savePost = (req, res) => {
  const url = req.protocol + '://' + req.get("host");
  const post = new Post({
    title: req.body.title,
    content: req.body.content,
    imagePath: url + '/images/' + req.file.filename
  });
  post.save().then((createdPost) => {
    res.status(201).json(
      {
        msg: 'posts added succesfully!',
        post: {
          ...createdPost,
          id: createdPost._id,
        }
      });
  }).catch(err => console.err(err));;
}

function fileFilter(req, file, cb) {
  if (file.mimetype == 'image/png'
    || file.mimetype == 'image/jpg'
    || file.mimetype == 'image/jpeg') {
    cb(null, true)
  } else {
    cb(null, false)
  }
}
