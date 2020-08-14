import React from "react";
import { FormControl, FormHelperText, InputLabel, Input, Grid } from '@material-ui/core';
import { NoSsr } from "@material-ui/core";
import { useStyles } from "./InputField.style";

export const InputField = (props) => {
    const classes = useStyles();

    return (
        <NoSsr>
            <Grid item xs={12}>
                <FormControl className={ classes.control }>
                    <InputLabel
                        id={ [props.name, 'label'].join('-') }
                        htmlFor={ [props.name, 'input'].join('-') }
                    >
                        { props.label }
                    </InputLabel>
                    <Input
                        id={ [props.name, 'input'].join('-') }
                        name={ props.name }
                        autoComplete={ props.autoComplete }
                        required={ props.required }
                        type={ props.type }
                        value={ props.value }
                        onChange={ e => props.onChange(e.target.value) }
                    />
                    { props.required ? <FormHelperText>*Обязательно для заполнения</FormHelperText> : undefined }
                </FormControl>
            </Grid>
        </NoSsr>
    );
};

