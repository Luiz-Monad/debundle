const replace = require('../extern/replace-method');

// Webpack debundling shim
// Here's what a webpack bundle looks like:
//
// (function() {
//   // webpackBootstrap
//   var __webpack_modules__ = ({
//     "module_1": (function(module, exports, __webpack_require__) {
//       var foo = __webpack_require__(2); // The index of the item to pull in within the array
//     }),
//     "module_2": (function(module, exports, __webpack_require__) {
//       "I am foo!";
//     })
//   };
// })
function webpackDecoder(moduleArray, knownPaths) {
  // Ensure that the bit of AST being passed is an array
  if (!Array.isArray(moduleArray)) {
    throw new Error(`The root level IIFE didn't have an array for it's first parameter, aborting...`);
  }

  return moduleArray.map((moduleDescriptor, id) => {
    return {
      id: moduleDescriptor.key.value,
      code: moduleDescriptor.value,
    };
  }).filter(i => i.code);
}

function getModuleFileName(node, knownPaths) {
  let id = node.arguments[0].raw;
  return knownPaths[id] ? knownPaths[id] : `./${id}`;
}

module.exports = webpackDecoder;
