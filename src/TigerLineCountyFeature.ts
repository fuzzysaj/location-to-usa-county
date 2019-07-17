import { Polygon, MultiPolygon } from "@turf/helpers";

export interface FeatColl {
  type: 'FeatureCollection',
  features: Array<TigerLineCountyFeature>
};

/** This captures a subset of useful properties encoded in the Natural Earth regions Shapefile. */
export interface TigerLineCountyFeature {
  type: 'Feature',
  properties: {
    GEOID?: string,  // fips code
    NAME?: string // county name
  },
  geometry: Polygon | MultiPolygon // | Point | MultiPoint | LineString | MultiLineString
};
