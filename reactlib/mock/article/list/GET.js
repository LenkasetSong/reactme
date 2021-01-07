/*
 * @Author: your name
 * @Date: 2020-07-23 15:11:15
 * @LastEditTime: 2020-07-23 15:33:52
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \dcfe-framework\mock-api\article\list\GET.js
 */
const Mock = require('mockjs');

const List = [];
const count = 100;

const baseContent =
  '<p>I am testing data, I am testing data.</p><p><img src="https://wpimg.wallstcn.com/4c69009c-0fd4-4153-b112-6cb53d1cf943"></p>';
const imageuri =
  'https://wpimg.wallstcn.com/e4558086-631c-425c-9430-56ffb46e70b3';

for (let i = 0; i < count; i += 1) {
  List.push(
    Mock.mock({
      id: '@increment',
      timestamp: +Mock.Random.date('T'),
      author: '@first',
      reviewer: '@first',
      title: '@title(5, 10)',
      content_short: 'mock data',
      content: baseContent,
      forecast: '@float(0, 100, 2, 2)',
      importance: '@integer(1, 3)',
      'type|1': ['CN', 'US', 'JP', 'EU'],
      'status|1': ['published', 'draft', 'deleted'],
      display_time: '@datetime',
      comment_disabled: true,
      pageviews: '@integer(300, 5000)',
      imageuri,
      platforms: ['a-platform'],
    })
  );
}

module.exports = (req, res) =>
  res.status(200).json({
    data: {
      total: List.length,
      items: List,
    },
    success: true,
  });
