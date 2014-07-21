describe('The menu renderer directive', function () {

	var $compile,
			scope;

	beforeEach(module('backstage'));

	function compileTemplate(tmpl) {
		tmpl = tmpl || '<div menu-renderer></div>';

		var element = $compile(tmpl)(scope);

		scope.$digest();

		return element;
	}


	beforeEach(inject(function (_$rootScope_, _$compile_) {
		scope = _$rootScope_.$new();
		$compile = _$compile_;
	}));


	it('should be defined', inject(function (menuRendererDirective) {
		expect(menuRendererDirective).toBeDefined();
	}));
});