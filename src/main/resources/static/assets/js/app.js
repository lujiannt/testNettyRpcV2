$(function () {

    var $fullText = $('.admin-fullText');
    $('#admin-fullscreen').on('click', function () {
        $.AMUI.fullscreen.toggle();
    });

    $(document).on($.AMUI.fullscreen.raw.fullscreenchange, function () {
        $fullText.text($.AMUI.fullscreen.isFullscreen ? '退出全屏' : '开启全屏');
    });


    var dataType = $('body').attr('data-type');
    for (key in pageData) {
        if (key == dataType) {
            pageData[key]();
        }
    }

    $('.tpl-switch').find('.tpl-switch-btn-view').on('click', function () {
        $(this).prev('.tpl-switch-btn').prop("checked", function () {
            if ($(this).is(':checked')) {
                return false
            } else {
                return true
            }
        })
        // console.log('123123123')

    });

    /**
     * 下拉菜单支持键盘事件
     */
    var keyState = false, $dropdown, $prevLi;
    $("body").on("opened.dropdown.amui", ".am-dropdown", function () {
        $dropdown = $(this);
        keyState = true;
        $prevLi = undefined;
    });
    $("body").on("closed.dropdown.amui", ".am-dropdown", function () {
        keyState = false;
        $prevLi = undefined;
    });
    $("body").on("keyup", function (e) {

        if (keyState) {

            if (e.keyCode == 38) {
                //向上
                if ($prevLi != undefined) {
                    if ($prevLi.prev().get(0) == undefined) {
                        return;
                    }
                    $prevLi = $prevLi.prev();
                    $prevLi.children().focus();
                }
            } else if (e.keyCode == 40) {
                //向下
                if ($prevLi != undefined) {
                    if ($prevLi.next().get(0) == undefined) {
                        return;
                    }
                    $prevLi = $prevLi.next();
                    $prevLi.children().focus();
                } else {
                    $prevLi = $dropdown.find("li").first();
                    $prevLi.children().focus();
                }
            } else if (e.keyCode == 13 && $prevLi != undefined) {
                $dropdown.dropdown('close');
            }
        }

    });


    $("input").val("");

    //消息提醒
    var msg = getQueryString()["msg"];
    if (msg != null) {
        toastr.info(msg);
    }

    //获取url中的参数
    function getQueryString() {
        var qs = location.search.substr(1), // 获取url中"?"符后的字串
            args = {}, // 保存参数数据的对象
            items = qs.length ? qs.split("&") : [], // 取得每一个参数项,
            item = null,
            len = items.length;

        for (var i = 0; i < len; i++) {
            item = items[i].split("=");
            var name = decodeURIComponent(item[0]),
                value = decodeURIComponent(item[1]);
            if (name) {
                args[name] = value;
            }
        }
        return args;
    }

    //获取总积分
    subOtherData("/m/queryIntegral").done(function (result) {
        $("#sum_integral").text(result.data);
    });
})
// ==========================
// 侧边导航下拉列表
// ==========================

$('.tpl-left-nav-link-list').on('click', function () {
    $(this).siblings('.tpl-left-nav-sub-menu').slideToggle(80)
        .end()
        .find('.tpl-left-nav-more-ico').toggleClass('tpl-left-nav-more-ico-rotate');
})
// ==========================
// 头部导航隐藏菜单
// ==========================

$('.tpl-header-nav-hover-ico').on('click', function () {
    $('.tpl-left-nav').toggle();
    $('.tpl-content-wrapper').toggleClass('tpl-content-wrapper-hover');
})


// 页面数据
var pageData = {
    // ===============================================
    // 首页
    // ===============================================
    'index': function indexData() {

    },

}

/**
 * 初始化表格
 * @param $table
 * @param url
 * @param param
 * @param noHover
 */
function initTableByServer($table, url, param, noHover) {
    if (noHover == undefined) {
        $table.on("mouseover", "td", function () {
            $("td").stop(true, true);
            $(prevTd).animate({backgroundColor: ($(prevTd).parent().index()) % 2 == 0 ? "#f9f9f9" : ""}, sleep);
            $(prevTd).siblings().animate({backgroundColor: ($(prevTd).parent().index()) % 2 == 0 ? "#f9f9f9" : ""}, sleep);
            $(this).animate({backgroundColor: "#e4e7f3"}, sleep);
            $(this).siblings().animate({backgroundColor: "#e4e7f3"}, sleep);
            $(this).attr("title", $(this).text());

            prevTd = $(this);
        });
    }
    return $table.bootstrapTable({
        showHeader: true,       //是否显示列头,
        toolbarAlign: "right",
        editable: param.edit === undefined ? false : param.edit,//开启编辑模式
        url: url,
        method: 'post',           //请求方式（*）
        toolbar: '#toolbar',        //工具按钮用哪个容器
        dataType: 'json',
        striped: true,           //是否显示行间隔色
        cache: true,            //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
        sortable: true,           //是否启用排序
        sortOrder: "asc",          //排序方式
        queryParams: param.query,//传递参数（*）
        queryParamsType: '',      //设置参数类型为restfull风格
        contentType: 'application/x-www-form-urlencoded;charset=UTF-8;',     //post方式提交json数据时，选择表单类型
        sidePagination: "server",      //分页方式：client客户端分页，server服务端分页（*）
        pageNumber: 1,            //初始化加载第一页，默认第一页
        pageSize: param.size == undefined ? 10 : param.size,            //每页的记录行数（*）
        pageList: param.pageList ? [10, 20, 50, 100] : param.pageList,    //可供选择的每页的行数（*）
        strictSearch: false,             //false:模糊搜索,true精确搜索
        clickToSelect: true,        //是否启用点击选中行
        height: param.height,            //行高，如果没有设置height属性，表格自动根据记录条数觉得表格高度  "550"
        pagination: param.pagination == undefined ? true : param.pagination,          //是否显示分页（*）
        // paginationLoop: param.paginationLoop,
        // onlyInfoPagination: param.onlyInfoPagination,
        uniqueId: "id",           //每一行的唯一标识，一般为主键列
        cardView: false,          //是否显示详细视图
        detailView: param.detailView == undefined ? false : param.detailView,          //是否显示父子表
        responseHandler: param.res,       //服务器返回数据后的处理
        columns: param.columns,             //列集合
        search: param.search == undefined ? true : param.search,                //是否开启搜索
        showExport: true,//显示导出按钮
        exportDataType: "basic",//导出数据类型
        exportTypes: ["excel", 'xls'],            //导出类型
        showFooter: false,
        onLoadSuccess: param.loadSuccess,
        classes: param.classes == undefined ? "am-table am-table-striped am-table-hover table-main" : param.classes,
        onEditableSave: param.onEditableSave == undefined ? " " : param.onEditableSave,
        onClickRow: function (row, element, field) {
            // $(element).addClass('select');//添加当前选中的 success样式用于区别
        },
        onDblClickRow: param.onDblClickRow == undefined ? null : param.onDblClickRow,
        onExpandRow: param.onExpandRow == undefined ? null : param.onExpandRow
    });
}


/**
 * 提交普通文本
 * @param url
 * @param params
 * @returns {*}
 */
function subOtherData(url, params, traditional) {
    return $.ajax({
        url: url,
        type: 'post',
        data: params,
        traditional: traditional === undefined ? false : traditional,
        dataType: 'json',
        error: function (e) {
            toastr.error(e.state);
        },
    });
}

/**
 * 日期转换
 * @param fmt
 * @returns {*}
 * @constructor
 */
Date.prototype.format = function (fmt) { //author: meizz
    var o = {
        "M+": this.getMonth() + 1, //月份
        "d+": this.getDate(), //日
        "h+": this.getHours(), //小时
        "m+": this.getMinutes(), //分
        "s+": this.getSeconds(), //秒
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度
        "S": this.getMilliseconds() //毫秒
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
};

//获取这周的周一
function getFirstDayOfWeek(date) {

    var weekday = date.getDay() || 7; //获取星期几,getDay()返回值是 0（周日） 到 6（周六） 之间的一个整数。0||7为7，即weekday的值为1-7

    date.setDate(date.getDate() - weekday + 1);//往前算（weekday-1）天，年份、月份会自动变化
    return date.format("yyyy-MM-dd");
}

//获取当月第一天
function getFirstDayOfMonth(date) {
    date.setDate(1);
    return date.format("yyyy-MM-dd");
}

//获取当季第一天
function getFirstDayOfSeason(date) {
    var month = date.getMonth();
    if (month < 3) {
        date.setMonth(0);
    } else if (2 < month && month < 6) {
        date.setMonth(3);
    } else if (5 < month && month < 9) {
        date.setMonth(6);
    } else if (8 < month && month < 11) {
        date.setMonth(9);
    }
    date.setDate(1);
    return date.format("yyyy-MM-dd");
}

//获取当年第一天
function getFirstDayOfYear(date) {
    date.setDate(1);
    date.setMonth(0);
    return date.format("yyyy-MM-dd");
}


/**
 * 获取上一个月的日期
 * @date 格式为yyyy-mm-dd的日期，如：2014-01-25
 */
function getPreMonth(date) {
    var arr = date.split('-');
    var year = arr[0]; //获取当前日期的年份
    var month = arr[1]; //获取当前日期的月份
    var day = arr[2]; //获取当前日期的日
    var days = new Date(year, month, 0);
    days = days.getDate(); //获取当前日期中月的天数
    var year2 = year;
    var month2 = parseInt(month) - 1;
    if (month2 == 0) {//如果是1月份，则取上一年的12月份
        year2 = parseInt(year2) - 1;
        month2 = 12;
    }
    var day2 = day;
    var days2 = new Date(year2, month2, 0);
    days2 = days2.getDate();
    if (day2 > days2) {//如果原来日期大于上一月的日期，则取当月的最大日期。比如3月的30日，在2月中没有30
        day2 = days2;
    }
    var t2 = year2 + '-' + parse0(month2) + '-' + parse0(day2);
    return t2;
}

/**
 * 获取日期中月份的第一天
 */
function getfirstDate(firstDate) {
    firstDate.setDate(1); //第一天
    var year = firstDate.getFullYear();
    firstDate.setMonth((firstDate.getMonth() + 1));
    var month = parse0(firstDate.getMonth());
    if (month == "00") {
        month = "12";
    }
    return year + "-" + month + "-" + parse0(firstDate.getDate());
}

/**
 * 获取日期中月份的最后一天
 * @param data
 */
function getEndDate(endDate) {
    endDate.setMonth((endDate.getMonth() + 1));
    endDate.setDate(0);    //最后一天
    return endDate.getFullYear() + "-" + parse0(endDate.getMonth() + 1) + "-" + parse0(endDate.getDate());
}

/**
 * 日期补零方法
 * @param s
 * @returns {string}
 */
function parse0(s) {
    s += "";
    return s.length < 2 ? '0' + s : s;
}
/**
 * 日期转周几
 * @param date
 * @returns {*}
 */
function getMyDay(date) {
    var week;
    if (date.getDay() == 0) week = "周日";
    else if (date.getDay() == 1) week = "周一";
    else if (date.getDay() == 2) week = "周二";
    else if (date.getDay() == 3) week = "周三";
    else if (date.getDay() == 4) week = "周四";
    else if (date.getDay() == 5) week = "周五";
    else if (date.getDay() == 6) week = "周六";
    return week;
}
