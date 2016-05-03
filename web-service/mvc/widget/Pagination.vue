 <!--
/**
 * @file 分页代码的实现
 * @author luchenqun&luke
 * @version 1.0
 * @copyright 2016 All Right Reserved @ LeHighHongking
 * @example  1、在你需要引用代码的地方，使用 <widget-pagination v-ref:pagination></widget-pagination> 将页面引入。
 * 2、调用设置总共页码函数this.$refs.pagination.setTotalPage(XX)
 * 3、当前页面改变的时候，会有 page-changed 信号发出
 */
-->

<template>
    <div class="p-wrap" v-show="totalPage > 0">
        <span class="p-num">
            <a class="prev disabled js-pre-page" v-show="currentPage > 1">&lt;上一页</a>

            <a class="js-page" page="{{ 1 }}" v-show="currentPage - 3 >= 1">{{ 1 }}</a>
            <b class="pn-break" v-show="currentPage - 3 >= 1">…</b>

            <a class="js-page" page="{{ currentPage - 2 }}" v-show="currentPage - 2 >= 1">{{ currentPage - 2 }}</a>
            <a class="js-page" page="{{ currentPage - 1 }}" v-show="currentPage - 1 >= 1">{{ currentPage - 1 }}</a>

            <a class="curr js-page" page="{{ currentPage }}" v-show="currentPage >= 1 ">{{ currentPage }}</a>

            <a class="js-page" page="{{ currentPage + 1 }}" v-show="currentPage + 1 <= totalPage">{{ currentPage + 1 }}</a>
            <a class="js-page" page="{{ currentPage + 2 }}" v-show="currentPage + 2 <= totalPage">{{ currentPage + 2 }}</a>

            <b class="pn-break" v-show="currentPage + 3 <= totalPage">…</b>
            <a class="js-page" page="{{ totalPage }}" v-show="currentPage + 3 <= totalPage">{{ totalPage }}</a>

            <a class="next js-next-page" v-show="currentPage < totalPage">下一页&gt;</a>
        </span>
        <span class="p-skip">
            <em>共<b>{{ totalPage }}</b>页&nbsp;&nbsp;到第</em>
            <input type="text" class="p-input js-input-current-page" value="{{ currentPage }}" />
            <em>页</em>
            <a class="btn-default" v-on:click="updateCurrentPage">确定</a>
        </span>
    </div>
</template>

<script>

/**
 * @func
 * @desc vue绑定数据
 * @author luchenqun
 */
export function data() {
    return {
        "currentPage": 0,   // 当前选择的页面
        "totalPage": 0,     // 一共的页码
    }
}

/**
 * @func
 * @desc 初始化
 * @author luchenqun
 */
export function ready() {
    var self = this

    // 点击页码
    jQuery(this.$el).on("click", ".js-page", function(){
        self.currentPage = parseInt($(this).attr("page"))
        jQuery('.js-input-current-page').attr("value", self.currentPage)
        jQuery('.js-input-current-page').val(self.currentPage)
        self.$dispatch("page-changed", self.currentPage)
    })

    // 点击上一页
    jQuery(this.$el).on("click", ".js-next-page", function(){
        self.currentPage += 1
        jQuery('.js-input-current-page').attr("value", self.currentPage)
        jQuery('.js-input-current-page').val(self.currentPage)
        self.$dispatch("page-changed", self.currentPage)
    })

    // 点击下一页
    jQuery(this.$el).on("click", ".js-pre-page", function(){
        self.currentPage -= 1
        jQuery('.js-input-current-page').attr("value", self.currentPage)
        jQuery('.js-input-current-page').val(self.currentPage)
        self.$dispatch("page-changed", self.currentPage)
    })
}

/**
 * @func
 * @desc 点击确定按钮更新当前页面
 * @author luchenqun
 */
export function updateCurrentPage(){
    var inputPage = jQuery('.js-input-current-page').val()

    if(!isNaN(inputPage) && parseInt(inputPage) <= this.totalPage){
        console.log('---------->', inputPage, jQuery('.js-input-current-page').val())
        this.currentPage = parseInt(inputPage)
        this.$dispatch("page-changed", this.currentPage)
    }
}

/**
* @desc 设置总页码，总页码更新的话，同时会将当前页码置为1
* @author luchenqun
* @param {Num} totalPage - 总页码
*/
export function setTotalPage(totalPage){
    this.totalPage = totalPage
    if(this.currentPage === 0){
        this.currentPage = 1
    }
    jQuery('.js-input-current-page').attr("value", this.currentPage)
    jQuery('.js-input-current-page').val(this.currentPage)

    jQuery('.js-input-current-page').attr("value", this.currentPage)
    jQuery('.js-input-current-page').val(this.currentPage)
}

/**
* @desc 设置当前页码
* @author luchenqun
* @param {Num} currentPage - 当前页码
*/
export function setCurrentPage(currentPage){
    this.currentPage = currentPage
    jQuery('.js-input-current-page').attr("value", currentPage)
    jQuery('.js-input-current-page').val(currentPage)
}

/**
* @desc 设置当前页码
* @author luchenqun
* @param {Num} totalPage - 总页码
* @param {Num} currentPage - 当前页码
*/
export function setPage(totalPage, currentPage){
    this.totalPage = totalPage
    jQuery('.js-input-current-page').attr("value", this.currentPage)
    jQuery('.js-input-current-page').val(this.currentPage)

    this.currentPage = currentPage
    jQuery('.js-input-current-page').attr("value", currentPage)
    jQuery('.js-input-current-page').val(currentPage)
}

</script>
