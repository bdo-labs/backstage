describe('Module renderer directive', function () {
	var scope,
		$compile,
		mockDirective = {
			compile: function () {
				return function link() {};
			}
		};

	function compileDirective(tmpl) {
		tmpl = tmpl || '<div module-renderer="boxes"></div>';

		var element = $compile(tmpl)(scope);

		scope.$digest();

		return element;
	}

	beforeEach(function () {

		// Define a mock directive
		angular.module('mockModule', []).directive('mock', function () {
			return mockDirective;
		});

		module('backstage', 'mockModule');


		inject(function ($rootScope, _$compile_) {
			scope = $rootScope.$new();
			$compile = _$compile_;

		});


	});

	it('should be defined', inject(function (moduleRendererDirective) {
		expect(moduleRendererDirective).toBeDefined();

	}));

	it('should be empty if no boxes have been defined', function () {
		var e = compileDirective();
		expect(e.children().length).toBe(0);
	});

	it('should compile and link a defined directive', function () {
		var linkCalled,
			linkScope,
			e;

		spyOn(mockDirective, 'compile').andCallFake(function () {
			return function (scope) {
				linkCalled = true;
				linkScope = scope;
			};
		});

		scope.boxes = ['mock'];

		e = compileDirective();

		expect(e.children().length).toBe(1);
		expect(linkCalled).toBe(true);
		expect(linkScope).toBeDefined();
	});

	it('should listen for changes to scope', function () {
		var e = compileDirective();

		expect(e.children().length).toBe(0);

		scope.boxes = ['mock'];
		scope.$digest();

		expect(e.children().length).toBe(1);
	});

	it('should not reinstantiate an existing module', function () {
		scope.boxes = ['mock'];

		spyOn(mockDirective, 'compile');

		var e = compileDirective(),
			callCount = mockDirective.compile.callCount;

		expect(mockDirective.compile).toHaveBeenCalled();

		scope.$digest();

		expect(callCount).toEqual(mockDirective.compile.callCount);
	});

	it('should instantiate new boxes added to scope', function () {
		scope.boxes = ['mock'];
		var e = compileDirective();
		expect(e.children().length).toBe(1);

		spyOn(mockDirective, 'compile');

		scope.boxes = ['mock', 'mock'];
		scope.$digest();

		expect(e.children().length).toBe(2);
		expect(mockDirective.compile).toHaveBeenCalled();
	});

	it('should support object box configs', function () {
		var linkCalled,
			e;

		spyOn(mockDirective, 'compile').andCallFake(function () {
			linkCalled = true;
		});

		scope.boxes = [{name: 'mock'}];
		e = compileDirective();

		expect(e.children().length).toBe(1);
		expect(mockDirective.compile).toHaveBeenCalled();
		expect(linkCalled).toBe(true);

	});


	it('should rearrange boxes by object reference', function () {
		var box1 = {name: 'mock'},
			box2 = {name: 'mock'},
			el1,
			el2,
			e;

		scope.boxes = [box1, box2];
		e = compileDirective();
		expect(e.children().length).toBe(2);

		el1 = e.children()[0];
		el2 = e.children()[1];

		scope.boxes = [box2, box1];
		scope.$digest();

		expect(e.children().length).toBe(2);

		expect(e.children()[0]).toBe(el2);
		expect(e.children()[1]).toBe(el1);
	});

	it('should not rearrange equal boxes on digest', function () {
		var el1,
			el2,
			e;

		scope.boxes = ['mock', 'mock'];
		e = compileDirective();
		expect(e.children().length).toBe(2);

		el1 = e.children()[0];
		el2 = e.children()[1];

		scope.$digest();

		expect(e.children().length).toBe(2);

		expect(e.children()[0]).toBe(el1);
		expect(e.children()[1]).toBe(el2);

	});

	it('should remove boxes when their config is removed', function () {
		scope.boxes = ['mock'];
		var e = compileDirective();

		expect(e.children().length).toBe(1);

		scope.boxes.splice(0, 1);
		scope.$digest();

		expect(e.children().length).toBe(0);
	});

	it('should handle mixed string and object box configs', function () {
		scope.boxes = ['mock', {name: 'mock'}];
		var e = compileDirective();

		expect(e.children().length).toBe(2);
	});

	it('should handle swapping out the first boxes', function () {
		scope.boxes = ['mock', 'mock2', 'mock3'];
		var e = compileDirective();
		expect(e.children().length).toBe(3);

		scope.boxes = ['mocket', 'mock2', 'mock3'];
		scope.$digest();
		expect(e.children().length).toBe(3);
	});

	it('should add normalized attributes from box config to directive', function () {
		var attrs,
			e;

		spyOn(mockDirective, 'compile').andCallFake(
			function (tElement, tAttrs, transclude) {
				attrs = tAttrs;
				return function () {};
			}
		);

		scope.boxes = [{
			name: 'mock',
			attributes: {
				testattri: 'aoeu',
				testing : 'oeu'
			}
		}];

		e = compileDirective();

		expect(attrs.testattri).toBe('aoeu');
		expect(attrs.testing).toBe('oeu');
	});

	it('should "denormalize" attributes', function () {
		var attrs,
			e;

		scope.boxes = [{
			name: 'mock',
			attributes: {
				normTesting: 'test'
			}
		}];

		e = compileDirective();

		expect(e.children()[0].getAttribute('norm-testing')).toBe('test');
	});

	it('should handle templates', function () {
		scope.boxes = [{
			template: 'Hei'
		}];

		var e = compileDirective();

		expect(e.children()[0].innerHTML).toEqual('Hei');
	});

	it('should compile templates', function () {
		scope.boxes = [{
			template: '<div ng-repeat="a in [1, 2, 3]"></div>'
		}];

		// Notice we have to count divs - angular adds comment nodes
		var e = compileDirective(),
			divCount = Array.prototype.reduce.call(e.children()[0].childNodes,
			function (result, node) {
				return result + (node.tagName === 'DIV');
			},
			0
		);

		expect(divCount).toBe(3);

	});


	it('should throw error on invalid config', function () {
		scope.boxes = [{}];

		expect(function () {
			compileDirective();
		}).toThrow();
	});

	it('should compile templates against the correct scope', function () {
		scope.boxes = [{
			template: '{{testvalue}}'
		}];

		scope.testvalue = 'aoeu';
		
		var e = compileDirective();
		
		expect(e.children()[0].innerHTML).toBe('aoeu');
	});
	

});
