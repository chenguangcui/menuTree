(function ($) {
    $.fn.menuTree = function (options) {
        function tree(options) {
            this.url = options.url || '';  //列表接口
            this.treeId = options.treeId || 'myTree';  //树id，默认id为myTree
            this.skin = options.skin || '#3c4b52';    //设置字体颜色
            this.treeData = options.treeData;
            this.init();
            this.initEvents();
        }

        var fn = tree.prototype;
        fn.init = function () {
            this.renderTreeData(this.treeData);
            $('#' + this.treeId).css('color', this.skin);
        }
        fn.renderTreeData = function (data) {
            var that = this;
            var html = "";
            var checkAllStr = '<div class="checkAll-contanier"><input type="checkbox" name="checkAll" ><span>全选</span></div>';
            $.each(data, function (index, value) {
                html += '<ul class="root-child">';
                html += '<li>';
                html += '<input type="checkbox" name="checkOne"/>';
                html += '<span>' + value.name + '</span>';

                html += that.renderChildren(value);

                html += '</li>';
                html += '</ul>';
            });
            $('#' + that.treeId).append(html);
            $('#' + that.treeId).prepend(checkAllStr);
        }
        fn.renderChildren = function (value) {
            var that = this;
            var html = "";
            //如果有孩子
            if (value.childMenus.length > 0) {
                html += '<ul>';
                $.each(value.childMenus, function (index, tmpValue) {
                    html += '<li>';
                    html += '<input type="checkbox" name="checkOne"/>';
                    html += '<span>' + tmpValue.name + '</span>';
                    html += that.renderChildren(tmpValue);
                    html += '</li>';
                });
                html += '</ul>';
            }
            return html;
        }
        fn.renderColumnData = function (data) {  //获取一列数据
            var that = this;
            //var saveData = data;
            //delete saveData.children; //孩子不保存
            var columnStart = '<ul class="root-child"><li id="' + data.id + '">\
					<input type="hidden" name="data" value=' + JSON.stringify(data) + '><input type="checkbox" name="checkOne"/>\
					<span>' + data.name + '</span>';
            var columnDataStr = that.recursive(data); //递归遍历树
            return columnStart + columnDataStr + '</li></ul>';
        }
        fn.recursive = function (data) {
            var that = this;
            var beginStr = '<ul>', oneDataStr = '';
            var tpl = '<li id="{id}"><input type="hidden" name="data" value=\{data}><input type="checkbox" name="checkOne" /><span>{name}</span>';
            $.each(data.childMenus, function (index, value) {
                oneDataStr += tpl.replace('{id}', value.id)
                    .replace('{name}', value.name)
                    .replace('{data}', JSON.stringify(value))
                if (value.childMenus && value.childMenus.length > 0) {
                    oneDataStr += that.recursive(value);
                }
            })
            return beginStr += oneDataStr + '</ul></li></ul>';
        }
        fn.initEvents = function () {
            var that = this;
            //全选
            $('#' + this.treeId).delegate('input[name="checkAll"]', 'click', function () {
                if ($(this).prop('checked')) {
                    $('#' + that.treeId + ' input[name="checkOne"]').each(function (index) {
                        $(this).prop('checked', true);
                    })
                    $('#' + that.treeId).find('input').prop('checked', true);
                } else {
                    $('#' + that.treeId).find('input').prop('checked', false);
                }
            })
            //勾选
            $('#' + this.treeId).delegate('input[name="checkOne"]', 'click', function () {
                var _this = $(this);
                if (_this.prop('checked')) {
                    _this.parent('li').find('input[name="checkOne"]').each(function (index) {
                        $(this).prop('checked', true);
                    })
                    _this.children('input[name="checkOne"]').prop('checked', true);
                } else {
                    _this.parent('li').find('input[name="checkOne"]').each(function (index) {
                        $(this).prop('checked', false);
                    })
                }

                that.setParentIsCheck(_this);
            })

        }
        fn.setParentIsCheck = function (_this) {
            if (_this.length == 0) {
                return false;
            }
            var targetNode = _this.parent('li').parent('ul');
            if ((targetNode.find('input[name="checkOne"]:checked').length) == targetNode.find('li').length) {
                targetNode.siblings('input[name="checkOne"]').prop('checked', true);
            } else {
                targetNode.siblings('input[name="checkOne"]').prop('checked', false);
            }
            this.setParentIsCheck(targetNode);
        }
        fn.getCheckIdStr = function () {
            var arr = [];
            $('#' + this.treeId + ' input[name="checkOne"]').each(function (index) {
                if ($(this).prop('checked')) {
                    arr.push($(this).parents('li').attr('id'))
                }
            })
            return arr.join(',');
        }
        fn.getCheckData = function () {
            var arr = [];
            $('#' + this.treeId + ' input[name="checkOne"]').each(function (index) {
                if ($(this).prop('checked')) {
                    arr.push(($(this).prev('input[name="data"]').val()));
                }
            })
            return arr.join(',');
        }
        var obj = new tree(options);
        return obj
    }
})(jQuery);
