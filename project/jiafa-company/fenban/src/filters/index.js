//index.js
import { timestampToTime } from "@/Utils/util.js";
export function fliterTimestamp(timestamp, type) {
    // console.log("timestamp,type",timestamp,type)
    if (!timestamp) return "--"
    return timestampToTime(timestamp, type)
}
