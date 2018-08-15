/**
 * Created by 96339 on 2018/6/17.
 */
$(function () {


    var $table = initTableByServer($("#user-list"), "/m/getIntegralList", {
        query: function (params) {
            params.searchText = $("#search").val();
            params.start = $("#start").val();
            params.end = $("#end").val();

            switch (params.sortName) {
                case "dateTime":
                    params.sortName = "date_time";
                    break;
                case "name":
                case "tel":
                case "integral":
                    break;
                default:
                    params.sortName = "last_update";
                    params.sortOrder = "DESC";
                    break;
            }
            return params;
        },
        res: function (result) {
            $.each(result.rows, function (i, v) {
                v.index = ++i;
            });
            return result;
        },
        columns: [
            {
                field: 'index',
                title: "序号",
                width: '10%'
            }, {
                field: 'tel',
                title: "手机号",
                sortable: true,
                width: '20%'
            }, {
                field: 'name',
                title: "姓名",
                sortable: true,
                width: '20%'
            }, {
                field: "integral",
                title: '积 分',
                width: '20%',
                sortable: true,
            }, {
                field: 'dateTime',
                title: "登记时间",
                width: '15%',
                sortable: true,
            }, {
                field: 'lastDate',
                title: "最后更新时间",
                width: '15%',
                sortable: true,
            },
        ],
        search: false,
    }, false);

    /**
     * 添加积分
     */
    $('#user-form').validator({
        validate: function (validity) {
            var v = $(validity.field).val();
            if ($(validity.field).attr("name") == "tel" && !/^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/.test(v)) {
                validity.valid = false;
            }
        }
    });
    /**
     * 兑换商品，减掉积分
     */
    $('#dh-form').validator({
        validate: function (validity) {
            var v = $(validity.field).val();
            if ($(validity.field).attr("name") == "tel" && !/^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/.test(v)) {
                validity.valid = false;
            }
        }
    });

    var time;
    $("#search").on("input", function () {
        window.clearTimeout(time);
        time = window.setTimeout(function () {
            $table.bootstrapTable("refresh");
        }, 700);
    });

    var time2,imap = [],$a;
    $("input[name='tel']").on("input", function () {
        var $this = $(this);
        window.clearTimeout(time2);
        time2 = window.setTimeout(function () {
            if($a != undefined && $a.readyState != 4){
                $a.abort();
                $a = undefined;
            }
            $a = subOtherData("/m/likeByTel", {tel: $this.val()}).done(function (integral) {
                $this.next().children().remove();
                $.each(integral, function (i, v) {
                    imap[v.tel] = v;
                    $this.next().append('<li class="am-dropdown-header" data-id="'+v.tel+'"><a href="#"> ' + v.tel + '</a></li>');
                });

            }).always(function(){
                $a = undefined;
            });
        }, 700);
    }).next().on("click","li",function(){
        //手机号填充
        $(this).parent().prev().val(imap[$(this).data("id")].tel);
        //名称填充
        $(this).closest("form").find("input[name='name']").val(imap[$(this).data("id")].name);
    });


    $("input[name='inum']").on("change",function(){
        localStorage.setItem("inum",$(this).val());
    });
    $("input[name='inum']").val(localStorage.getItem("inum"));

    $("#end,#start").on('changeDate.datepicker.amui', function (event) {
        $(this).val(event.date.format("yyyy-MM-dd"));

        if ($("#end").val() != "" && $("#start").val() != "")
            $table.bootstrapTable("refresh");
    });


    $("#url-integral").addClass("active");


});