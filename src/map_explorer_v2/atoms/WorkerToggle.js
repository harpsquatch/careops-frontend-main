import React from 'react';
import styled from 'styled-components';

const Track = styled.div`
    width: 42px;
    height: 24px;
    border-radius: 12px;
    background: ${(p) => (p.$checked ? p.theme.primary : p.theme.toggleOff)};
    position: relative;
    cursor: pointer;
    transition: background 0.2s;
`;

const Thumb = styled.div`
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: ${({ theme }) => theme.toggleThumb};
    position: absolute;
    top: 2px;
    left: ${(p) => (p.$checked ? '20px' : '2px')};
    transition: left 0.2s;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
`;

const WorkerToggle = ({ checked, onChange }) => (
    <Track $checked={checked} onClick={onChange}>
        <Thumb $checked={checked} />
    </Track>
);

export default WorkerToggle;
