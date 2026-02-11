import React from 'react';
import styled from 'styled-components';
import logoSvg from '../../static/images/logo.svg';

const Img = styled.img`
    height: 32px;
    width: auto;
    display: block;
`;

const Logo = (props) => <Img src={logoSvg} alt="ECT Vision" {...props} />;

export default Logo;

