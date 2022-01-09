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
    return await data.json()
}
function killChildren(ele) {
    while(ele.firstChild) {
        ele.firstChild.remove()
    }
}
function sortChildren(ele, sortFunction) {
    console.log("ok")
    let eles = ele.childNodes
    let tmp = []
    for(let i in eles) {
        if(eles[i].nodeType == 1) {
            tmp.push(eles[i])
        }
    }
    killChildren(ele)
    tmp.sort(sortFunction)
    for(let x of tmp) {
        ele.appendChild(x)
    }
}
var sortingFunction = (a, b) => {
    console.log(a)
    console.log(b)
    return parseFloat(a.value)-parseFloat(b.value)    
} 
var stageDOM = (stages, items, penguinStats) => {
    let divs = document.querySelectorAll(".arknights-stages")
    for(let div of divs) {
        let stages_present = new Set(penguinStats.map(p => p.stageId))
        let stages_where_there_are_data = stages.filter(stage => stages_present.has(stage.id))

        let container = document.createElement("div")
        let stageInfo = document.createElement("div")
        let code = document.createElement("p")
        let probabilityList = document.createElement("ul")
        let select = document.createElement("select")

        select.onchange = () => {
            let val = select.value
            let stage = stages_where_there_are_data.find(e => e.id == val)
            let penguinData = penguinStats.filter(e => e.stageId == val)
            code.innerText = `${stage.code} ${stage.name} ${stage.sanity_cost} Sanity`
            killChildren(probabilityList)
            for(let x of penguinData) {
                let item = items.find(e => e.id == x.itemId)
                if(item) {
                    let li = document.createElement("li")
                    let dropRate = x.quantity/x.times
                    if(dropRate) {
                        let sanityCost = stage.sanity_cost/dropRate
                        li.value = sanityCost
                        li.innerText = `${item.name} ${dropRate.toFixed(2)*100}% SC/DROP [${sanityCost.toFixed(2)}]`
                        probabilityList.appendChild(li)
                    }
                }
            }
            sortChildren(probabilityList, sortingFunction)
        }
        for(let stage of stages_where_there_are_data) {
            let option = document.createElement("option")
            option.value = stage.id
            option.innerText = `${stage.code}`
            select.appendChild(option)
        }
        
        stageInfo.appendChild(code)
        stageInfo.appendChild(probabilityList)
        container.appendChild(select)
        container.appendChild(stageInfo)
        div.appendChild(container)
    }
}
var itemDOM = (items, stages, penguinStats) => {
    let divs = document.querySelectorAll(".arknights-items")
    for(let div of divs) {
        let items_present = new Set(penguinStats.map(e => e.itemId))
        let items_where_there_are_data = items.filter(e => items_present.has(e.id))
        let container = document.createElement("div")
        let itemInfo = document.createElement("div")
        let code = document.createElement("p")
        let probabilityList = document.createElement("ul")
        let select = document.createElement("select")
        
        select.onchange = () => {
            let val = select.value
            let item = items_where_there_are_data.find(e => e.id == val)
            let penguinData = penguinStats.filter(e => e.itemId == val)
            code.innerText = `${item.name}`
            killChildren(probabilityList)
            for(let x of penguinData) {
                let stage = stages.find(e => e.id == x.stageId)
                if(stage) {
                    let li = document.createElement("li")
                    let dropRate = x.quantity/x.times
                    if(dropRate) {
                        let sanityCost = stage.sanity_cost/dropRate
                        li.value = sanityCost
                        li.innerText = `${stage.code} ${stage.name} ${dropRate.toFixed(2)*100}% SC/DROP [${sanityCost.toFixed(2)}]`
                        probabilityList.appendChild(li)
                    }
                }
            }
            sortChildren(probabilityList, sortingFunction)
        }
        for(let item of items_where_there_are_data) {
            console.log("asd")
            let option = document.createElement("option")
            option.value = item.id
            option.innerText = `${item.name}`
            select.appendChild(option)
        }
        
        itemInfo.appendChild(code)
        itemInfo.appendChild(probabilityList)
        container.appendChild(select)
        container.appendChild(itemInfo)
        div.appendChild(container)
    }
}
var program = async () => {
    let stages = await fetchStages()
    let items = await fetchItems()
    let formulas = await fetchFormulas()

    let {matrix} = await fetchPenguinStats()
    stageDOM(stages, items, matrix)
    
    itemDOM(items, stages, matrix)
    
}

program()