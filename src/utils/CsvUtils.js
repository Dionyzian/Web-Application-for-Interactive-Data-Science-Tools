import { mean, median, mode, min, max, variance, standardDeviation, sampleCorrelation } from 'simple-statistics'

export function csvToJson(csv) {
  const lines = csv.split('\n');
  const headers = lines[0].split(',');
  const result = [];

  for (let i = 1; i < lines.length; i++) {
    const obj = {};
    const currentLine = lines[i].split(',');

    if (currentLine.length !== headers.length) {
      continue;
    }

    for (let j = 0; j < headers.length; j++) {
      const value = currentLine[j].trim();
      obj[headers[j]] = value === '' || value === undefined || value === null ? null : isNaN(value) ? value : +value;
    }

    result.push(obj);
  }

  return { headers: headers, data: result };
}



export function findMissingElements(jsonObj, requiredProperties) {
  const missingElements = [];

  jsonObj.forEach((item) => {
    const missing = requiredProperties.filter((property) => {
      return !(property in item) || !item[property];
    });

    if (missing.length > 0) {
      missing.forEach((property) => {
        if (!(property in item)) {
          item[property] = null;
        }
      });

      missingElements.push({ item: item, missing: missing });
    }
  });

  return missingElements;
}


export function getJsonFeatureTypes(jsonData) {
  const featureTypes = { nominal: [], numerical: [] };
  if (jsonData.length > 0) {
    const firstRow = jsonData[0];
    for (const feature in firstRow) {
      if (isNaN(firstRow[feature])) {
        featureTypes.nominal.push(feature);
      } else {
        featureTypes.numerical.push(feature);
      }
    }
  }
  return featureTypes;
}


export function getBasicStats(jsonData, numericalFeatures) {
  const basicStats = {}
  numericalFeatures.forEach(feature => {
    const values = []
    jsonData.forEach(dataPoint => {
      const value = parseFloat(dataPoint[feature])
      if (!isNaN(value)) {
        values.push(value)
      }
    })

    if (values.length > 0) {
      basicStats[feature] = {
        mean: Number(mean(values).toFixed(2)),
        median: Number(median(values).toFixed(2)),
        mode: Number(mode(values).toFixed(2)),
        max: Number(max(values).toFixed(2)),
        min: Number(min(values).toFixed(2)),
        variance: Number(variance(values).toFixed(2)),
        std: Number(standardDeviation(values).toFixed(2))
      }
    }
  })

  return basicStats
}



export function getNominalStats(jsonData, nominalFeatures) {
  const nominalStats = {}

  jsonData.forEach(dataPoint => {
    nominalFeatures.forEach(feature => {
      const value = dataPoint[feature]
      if (!nominalStats[feature]) {
        nominalStats[feature] = []
      }
      nominalStats[feature].push(value)
    })
  })

  nominalFeatures.forEach(feature => {
    const values = nominalStats[feature]
    if (values.length > 0) {
      const totalCount = jsonData.length
      const distribution = {}
      values.forEach(value => {
        distribution[value] = distribution[value] ? distribution[value] + 1 : 1
      })
      const probability = Object.values(distribution).map(count => count / totalCount)
      const entropy = -1 * probability.reduce((sum, p) => sum + p * Math.log2(p), 0)
      const distinctValues = Object.keys(distribution)
      const numDistinctValues = distinctValues.length
      const frequencyPercentages = {}
      distinctValues.forEach(value => {
        frequencyPercentages[value] = Number(((distribution[value] / totalCount) * 100).toFixed(2))
      })
      nominalStats[feature] = {
        mode: mode(values),
        entropy: Number(entropy.toFixed(2)),
        numDistinctValues,
        distinctValues,
        frequencyPercentages
      }
    }
  })

  return nominalStats
}





export function getCorrelations(jsonData, numericalFeatures) {
  const correlations = {};

  for (let i = 0; i < numericalFeatures.length; i++) {
    const feature1 = numericalFeatures[i];
    correlations[feature1] = {};

    for (let j = 0; j < numericalFeatures.length; j++) {
      const feature2 = numericalFeatures[j];
      const values1 = [];
      const values2 = [];

      for (const point of jsonData) {
        const value1 = parseFloat(point[feature1]);
        const value2 = parseFloat(point[feature2]);

        if (!isNaN(value1) && !isNaN(value2)) {
          values1.push(value1);
          values2.push(value2);
        }
      }

      if (values1.length >= 2 && values2.length >= 2) {
        correlations[feature1][feature2] = sampleCorrelation(values1, values2);
      } else {
        correlations[feature1][feature2] = NaN;
      }
    }
  }

  return correlations;
}







export function standardizeData(data, featureStats) {
  const standardizedData = [];

  for (let i = 0; i < data.length; i++) {
    const standardizedRow = {};

    for (let feature in data[i]) {
      if (typeof data[i][feature] === 'number' && data[i][feature] !== null && data[i][feature] !== undefined) {
        if (featureStats[feature] && featureStats[feature].mean !== undefined && featureStats[feature].std !== undefined) {
          const value = data[i][feature];

          const mean = featureStats[feature].mean;
          const standardDeviation = featureStats[feature].std;


          const standardizedValue = Number(((value - mean) / standardDeviation).toFixed(2));

          standardizedRow[feature] = standardizedValue;
        } else {
          standardizedRow[feature] = data[i][feature];
        }
      } else {
        standardizedRow[feature] = data[i][feature];
      }
    }

    standardizedData.push(standardizedRow);
  }

  return standardizedData;
}

export function normalizeDataMinMax(data, featureStats) {
  const normalizedData = [];

  for (let i = 0; i < data.length; i++) {
    const normalizedRow = {};

    // Loop through each feature
    for (let feature in data[i]) {
      if (typeof data[i][feature] === 'number' && data[i][feature] !== null && data[i][feature] !== undefined) {
        if (featureStats[feature] && featureStats[feature].min !== undefined && featureStats[feature].max !== undefined) {
          const value = data[i][feature];

          const min = featureStats[feature].min;
          const max = featureStats[feature].max;

          const normalizedValue = Number(((value - min) / (max - min)).toFixed(2));

          normalizedRow[feature] = normalizedValue;
        } else {
          normalizedRow[feature] = data[i][feature];
        }
      } else {
        normalizedRow[feature] = data[i][feature];
      }
    }

    normalizedData.push(normalizedRow);
  }

  return normalizedData;
}

export function logTransformData(data, featureStats) {
  const transformedData = [];

  for (let i = 0; i < data.length; i++) {
    const transformedRow = {};

    for (let feature in data[i]) {
      if (typeof data[i][feature] === 'number' && data[i][feature] !== null && data[i][feature] !== undefined) {
        if (featureStats[feature] && featureStats[feature].mean !== undefined && featureStats[feature].std !== undefined
          && featureStats[feature].mean > 0 && featureStats[feature].std > 0) {
          const value = data[i][feature];

          const mean = featureStats[feature].mean;
          const standardDeviation = featureStats[feature].std;

          const transformedValue = Number((Math.log(value / mean) / standardDeviation).toFixed(2));

          transformedRow[feature] = transformedValue;
        } else {
          transformedRow[feature] = data[i][feature];
        }
      } else {
        transformedRow[feature] = data[i][feature];
      }
    }

    transformedData.push(transformedRow);
  }

  return transformedData;
}

export function exponentialTransform(data, numericalFeatures) {
  const transformedData = [];

  // Loop through each row of the data
  for (let i = 0; i < data.length; i++) {
    const transformedRow = {};

    for (let key in data[i]) {
      if (numericalFeatures.includes(key)) {
        if (typeof data[i][key] === 'number' && data[i][key] !== null && data[i][key] !== undefined) {
          const value = data[i][key];

          const transformedValue = Number(Math.exp(value).toFixed(2));

          transformedRow[key] = transformedValue;
        } else {
          transformedRow[key] = data[i][key];
        }
      } else {
        transformedRow[key] = data[i][key];
      }
    }

    transformedData.push(transformedRow);
  }

  return transformedData;
}

export function oneHotEncode(data, nominalFeatures) {
  const encodedData = [];

  // Loop through each row of the data
  for (let i = 0; i < data.length; i++) {
    const encodedRow = {};

    for (let feature in data[i]) {
      if (nominalFeatures.includes(feature)) {
        const values = Array.from(new Set(data.map(row => row[feature])));

        for (let value of values) {
          encodedRow[`${feature}_${value}`] = data[i][feature] === value ? 1 : 0;
        }
      } else {
        encodedRow[feature] = data[i][feature];
      }
    }

    encodedData.push(encodedRow);
  }

  return encodedData;
}
