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

    describe('#isIncluded', function() {
        it('should act identical to #match', function() {
            PermissionService.isIncluded(['a.b'], 'a.b').should.be.eql(PermissionService.matches('a.b', 'a.b'));
            PermissionService.isIncluded(['a.b'], 'a.b.c').should.be.eql(PermissionService.matches('a.b', 'a.b.c'));
            PermissionService.isIncluded(['a.*'], 'a.b').should.be.eql(PermissionService.matches('a.*', 'a.b'));
            PermissionService.isIncluded(['a.*.b'], 'a.b.b').should.be.eql(PermissionService.matches('a.*.b', 'a.b.b'));
            PermissionService.isIncluded(['a.*'], 'a').should.be.eql(PermissionService.matches('a.*', 'a'));
        });

        it('returns true if any one of the given permissions match', function() {
            PermissionService.isIncluded(['a.b', 'a.c', 'b.*'], 'a.c').should.be.ok;
            PermissionService.isIncluded(['a.b', 'a.c', 'b.*'], 'a.d').should.not.be.ok;
            PermissionService.isIncluded(['a.b', 'a.c', 'b.*'], 'b.a').should.be.ok;
            PermissionService.isIncluded([], 'a').should.not.be.ok;
        });
    });
});
