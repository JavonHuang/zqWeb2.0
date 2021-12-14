const lodash = require('lodash')

const generateGroup = (list,keyList,mergeCells,columnsMap,level) => {
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
        generateGroup(value,keyList,mergeCells,columnsMap,level)
      }
    }
  })
}

const generateUUID = (prefix = null)=> {
  let d = new Date().getTime()
  const pre = !prefix ? 'xxxx' : prefix + '_'
  const uuid = `${pre}xx4xxyxx`.replace(/[xy]/g, (str) => {
    const r = (d + Math.random() * 8) % 16 | 0
    d = Math.floor(d/16)
    return (str == 'x' ? r : (r&0x3|0x8)).toString(16)
  })

  return uuid
}
export {
  generateGroup,
  generateUUID
}