var url = "https://penguin-stats.io/PenguinStats/api/v2/result/matrix?show_closed_zones=true&server=US"

var program = async () => {

    var fetchStages = async() => {
        let data = await fetch("https://dss285.github.io/arknights/stages.json")
        return await data.json()
    }
    var fetchItems = async() => {
        let data = await fetch("https://dss285.github.io/arknights/items.json")
        return await data.json()
    }
    var fetchFormulas = async() => {
        let data = await fetch("https://dss285.github.io/arknights/formulas.json")
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
        return parseFloat(a.value)-parseFloat(b.value)    
    }

    var stages = await fetchStages()
    var items = await fetchItems()
    var formulas = await fetchFormulas()

    let {matrix} = await fetchPenguinStats()
    var penguinStats = matrix
    


    var sanityEfficiency = (stage) => {
        console.trace(penguinStats)
        let drops = penguinStats.filter(e => e.stageId == stage.id)
        let sanityValue = 0
        for(let x of drops) {
            let dropRate = (x.times != 0 ? x.quantity/x.times : 0)
            let bestItem = bestitemSanityCost(items.find(e => e.id == x.itemId))
            console.log(bestItem)
            if(dropRate != 0 && bestItem != 0) {
                console.log(dropRate)
                sanityValue += bestItem.value * dropRate
                console.log(bestItem.value / dropRate)
            }
        }
        return sanityValue/stage.sanity_cost
    }
    var bestitemSanityCost = (item) => {
        console.log(item)
        if(item) {
            let drops = penguinStats.filter(e => e.itemId == item.id)
            let formula = formulas.filter(e => e.item_id == item.id)
            let formula_sanity_cost = null
            if(formula !== null && formula !== undefined && formula.length > 0) {
                formula = formula[0]
                let formula_items = formula.costs.split(" ")
                formula_sanity_cost = 0
                for(let x of formula_items) {
                    console.log(x)
                    let splitted = x.split("|")
                    let item_id = splitted[0]
                    let item_amount = parseInt(splitted[1])
                    formula_sanity_cost += bestitemSanityCost({id:item_id}).value*item_amount
                }
            }
            let bestValue = {value : null, stage : null, workshop : null}
            for(let x of drops) {
                let dr = (x.times != 0 ? x.quantity/x.times : 0)
                if (dr != 0) {
                    if(bestValue.value == null) {
                        let stage = stages.find(e => e.id == x.stageId)
                        if (stage) {
                            bestValue.value = stage.sanity_cost/dr
                            bestValue.stage = stage
                        }
                    } else {
                        let stage = stages.find(e => e.id == x.stageId)
                        if (stage) {
                            let sanity_cost = stage.sanity_cost
                            
                            if(bestValue.value > sanity_cost/dr) {
                                bestValue.value = sanity_cost/dr
                                bestValue.stage = stage
                            }
                        }
    
                    }
                }     
            }
            console.log(formula_sanity_cost)
            console.log(bestValue)
            if(formula_sanity_cost != null && bestValue.value > formula_sanity_cost && formula_sanity_cost != 0) {
                bestValue.value = formula_sanity_cost
                bestValue.stage = null
                bestValue.workshop = true
            }
            return bestValue
        }
        return 0
    }
    
    var stageDOM = () => {
        let divs = document.querySelectorAll(".arknights-stages")
        for(let div of divs) {
            let stages_present = new Set(penguinStats.map(p => p.stageId))
            console.log(stages_present)
            let stages_where_there_are_data = stages.filter(stage => stages_present.has(stage.id))
    
            let container = document.createElement("div")
            let stageInfo = document.createElement("div")
            let code = document.createElement("h2")
            let probabilityList = document.createElement("ul")
            let select = document.createElement("select")
    
            select.onchange = () => {
                let val = select.value
                let stage = stages_where_there_are_data.find(e => e.id == val)
                let penguinData = penguinStats.filter(e => e.stageId == val)
                code.innerText = `${stage.code} ${stage.name} ${stage.sanity_cost} Sanity SC/EFFICIENCY[${sanityEfficiency(stage, items, stages, penguinStats).toFixed(2)}]`
                killChildren(probabilityList)
                for(let x of penguinData) {
                    let item = items.find(e => e.id == x.itemId)
                    if(item) {
                        let li = document.createElement("li")
                        let dropRate = x.quantity/x.times
                        if(dropRate) {
                            let sanityCost = stage.sanity_cost/dropRate
                            li.value = sanityCost
                            li.innerText = `${item.name}
                            ${dropRate.toFixed(2)*100}%
                            SC/DROP [${sanityCost.toFixed(2)}]
                            `
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
    var itemDOM = () => {
        let divs = document.querySelectorAll(".arknights-items")
        for(let div of divs) {
            let items_present = new Set(penguinStats.map(e => e.itemId))
            let items_where_there_are_data = items.filter(e => items_present.has(e.id))
            let container = document.createElement("div")
            let itemInfo = document.createElement("div")
            let code = document.createElement("h2")
            let probabilityList = document.createElement("ul")
            let select = document.createElement("select")
            
            select.onchange = () => {
                let val = select.value
                let item = items_where_there_are_data.find(e => e.id == val)
                let penguinData = penguinStats.filter(e => e.itemId == val)
                let bestItem = bestitemSanityCost(item)
                let best = ""
                if(bestItem.stage == null) {
                    best = "WORKSHOP"
                } else {
                    best = bestItem.stage.code
                }
                console.log(bestItem)
                
                code.innerText = `${item.name} ${bestItem.value.toFixed(2)}, ${best}`
                killChildren(probabilityList)
                for(let x of penguinData) {
                    
                    let stage = stages.find(e => e.id == x.stageId)
                    if(stage) {
                        let li = document.createElement("li")
                        let dropRate = x.quantity/x.times
                        if(dropRate) {
                            let sanityCost = stage.sanity_cost/dropRate
                            li.value = sanityCost
                            li.innerText = `${stage.code} ${stage.name}, ${stage.sanity_cost} Sanity
                            ${dropRate.toFixed(2)*100}%
                            SC/DROP [${sanityCost.toFixed(2)}]`
                            probabilityList.appendChild(li)
                        }
                    }
                }
                sortChildren(probabilityList, sortingFunction)
            }
            for(let item of items_where_there_are_data) {
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
    stageDOM()
    itemDOM()
}




program()