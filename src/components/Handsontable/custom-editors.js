import Handsontable from 'handsontable'
import Vue from 'vue'

class CustomEditors extends Handsontable.editors.BaseEditor {
  init() {
    this.customDom = this.hot.rootDocument.createElement('div');
    Handsontable.dom.addClass(this.customDom, 'htSelectEditor');
    this.customDom.style.display = 'none';

    this.deidom = document.createElement('div')
    this.customDom.appendChild(this.deidom)
    this.hot.rootElement.appendChild(this.customDom);
  }

  prepare(row, col, prop, td, originalValue, cellProperties) {
    // Remember to invoke parent's method
    super.prepare(row, col, prop, td, originalValue, cellProperties);
    this.customDom.style.height=td.clientHeight+'px'
    this.customDom.style.width=td.clientWidth+'px'
    let node =cellProperties.editorSlots(this)
    this.tyyyt = new Vue({
      render: function (createElement) {
        return createElement(
          'div',
          {
            style:{
              height: '100%'
            }
          },
          node
        )
      }
    }).$mount(this.deidom)
    // this.initComponent(originalValue)
  }

  // getValue() {
  //   return this.customDom.value;
  // }
  
  // setValue(value) {
  //   this.customDom.value = value;
  // }
  
  open() {
    this._opened = true;
    this.refreshDimensions();
    this.customDom.style.display = '';
  }
  
  refreshDimensions() {
    this.TD = this.getEditedCell();
  
    // TD is outside of the viewport.
    if (!this.TD) {
      this.close();
  
      return;
    }
    const { wtOverlays } = this.hot.view.wt;
    const currentOffset = Handsontable.dom.offset(this.TD);
    const containerOffset = Handsontable.dom.offset(this.hot.rootElement);
    const scrollableContainer = wtOverlays.scrollableElement;
    const editorSection = this.checkEditorSection();
    let width = Handsontable.dom.outerWidth(this.TD) + 1;
    let height = Handsontable.dom.outerHeight(this.TD) + 1;
    let editTop = currentOffset.top - containerOffset.top - 1 - (scrollableContainer.scrollTop || 0);
    let editLeft = currentOffset.left - containerOffset.left - 1 - (scrollableContainer.scrollLeft || 0);
    let cssTransformOffset;
  
    switch (editorSection) {
      case 'top':
        cssTransformOffset = Handsontable.dom.getCssTransform(wtOverlays.topOverlay.clone.wtTable.holder.parentNode);
        break;
      case 'left':
        cssTransformOffset = Handsontable.dom.getCssTransform(wtOverlays.leftOverlay.clone.wtTable.holder.parentNode);
        break;
      case 'top-left-corner':
        cssTransformOffset = Handsontable.dom.getCssTransform(wtOverlays.topLeftCornerOverlay.clone.wtTable.holder.parentNode);
        break;
      case 'bottom-left-corner':
        cssTransformOffset = Handsontable.dom.getCssTransform(wtOverlays.bottomLeftCornerOverlay.clone.wtTable.holder.parentNode);
        break;
      case 'bottom':
        cssTransformOffset = Handsontable.dom.getCssTransform(wtOverlays.bottomOverlay.clone.wtTable.holder.parentNode);
        break;
      default:
        break;
    }
  
    if (this.hot.getSelectedLast()[0] === 0) {
      editTop += 1;
    }
    if (this.hot.getSelectedLast()[1] === 0) {
      editLeft += 1;
    }
  
    const selectStyle = this.customDom.style;
  
    if (cssTransformOffset && cssTransformOffset !== -1) {
      selectStyle[cssTransformOffset[0]] = cssTransformOffset[1];
    } else {
      Handsontable.dom.resetCssTransform(this.customDom);
    }
  
    const cellComputedStyle = Handsontable.dom.getComputedStyle(this.TD, this.hot.rootWindow);
  
    if (parseInt(cellComputedStyle.borderTopWidth, 10) > 0) {
      height -= 1;
    }
    if (parseInt(cellComputedStyle.borderLeftWidth, 10) > 0) {
      width -= 1;
    }
  
    selectStyle.height = `${height}px`;
    selectStyle.minWidth = `${width}px`;
    selectStyle.top = `${editTop}px`;
    selectStyle.left = `${editLeft}px`;
    selectStyle.margin = '0px';
  }
  
  getEditedCell() {
    const { wtOverlays } = this.hot.view.wt;
    const editorSection = this.checkEditorSection();
    let editedCell;
  
    switch (editorSection) {
      case 'top':
        editedCell = wtOverlays.topOverlay.clone.wtTable.getCell({
          row: this.row,
          col: this.col
        });
        this.customDom.style.zIndex = 101;
      break;
      case 'corner':
        editedCell = wtOverlays.topLeftCornerOverlay.clone.wtTable.getCell({
          row: this.row,
          col: this.col
        });
        this.customDom.style.zIndex = 103;
        break;
      case 'left':
        editedCell = wtOverlays.leftOverlay.clone.wtTable.getCell({
          row: this.row,
          col: this.col
        });
        this.customDom.style.zIndex = 102;
        break;
      default:
        editedCell = this.hot.getCell(this.row, this.col);
        this.customDom.style.zIndex = '';
        break;
    }
  
    return editedCell < 0 ? void 0 : editedCell;
  }
  
  focus() {
    this.customDom.focus();
  }
  
  close() {
    this._opened = false;
    this.customDom.style.display = 'none';
  }
}

export default CustomEditors