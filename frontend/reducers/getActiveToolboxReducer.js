const getActiveToolboxReducer = (state, action) => {
    switch (action.type) {
        case 'getToolbox': {
            return action.payload;
        }
        default: return state;
    }
}

export default getActiveToolboxReducer;