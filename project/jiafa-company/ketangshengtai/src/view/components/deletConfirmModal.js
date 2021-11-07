import React from "react"
import Modal from "antd/lib/modal/Modal"
import { Button } from "antd"

export default function DelectConfirmModal(props) {
    return <Modal
        width={400}
        visible={props.visible}
        onCancel={props.onCancel}
        title="操作提示"
        footer={null}
    >
        <div style={{ display: "flex", justifyContent: "center", fontSize: 16, marginBottom: 20 }}>
            <span>{props.text}</span>
        </div>
        <div className="ll-modalBTNCTN">
            <Button
                type="primary"
                onClick={props.onOk}
                style={{ backgroundColor: "#30bf99", borderColor: "#30bf99" }}
            >确定</Button>
            <Button onClick={props.onCancel}>取消</Button>
        </div>
    </Modal>
}  