import React from 'react';
import styled from 'styled-components';
import MapGL from 'react-map-gl/mapbox';
import { MAPBOX_TOKEN } from '../../config';
import { MAPBOX_STYLE_DARK, MAPBOX_STYLE_LIGHT, FONT_FAMILY, F } from '../constants';
import 'mapbox-gl/dist/mapbox-gl.css';

const Container = styled.div`
    width: 100%;
    height: 100%;
`;

const Fallback = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    color: ${({ theme }) => theme.textMuted};
    font-family: ${FONT_FAMILY};
    font-size: ${F.md};
`;

const MapboxMap = ({ mapRef, viewState, onMove, onLoad, isDark, children }) => {
    if (!MAPBOX_TOKEN) {
        return <Fallback>Mapbox token required</Fallback>;
    }

    return (
        <Container>
            <MapGL
                ref={mapRef}
                {...viewState}
                onMove={onMove}
                mapboxAccessToken={MAPBOX_TOKEN}
                mapStyle={isDark ? MAPBOX_STYLE_DARK : MAPBOX_STYLE_LIGHT}
                onLoad={onLoad}
                style={{ width: '100%', height: '100%' }}
            >
                {children}
            </MapGL>
        </Container>
    );
};

export default MapboxMap;
