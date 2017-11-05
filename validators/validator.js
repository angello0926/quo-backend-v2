import Validator from 'validator';
import _ from 'lodash';

export function validateSignUpInput(data){
    let errors = {};

    if(Validator.isNull(data.email)){
        errors.email = "This field is required";
    }

    if (Validator.isNull(data.password)){
        errors.password = "This field is required";
    }

    return {
        errors,
        isValid :_.isEmpty(errors)
    }
}