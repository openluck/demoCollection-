/*
 * @Descripttion: 
 * @version: 
 * @Author: OpenLcuk
 * @Date: 2021-11-02 11:18:23
 * @LastEditors: OpenLcuk
 * @LastEditTime: 2021-11-02 11:33:01
 */
'use strict';

const Controller = require('egg').Controller;

class HomeController extends Controller {
  async index() {
    const { ctx } = this;
    const { id } = ctx.query;
    ctx.body = {
      name: 'hi egg',
      id: id
    };
  }

  async user() {
    const {ctx} = this;
    const {name,content} = await ctx.service.home.user()
    ctx,bodu = {
      name,
      content
    }
  }
}

module.exports = HomeController;
