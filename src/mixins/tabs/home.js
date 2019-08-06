import wepy from 'wepy'

export default class extends wepy.mixin {
    // 准备空数组储存轮播图数据
    data = {
        swiperList: [],
        cataList: [],
        floodata: []
    }

    onLoad() {
        this.getSwiperList()
        this.getCateItems()
        this.getFlootdata()
    }

    methods = {
        //   点击楼层跳转到页面 goods_list
        goGoodsList(url) {
            // console.log(url)
            wepy.navigateTo({
                url: url
            
            })
        }
    }

    async getSwiperList() {
        const { data } = await wepy.get('/home/swiperdata')

        // console.log(data)

        if (data.meta.status !== 200) {
            // console.log('获取数据失败')
            return wepy.baseToast()
        }

        this.swiperList = data.message
        this.$apply()
    }

    async getCateItems() {
        const { data } = await wepy.request({
            url: 'https://www.zhengzhicheng.cn/api/public/v1/home/catitems',
            method: 'get',
            data: {}
        })
        // console.log(data)

        if (data.meta.status !== 200) {
            // console.log('获取数据失败')
            return wepy.showToast({
                title: '获取分页按钮数据失败！！',
                icon: 'none',
                duration: 2000
            })
        }

        this.cataList = data.message
        this.$apply()
    }

    async getFlootdata() {
        const { data } = await wepy.get('/home/floordata')
        // console.log(data)

        if (data.meta.status !== 200) {
            // console.log('获取数据失败')
            return wepy.showToast({
                title: '获取楼层数据失败！！',
                icon: 'none',
                duration: 2000
            })
        }

        this.floodata = data.message
        this.$apply()
    }

}