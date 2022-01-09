var url = "https://penguin-stats.io/PenguinStats/api/v2/result/matrix?server=US"
var fetchStages = async() => {
    let data = await fetch("https://dss285.github.io/arknights/arknights_stages.json")
    return await data.json()
}
var fetchItems = async() => {
    let data = await fetch("https://dss285.github.io/arknights/arknights_items.json")
    return await data.json()
}
var fetchFormulas = async() => {
    let data = await fetch("https://dss285.github.io/arknights/arknights_formulas.json")
    return await data.json()
}
var fetchPenguinStats = async () => {
    let data = await fetch(url)
    return await data.json()["matrix"]
}
var stageDOM = (stages, penguin) => {
    let stages_present = new Set(penguin.map(p => p.stageId))
    let stages_where_there_are_data = stages.filter(stage => stages_present.has(stage.id))
    console.log(stages_where_there_are_data)
}

var program = async () => {
    let stages = await fetchStages()
    let items = await fetchItems()
    let formulas = await fetchFormulas()

    let penguinStats = await fetchPenguinStats()
    stageDOM(stages, penguin)
    
}

program()