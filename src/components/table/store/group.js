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

export default deepList