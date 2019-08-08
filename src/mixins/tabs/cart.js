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
      Dialog.alert({
        title: '温馨提示您！',
        message: '优购提示：您确定要删除吗？'
      })

      this.cid = id
      this.show = true
    },

    onClose() {
      wepy.showToast({
        title: '已成功为您取消删除！',
        icon: 'none'
      })
      this.show = false
    },

    // 点击确定触发的事件
    onConfim() {
      this.$parent.removeCartList(this.cid)
      wepy.showToast({
        title: '很抱歉没有取得您的青睐！',
        icon: 'none'
      })
      this.show = false
    },

    // 监听全选复选框的选中状态，跟新商品的选中状态
    onFullhecked(e) {
     const status = e.detail
     this.$parent.updataAllCartStatus(status)
    },

    // 提交订单
    onOrder() {
      if(this.amount <= 0) {
        return wepy.baseToast('订单金额不能为空！')
      }

      wepy.navigateTo({
        url: '/pages/order'
      })
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
    },

    /**
     * 计算总价，单位要精确到后两位
     * 循环遍历所有商品数据，判断 isCheck 是否被选中
     * 将 isCheck 被选中的那组数据的单价与数量相乘
     * 最后return出去，组件会自己精确，气门只需要乘以100
     */
    amount() {
      let total = 0
      this.mycart.forEach(x => {
        if(x.isCheck) {
          total += x.price * x.count
        }
      })

      return total * 100
    },

    // 计算所有商品的 选中的数量 与 商品的总数 作比较
    isFullChecked() {
      // 商品总数
      const allCount = this.mycart.length

      // 勾选总数
      let count = 0    
      this.mycart.forEach(x => {
        if(x.isCheck) {
          // 每次循环到被选中的商品让此变量自加一
          count++
        }
      })

      if(count === allCount) {
        return true
      }
      return false
    }

  }
}
