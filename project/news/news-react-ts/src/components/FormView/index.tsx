/*
 * @Descripttion:
 * @version:
 * @Author: OpenLcuk
 * @Date: 2021-11-17 15:13:26
 * @LastEditors: OpenLcuk
 * @LastEditTime: 2021-11-17 15:53:07
 */
import React from 'react';
import { Form, Input, Button, message } from "antd";

export const FormView = () => {
  return (
    <Form>
      {/* 用户名 */}
      <Form.Item
        label="Username"
        name="username"
        rules={[{ required: true, message: "Please input your username!" }]}
      >
        <Input />
      </Form.Item>
      {/* 密码 */}
      <Form.Item
        label="Password"
        name="password"
        rules={[{ required: true, message: "Please input your password!" }]}
      >
        <Input.Password />
      </Form.Item>
      {/* 登录 */}
      <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
        <Button type="primary" htmlType="submit">
          Submit
        </Button>
      </Form.Item>
    </Form>
  );
};
