var recast = require('recast')
var visit  = recast.types.visit
var build  = recast.types.builders
var parse  = recast.parse
var print  = recast.print

module.exports = replacer

function replacer(ast) {
  if (Buffer.isBuffer(ast)) ast = String(ast)
  if (typeof ast === 'string')
    ast = parse(ast)

  return replace;

  function replace(methodPath, updater) {
    var methodPath = Array.isArray(methodPath)
      ?  methodPath
      : [methodPath]

    var size = methodPath.length

    fn = size === 1 ? single : nested;
    visit(ast, {
      visitNode(path) {
        fn(path.node);
        this.traverse(path);
      }
    });

    return replace

    function single(node) {
      if (node.type !== 'CallExpression' && node.type !== 'Identifier') return;
      if (node.type === 'CallExpression' && methodPath[0] !== node.callee.name) return;
      if (node.type === 'Identifier' && methodPath[0] !== node.name) return;

      var result = updater(node)
      if (result !== undefined) {
        return false
      }
    }

    function nested(node) {
      if (node.type !== 'CallExpression') return

      var c = node.callee
      var o = node.callee
      var i = size - 1

      if (c.type === 'Identifier') return
      while (c && c.type === 'MemberExpression') {
        o = c
        if (c.computed) return
        if (methodPath[i] !== c.property.name) return
        c = c.object
        i = i - 1
      }

      if (!o.object || !o.object.name) return
      if (o.object.name !== methodPath[0]) return

      var result = updater(node)
      if (result !== undefined) {
        return false
      }
    }
  }
}
