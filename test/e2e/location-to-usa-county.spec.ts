import { County, locToCounty } from '../../src';
import 'mocha';
import { expect } from 'chai';

describe('End-to-end', function() {

  describe('Basic locToCounty lookup', function() {
    this.timeout(5000);
    it('When known Phoenix latitude, longitude is searched for, it finds the county', async function() {
      const lat = 33.5038, lon = -112.0253; // Phoenix, USA
      const county: County = await locToCounty(lat, lon);
      expect(county).to.not.be.null;
      expect(county.county_name).to.equal('Maricopa');
      expect(county.county_name).to.equal('04013');
    });

    it('When a non-USA location is searched for, it returns null', async function() {
      const lat = 51.509865, lon = -0.118092; // London, England
      const county: County = await locToCounty(lat, lon);
      expect(county).to.be.null;
    });

  });

});