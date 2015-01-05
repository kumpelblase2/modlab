describe('Site', function() {
    describe('Page', function() {
        it('should allow a plugin to register a page');
        it("should allow a plugin to remove it's own page");
        it('should thrown an error if you want to remove someone elses page');
        it('should require a name for the page');
    });

    describe('Widget', function() {
        it('should allow a plugin to register a widget');
    });

    describe('Resources', function() {
        it('should allow plugins to register client resources');
        it('should not duplicate resources');
        it('should add stylesheets in the head tag');
        it('should add javascript files in the head tag');
    });
});
