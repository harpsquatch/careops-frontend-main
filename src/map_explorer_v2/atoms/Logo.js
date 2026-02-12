import React from 'react';
import styled, { useTheme } from 'styled-components';
import logoDark from '../../static/images/logo-darkbg.png';
import logoLight from '../../static/images/logo-lightbg.png';

const Img = styled.img`
    height: 32px;
    width: auto;
    display: block;
`;

const Logo = (props) => {
    const theme = useTheme();
    const logoSrc = theme.mode === 'dark' ? logoDark : logoLight;
    return <Img src={logoSrc} alt="CareOps" {...props} />;
};

export default Logo;

