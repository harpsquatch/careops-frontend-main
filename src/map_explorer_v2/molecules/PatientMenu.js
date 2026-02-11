import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import styled from 'styled-components';
import { FONT_FAMILY, S, F, W } from '../constants';

const MenuDropdown = styled.div`
    position: fixed;
    min-width: 140px;
    backdrop-filter: ${({ theme }) => theme.cardBlur};
    border: 1px solid ${({ theme }) => theme.border};
    background: ${({ theme }) => theme.menuBg};
    border-radius: 8px;
    box-shadow: 0 4px 12px ${({ theme }) => theme.cardShadow};
    -webkit-backdrop-filter: ${({ theme }) => theme.cardBlur};
    z-index: 10000;
    overflow: hidden;
    display: flex;
    flex-direction: column;
`;

const MenuItem = styled.button`
    padding: ${S.md} ${S.lg};
    border: none;
    background: transparent;
    color: ${({ theme, $danger }) => $danger ? theme.dangerColor : theme.text};
    font-family: ${FONT_FAMILY};
    font-size: ${F.sm};
    font-weight: ${W.regular};
    text-align: left;
    cursor: pointer;
    transition: background 0.15s;
    white-space: nowrap;

    &:hover {
        background: ${({ theme }) => theme.surfaceHover};
    }

    &:first-child {
        border-top-left-radius: 8px;
        border-top-right-radius: 8px;
    }

    &:last-child {
        border-bottom-left-radius: 8px;
        border-bottom-right-radius: 8px;
    }
`;

const PatientMenu = ({ isOpen, onClose, onEdit, onAddVisit, onDischarge, onDelete, buttonRef }) => {
    const menuRef = useRef(null);
    const [position, setPosition] = useState({ top: 0, right: 0 });

    useEffect(() => {
        if (!isOpen || !buttonRef?.current) return;

        const updatePosition = () => {
            const buttonRect = buttonRef.current.getBoundingClientRect();
            setPosition({
                top: buttonRect.bottom + 4, // S.xs = 4px
                right: window.innerWidth - buttonRect.right,
            });
        };

        updatePosition();
        window.addEventListener('scroll', updatePosition, true);
        window.addEventListener('resize', updatePosition);

        return () => {
            window.removeEventListener('scroll', updatePosition, true);
            window.removeEventListener('resize', updatePosition);
        };
    }, [isOpen, buttonRef]);

    useEffect(() => {
        if (!isOpen) return;

        const handleClickOutside = (event) => {
            if (
                menuRef.current &&
                !menuRef.current.contains(event.target) &&
                buttonRef?.current &&
                !buttonRef.current.contains(event.target)
            ) {
                onClose();
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isOpen, onClose, buttonRef]);

    if (!isOpen) return null;

    const handleItemClick = (action) => {
        action?.();
        onClose();
    };

    const menu = (
        <MenuDropdown ref={menuRef} style={{ top: `${position.top}px`, right: `${position.right}px` }}>
            <MenuItem onClick={() => handleItemClick(onEdit)}>
                Edit
            </MenuItem>
            <MenuItem onClick={() => handleItemClick(onAddVisit)}>
                Add Visit
            </MenuItem>
            <MenuItem onClick={() => handleItemClick(onDischarge)}>
                Discharge
            </MenuItem>
            <MenuItem $danger onClick={() => handleItemClick(onDelete)}>
                Delete
            </MenuItem>
        </MenuDropdown>
    );

    return createPortal(menu, document.body);
};

export default PatientMenu;

