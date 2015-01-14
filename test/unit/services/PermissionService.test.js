describe('PermissionService', function() {
    describe('#matches', function() {
        it('returns true if the permissions are identical', function() {
            PermissionService.matches('a.b', 'a.b').should.be.ok;
            PermissionService.matches(['a', 'b'], ['a', 'b']).should.be.ok;
        });

        it('returns false if any of the parts are different', function() {
            PermissionService.matches('a.b', 'a.c').should.not.be.ok;
            PermissionService.matches('b.c', 'a.c').should.not.be.ok;
            PermissionService.matches('a', 'a.c').should.not.be.ok;
            PermissionService.matches('a.c', 'a').should.not.be.ok;
        });

        it('fails when its passed the wrong type');

        it('should work with strings and arrays', function() {
            PermissionService.matches('a.b', ['a', 'b']).should.be.ok;
        });

        it('should allow wildcard character for one group', function() {
            PermissionService.matches('a.*.b', 'a.b.b').should.be.ok;
            PermissionService.matches('a.*', 'a.b').should.be.ok;
            PermissionService.matches('a.*', 'a.b.b').should.not.be.ok;
        });
    });
});
