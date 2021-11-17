import Handsontable from 'handsontable'

class elCheckEditor extends Handsontable.editors.BaseEditor {
  init() {
    this.select = this.hot.rootDocument.createElement('SELECT');
    Handsontable.dom.addClass(this.select, 'htSelectEditor');
    this.select.style.display = 'none';

    // Attach node to DOM, by appending it to the container holding the table
    this.hot.rootElement.appendChild(this.select);
  }

  prepare(row, col, prop, td, originalValue, cellProperties) {
    // Remember to invoke parent's method
    super.prepare(row, col, prop, td, originalValue, cellProperties);
  
    const selectOptions = this.cellProperties.selectOptions;
    let options;
  
    if (typeof selectOptions === 'function') {
      options = this.prepareOptions(selectOptions(this.row, this.col, this.prop));
    } else {
      options = this.prepareOptions(selectOptions);
    }
  
    Handsontable.dom.empty(this.select);
  
    Handsontable.helper.objectEach(options, (value, key) => {
      const optionElement = this.hot.rootDocument.createElement('OPTION');
      optionElement.value = key;
  
      Handsontable.dom.fastInnerHTML(optionElement, value);
      this.select.appendChild(optionElement);
    });
  }

  prepareOptions(optionsToPrepare) {
    let preparedOptions = {};
  
    if (Array.isArray(optionsToPrepare)) {
      for (let i = 0, len = optionsToPrepare.length; i < len; i++) {
        preparedOptions[optionsToPrepare[i]]=optionsToPrepare[i];
      }
  
    } else if (typeof optionsToPrepare === 'object') {
      preparedOptions=optionsToPrepare;
    }
  
    return preparedOptions;
  }

  getValue() {
    return this.select.value;
  }
  
  setValue(value) {
    this.select.value = value;
  }
  
  open() {
    this._opened = true;
    this.refreshDimensions();
    this.select.style.display = '';
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
  
    const selectStyle = this.select.style;
  
    if (cssTransformOffset && cssTransformOffset !== -1) {
      selectStyle[cssTransformOffset[0]] = cssTransformOffset[1];
    } else {
      Handsontable.dom.resetCssTransform(this.select);
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
        this.select.style.zIndex = 101;
      break;
      case 'corner':
        editedCell = wtOverlays.topLeftCornerOverlay.clone.wtTable.getCell({
          row: this.row,
          col: this.col
        });
        this.select.style.zIndex = 103;
        break;
      case 'left':
        editedCell = wtOverlays.leftOverlay.clone.wtTable.getCell({
          row: this.row,
          col: this.col
        });
        this.select.style.zIndex = 102;
        break;
      default:
        editedCell = this.hot.getCell(this.row, this.col);
        this.select.style.zIndex = '';
        break;
    }
  
    return editedCell < 0 ? void 0 : editedCell;
  }
  
  focus() {
    this.select.focus();
  }
  
  close() {
    this._opened = false;
    this.select.style.display = 'none';
  }
  
}

export default elCheckEditor