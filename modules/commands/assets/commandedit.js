$(function() {
    $('.delete-button').click(function() {
        var self = this;
        swal({
            title: 'Are you sure?',
            text: 'If you continue, you will not be able to recover the deleted command.',
            type: 'warning',
            showCancelButton: true,
            confirmButtonClass: 'btn-danger',
            confirmButtonText: 'Yes, continue',
            closeOnConfirm: false
        }, function() {
            $.ajax({
                url: self.getAttribute('data-href'),
                type: 'DELETE',
                dataType: 'json',
                success: function(result) {
                    window.location.href = self.getAttribute('data-return');
                },
                error: function(result) {
                    if (result.status === 200) {
                        window.location.href = self.getAttribute('data-return');
                    }
                }
            });
        });
    });
});
