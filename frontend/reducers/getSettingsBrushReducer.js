const getSettingsBrushReducer = (state, action) => {
    switch (action.type) {
        case 'getSettingsBrush': {
            return action.payload;
        }
        default: return state;
    }
}

export default getSettingsBrushReducer;
