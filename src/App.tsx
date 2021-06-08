import axios from "axios";
//const projectStream = require('project-geojson')
//import proj4 from 'proj4'
import reproject from 'reproject';
import proj4 from 'proj4';
const { stringify } = require('wkt');
var epsg = require('epsg');



const sampleGeoJson = {
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "properties": {},
      "geometry": {
        "type": "Polygon",
        "coordinates": [
          [
            [
              -123.72802734375,
              48.22467264956519
            ],
            [
              -122.93701171874999,
              48.821332549646634
            ],
            [
              -124.365234375,
              49.453842594330716
            ],
            [
              -125.3759765625,
              50.45750402042058
            ],
            [
              -127.72705078124999,
              50.999928855859636
            ],
            [
              -129.19921875,
              50.72254683363231
            ],
            [
              -123.72802734375,
              48.22467264956519
            ]
          ]
        ]
      }
    }
  ]
}

const wktConvert = (input: any) => {
  console.log('input:' + input)
  return stringify(input)
}
const goal = 'https://openmaps.gov.bc.ca/geo/pub/wfs?SERVICE=WFS&VERSION=1.1.0&REQUEST=GetFeature&outputFormat=json&typeName=pub:WHSE_WATER_MANAGEMENT.GW_WATER_WELLS_WRBC_SVW&SRSNAME=EPSG:3005&CQL_FILTER=WITHIN(GEOMETRY,POLYGON((830772.7%20367537.4,%201202463%20367537.4,%201202463%20651616.7,%20830772.7%20651616.7,%20830772.7%20367537.4)))'
const baseURL = 'https://openmaps.gov.bc.ca/geo/pub/wfs?SERVICE=WFS&VERSION=1.1.0&REQUEST=GetFeature&outputFormat=json&typeName=pub:'
const layerName = 'WHSE_WATER_MANAGEMENT.GW_WATER_WELLS_WRBC_SVW'
const projection = '&SRSNAME=EPSG:3005'
const originalcql = '&CQL_FILTER=WITHIN(GEOMETRY,POLYGON((830772.7%20367537.4,%201202463%20367537.4,%201202463%20651616.7,%20830772.7%20651616.7,%20830772.7%20367537.4)))'



// nfg: const reprojected = reproject.reproject(JSON.stringify(sampleGeoJson.features[0]).replaceAll(' ', ''), 'EPSG:4326', '+proj=aea +lat_1=50 +lat_2=58.5 +lat_0=45 +lon_0=-126 +x_0=1000000 +y_0=0 +ellps=GRS80 +datum=NAD83 +units=m +no_defs', epsg)
// something returned at least : const reprojected = reproject.reproject(sampleGeoJson.features[0], proj4.WGS84, proj4('EPSG:4326'))
// nfg: const reprojected = reproject.reproject(sampleGeoJson.features[0], proj4('EPSG:4326'), proj4('EPSG:3005'))
// nfg: const reprojected = reproject.reproject(sampleGeoJson.features[0], proj4('EPSG:4326'), proj4('EPSG:3005'))
// nfg: const reprojected = reproject.reproject(sampleGeoJson.features[0], proj4.WGS84, proj4('EPSG:3005'))
// nfg: const reprojected = reproject.reproject(sampleGeoJson.features[0], proj4.WGS84, proj4('EPSG:3005'), { "EPSG:3005":  "+proj=aea +lat_1=50 +lat_2=58.5 +lat_0=45 +lon_0=-126 +x_0=1000000 +y_0=0 +ellps=GRS80 +datum=NAD83 +units=m +no_defs"})

//works!!
proj4.defs("EPSG:3005", "+proj=aea +lat_1=50 +lat_2=58.5 +lat_0=45 +lon_0=-126 +x_0=1000000 +y_0=0 +ellps=GRS80 +datum=NAD83 +units=m +no_defs")
const reprojected = reproject.reproject(sampleGeoJson.features[0], proj4.WGS84, proj4('EPSG:3005'))
const reprojectedAsWKT = wktConvert(reprojected)
//const convertedGeoWithoutWhitespace = reprojectedAsWKT.replaceAll(' ','')
const customCQL = '&CQL_FILTER=WITHIN(GEOMETRY,' + reprojectedAsWKT  + ')'
let actual = baseURL + layerName + projection + customCQL
console.log('actual: ' + actual)

const getStuff = async (input: string) => {
  let resp = await axios.get(actual)
  console.log(JSON.stringify(resp)) 
}

//getStuff(goal);
getStuff(actual)


export default function App() {
  return (
    <div className="App">
      <h1>Hello CodeSandbox</h1>
      <h2>Start editing to see some magic happen!</h2>
    </div>
  );
}
