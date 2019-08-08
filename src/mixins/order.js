import wepy from 'wepy'

export default class extends wepy.mixin {
    data = {
        addressInfo: null,
        cartArr: [],
        islogin: false
    }

    onLoad() {
        this.addressInfo = wepy.getStorageSync('address') || null

        // 筛选出在购物车内被选中的物品
        const newArr = this.$parent.globalData.cartInfo.filter(x => x.isCheck)
        this.cartArr = newArr
    }

    methods = {
        // 选择收货地址
        async chooesDaaress() {
            const data = await wepy.chooseAddress().catch(err => err)

            if (data.errMsg !== 'chooseAddress:ok') {
                return
            }

            this.addressInfo = data
            // 存储到本地
            wepy.setStorageSync('address', this.addressInfo)
            this.$apply()
        },

        // 获取用户信息
        async getUserInfo(userInfo) {
            if (userInfo.detail.errMsg !== 'getUserInfo:ok') {
                return wepy.baseToast('获取用户信息失败！')
            }

            // 获取用户登录的凭证 Code
            const loginRes = await wepy.login()
            if (loginRes.errMsg !== 'login:ok') {
                return wepy.baseToast('微信登录失败！')
            }

            // 登录的参数
            const loginParams = {
                code: loginRes.code,
                encryptedData: userInfo.detail.encryptedData,
                iv: userInfo.detail.iv,
                rawData: userInfo.detail.rawData,
                signature: userInfo.detail.signature
            }

            // 发起登录的请求，换取登录成功之后的 Token 值
            const { data: res } = await wepy.post('/users/wxlogin', loginParams)
            console.log(res)
            if(res.meta.status !== 200) {
                return wepy.baseToast('微信登录失败！！')
            }

            wepy.setStorageSync('token', res.message.token)
            // wepy.setStorageSync('token', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOjEyLCJpYXQiOjE1MjU0MDIyMjMsImV4cCI6MTUyNTQ4ODYyM30.g-4GtEQNPwT_Xs0Pq7Lrco_9DfHQQsBiOKZerkO-O-o')
            // 声明个变量判断是否登录了
            this.islogin = true
            this.$apply()
        },

        // 支付订单
        async onSubmit() {
            // 确认支付前，先判断是否满足条件
            if(this.aomunt <= 0) {
                return wepy.baseToast('商品价格不能为0')
            }

            if(this.addressStr.length <= 0) {
                return wepy.baseToast('收货地址不能为空！')
            }

            // 准备需要的参数
            const allParams = {
                order_price: '0.01',
                consignee_addr: this.addressStr,
                order_detail: JSON.stringify(this.cartArr),
                goods: this.cartArr.map(x => {
                    return {
                        goods_id: x.id,
                        goods_number: x.count,
                        goods_price: x.price
                    }
                })
            }
            const {data:createdResult} = await wepy.post('http://ip:8888/api/public/v1/my/orders/create', allParams)
            console.log(createdResult)
        }
    }

    computed = {
        isHaveAddress() {
            if (this.addressInfo === null) {
                return false
            }

            return true
        },
        // 拼接收货地址
        addressStr() {
            if (this.addressInfo === null) {
                return ''
            }

            const x = this.addressInfo.provinceName + this.addressInfo.cityName + this.addressInfo.countyName + this.addressInfo.detailInfo
            return x
        },
        // 算出商品总价
        aomunt() {
            let total = 0
            this.cartArr.forEach(x => {
                total += x.price * x.count
            });

            return total * 100
        }
    }
}