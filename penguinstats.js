var url = "https://penguin-stats.io/PenguinStats/api/v2/result/matrix?server=US"

var fetchPenguinStats = async () => {
    let data = await fetch(url)
    return await data.json()
}

var parseData = async () => {
    let data = await fetchPenguinStats()
    if("matrix" in data) {
        console.log(data.matrix)
    }
}

parseData()