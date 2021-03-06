import { getLocToCountyLookupService } from './';

(async ()=> {
  if (process.argv.length <= 3) {
    console.log('Must pass in latitude as first command line argument and longitude as second.');
    console.log('For example, to look up county for Phoenix: ./lookup 33.5038 -112.0253');
    return;
  }
  const latStr = process.argv[2];
  const lonStr = process.argv[3];
  const floatRegEx = /^[-+]?[0-9]*\.?[0-9]+(?:[eE][-+]?[0-9]+)?$/;
  const errMsg = (x: string) => `Argument "${latStr}" does not look like a floating point number.`;
  if (!floatRegEx.test(latStr)) {
    console.log(errMsg(latStr));
    return;
  }
  if (!floatRegEx.test(lonStr)) {
    console.log(errMsg(lonStr));
    return;
  }
  const lat = parseFloat(latStr);
  const lon = parseFloat(lonStr);
  console.log(`Looking up county for coordinates latitude: ${lat}, longitude: ${lon}`);
  try {
    const county = (await getLocToCountyLookupService())(lat, lon);
    console.log(`Found county: ${JSON.stringify(county)}`);
  } catch (e) {
    console.log(`Error: `, e);
  }
})();