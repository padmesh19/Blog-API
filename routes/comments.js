const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const {
  createComment,
  getCommentsByPostId,
  getCommentById,
  updateComment,
  deleteComment
} = require('../controllers/commentController');

router.post('/', auth, createComment);
router.get('/', getCommentsByPostId);
router.get('/:id', getCommentById);
router.put('/:id', auth, updateComment);
router.delete('/:id', auth, deleteComment);

module.exports = router;
