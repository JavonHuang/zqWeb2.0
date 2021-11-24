const lodash = require('lodash')

const deepList = (list,keyList,mergeCells,columnsMap) => {
  let grouByList = lodash.groupBy(list,keyList[0])
  lodash.mapKeys(grouByList,(value,key)=>{
    if(value.length>1){
      mergeCells.push({
        row:value[0].rowIndex,
        rowspan:value[value.length-1].rowIndex,
        col:columnsMap[keyList[0]],
        colspan: 1
      })
      let newkeyList = keyList.splice(1,1)
      if(newkeyList.length>0){
        deepList(value,newkeyList,mergeCells,columnsMap)
      }
    }
  })
}

const deepList2 = (list,keyList,mergeCells,columnsMap,level) => {
  let grouByList = lodash.groupBy(list,keyList[level])
  level++
  lodash.mapKeys(grouByList,(value,key)=>{
    if(value.length>1){
      mergeCells.push({
        startRow:value[0].rowIndex,
        startCol:columnsMap[keyList[level-1]],
        endRow:value[value.length-1].rowIndex,
        endCol: columnsMap[keyList[level-1]],
      })
      if(level<keyList.length){
        deepList2(value,keyList,mergeCells,columnsMap,level)
      }
    }
  })
}
export {
  deepList2,
  deepList
}