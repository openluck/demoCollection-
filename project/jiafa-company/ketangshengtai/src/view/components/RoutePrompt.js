import { Prompt } from "react-router-dom";

export default function RouterPrompt({ message, promptBoolean }) {
  return <Prompt message={
    location =>
      !promptBoolean
        ? true
        : message || '离开页面将不会保存当前页面内容，确定离开?'
  }
  />
}