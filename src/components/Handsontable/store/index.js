import Watcher from './watcher';

Watcher.prototype.mutations = {
  setData(states, data) {
    states._data = data
  },
  insertColumn(states, column, columnIndex) {
    let columnsMap = {}
    let list = [...states.columns]
    list.splice(columnIndex, 0, column)
    list.forEach((item,index)=>{
      item.columnIndex = index
      columnsMap[item.data] = index
    })
    states.columns = list
    states.columnsMap = columnsMap
  },
  setSelectAll(states, selectAll) {
    states.selectAll = selectAll
  }
}

Watcher.prototype.commit = function(name, ...args) {
  const mutations = this.mutations;
  if (mutations[name]) {
    mutations[name].apply(this, [this.states].concat(args));
  } else {
    throw new Error(`Action not found: ${name}`);
  }
};


export default Watcher