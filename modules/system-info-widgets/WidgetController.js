module.exports = {
    modules: function(req) {
        var contentString = "<div class='panel panel-primary'><div class='panel-heading'><div class='row'><div class='col-xs-3'><i class='fa fa-cog fa-5x'></i>";
        contentString += "</div><div class='col-xs-9 text-right'><div class='huge'>" + Object.keys(sails.app.modules).length + "</div><div>Enabled plugins</div></div></div></div>";
        contentString += "<a href='/plugins'><div class='panel-footer'><span class='pull-left'>View</span><span class='pull-right'><i class='fa fa-arrow-circle-right'></i>";
        contentString += "</span><div class='clearfix'></div></div></a></div>";

        return {
            name: 'Plugins',
            size: 3,
            content: contentString
        };
    },
    users: function(req) {
        console.log(User.count());
        var contentString = "<div class='panel panel-primary'><div class='panel-heading'><div class='row'><div class='col-xs-3'><i class='fa fa-comments fa-5x'></i>";
        contentString += "</div><div class='col-xs-9 text-right'><div class='huge'>" + User.find().count() + "</div><div>Registered Users</div></div></div></div>";
        contentString += "<a href='/rights'><div class='panel-footer'><span class='pull-left'>View</span><span class='pull-right'><i class='fa fa-arrow-circle-right'></i>";
        contentString += "</span><div class='clearfix'></div></div></a></div>";

        return {
            name: 'Users',
            size: 3,
            content: contentString
        };
    },
    groups: function(req) {
        return false;
    }
};
