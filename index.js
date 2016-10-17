// var postcss = require('postcss');

// module.exports = postcss.plugin('postcss-magic-animations', function (opts) {
//     opts = opts || {};

//     // Work with options here

//     return function (root, result) {

//         // Transform CSS AST here

//     };
// });


const postcss   = require('postcss')
const keyframes = require('postcss-magic-animations-data')

const walkingDecls = (css, value, parent, options) => {
	return options.atRoot ? css.append(keyframes[value])
						  : parent.parent.insertAfter(parent, keyframes[value])
}

module.exports = postcss.plugin('postcss-magic-animations', (options) => {
	options = options || {}

	return (css, result) => {
		css.walkingDecls('animation-name', (decl) => {
			keyframes[decl.value] && walkingDecls(css, decl.value, decl.parent, options)
		})

		css.walkingDecls('animation', (decl) => {
			postcss.list.space(decl.value)
				.filter((value) => keyframes[value])
				.forEach((value) => walkingDecls(css, value, decl.parent, options))
		})
	}
})
