import wepy from 'wepy'
import Dialog from '@/assets/vant/dialog/dialog'

export default class testMixin extends wepy.mixin {
  data = {
    // 我的购物车里表数据
    mycart: [],
    // 控制弹框的显示与隐藏
    show: false,
    cid: ''
  }
  methods = {
    // 监听数量的加减变化
    countChanged(e) {
      // 获取到数量的最新数量值
      const cartCount = e.detail
      // 拿到点击的当前商品的id
      const id = e.target.dataset.id
      // 调用全局函数跟新数据
      this.$parent.updataCartCount(id, cartCount)
    },

    // 监听复选框的状态
    statusChange(e) {
      // 拿到最新的复选框状态
      const status = e.detail

      // 拿到当前点击项对应的商品id
      const id = e.target.dataset.id

      this.$parent.updataCartStatus(id, status)
    },

    // 删除对应的商品
    removeClose(id) {
      this.cid = id
      this.show = true
    },

    // 点击取消触发的事件
    onClose() {
      wepy.showToast({
        title: '已成功为您取消删除！',
        icon: 'none'
      })
      Dialog.resetDefaultOptions()
    },

    // 点击确定触发的事件
    onConfim() {
      this.$parent.removeCartList(this.cid)
      wepy.showToast({
        title: '很抱歉没有取得您的青睐！',
        icon: 'none'
      })
      Dialog.resetDefaultOptions()
    }
  }

  onLoad() {
    this.mycart = this.$parent.globalData.cartInfo
  }

  // 通过计算属性 判断出现是哪个盒子
  computed = {
    // 判断购物车是否为空
    isEmpty() {
      if (this.mycart.length <= 0) {
        return true
      }
      return false
    }
  }
}
