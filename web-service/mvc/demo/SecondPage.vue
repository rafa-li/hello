
<template>

    <h3>Second Page</h3>

    <button>{{counter}}</button>

    {{model | JSON.stringify }}


    <menu-list :list="model"></menu-list>

</template>


<!-- 定义一个组件： menu-list -->
<component:menu-list prop:list tagName="ul">
    <li v-for="item in list">
        <span>{{item.title}}</span>

        <menu-list :list="item.children"></menu-list>
    </li>
</component:menu-list>



<script server>
// 后端代码，在 nodejs 中执行 ----------------------------
export function selectData(postman, counter) {
    postman( counter + 1 )
}
</script>



<script>
// 前端代码，在浏览器中执行 ----------------------------

//console.log(123123)

export function registerSideMenu(sideMenu){
    // 注册到左侧菜单
    // sideMenu.registerItem(
    //     "/demo"
    //     , {
    //         title: "自助分券" ,
    //         icon: "block layout icon"
    //     }
    // )

    // sideMenu.registerItem(
    //     "/demo/SecondPage"
    //     , {
    //         title: "&nbsp&nbsp·&nbspSecondPage" ,
    //         icon: "block layout icon" ,
    //         component: require.id
    //     }
    // )

    // sideMenu.registerItem(
    //     "/self_allocate_stock"
    //     , {
    //         title: "&nbsp&nbsp·&nbsp小组心愿清单" ,
    //         icon: "block layout icon" ,
    //         component: "self_allocate_stock/GroupWishList.vue"
    //     }
    // )

}

export function data(){
    return {
        counter: 1
        , model: null

    }
}


export function ready() {

    var self = this

    $("button").click(function(){

        selectData( self.counter, function(err, data){
            self.counter = data
        })

    })


    this.model = [
        {
            title: "aaaaaaa"
            , children: [
                {
                    title: "11111111111"

                    , children: [
                        {
                            title: "222222"
                        }
                    ]
                }
            ]
        }
        , {
            title: "bbbbbbb"
        }
        , {
            title: "ccccc"
        }
    ]
}



</script>
