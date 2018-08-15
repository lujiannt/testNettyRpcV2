/**
 * Created by 96339 on 2018/6/17.
 */
$(function () {


    var $table = initTableByServer($("#user-list"), "/m/getUsers", {
        query: function (params) {
            params.searchText = $("#search").val();
            return params;
        },
        res: function (result) {
            $.each(result.rows, function (i, v) {
                v.index = ++i;
                v.tools = "<button class='am-btn am-btn-danger am-btn-xs'>修改</button>"
            });
            return result;
        },
        columns: [
            {
                field: 'index',
                title: "序号",
                width: '5%'
            }, {
                field: 'name',
                title: "用户名",
                width: '15%'
            }, {
                field: 'nice',
                title: "昵称",
                width: '15%'
            }, {
                field: 'tools',
                title: "操作",
                width: '15%'
            }
        ],
        search: false,
    }, false);

    $table.on("click", ".am-btn-danger", function () {
        var row = $table.bootstrapTable("getRowByUniqueId",$(this).closest("tr").data("uniqueid"));
        $("input[name='name']").val(row.name).attr("disabled",true);
        $("input[name='id']").val(row.id);
        $("input[name='nice']").val(row.nice);
        $("input[name='passwd']").val(row.passwd);
        $('#user-form').attr("action","/m/updateUser");
        $("#user-popup").modal();
    });

    $("#user-popup").on("close.modal.amui",function(){
        $('#user-form').attr("action","/m/insertUser");
        $("input[name='name']").attr("disabled",false);
    });

    var time;
    $("#search").on("input",function(){
        window.clearTimeout(time)
        time = window.setTimeout(function(){
            try {
                $table.bootstrapTable("refresh");
            } catch (e) {
            }
        },700);

    });

    $('#user-form').validator({
        validate: function (validity) {

            if ($(validity.field).attr("name") == "name") {
                var d = subOtherData("/m/isExists", {name: $(validity.field).val()});
                d.then(function (result) {
                    if (result.state == 1) {
                        $(validity.field).parent().addClass("am-form-success");
                        validity.valid = true;
                    } else {
                        toastr.info("用户名已存在");
                        validity.valid = false;
                    }
                    return validity;
                }, function (e) {
                    console.log(validity, e);
                    return validity;
                });
                console.log(validity);
                return d;
            } else {

                console.log(validity);
            }

        },
        submit: function() {
            var formValidity = this.isFormValid();

            // 表单验证未成功，而且未成功的第一个元素为 UEEditor 时，focus 编辑器
            if (!formValidity) {
                toastr.info("no");
            }

            console.warn('验证状态：', formValidity ? '通过' : '未通过');
            return true;
        }
    });

    $("#url-user").addClass("active");
});