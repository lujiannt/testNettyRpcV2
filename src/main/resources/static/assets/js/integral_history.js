/**
 * Created by 96339 on 2018/6/17.
 */
$(function () {


    var $table = initTableByServer($("#user-list"), "/m/queryHistory", {
        query: function (params) {
            params.searchText = $("#search").val();
            params.start = $("#start").val();
            params.end = $("#end").val();
            switch (params.sortName) {
                case "name":
                    params.sortName = "b.name";
                    break;
                case "inum":
                    params.sortName = "i_num";
                    break;
                case "user.nice":
                    params.sortName = "b.nice";
                    break;
                case "typeStr":
                    params.sortName = "a.type";
                    break;
                case "tel":
                    break;
                default:
                    params.sortName = "a.date_time";
                    params.sortOrder = "DESC";
                    break;
            }

            return params;
        },
        res: function (result) {
            $.each(result.rows, function (i, v) {
                v.index = ++i;
                v.tools = "<button class='am-btn am-btn-danger am-btn-xs'>作废</button>";
                if (v.type == 1) {
                    v.typeStr = "<span class='am-text-primary'>正常</span>";
                } else if (v.type == 3) {
                    v.typeStr = "<span class='am-text-warning'>已作废</span>";
                } else {
                    v.typeStr = "<span class='am-text-warning'>兑换</span>";
                }
            });
            return result;
        },
        columns: [
            {
                field: 'index',
                title: "序号",
                width: '5%'
            }, {
                field: 'tel',
                title: "手机号",
                sortable: true,
                width: '15%'
            }, {
                field: 'name',
                title: "姓名",
                sortable: true,
                width: '15%'
            }, {
                field: "inum",
                title: '本次积分',
                width: '10%',
                sortable: true,
            }, {
                field: 'datetime',
                title: "登记时间",
                width: '15%',
                sortable: true,
            }, {
                field: 'user.nice',
                title: "登记人员",
                width: '10%',
            }, {
                field: 'typeStr',
                title: "状态",
                width: '10%',
                sortable: true,
            }, {
                field: 'tools',
                title: "操作",
                width: '15%'
            }
        ],
        search: false,
    }, false);

    //作废单据
    $table.on("click", ".am-btn-danger", function () {
        var row = $table.bootstrapTable("getRowByUniqueId", $(this).closest("tr").data("uniqueid"));
        window.location.href = "/m/updateHistory?id=" + row.id + "&type=3&inum=" + row.inum + "&tel=" + row.tel;
    });

    $('#user-form').validator({
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

    var time2, imap = [], $a;
    $("input[name='tel']").on("input", function () {
        var $this = $(this);
        $this.val($(this).val().replace(/\s+/g, ""));
        window.clearTimeout(time2);
        time2 = window.setTimeout(function () {
            if ($a != undefined && $a.readyState != 4) {
                $a.abort();
                $a = undefined;
            }
            $a = subOtherData("/m/likeByTel", {tel: $this.val()}).done(function (integral) {
                $this.next().children().remove();
                $.each(integral, function (i, v) {
                    imap[v.tel] = v;
                    $this.next().append('<li class="am-dropdown-header" data-id="' + v.tel + '"><a href="#"> ' + v.tel + '</a></li>');
                });

            }).always(function () {
                $a = undefined;
            });
        }, 700);
    }).next().on("click", "li", function () {
        //手机号填充
        $(this).parent().prev().val(imap[$(this).data("id")].tel);
        //名称填充
        $(this).closest("form").find("input[name='name']").val(imap[$(this).data("id")].name);
    });

    $("#end,#start").on('changeDate.datepicker.amui', function (event) {
        $(this).val(event.date.format("yyyy-MM-dd"));

        if ($("#end").val() != "" && $("#start").val() != "")
            $table.bootstrapTable("refresh");
    });

    $("input[name='inum']").on("change", function () {
        localStorage.setItem("inum", $(this).val());
    });
    $("input[name='inum']").val(localStorage.getItem("inum"));

    $("#url-integral").addClass("active");


});