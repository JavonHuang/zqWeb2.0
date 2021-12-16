/**
 * table afterRender渲染完成后设置
 * */
const renderIndexCell = (el,dataMaxNum,dispalyNode) =>{
  /**
   * 处理左边序列号,隐藏掉用于合计的虚拟行
   * 注意：出现滚动条后，显示的dom数量和数据条数是不一致的。因为大数据下dom不会无限创建，所以采用innerText序号值判断
   * */
  const ht_clone_left = el.querySelector('.ht_clone_left table tbody')
  if(ht_clone_left.childNodes.length>0 && ht_clone_left.childNodes[ht_clone_left.childNodes.length-1].innerText==dataMaxNum){
    ht_clone_left.childNodes[ht_clone_left.childNodes.length-1].style.visibility='hidden'
    dispalyNode.push(ht_clone_left.childNodes[ht_clone_left.childNodes.length-1])
  }
  /**
  * 处理底部悬浮，左悬浮
  * */
  const ht_clone_bottom_left_corner = el.querySelector('.ht_clone_bottom_left_corner table tbody tr')
  if(ht_clone_bottom_left_corner && ht_clone_bottom_left_corner.childNodes.length>0){
    ht_clone_bottom_left_corner.childNodes[0].innerText='合计'
    ht_clone_bottom_left_corner.childNodes.forEach(element => {
      console.log(element.dataset.columns)
    })
  }
  /**
  * 处理计算，bottom悬浮行显示
  * */
  // const ht_clone_bottom = el.querySelector('.ht_clone_bottom table tbody')
  // if(ht_clone_bottom.childNodes.length>0){
  //   ht_clone_bottom.firstChild.childNodes[0].innerHTML=''
  // }

  const ht_master = el.querySelector('.ht_master table tbody')
  if(ht_master && ht_master.childNodes.length>0 && ht_master.childNodes[ht_master.childNodes.length-1].querySelector('.rowHeader').innerHTML==dataMaxNum){
    ht_master.childNodes[ht_clone_left.childNodes.length-1].style.visibility='hidden'
    dispalyNode.push(ht_master.childNodes[ht_clone_left.childNodes.length-1])
  }
}

export {
  renderIndexCell,
}