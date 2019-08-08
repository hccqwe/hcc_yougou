import wepy from 'wepy'

export default class extends wepy.mixin {
    data = {
        catesList: [],
        active: 0,
        // 当前屏幕可用高度
        wHeight: 0,
        // 所有二级分类数据
        secondCate: [],
        value: '',
        isDisabled: false
    }

    onLoad() {
        this.getWindowHeight()
        this.getCatesList()
    }

    onShow() {
    }

    methods = {
        goGoodsList(id) {
            // console.log(id)
            wepy.navigateTo({
                url: '/pages/goods_list?cid=' + id
            })
        },

        // 搜索框内容发生改变时触发的事件
        onChange(e) {

            const newLength = wepy.getStorageSync('length')
            // console.log(e)
            const val = e.detail.trim()

            if(val.length <= 0) {

                wepy.setStorageSync('length', '')
                return

            } else if(val.length < newLength) {

                return

            }else {

                const valOldLength = val.length
                wepy.setStorageSync('length',valOldLength)
    
                wepy.setStorageSync('catesList', val)
                
                wepy.switchTab({
                    url: '/pages/tabs/search'
                })

            }
        },

        onSearch(e) {
            const val = e.detail.trim()
            if(val.length <= 0) {
                return
            }
         wepy.navigateTo({
             url: '/pages/goods_detail/main?query=' + val
         })
        }
    }

    async getWindowHeight() {
        const res = await wepy.getSystemInfo()

        if(res.errMsg == 'getSystemInfo:ok') {
            this.wHeight = res.windowHeight
            this.$apply()
        }
    }

    async getCatesList() {
        const { data } = await wepy.get('/categories')
        // console.log(data)
        if(data.meta.status !==200) {
            return wepy.baseToast()
        }

        this.catesList = data.message
        this.secondCate = data.message[0].children
        this.$apply()
    }
}