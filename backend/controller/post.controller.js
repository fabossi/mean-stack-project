const Post = require('../models/post.model');

exports.savePost = (req, res) => {
  const url = req.protocol + '://' + req.get("host");
  const post = new Post({
    title: req.body.title,
    content: req.body.content,
    imagePath: url + '/images/' + req.file.filename,
    creator: req.userData.userId
  });
  post.save().then((createdPost) => {
    res.status(201).json(
      {
        message: 'posts added succesfully!',
        post: {
          ...createdPost,
          id: createdPost._id,
        }
      });
  }).catch(err => {
    console.err(err); res.status(500)
      .json(
        {
          message: 'Creating a post failed, try again later!'
        })
  });;
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
    imagePath: imagePath,
    creator: req.userData.userId
  });
  Post.updateOne({ _id: req.params.id, creator: req.userData.userId }, post)
    .then(result => {
      if (result.n > 0) {
        res.status(200).json({ message: 'update succesfull!' });
      } else {
        res.status(401).json({ message: 'Update Unauthorized!' });
      }
    })
    .catch(err => { console.error(err); res.status(401).json({ error: 'Update failed! try again.' }) });
}

exports.getPosts = (req, res) => {
  const pageSize = +req.query.pageSize;
  const currentPage = +req.query.page;
  const postQuery = Post.find();
  let fetchedPosts;
  if (pageSize && currentPage) {
    postQuery
      .skip(pageSize * (currentPage - 1))
      .limit(pageSize);
  }
  postQuery.then((documents) => {
    fetchedPosts = documents;
    return Post.countDocuments();
  }).then((count) => {
    res.status(200).json(
      {
        posts: fetchedPosts,
        maxPosts: count
      });
  }).catch(error => {
    res.status(500).json({ message: 'Fetching posts failed, try again!' });
  })
}

exports.getPostsById = (req, res) => {
  Post.findById(req.params.id)
    .then((post) => {
      if (post) {
        res.status(200).json(post);
      } else {
        res.status(404).json({ error: 'Post not found' });
      }
    }).catch(error => {
      res.status(500).json({ message: 'Failed to fetch your posts, try again!' });
    });
}

exports.deletePosts = (req, res) => {
  Post.deleteOne({ _id: req.params.id, creator: req.userData.userId })
    .then((result) => {
      if (result.n > 0) {
        res.status(200).json({ message: 'Post Deleted', res: result });
      } else {
        res.status(401).json({ error: 'Unauthorized!' });
      }
    }).catch(err =>
      res.status(500)
        .json(
          { message: 'Failed to delete this post, try again!' }
        ));
}

