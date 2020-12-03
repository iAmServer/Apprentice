$(document).ready(function () {
    $('.menu').niceScroll({
        cursorcolor: '#999999',
        cursorwidth: 4,
        cursorborder: 'none',
    });

    $('.nav-icon').on('click', function () {
        $('.menu').toggleClass('open');
    });

    $('#dismiss').on('click', function () {
        $('#sidenav').removeClass('open');
    });

    $('.btn-select-skill').on('click', function (e) {
        e.preventDefault();
        var id = $(this).data('id');
        window.location.href = "/users/skill/" + id;
    });

    $('#btnMakePayment').on('click', function (e) {
        e.preventDefault();
        var PBFPubKey = "FLWPUBK_TEST-41212822fe5fbf5a6ac3e3a16560c2fd-X";
        var id = $(this).data('id');
        var ref = "KOSE-fwr-" + id + Math.random();
        var skill = $(this).data('skill');
        var amount = $(this).data('amount');
        getpaidSetup({
            PBFPubKey: PBFPubKey,
            customer_email: $(this).data('customer_email'),
            amount: amount,
            custom_title: $(this).data('custom_title') + " Payment",
            currency: "NGN",
            txref: ref,
            onclose: function (response) {
                alert('Payment Cancelled');
                window.location.reload();
            },
            callback: function (response) {
                var txref = response.tx.txRef;
                var chargeResponse = response.tx.chargeResponseCode;
                var data = {
                    user: id,
                    skill: skill,
                    txtRef: txref,
                    chargeRes: chargeResponse,
                    amount: amount
                }
                $.ajax({
                    url: '/users/paymentverification',
                    data: JSON.stringify(data),
                    type: 'POST',
                    dataType: 'json',
                    cache: false,
                    contentType: 'application/json',
                    success: function (res) {
                        if (res.success) {
                            window.location = '/users/training';
                        }
                    },
                    error: function (res) {
                        console.log(res);
                    }
                })
                // if (chargeResponse == "00" || chargeResponse == "0") {
                //     window.location = "localhost:3000/users/paymentverification/"+txref;
                // }else {
                //     alert('Payment Cancelled');
                // }
            }
        });
    });

    $('.aViewResources').on('click', function (e) {
        e.preventDefault();

        var url = $(this).data('url');
        var id = $(this).data('id');
        $('#vRes').removeAttr("src");
        $('#vRes').attr("src", url);
        $("#vRes")[0].src = $("#vRes")[0].src;
    });

    $('.videoT').click(function () {
        var $this = $(this);
        var res = $this.data('id');
        var skill = $this.data('skill');
        if ($this.is(':checked')) {
            var data = {
                skill: skill,
                res: res
            }
            $.ajax({
                url: '/users/res/done',
                data: JSON.stringify(data),
                type: 'POST',
                dataType: 'json',
                cache: false,
                contentType: 'application/json',
                success: function (res) {
                    console.log('done');
                },
                error: function (res) {
                    console.log(res);
                }
            })
        } else {
            var data = {
                skill: skill,
                res: res
            }
            $.ajax({
                url: '/users/res/undone',
                data: JSON.stringify(data),
                type: 'POST',
                dataType: 'json',
                cache: false,
                contentType: 'application/json',
                success: function (res) {
                    console.log('undone');
                },
                error: function (res) {
                    console.log(res);
                }
            })
        }
    });
});