describe('The menu renderer directive', function () {

	var $compile,
			scope;

	beforeEach(module('backstage'));

	function compileTemplate(tmpl) {
		tmpl = tmpl || '<ul menu-renderer="menuConfigs"></ul>';

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

	it('should be empty when no menu items are provided', function () {
		var el = compileTemplate();
		expect(el.children().length).toBe(0);
	});

	it('should add an element when provided in the menu config', function () {
		scope.menuConfigs = [{name: 'Best link', url: 'beststate'}];
		var el = compileTemplate();

		expect(el.children().length).toBe(1);
	});

	it('should listen for changes in scope', function () {
		var el = compileTemplate();

		expect(el.children().length).toBe(0);

		scope.menuConfigs = [{name: 'Best link', url: 'beststate'}];
		scope.$digest();

		expect(el.children().length).toBe(1);
	});

	it('should remove items', function () {
		scope.menuConfigs = [{name: 'Best link', url: 'beststate'}];
		var el = compileTemplate();
		expect(el.children().length).toBe(1);

		scope.menuConfigs = [];
		scope.$digest();

		expect(el.children().length).toBe(0);
	});

	it('should create a correct li element', function () {
		scope.menuConfigs = [{name: 'Best link', url: 'beststate'}];
		var el = compileTemplate();
		expect(el.html()).toBe('<li><a sref="beststate">Best link</a></li>');

	});
});