const Mock = require('mockjs');

module.exports = (req, res) => {
  res.status(200).json({
    data: {
      token: '142857',
    },
    success: true,
  });
}