const Comment = require('../models/Comment');

exports.createComment = async (req, res) => {
  const { post_id, content } = req.body;
  try {
    const newComment = new Comment({
      post: post_id,
      content,
      author: req.user.id
    });
    const comment = await newComment.save();
    res.json(comment);
  } catch (err) {
    res.status(500).send('Server error');
  }
};

exports.getCommentsByPostId = async (req, res) => {
  try {
    const comments = await Comment.find({ post: req.query.post_id }).populate('author', 'username');
    res.json(comments);
  } catch (err) {
    res.status(500).send('Server error');
  }
};

exports.getCommentById = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id).populate('author', 'username');
    if (!comment) return res.status(404).json({ msg: 'Comment not found' });
    res.json(comment);
  } catch (err) {
    res.status(500).send('Server error');
  }
};

exports.updateComment = async (req, res) => {
  const { content } = req.body;
  try {
    let comment = await Comment.findById(req.params.id);
    if (!comment) return res.status(404).json({ msg: 'Comment not found' });

    if (comment.author.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized' });
    }

    comment.content = content || comment.content;
    await comment.save();
    res.json(comment);
  } catch (err) {
    res.status(500).send('Server error');
  }
};

exports.deleteComment = async (req, res) => {
  try {
    let comment = await Comment.findById(req.params.id);
    if (!comment) return res.status(404).json({ msg: 'Comment not found' });

    if (comment.author.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized' });
    }

    await comment.deleteOne();
    res.json({ msg: 'Comment removed' });
  } catch (err) {
    res.status(500).send('Server error');
  }
};
