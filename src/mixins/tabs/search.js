import wepy from 'wepy'

export default class extends wepy.mixin {
    data = {
        value: '',
        suggestList: [],
        // 搜索历史数据
        keList: [],
        // 控制自动获取焦点
        // focus: true
    }

    onLoad() {
        const kwData = wepy.getStorageSync('name') || []
        this.keList = kwData
    }

    onShow() {
        const cateData = wepy.getStorageSync('catesList')
        // console.log(cateData)
        this.value = cateData

        this.getSuggestList(this.value)
    }

    onHide() {
        this.value = ''
        wepy.setStorageSync('catesList', '')
    }

    methods = {
        // 输入框内容发生改变时触发这个函数
        onChange(e) {
            this.value = e.detail.trim()
            if (e.detail.trim().length <= 0) {
                this.suggestList = []
                return
            }
            this.getSuggestList(e.detail)
        },

        // 点击搜索按钮会触发这个函数
        onSearch(e) {
            const kw = e.detail.trim()
            if (kw.length <= 0) {
                this.suggestList = []
                return
            }

            // 将数据保存起来，以便加入历史搜索
            if (this.keList.indexOf(kw) === -1) {
                this.keList.unshift(kw)
            }
            /**
             * 数组的 slice 方法，不会修改原数组，而是返回一个新的数组
             * 截取索引为0到10  10不会被截取出来
             */
            this.keList = this.keList.slice(0, 10)
            // 将最新的数组放进本地贮存里面
            wepy.setStorageSync('name', this.keList)

            wepy.navigateTo({
                url: '/pages/goods_list?query=' + kw
            })
        },

        // 点击取消会触发这个函数
        onCancel() {
            this.suggestList = []
            return
        },

        // 点击列表项跳转到商品详情页
        goGoodsDetail(cid) {
            // console.log(id)
            wepy.navigateTo({
                url: '/pages/goods_detail/main?goods_id=' + cid
            })
        },

        // 点击历史搜索项跳转到商品商品列表
        goInputItem(val) {
            wepy.navigateTo({
                url: '/pages/goods_list?query?' + val
            })
        },

        // 点击搜索历史的垃圾箱清除本地储存数据和搜索历史栏里面的数据
        clearHistory() {
            this.keList = []
            wepy.setStorageSync('name', [])
            wepy.setStorageSync('catesList', [])
        }
    }

    // 计算属性
    computed = {
        isShowHistory() {
            if (this.value.trim().length <= 0) {
                return true
            }
            return false
        }
    }

    async getSuggestList(searchVal) {
        const { data } = await wepy.get('/goods/qsearch', { query: searchVal })
        // console.log(data)

        if (data.meta.status !== 200) {
            // console.log('获取数据失败')
            return wepy.baseToast()
        }

        this.suggestList = data.message
        this.$apply()
    }
}