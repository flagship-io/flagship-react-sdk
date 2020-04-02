import withFlagship from './withFlagship';
import * as fsHooks from './hooks';
import FlagshipContext from './FlagshipContext';

// if (process.env.NODE_ENV === "production") {
//   module.exports = require("./xxxxxx.min.js");
// } else {
//   module.exports = require("./xxxxxx.js");
// }

// export const ;
// export fsHooks;

export default {
  withFlagship,
  FlagshipProvider: FlagshipContext,
  ...fsHooks,
};
