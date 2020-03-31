import { gzToJson } from './file-utils';
import * as path from 'path';
import { County } from './County';
import { TigerLineCountyFeature } from './TigerLineCountyFeature';
import * as gjgLookup from 'geojson-geometries-lookup';
import Debug from 'debug';
const debug = Debug('location-to-usa-county');

// function initializeService(): void
// {
//   debug(`US counties spatial index has not been initialized yet.  Initializing....`);
//   const admin2FeatColl = require('../data/tl_2018_us_county.json') as FeatColl;
//   debug(`admin2FeatColl.type: ${admin2FeatColl.type}`);
//   glookup = new gjgLookup(admin2FeatColl);
//   debug('Finished initializing GeoJsonGeometries index.');
//   if (!glookup) throw new Error('US counties spatial index was not initialized.');
// }

const getSpatialIndex = (()=> {
  let glookup = null;
  return async () => {
    if (glookup) {
      debug(`US counties spatial index already initialized.`);
      return glookup;
    }
    debug(`US counties spatial index has not been initialized yet.  Initializing....`);
    const admin2FeatColl = await gzToJson(path.join(__dirname, '../data/tl_2018_us_county.json.gz'));
    debug(`admin2FeatColl.type: ${admin2FeatColl.type}`);
    glookup = new gjgLookup(admin2FeatColl);
    debug('Finished initializing GeoJsonGeometries index.');
    if (!glookup) throw new Error('US counties spatial index was not initialized.');
    return glookup;
  }
})();

export async function getLocToCountyLookupService()
  : Promise<(latitude: number, longitude: number) => County>
{
  const glookup = await getSpatialIndex();
  return function(latitude: number, longitude: number): County {
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
  }
}
