// Lightweight GeoJSON FeatureCollection of Major Indian States & Union Territories
export const indiaStatesGeoJSON = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      properties: { name: "Maharashtra", state_code: "MH", capital: "Mumbai" },
      geometry: {
        type: "Polygon",
        coordinates: [[[72.6, 18.8], [73.5, 20.2], [76.5, 21.5], [80.5, 21.2], [80.8, 18.8], [77.5, 17.5], [73.5, 15.8], [72.6, 18.8]]]
      }
    },
    {
      type: "Feature",
      properties: { name: "Kerala", state_code: "KL", capital: "Thiruvananthapuram" },
      geometry: {
        type: "Polygon",
        coordinates: [[[75.0, 12.8], [76.5, 12.0], [77.3, 10.2], [77.1, 8.3], [76.8, 8.8], [76.0, 10.5], [75.0, 12.8]]]
      }
    },
    {
      type: "Feature",
      properties: { name: "Tamil Nadu", state_code: "TN", capital: "Chennai" },
      geometry: {
        type: "Polygon",
        coordinates: [[[76.5, 12.0], [78.5, 13.5], [80.3, 13.4], [79.8, 10.8], [78.2, 8.1], [77.1, 8.3], [76.5, 12.0]]]
      }
    },
    {
      type: "Feature",
      properties: { name: "Delhi NCR", state_code: "DL", capital: "New Delhi" },
      geometry: {
        type: "Polygon",
        coordinates: [[[76.8, 28.9], [77.4, 28.9], [77.4, 28.4], [76.8, 28.4], [76.8, 28.9]]]
      }
    },
    {
      type: "Feature",
      properties: { name: "Odisha", state_code: "OR", capital: "Bhubaneswar" },
      geometry: {
        type: "Polygon",
        coordinates: [[[81.4, 18.5], [83.8, 19.2], [86.9, 21.6], [87.5, 21.6], [85.5, 22.5], [82.5, 20.5], [81.4, 18.5]]]
      }
    },
    {
      type: "Feature",
      properties: { name: "West Bengal", state_code: "WB", capital: "Kolkata" },
      geometry: {
        type: "Polygon",
        coordinates: [[[86.5, 21.6], [89.0, 21.5], [88.9, 24.2], [88.3, 27.2], [86.8, 26.5], [86.5, 21.6]]]
      }
    },
    {
      type: "Feature",
      properties: { name: "Karnataka", state_code: "KA", capital: "Bengaluru" },
      geometry: {
        type: "Polygon",
        coordinates: [[[74.1, 15.6], [76.5, 17.5], [77.6, 17.2], [78.2, 13.8], [76.5, 11.6], [74.8, 13.0], [74.1, 15.6]]]
      }
    },
    {
      type: "Feature",
      properties: { name: "Gujarat", state_code: "GJ", capital: "Gandhinagar" },
      geometry: {
        type: "Polygon",
        coordinates: [[[68.2, 23.8], [71.5, 24.7], [74.3, 23.0], [73.5, 20.2], [70.5, 20.5], [68.8, 22.2], [68.2, 23.8]]]
      }
    },
    {
      type: "Feature",
      properties: { name: "Assam", state_code: "AS", capital: "Dispur" },
      geometry: {
        type: "Polygon",
        coordinates: [[[89.7, 26.3], [92.5, 26.8], [95.8, 27.9], [95.5, 26.5], [92.2, 24.5], [89.7, 26.3]]]
      }
    },
    {
      type: "Feature",
      properties: { name: "Himachal Pradesh", state_code: "HP", capital: "Shimla" },
      geometry: {
        type: "Polygon",
        coordinates: [[[75.6, 32.2], [78.2, 32.9], [78.8, 31.4], [76.5, 30.5], [75.6, 32.2]]]
      }
    }
  ]
};
