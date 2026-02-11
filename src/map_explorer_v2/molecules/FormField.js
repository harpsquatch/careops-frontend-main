import React from 'react';
import styled from 'styled-components';
import FormLabel from '../atoms/FormLabel';
import TextInput from '../atoms/TextInput';
import { S } from '../constants';

const Wrapper = styled.div`
    display: flex;
    flex-direction: column;
    gap: ${S.xs};
`;

const FormField = ({ label, ...inputProps }) => (
    <Wrapper>
        <FormLabel>{label}</FormLabel>
        <TextInput {...inputProps} />
    </Wrapper>
);

export default FormField;

