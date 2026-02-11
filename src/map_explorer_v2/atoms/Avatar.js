import React from 'react';
import styled from 'styled-components';

const Img = styled.img`
    width: ${(p) => p.$size || 45}px;
    height: ${(p) => p.$size || 45}px;
    border-radius: 50%;
    object-fit: cover;
`;

const FALLBACK = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSfpIaGerw5l637QyCc2ZwUJH1KMMzipcYsMxAbDDg2_3zZE6kHxcHyG3caDBMHCFAl_c0&usqp=CAU';

const Avatar = ({ src, alt = 'avatar', size, ...rest }) => (
    <Img src={src || FALLBACK} alt={alt} $size={size} {...rest} />
);

export default Avatar;

