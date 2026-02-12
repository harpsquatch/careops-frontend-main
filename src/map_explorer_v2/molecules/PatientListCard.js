import React, { useState, useRef } from 'react';
import styled, { useTheme } from 'styled-components';
import { MdMoreVert } from 'react-icons/md';
import { FONT_FAMILY, S, F, W, CARE_LEVEL_MAP } from '../constants';
import { Avatar, Badge, IconButton } from '../atoms';
import PatientMenu from './PatientMenu';

/* ─── Card container ─── */

const Card = styled.div`
    width: 100%;
    box-sizing: border-box;
    padding: ${S.lg} ${S.lg};
    background: ${({ theme }) => theme.cardBg};
    box-shadow: 0px 1px 2px ${({ theme }) => theme.cardShadow};
    border-radius: 14px;
    outline: 1px ${({ theme }) => theme.cardOutline} solid;
    backdrop-filter: ${({ theme }) => theme.cardBlur};
    -webkit-backdrop-filter: ${({ theme }) => theme.cardBlur};
    outline-offset: -1px;
    display: flex;
    flex-direction: column;
    gap: ${S.md};
    cursor: pointer;
    transition: box-shadow 0.2s;
    position: relative;

    &:hover {
        box-shadow: 0px 3px 6px ${({ theme }) => theme.cardShadow};
    }
`;

const MenuWrapper = styled.div`
    position: absolute;
    top: ${S.md};
    right: ${S.md};
    z-index: 10;
`;

const Name = styled.p`
    margin: 0;
    color: ${({ theme }) => theme.text};
    font-size: ${F.md};
    font-family: ${FONT_FAMILY};
    font-weight: ${W.medium};
    word-wrap: break-word;
`;

const Subtitle = styled.p`
    margin: 0;
    color: ${({ theme }) => theme.textSecondary};
    font-size: ${F.sm};
    font-family: ${FONT_FAMILY};
    font-weight: ${W.regular};
    word-wrap: break-word;
`;

const BadgeRow = styled.div`
    align-self: stretch;
    display: inline-flex;
    align-items: center;
    gap: ${S.xs};
    flex-wrap: wrap;
`;

/* ─── Component ─── */

const PatientListCard = ({ patient, onClick, onEdit, onAddVisit, onDischarge, onDelete, onOpenNotes }) => {
    const theme = useTheme();
    const [menuOpen, setMenuOpen] = useState(false);
    const menuButtonRef = useRef(null);
    const careLevel = patient.acres || 'Skilled';
    const clDef = CARE_LEVEL_MAP[careLevel];
    const isDark = theme.bg !== '#fff';
    const clBg = clDef ? (isDark ? clDef.darkBg : clDef.bg) : undefined;
    const clColor = clDef ? (isDark ? clDef.darkColor : clDef.color) : undefined;
    const status = patient.active ? 'Active' : 'Discharged';

    const handleMenuClick = (e) => {
        e.stopPropagation();
        setMenuOpen(!menuOpen);
    };

    const handleEdit = () => {
        onEdit?.(patient);
    };

    const handleAddVisit = () => {
        onAddVisit?.(patient);
    };

    const handleDischarge = () => {
        onDischarge?.(patient);
    };

    const handleDelete = () => {
        onDelete?.(patient);
    };

    return (
        <Card onClick={() => onClick?.(patient)}>
            <MenuWrapper>
                <IconButton ref={menuButtonRef} onClick={handleMenuClick} title="More options">
                    <MdMoreVert size={20} />
                </IconButton>
                <PatientMenu
                    isOpen={menuOpen}
                    onClose={() => setMenuOpen(false)}
                    onEdit={handleEdit}
                    onAddVisit={handleAddVisit}
                    onDischarge={handleDischarge}
                    onDelete={handleDelete}
                    buttonRef={menuButtonRef}
                    patient={patient}
                />
            </MenuWrapper>
            <Avatar src={patient.avatar_url || undefined} size={36} alt={patient.field_name} />
            <Name>{patient.field_name}</Name>
            <Subtitle>{patient.description || patient.address || 'No details available'}</Subtitle>
            <BadgeRow>
                <Badge bg={clBg} color={clColor}>{careLevel}</Badge>
                <Badge
                    bg={patient.active ? theme.completedBg : theme.dangerBg}
                    color={patient.active ? theme.completedColor : theme.dangerColor}
                >
                    {status}
                </Badge>
                {patient.notes && (
                    <Badge
                        onClick={(e) => { e.stopPropagation(); onOpenNotes?.(patient); }}
                        style={{ cursor: 'pointer' }}
                    >
                        Notes
                    </Badge>
                )}
            </BadgeRow>
        </Card>
    );
};

export default PatientListCard;
