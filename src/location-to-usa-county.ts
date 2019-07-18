import * as path from 'path';
import { County } from './County';
import { FeatColl, TigerLineCountyFeature } from './TigerLineCountyFeature';
import * as gjgLookup from 'geojson-geometries-lookup';

import Debug from 'debug';
const debug = Debug('location-to-usa-county');

let glookup = null;

function initializeService(): void
{
  const admin2FeatColl = require('../data/tl_2018_us_county.json') as FeatColl;
  debug(`admin2FeatColl.type: ${admin2FeatColl.type}`);
  glookup = new gjgLookup(admin2FeatColl);
  debug('Finished initializing GeoJsonGeometries index.');
}

export function locToCounty(latitude: number, longitude: number): County {
  debug(`Entering locToCounty(${latitude}, ${longitude})`);
  if (!glookup) {
    debug(`Lookup spatial index has not been initialized yet.  Initializing....`);
    initializeService();
  }
  if (!glookup) throw new Error('glookup was not initialized.');
  const p = { type: "Point", coordinates: [longitude, latitude] };
  const ccount = glookup.countContainers(p);
  const containers = glookup.getContainers(p);
  if (ccount === 0 || !containers || !containers.features) {
    debug(`County lookup failed.`);
    return null;
  }
  const feat: TigerLineCountyFeature = containers.features[0];
  const props = feat.properties;
  const county: County = {
    county_name: props.NAME,
    county_fips: props.GEOID
  };
  return county;
};
