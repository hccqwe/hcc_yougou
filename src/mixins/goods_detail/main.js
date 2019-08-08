import wepy from 'wepy'

export default class testMixin extends wepy.mixin {
  data = {
    goods_id: '',
    // 页面数据
    detailList: [],
    // 收藏图标
    icon: 'star-o',
    // 收货地址
    addressList: null
  }
  methods = {
    // 点击图标事件
    iconClick() {
      this.icon = 'star'
    },

    // 点击图片预览效果
    preview(pic) {
      wepy.previewImage({
        // 所有要预览的图片路径 map循环得到
        urls: this.detailList.pics.map(x => x.pics_big),
        // 当前默认预览的图片
        current: pic
      })

    },

    // 点击选择地址
    async chooseAddress() {
      const data = await wepy.chooseAddress().catch(err => err)

      if (data.errMsg !== 'chooseAddress:ok') {
        return wepy.baseToast('获取收货地址失败！')
      }

      this.addressList = data
      wepy.setStorageSync('address',data)
      this.$apply()
    },

    // 加入购物车
    addToCart() {
      /**
       * 点击加入购物车按钮之后调用全局声明的函数 addGoodsToCart()
       * 在调用的同时 将当前页面的数据传递过去
       */
      this.$parent.addGoodsToCart(this.detailList)

      wepy.showToast({
        title: '加入购物车成功',
        icon: 'success'
      })
    },

    // 购买
    onClickButton() {
      console.log(123)
    }
  }

  onLoad(options) {
    this.goods_id = options.goods_id
    // console.log(this.goods_id)
    this.getMainList()
  }

  /** 
   * 原本设置 addressList 为一个空对象 显示收货地址 直接令他为null
   * 声明一个函数判读 addressList 这个对象是否为 非null
   * 如果是 null return一个‘请选择收货地址’
   * 否则就将 addressList 里面的数据return出去
   */
  computed = {
    addressStr() {
      if(this.addressList === null) {
        return '请选择收货地址'
      }

      // 现将对象取到方便操作
      const addr = this.addressList
      const str = addr.provinceName + addr.cityName + addr.countyName + addr.detailInfo
      return str
    },

    // 调用全局函数，获取到全局商品数量，赋值给购物车图标部分
    allCount() {
      // console.log(this.$parent.globalData.allTotal)
      return this.$parent.globalData.allTotal
    }
  }

  async getMainList() {
    const { data } = await wepy.get('/goods/detail', { goods_id: this.goods_id })

    if (data.meta.status !== 200) {
      return wepy.baseToast()
    }

    this.detailList = data.message
    this.$apply()
  }
}
