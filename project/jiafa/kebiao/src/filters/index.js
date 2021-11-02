/*
 * @Descripttion: 
 * @version: 
 * @Author: OpenLcuk
 * @Date: 2021-10-14 10:46:41
 * @LastEditors: OpenLcuk
 * @LastEditTime: 2021-10-14 11:24:40
 */
//index.js
import { timestampToTime } from "@/Utils/util.js";
export function fliterTimestamp(timestamp, type) {
    console.log("timestamp,type",timestamp,type)
    if (!timestamp) return "--"
    return timestampToTime(timestamp, type)
}
