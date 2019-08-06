import wepy from 'wepy'

export default class testMixin extends wepy.mixin {
    data = {
        // 查询关键词
        query: '',
        // 商品分类的Id
        cid: '',
        // 页码值
        pagenum: 1,
        // 每页显示多少条数据
        pagesize: 10,
        // 商品列表数据
        goodslist: [],
        // 商品条数
        total: 0,
        // 控制底部提示框的显示与隐藏
        flag: false,
        // 表示当前数据是否正在请求中 默认没有
        isloading: false,
        // 没有数据的提示框
        isOver: true

    }

    onLoad(options) {
        this.query = options.query || ''
        this.cid = options.cid || ''
        this.getGoodsList()
    }

    methods = {
        // 点击商品跳转到商品详情页 并传一个id值
        goGoodsDetail(id) {
            wepy.navigateTo({
                url: '/pages/goods_detail/main?goods_id=' + id
            })
        }
    }

    // 获取商品列表数据
    async getGoodsList(cb) {
        this.isloading = true
        const { data: res } = await wepy.get('/goods/search', {
            query: this.query,
            cid: this.cid,
            pagenum: this.pagenum,
            pagesize: this.pagesize
        })
        // console.log(res)

        if (res.meta.status !== 200) {
            return wepy.baseToast()
        }

        if (res.message.total == 0) {
            return this.isOver = false
        }

        this.goodslist = [...this.goodslist, ...res.message.goods]
        // this.total = 20
        this.total = res.message.total
        this.isloading = false
        this.$apply()

        /**
         * 在下拉刷新时，调用请求数据函数的同时，并传递了一个回调函数 =》 停止下拉刷新的函数
         * 然后再请求数据的函数中判断是否应该执行这个函数
         * 如果在某个函数中传递了这样一个停止下拉刷新函数 就执行
         */

        cb && cb()
    }

    // 触底操作自动翻页
    onReachBottom() {
        /**
         * 在发生触底的时候判断前一次数据是否在请求当中
         * 如果前一次请求还没有完就不执行触底操作
         * 避免发生前一次数据没有请求回来 发生请求二次数据
         */
        if (this.isloading) {
            return
        }

        // 为了避免重复加载和数据被加载完毕  再这之前判断一下
        if (this.pagenum * this.pagesize >= this.total) {
            wepy.showToast({
                title: '数据已加载完...',
                // 弹框期间不会携带任何图标
                icon: 'success',
                duration: 3000
            })
            this.flag = true
            return
        }
        this.pagenum++
        this.getGoodsList()
    }

    // 下拉刷新操作 重置某些必要的值
    onPullDownRefresh() {
        this.pagenum = 1
        this.total = 0
        this.goodslist = []
        this.flag = false
        this.isloading = false

        // 才调用请求数据事件函数
        this.getGoodsList(() => {
            // 停止下拉刷新的行为
            wepy.stopPullDownRefresh()
        })
    }
}
