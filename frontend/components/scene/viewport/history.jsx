export const history = (canvas) => {
      /**
   * Initialization of the plugin
   */
  let historyUndo, historyRedo, extraProps, historyNextState, historyProcessing;

  //function _historyInit() {
    historyUndo = [];
    historyRedo = [];
    extraProps = ['selectable'];
    historyNextState = _historyNext();
    
    canvas.on(_historyEvents());
  
 // }


    /**
   * Returns an object with fabricjs event mappings
   */

  function _historyEvents(){
    return {
      'object:added': _historySaveAction,
      'object:removed': _historySaveAction,
      'object:modified': _historySaveAction,
      'object:skewing': _historySaveAction
    }
  }

  /**
   * Returns current state of the string of the canvas
   */

  function _historyNext() {
    return JSON.stringify(canvas.toDatalessJSON(extraProps));
  }  

  /**
   * Remove the custom event listeners
   */

  function _historyDispose() {
    canvas.off(_historyEvents())
  }

  /**
   * It pushes the state of the canvas into history stack
   */

  function _historySaveAction() {
    if (historyProcessing) return;

    const json = historyNextState;
    historyUndo.push(json);
    historyNextState = _historyNext();
    canvas.fire('history:append', { json: json });
  }

  /**
   * Undo to latest history. 
   * Pop the latest state of the history. Re-render.
   * Also, pushes into redo history.
   */

  function undo(callback) {
    // The undo process will render the new states of the objects
    // Therefore, object:added and object:modified events will triggered again
    // To ignore those events, we are setting a flag.
    historyProcessing = true;

    const history = historyUndo.pop();
    if (history) {
      // Push the current state to the redo history
      historyRedo.push(_historyNext());
      historyNextState = history;
      _loadHistory(history, 'history:undo', callback);
    } else {
      historyProcessing = false;
    }
  }

  /**
   * Redo to latest undo history.
   */

  function redo(callback) {
      // The undo process will render the new states of the objects
    // Therefore, object:added and object:modified events will triggered again
    // To ignore those events, we are setting a flag.
    historyProcessing = true;
    const history = historyRedo.pop();
    if (history) {
      // Every redo action is actually a new action to the undo history
      historyUndo.push(_historyNext());
      historyNextState = history;
      _loadHistory(history, 'history:redo', callback);
    } else {
      historyProcessing = false;
    }
  }

  function _loadHistory(history, event, callback) {
    canvas.loadFromJSON(history, () => {
        canvas.renderAll();
        canvas.fire(event);
        historyProcessing = false;
  
      if (callback && typeof callback === 'function')
        callback();
    });
  }
  /**
   * Clear undo and redo history stacks
   */

  function clearHistory() {
    historyUndo = [];
    historyRedo = [];
    canvas.fire('history:clear');
  }

  function offHistory() {
    historyProcessing = true;
  }
  function onHistory() {
    historyProcessing = false;
  
    _historySaveAction();
  }


  return { clearHistory, offHistory, onHistory, undo, redo}
}