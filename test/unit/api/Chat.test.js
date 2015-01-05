var Bot = require('./chat/chat');

describe('Chat', function() {
    describe('#hear', function() {
        it('calls the methods when a message with the format appears', function(done) {
            var bot = new Bot();
            bot.hear('test', function(message) {
                message.should.be.eql('test');
                done();
            });

            bot.receive(new TextMessage(null, 'test', null));
        });
    });
});
