import React from "react"
import SVG from "../../public/public-component-svg"

export default function LatePersonCard({
    name, exactClass, dorm, sex
}) {
    return <div className="ll-latePersonCard" key={Math.random()}>
        <div className="ll-sexPicture">
            <div>
                <SVG
                    type={sex == 1 ? "nantouxiang" : "nv"}
                    title={sex == 1 ? "男" : "女"}
                    width={50}
                    height={50}
                />
            </div>
        </div>
        <div className="ll-info">
            <div className="ll-bigFont">{name}</div>
            <div className="ll-smallFont">{exactClass}</div>
            <div className="ll-smallFont">{dorm}</div>
        </div>
    </div>
}