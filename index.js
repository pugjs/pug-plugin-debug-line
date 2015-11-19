'use strict';

var walk = require('jade-walk');
var stringify = require('js-stringify');

module.exports = function (options) {
  return {
    preCodeGen: function (ast) {
      ast = JSON.parse(JSON.stringify(ast));
      walk(ast, function (node, replace) {
        if (node.type === 'Tag' || node.type === 'InterpolatedTag') {
          [
            { name: 'data-jade-file', val: node.filename, mustEscape: true },
            { name: 'data-jade-line', val: node.line, mustEscape: false },
            { name: 'data-jade-column', val: node.column, mustEscape: false }
          ].forEach(function (attr) {
            if (attr.val === undefined) return;
            var alreadyExisted = findAttr(node.attrs, attr.name);
            if (alreadyExisted) {
              alreadyExisted.val = stringify(attr.val);
              alreadyExisted.mustEscape = attr.mustEscape;
            } else {
              attr.val = stringify(attr.val);
              node.attrs.push(attr);
            }
          });
        }
      });
      return ast;
    }
  };
};

function findAttr (attrs, name) {
  for (var i = 0; i < attrs.length; i++) {
    if (attrs[i].name === name) return attrs[i];
  }
}
