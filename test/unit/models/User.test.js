describe('User', function() {
    it('should have a some properties', function(done){
        User.findOne(1).exec(function(err, user){
            user.should.have.property('id');
            user.should.have.property('createdAt');
            user.username.should.be.eql('Test');
        });
        done();
    });

    it('should have permissions', function(done) {
        User.findOne(1).exec(function(err, user) {
            user.should.have.property('permissions');
            user.hasPermission('test').should.be.ok;
            user.hasPermission('test.test2').should.be.ok;
            done();
        });
    });
});
