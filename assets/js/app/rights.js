$(function() {
    $('#btnAddPermission').click(function() {
        $(this).parent().append(JST["assets/templates/rights/permissioninput.html"]);
    });

    $('#deleteGroup').click(function() {
        var self = this;
        swal({
            title: 'Are you sure?',
            text: 'If you continue, you will not be able to recover the deleted group.',
            type: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#DD6B55',
            confirmButtonText: 'Yes, continue'
        }, function() {
            $.ajax({
                url: self.getAttribute('data-href'),
                type: 'DELETE',
                dataType: 'json',
                success: function(result) {
                    window.location.href = self.getAttribute('data-return');
                },
                error: function(result) {
                    if(result.status === 200) {
                        window.location.href = self.getAttribute('data-return');
                    }
                }
            });
        });
    });
});
