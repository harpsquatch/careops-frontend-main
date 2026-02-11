import styled from 'styled-components';
import { FONT_FAMILY, F, W } from '../constants';

const FormLabel = styled.label`
    font-family: ${FONT_FAMILY};
    font-size: ${F.sm};
    font-weight: ${W.medium};
    color: ${({ theme }) => theme.textSecondary};
    letter-spacing: 0.5px;
`;

export default FormLabel;
