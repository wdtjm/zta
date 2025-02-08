function todayTime() {
    const today = new Date()
    const year = today.getFullYear()
    const month = today.getMonth() + 1
    const day = today.getDate()
    const dateStr = year + "-" + month + "-" + day
    return dateStr
}

function getNowTime() {
    const now = new Date()
    const year = now.getFullYear()
    const month = now.getMonth() + 1
    const day = now.getDate()
    const hour = now.getHours()
    const minute = now.getMinutes()
    const second = now.getSeconds()
    const timeStr = year + "-" + month + "-" + day + " " + hour + ":" + minute + ":" + second
    return timeStr
}

export { todayTime, getNowTime }

