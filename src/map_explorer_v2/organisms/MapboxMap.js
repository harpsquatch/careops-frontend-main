import React from 'react';
import styled from 'styled-components';
import MapGL, { NavigationControl } from 'react-map-gl/mapbox';
import { MAPBOX_TOKEN } from '../../config';
import { MAPBOX_STYLE, FONT_FAMILY, F } from '../constants';
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

const MapboxMap = ({ mapRef, viewState, onMove, onLoad, children }) => {
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
                mapStyle={MAPBOX_STYLE}
                onLoad={onLoad}
                style={{ width: '100%', height: '100%' }}
            >
                <NavigationControl position="top-right" />
                {children}
            </MapGL>
        </Container>
    );
};

export default MapboxMap;
