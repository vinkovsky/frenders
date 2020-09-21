import React, {useContext, useEffect, useState} from 'react';

import Switch from '@material-ui/core/Switch';
import Checkbox from "@material-ui/core/Checkbox";

import FormControlLabel from "@material-ui/core/FormControlLabel";

import FormControl from '@material-ui/core/FormControl';
import FormGroup from '@material-ui/core/FormGroup';
import ViewportSceneContext from "../../../../../context/ViewportSceneContext";

let filtersMap = new Map();

export default function Filters() {
    const [state, dispatch] = useContext(ViewportSceneContext);
    const [disabled, setDisabled] = useState(true);
    // const [indeterminate, setIndeterminate] = useState(false);
    const [filterCheckers, setFilterCheckers] = useState({
        Grayscale: false,
        Invert: false,
        Sepia: false,
        Vintage: false,
        Kodachrome: false,
        Technicolor: false,
        Polaroid: false,
        BlackWhite: false,
        Brownie: false
    });

    const intersect = (a, b, ...rest) => {
        if (rest.length === 0) return [...new Set(a)].filter(x => new Set(b).has(x));
        return intersect(a, intersect(b, ...rest));
    };

    useEffect(() => {
        if (!state.getCanvas) return;

        const selectHandler = (e) => {
            const selectedObject = state.getCanvas.canvas.getActiveObjects();

            if (selectedObject.length === 0) {
                setDisabled(true);
                return;
            }

            for (let filterCheckersKey in filterCheckers) {
                setFilterCheckers((filterCheckers) => (
                    {
                        ...filterCheckers,
                        [filterCheckersKey]: false
                    }
                ));
            }

            if (e.selected && selectedObject[0].type === "image") {
                setDisabled(false);
                let arr = [];

                if(e.selected.length > 1) {
                   //console.log(selectedObject);
                    selectedObject.map((item) => {
                        if (item.filters.length !== 0) {
                            arr.push(Array.from(filtersMap.get(item)));
                        } else {
                            arr.push([])
                        }
                    })

                  // console.log(arr);

                    const intersection = intersect(...arr);

                //    console.log(intersection);

                    for (let intersectionKey of intersection) {
                        setFilterCheckers((filterCheckers) => (
                            {
                                ...filterCheckers,
                                [intersectionKey]: true
                            }
                        ));
                    }
                } else {
                    if (selectedObject[0].filters.length !== 0) {
                        selectedObject[0].filters.map((item) => {
                            setFilterCheckers((filterCheckers) => (
                                {
                                    ...filterCheckers,
                                    [item.type]: true
                                }
                            ));
                        })
                    }
                }

            } else {
                setDisabled(true);
            }
        }
        state.getCanvas.canvas.requestRenderAll()
        state.getCanvas.canvas.on('selection:created', selectHandler);
        state.getCanvas.canvas.on('selection:updated', selectHandler);
        state.getCanvas.canvas.on('selection:cleared', selectHandler);
        return () => {
            state.getCanvas.canvas.off({'selection:created': selectHandler}, {'selection:updated': selectHandler, 'selection:cleared': selectHandler});
        }
    }, [state.getCanvas])

    const handleChange = (event, value) => {
        const selectedObject = state.getCanvas.canvas.getActiveObjects();

        if (selectedObject.length > 1) {
            selectedObject.map((obj) => {
                if (!filtersMap.has(obj)) {
                    filtersMap.set(obj, new Set());
                }
            })
            selectedObject.map((obj) => {
                let set = filtersMap.get(obj);
                if (value === false) {
                    set.delete(event.target.name)
                } else {
                    set.add(event.target.name);
                }
                const arr = Array.from(set).sort();
                if (obj.type === 'image') {
                    obj.filters = [];
                    arr.map((item, index) => {
                        obj.filters[index] = new fabric.Image.filters[item];
                    })
                    obj.applyFilters();
                }
            })
        } else {
            if (!filtersMap.has(selectedObject[0])) {
                filtersMap.set(selectedObject[0], new Set());
            }
            let set = filtersMap.get(selectedObject[0])

            if (set.has(event.target.name)) {
                set.delete(event.target.name)
            } else {
                set.add(event.target.name);
            }

            let arr = Array.from(set).sort();

            if (selectedObject[0].type === 'image') {
                selectedObject[0].filters = [];
                arr.map((item, index) => {
                    selectedObject[0].filters[index] = new fabric.Image.filters[item];
                })
                selectedObject[0].applyFilters();
            }
        }
        state.getCanvas.canvas.renderAll()
        setFilterCheckers((filterCheckers) => (
            {
                ...filterCheckers,
                [event.target.name]: event.target.checked
            }
        ));
    };

    return (
        <>
            <FormControl component="fieldset">
                <FormGroup>
                    {
                        Object.entries(filterCheckers).map((name, index) => {
                            return <FormControlLabel value={name[0]} disabled={disabled}  key={`filter-${index}`} control={
                                <Checkbox
                                    checked={name[1]}
                                    onChange={handleChange}
                                    color="primary"
                                    name={name[0]}
                                    // indeterminate={indeterminate}
                                />
                            } label={name[0]} />
                        })
                    }
                </FormGroup>
            </FormControl>
        </>
    );
}
