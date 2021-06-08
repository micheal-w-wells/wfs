import axios from "axios";
import reproject from "reproject";
import proj4 from "proj4";
const { stringify } = require("wkt");

const sampleGeoJson = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      properties: {},
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [-123.72802734375, 48.22467264956519],
            [-122.93701171874999, 48.821332549646634],
            [-124.365234375, 49.453842594330716],
            [-125.3759765625, 50.45750402042058],
            [-127.72705078124999, 50.999928855859636],
            [-129.19921875, 50.72254683363231],
            [-123.72802734375, 48.22467264956519],
          ],
        ],
      },
    },
  ],
};
proj4.defs(
  "EPSG:3005",
  "+proj=aea +lat_1=50 +lat_2=58.5 +lat_0=45 +lon_0=-126 +x_0=1000000 +y_0=0 +ellps=GRS80 +datum=NAD83 +units=m +no_defs"
);

const wktConvert = (input: any) => {
  return stringify(input);
};

const layerName = "WHSE_WATER_MANAGEMENT.GW_WATER_WELLS_WRBC_SVW";
const buildURLForDataBC = (layerName: string, geoJSON: Object) => {
  const baseURL = "https://openmaps.gov.bc.ca/geo/pub/wfs?SERVICE=WFS&VERSION=1.1.0&REQUEST=GetFeature&outputFormat=json&typeName=pub:";
  const projection = "&SRSNAME=EPSG:3005";
  const reprojected = reproject.reproject(
    geoJSON,
    proj4.WGS84,
    proj4("EPSG:3005")
  );
  const reprojectedAsWKT = wktConvert(reprojected);
  const customCQL = "&CQL_FILTER=WITHIN(GEOMETRY," + reprojectedAsWKT + ")";
  return baseURL + layerName + projection + customCQL;
};

const getHTTP = async (input: string) => {
  let resp = await axios.get(input);
  return resp 
};

const getDataFromDataBC = async (layerName: string, geoJSON: Object) =>
{
  const URL = buildURLForDataBC(layerName, geoJSON)
  const returnVal = await getHTTP(URL)
  return returnVal.data
}


const albersToGeog = (featureCollection: Object[]) =>
{
  const reprojected = reproject.reproject(
    featureCollection,
    proj4("EPSG:3005"),
    proj4.WGS84
  );

  return reprojected
}


const getDataBCDataByGeometry = async (layerName: string, geometry: Object) => {
  const albersReturnData = await getDataFromDataBC(layerName, sampleGeoJson.features[0])
  const geogData = (albersToGeog(albersReturnData))
  console.log(geogData)
  return geogData;
}

getDataBCDataByGeometry(layerName, sampleGeoJson.features[0])

export default function App() {
  return (
    <div className="App">
      <h1>Hello CodeSandbox</h1>
      <h2>Start editing to see some magic happen!</h2>
    </div>
  );
}
