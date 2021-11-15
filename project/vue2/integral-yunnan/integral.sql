/*
Navicat MySQL Data Transfer

Source Server         : test
Source Server Version : 80021
Source Host           : localhost:3306
Source Database       : integral

Target Server Type    : MYSQL
Target Server Version : 80021
File Encoding         : 65001

Date: 2021-05-17 17:11:47
*/

SET FOREIGN_KEY_CHECKS=0;

-- ----------------------------
-- Table structure for adminuser
-- ----------------------------
DROP TABLE IF EXISTS `adminuser`;
CREATE TABLE `adminuser` (
  `id` int NOT NULL AUTO_INCREMENT,
  `adusername` varchar(30) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '用户名',
  `aduserpwd` varchar(30) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '用户密码',
  `adnickname` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '用户昵称',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ----------------------------
-- Records of adminuser
-- ----------------------------
INSERT INTO `adminuser` VALUES ('1', 'admin', '123', 'aa');
INSERT INTO `adminuser` VALUES ('2', '企业2', '123', '十三哥');

-- ----------------------------
-- Table structure for goods
-- ----------------------------
DROP TABLE IF EXISTS `goods`;
CREATE TABLE `goods` (
  `id` int NOT NULL,
  `goodsname` varchar(255) DEFAULT NULL,
  `goodsimg` varchar(255) DEFAULT NULL,
  `pointe` int DEFAULT NULL,
  `money` int DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ----------------------------
-- Records of goods
-- ----------------------------
INSERT INTO `goods` VALUES ('1', '精致小碟子', 'http://pwebsoft.com/images/sp1.png', '20', '10');
INSERT INTO `goods` VALUES ('2', '挂具', 'http://pwebsoft.com/images/sp2.png', '30', '40');
INSERT INTO `goods` VALUES ('0', '厨房用品', 'http://pwebsoft.com/images/sp3.png', '25', '32');
INSERT INTO `goods` VALUES ('4', '洗碗毛巾', 'http://pwebsoft.com/images/sp4.png', '11', '24');
INSERT INTO `goods` VALUES ('5', '餐具挂具', 'http://pwebsoft.com/images/sp5.png', '34', '12');
INSERT INTO `goods` VALUES ('6', '厨房挂具', 'http://pwebsoft.com/images/sp6.png', '11', '32');
INSERT INTO `goods` VALUES ('7', '节能学习灯', 'http://pwebsoft.com/images/sp7.png', '45', '65');
INSERT INTO `goods` VALUES ('8', '加湿器', 'http://pwebsoft.com/images/sp8.png', '67', '76');
INSERT INTO `goods` VALUES ('9', '小风扇', 'http://pwebsoft.com/images/sp9.png', '63', '76');

-- ----------------------------
-- Table structure for hotnews
-- ----------------------------
DROP TABLE IF EXISTS `hotnews`;
CREATE TABLE `hotnews` (
  `id` int NOT NULL,
  `info` varchar(255) DEFAULT NULL,
  `time` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ----------------------------
-- Records of hotnews
-- ----------------------------
INSERT INTO `hotnews` VALUES ('1', '时代楷模陈俊武：打破国外技术垄断 专注炼油工业70载', '2020-10-01');
INSERT INTO `hotnews` VALUES ('2', '翟光明：永不停歇的找油人', '2020-10-02');
INSERT INTO `hotnews` VALUES ('3', '山东数十家地炼整合进入倒计时：中小炼化企业已行至分水岭', '2020-11-04');
INSERT INTO `hotnews` VALUES ('4', '中国石油集团：越来越多石油公司利用区块链进行......', '2021-02-04');
INSERT INTO `hotnews` VALUES ('5', '各地油价陆续重回“7时代”！更坏的消息是……', '2021-03-07');
INSERT INTO `hotnews` VALUES ('6', '昨晚油价上涨，快看各地油价上调多少', '2021-02-01');
INSERT INTO `hotnews` VALUES ('7', '今日油价|全国各地加油站92，95号汽油~柴油最新价格', '2021-03-09');

-- ----------------------------
-- Table structure for news
-- ----------------------------
DROP TABLE IF EXISTS `news`;
CREATE TABLE `news` (
  `id` int NOT NULL,
  `title` varchar(255) DEFAULT NULL,
  `time` varchar(255) DEFAULT NULL,
  `info` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ----------------------------
-- Records of news
-- ----------------------------
INSERT INTO `news` VALUES ('1', '头条', '2021-03-04', '今日凌晨油价下跌，全国各地最新油价出炉');
INSERT INTO `news` VALUES ('2', '头条', '2021-03-05', '本周地炼石油焦价格小幅下跌');
INSERT INTO `news` VALUES ('3', '头条', '2021-04-05', '岱山县积极做好绿色石化基地随迁子女入读工作');
INSERT INTO `news` VALUES ('4', '头条', '2021-05-01', '国际油价下滑 国内成品油涨幅收窄将迎小幅上调');
INSERT INTO `news` VALUES ('5', '头条', '2021-05-01', '中国石化广东炼化一体化项目特殊阀门招标公告');
INSERT INTO `news` VALUES ('6', '头条', '2021-01-04', '锦西石化分公司北蒸馏装置管道材质升级基础设计 招标公告');
INSERT INTO `news` VALUES ('7', '头条 ', '2021-01-07', '通惠保理领航华南商业保理市场');

-- ----------------------------
-- Table structure for publish
-- ----------------------------
DROP TABLE IF EXISTS `publish`;
CREATE TABLE `publish` (
  `id` int NOT NULL,
  `orgPointes` int DEFAULT NULL,
  `remainPointes` int DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ----------------------------
-- Records of publish
-- ----------------------------
INSERT INTO `publish` VALUES ('1', '6000', '5766');

-- ----------------------------
-- Table structure for userinfo
-- ----------------------------
DROP TABLE IF EXISTS `userinfo`;
CREATE TABLE `userinfo` (
  `id` int NOT NULL,
  `username` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `address` varchar(255) DEFAULT NULL,
  `birthday` varchar(255) DEFAULT NULL,
  `carband` varchar(255) DEFAULT NULL,
  `vipgrade` varchar(255) DEFAULT NULL,
  `userbalance` varchar(255) DEFAULT NULL,
  `Intbalance` varchar(255) DEFAULT NULL,
  `age` int DEFAULT NULL,
  `getpointes` int DEFAULT NULL,
  `outpointes` int DEFAULT NULL,
  `sendpointes` int DEFAULT NULL,
  `oilpointes` int DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ----------------------------
-- Records of userinfo
-- ----------------------------
INSERT INTO `userinfo` VALUES ('1', 'vip1', '北京', '1996-10-05', '本田', '一级', '1000', '1000', '32', '1300', '3500', '6700', '4300');
INSERT INTO `userinfo` VALUES ('2', 'admin', '上海', '1997-10-11', '本田', '二级', '1000', '1000', '28', '2500', '4500', '2300', '8700');
INSERT INTO `userinfo` VALUES ('3', null, null, null, null, null, null, null, null, null, null, null, null);

-- ----------------------------
-- Table structure for users
-- ----------------------------
DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(30) NOT NULL COMMENT '用户名',
  `userpwd` varchar(30) NOT NULL COMMENT '用户密码',
  `nickname` varchar(50) NOT NULL COMMENT '用户昵称',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ----------------------------
-- Records of users
-- ----------------------------
INSERT INTO `users` VALUES ('14', 'vip1', '123', 'aa');
INSERT INTO `users` VALUES ('15', 'cat', '123', '十三哥');
INSERT INTO `users` VALUES ('16', 'vip2', '123', '');
